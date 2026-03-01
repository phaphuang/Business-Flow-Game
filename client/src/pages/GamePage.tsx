import { useState, useCallback, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { businessCases, challenges } from "@shared/gameData";
import DragSortChallenge from "@/components/game/DragSortChallenge";
import OrderingChallenge from "@/components/game/OrderingChallenge";
import MatchingChallenge from "@/components/game/MatchingChallenge";
import CalculationChallenge from "@/components/game/CalculationChallenge";
import { Trophy, Loader2, UserCircle, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const businessCasesByS = Object.values(businessCases).reduce((acc, bc) => {
  acc[bc.sector] = bc;
  return acc;
}, {} as Record<string, (typeof businessCases)[keyof typeof businessCases]>);

const TYPE_LABELS: Record<string, string> = {
  "drag-drop-ipo": "Drag & Drop: IPO Sort",
  "drag-drop-classify": "Drag & Drop: Classification",
  "ordering": "Sequence Ordering",
  "matching": "Connection Matching",
  "calculation": "Calculation",
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
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackExplanation, setFeedbackExplanation] = useState("");

  const currentChallenge = currentChallengeIndex < challenges.length ? challenges[currentChallengeIndex] : null;
  const progress = useMemo(() => (currentChallengeIndex / challenges.length) * 100, [currentChallengeIndex]);

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/sessions", sessionId],
    enabled: !!sessionId,
  });

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
      setFeedbackCorrect(isCorrect);
      setFeedbackExplanation(currentChallenge.explanation);
      setShowFeedback(true);

      const isLastChallenge = currentChallengeIndex >= challenges.length - 1;

      if (isLastChallenge) {
        const totalTimeMinutes = Math.max(1, Math.floor((Date.now() - startTime) / 60000));
        await updateSessionMutation.mutateAsync({
          totalScore: newTotalScore,
          timeSpentMinutes: totalTimeMinutes,
          isCompleted: true,
          completedAt: new Date().toISOString(),
        });
      }

      setTimeout(() => {
        setShowFeedback(false);
        if (isLastChallenge) {
          setLocation(`/results/${sessionId}`);
        } else {
          setCurrentChallengeIndex(prev => prev + 1);
          setChallengeStartTime(Date.now());
          setIsSubmitting(false);
        }
      }, 4000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }, [isSubmitting, currentChallenge, challengeStartTime, totalScore, sessionId, currentChallengeIndex, startTime]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center" data-testid="loading-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const businessCase = businessCasesByS[currentChallenge.sector];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900" data-testid="text-game-title">IPO Learning Game</h1>
              <p className="text-sm text-gray-600" data-testid="text-challenge-counter">
                Challenge {currentChallengeIndex + 1} of {challenges.length}
              </p>
            </div>
            <div className="flex items-center gap-2" data-testid="text-score">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold">{totalScore} pts</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-3 pt-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${businessCase?.color || 'bg-blue-500'} flex items-center justify-center text-lg text-white font-bold shrink-0`}>
                {businessCase?.icon}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg" data-testid="text-company-name">{businessCase?.name}</CardTitle>
                <p className="text-xs text-muted-foreground" data-testid="text-company-description">{businessCase?.description}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant="secondary" data-testid="badge-difficulty">{currentChallenge.difficulty}</Badge>
                <Badge variant="outline" data-testid="badge-points">{currentChallenge.points} pts</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {showFeedback && (
          <Card className={`mb-4 border-2 ${feedbackCorrect ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50'}`} data-testid="card-feedback">
            <CardContent className="pt-5 pb-4">
              <h3 className={`font-bold text-lg mb-2 ${feedbackCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {feedbackCorrect ? "Correct!" : "Not Quite Right"}
              </h3>
              <p className="text-sm text-gray-700">{feedbackExplanation}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2 pt-4">
            <Badge variant="outline" className="w-fit mb-2 bg-indigo-50 text-indigo-700 border-indigo-200" data-testid="badge-type">
              {TYPE_LABELS[currentChallenge.type] || currentChallenge.type}
            </Badge>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-md w-fit" data-testid="text-role">
              <UserCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-semibold text-indigo-700">Your Role: {currentChallenge.role}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-700 leading-relaxed" data-testid="text-scenario">
              {currentChallenge.scenario}
            </p>
            <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md" data-testid="text-mission">
              <Target className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
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
