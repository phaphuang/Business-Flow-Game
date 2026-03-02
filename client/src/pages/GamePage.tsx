import { useState, useCallback, useMemo, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { businessCases, challenges, AVATARS } from "@shared/gameData";
import DragSortChallenge from "@/components/game/DragSortChallenge";
import OrderingChallenge from "@/components/game/OrderingChallenge";
import MatchingChallenge from "@/components/game/MatchingChallenge";
import CalculationChallenge from "@/components/game/CalculationChallenge";
import QuestMap from "@/components/game/QuestMap";
import CelebrationOverlay from "@/components/game/CelebrationOverlay";
import { Loader2, Swords, Puzzle, Link2, Calculator, GripVertical } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const businessCasesByS = Object.values(businessCases).reduce((acc, bc) => {
  acc[bc.sector] = bc;
  return acc;
}, {} as Record<string, (typeof businessCases)[keyof typeof businessCases]>);

const TYPE_ICONS: Record<string, any> = {
  "drag-drop-ipo": Swords,
  "drag-drop-classify": Puzzle,
  "ordering": GripVertical,
  "matching": Link2,
  "calculation": Calculator,
};

const TYPE_LABELS: Record<string, string> = {
  "drag-drop-ipo": "Sort into Categories",
  "drag-drop-classify": "Classify Items",
  "ordering": "Put in Order",
  "matching": "Connect the Pairs",
  "calculation": "Do the Math",
};

const DIFFICULTY_STARS: Record<string, string> = {
  easy: "\u2B50",
  medium: "\u2B50\u2B50",
  hard: "\u2B50\u2B50\u2B50",
};

export default function GamePage() {
  const [, params] = useRoute("/game/:sessionId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const sessionId = params?.sessionId;

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [challengeStartTime, setChallengeStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedIndexes, setCompletedIndexes] = useState<Set<number>>(new Set());
  const [celebration, setCelebration] = useState<{ isCorrect: boolean; points: number; explanation: string } | null>(null);
  const [isLastChallenge, setIsLastChallenge] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  // 1. Remove localStorage save effect
  // 2. Remove localStorage mount effect
  const avatarId = localStorage.getItem("ipo_avatar") || "ninja";
  const avatarEmoji = AVATARS.find(a => a.id === avatarId)?.emoji || "\uD83E\uDD77";

  const currentChallenge = currentChallengeIndex < challenges.length ? challenges[currentChallengeIndex] : null;
  const progress = useMemo(() => Math.round((currentChallengeIndex / challenges.length) * 100), [currentChallengeIndex]);

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/sessions", sessionId],
    enabled: !!sessionId,
  });

  // Fetch saved responses to restore progress on refresh
  const { data: savedResponses, isSuccess: isResponsesLoaded, isFetching } = useQuery<any[]>({
    queryKey: ["/api/sessions", sessionId, "responses"],
    enabled: !!sessionId,
  });

  // Restore progress from DB responses on mount
  useEffect(() => {
    if (isResponsesLoaded && savedResponses && !isFetching) {
      if (savedResponses.length > 0) {
        const completed = new Set<number>();
        let score = 0;
        
        savedResponses.forEach((response: any) => {
          const challengeIndex = challenges.findIndex(c => c.id === response.challengeId);
          if (challengeIndex !== -1) {
            completed.add(challengeIndex);
            score += response.pointsEarned;
          }
        });
        
        setCompletedIndexes(completed);
        setTotalScore(score);
        
        // Find next uncompleted challenge
        const nextIndex = challenges.findIndex((_, i) => !completed.has(i));
        if (nextIndex !== -1) {
          setCurrentChallengeIndex(nextIndex);
        } else {
          setCurrentChallengeIndex(challenges.length - 1);
          setIsLastChallenge(true);
        }
      }
      setIsRestoring(false);
    } else if (isResponsesLoaded && savedResponses?.length === 0 && !isFetching) {
      setIsRestoring(false);
    }
  }, [isResponsesLoaded, savedResponses, isFetching]);

  const submitResponseMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/responses", data);
      return res.json();
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/sessions/${sessionId}`, data);
      return res.json();
    },
  });

  const handleAnswer = useCallback(async (userAnswer: any, isCorrect: boolean) => {
    if (isSubmitting || !currentChallenge) return;
    setIsSubmitting(true);

    const timeSpentSeconds = Math.floor((Date.now() - challengeStartTime) / 1000);
    const pointsEarned = isCorrect ? currentChallenge.points : 0;
    const newTotalScore = totalScore + pointsEarned;

    try {
      await submitResponseMutation.mutateAsync({
        sessionId,
        challengeId: currentChallenge.id,
        sector: currentChallenge.sector,
        userAnswer,
        correctAnswer: currentChallenge.correctAnswer,
        isCorrect,
        pointsEarned,
        timeSpentSeconds,
      });

      setTotalScore(newTotalScore);
      setCompletedIndexes(prev => new Set(prev).add(currentChallengeIndex));

      setCelebration({
        isCorrect,
        points: pointsEarned,
        explanation: currentChallenge.explanation,
      });

      const lastChallenge = currentChallengeIndex >= challenges.length - 1;
      setIsLastChallenge(lastChallenge);

      if (lastChallenge) {
        const totalTimeMinutes = Math.max(1, Math.floor((Date.now() - startTime) / 60000));
        await updateSessionMutation.mutateAsync({
          totalScore: newTotalScore,
          timeSpentMinutes: totalTimeMinutes,
          isCompleted: true,
          completedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Failed to save your answer. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }, [isSubmitting, currentChallenge, challengeStartTime, totalScore, sessionId, currentChallengeIndex, startTime]);

  const handleCelebrationComplete = useCallback(() => {
    setCelebration(null);
    if (isLastChallenge) {
      setLocation(`/results/${sessionId}`);
    } else {
      setCurrentChallengeIndex(prev => prev + 1);
      setChallengeStartTime(Date.now());
      setIsSubmitting(false);
    }
  }, [isLastChallenge, sessionId]);

  if (sessionLoading || !currentChallenge || isRestoring) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center" data-testid="loading-screen">
        <div className="text-center animate-bounce-in">
          <div className="text-5xl sm:text-6xl mb-4 animate-walk">{avatarEmoji}</div>
          <p className="text-base sm:text-lg text-gray-600 font-medium">Loading your quest...</p>
        </div>
      </div>
    );
  }

  const businessCase = businessCasesByS[currentChallenge.sector];
  const TypeIcon = TYPE_ICONS[currentChallenge.type] || Swords;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-3 sm:py-4">
      {celebration && (
        <CelebrationOverlay
          isCorrect={celebration.isCorrect}
          points={celebration.points}
          explanation={celebration.explanation}
          avatar={avatarEmoji}
          onComplete={handleCelebrationComplete}
        />
      )}

      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{avatarEmoji}</span>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-gray-900" data-testid="text-game-title">IPO Quest</h1>
              <p className="text-[11px] sm:text-xs text-gray-500" data-testid="text-challenge-counter">
                Quest {currentChallengeIndex + 1} of {challenges.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right">
              <div className="text-[11px] sm:text-xs text-gray-500">Score</div>
              <div className="font-bold text-sm sm:text-base text-indigo-600" data-testid="text-score">{totalScore} pts</div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center text-base sm:text-lg border-2 border-yellow-500">
              {"\uD83C\uDFC6"}
            </div>
          </div>
        </div>

        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2" data-testid="progress-bar">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5 px-1">
            <span>Start</span>
            <span>{progress}%</span>
            <span>Finish!</span>
          </div>
        </div>

        <QuestMap currentIndex={currentChallengeIndex} completedIndexes={completedIndexes} avatar={avatarEmoji} />

        <Card className="mb-3 overflow-hidden animate-slide-up" key={currentChallenge.id}>
          <div className={`h-1.5 ${businessCase?.color || "bg-indigo-500"}`} />
          <CardHeader className="pb-2 pt-3 px-3 sm:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{businessCase?.emoji}</span>
                <div>
                  <div className="font-bold text-sm sm:text-base" data-testid="text-company-name">{businessCase?.name}</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground" data-testid="text-quest-name">{businessCase?.questName}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs">{DIFFICULTY_STARS[currentChallenge.difficulty]}</span>
                <Badge variant="outline" className="text-xs" data-testid="badge-points">{currentChallenge.points} pts</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 px-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <TypeIcon className="w-4 h-4 text-indigo-500 shrink-0" />
              <Badge variant="secondary" className="text-[11px] sm:text-xs" data-testid="badge-type">
                {TYPE_LABELS[currentChallenge.type]}
              </Badge>
              <Badge variant="outline" className="text-[11px] sm:text-xs bg-indigo-50 text-indigo-700 border-indigo-200" data-testid="text-role">
                {currentChallenge.role}
              </Badge>
            </div>

            <div className="bg-white/60 rounded-lg p-3 border border-gray-200" data-testid="text-scenario">
              <p className="text-sm leading-relaxed text-gray-700">{currentChallenge.scenario}</p>
            </div>

            <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg" data-testid="text-mission">
              <span className="text-base shrink-0">{"\uD83C\uDFAF"}</span>
              <span className="text-sm font-semibold text-amber-800">{currentChallenge.mission}</span>
            </div>

            {(currentChallenge.type === "drag-drop-ipo" || currentChallenge.type === "drag-drop-classify") && (
              <DragSortChallenge key={currentChallenge.id} challenge={currentChallenge} onAnswer={handleAnswer} disabled={isSubmitting} />
            )}
            {currentChallenge.type === "ordering" && (
              <OrderingChallenge key={currentChallenge.id} challenge={currentChallenge} onAnswer={handleAnswer} disabled={isSubmitting} />
            )}
            {currentChallenge.type === "matching" && (
              <MatchingChallenge key={currentChallenge.id} challenge={currentChallenge} onAnswer={handleAnswer} disabled={isSubmitting} />
            )}
            {currentChallenge.type === "calculation" && (
              <CalculationChallenge key={currentChallenge.id} challenge={currentChallenge} onAnswer={handleAnswer} disabled={isSubmitting} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
