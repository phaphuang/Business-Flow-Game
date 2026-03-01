import { useState, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { businessCases, challenges } from "@shared/gameData";
import DragDropChallenge from "@/components/game/DragDropChallenge";
import MultipleChoiceChallenge from "@/components/game/MultipleChoiceChallenge";
import ClassificationChallenge from "@/components/game/ClassificationChallenge";
import { Trophy, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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
  const progress = ((currentChallengeIndex) / challenges.length) * 100;

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
      }, 3500);
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

  const businessCase = Object.values(businessCases).find(
    bc => bc.sector === currentChallenge.sector
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-game-title">IPO Learning Game</h1>
              <p className="text-sm text-gray-600" data-testid="text-challenge-counter">
                Challenge {currentChallengeIndex + 1} of {challenges.length}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2" data-testid="text-score">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold">{totalScore} pts</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${businessCase?.color || 'bg-blue-500'} flex items-center justify-center text-2xl text-white`}>
                {businessCase?.icon}
              </div>
              <div>
                <CardTitle className="text-xl" data-testid="text-company-name">{businessCase?.name}</CardTitle>
                <CardDescription data-testid="text-company-description">{businessCase?.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {showFeedback && (
          <Card className={`mb-6 border-2 ${feedbackCorrect ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50'}`} data-testid="card-feedback">
            <CardContent className="pt-6">
              <h3 className={`font-bold text-lg mb-2 ${feedbackCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {feedbackCorrect ? "Correct!" : "Incorrect"}
              </h3>
              <p className="text-sm text-gray-700">{feedbackExplanation}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" data-testid="badge-difficulty">
                    {currentChallenge.difficulty}
                  </Badge>
                  <Badge variant="outline" data-testid="badge-points">
                    {currentChallenge.points} points
                  </Badge>
                  <Badge variant="outline" data-testid="badge-type">
                    {currentChallenge.type === 'drag-drop' ? 'Drag & Drop' :
                     currentChallenge.type === 'multiple-choice' ? 'Multiple Choice' :
                     currentChallenge.type === 'scenario' ? 'Scenario' : 'Classification'}
                  </Badge>
                </div>
                <CardTitle className="text-lg" data-testid="text-question">{currentChallenge.question}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {(currentChallenge.type === "drag-drop") && (
              <DragDropChallenge
                key={currentChallenge.id}
                challenge={currentChallenge}
                onAnswer={handleAnswer}
                disabled={isSubmitting}
              />
            )}
            {(currentChallenge.type === "multiple-choice" || currentChallenge.type === "scenario") && (
              <MultipleChoiceChallenge
                key={currentChallenge.id}
                challenge={currentChallenge}
                onAnswer={handleAnswer}
                disabled={isSubmitting}
              />
            )}
            {currentChallenge.type === "classification" && (
              <ClassificationChallenge
                key={currentChallenge.id}
                challenge={currentChallenge}
                onAnswer={handleAnswer}
                disabled={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
