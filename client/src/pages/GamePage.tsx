import { useState, useEffect } from "react";
  import { useRoute, useLocation } from "wouter";
  import { useQuery, useMutation } from "@tanstack/react-query";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Progress } from "@/components/ui/progress";
  import { useToast } from "@/hooks/use-toast";
  import { businessCases, challenges, type Challenge } from "@shared/gameData";
  import DragDropChallenge from "@/components/game/DragDropChallenge";
  import MultipleChoiceChallenge from "@/components/game/MultipleChoiceChallenge";
  import ClassificationChallenge from "@/components/game/ClassificationChallenge";
  import { Clock, Trophy, ChevronRight } from "lucide-react";

  export default function GamePage() {
    const [, params] = useRoute("/game/:sessionId");
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const sessionId = params?.sessionId;

    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [startTime] = useState(Date.now());
    const [challengeStartTime, setChallengeStartTime] = useState(Date.now());

    const currentChallenge = challenges[currentChallengeIndex];
    const progress = ((currentChallengeIndex) / challenges.length) * 100;

    const { data: session } = useQuery({
      queryKey: ["session", sessionId],
      queryFn: async () => {
        const res = await fetch(`/api/sessions/${sessionId}`);
        return res.json();
      },
      enabled: !!sessionId,
    });

    const submitResponseMutation = useMutation({
      mutationFn: async (data: any) => {
        const res = await fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return res.json();
      },
    });

    const updateSessionMutation = useMutation({
      mutationFn: async (data: any) => {
        const res = await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return res.json();
      },
    });

    const handleAnswer = async (userAnswer: any, isCorrect: boolean) => {
      const timeSpentSeconds = Math.floor((Date.now() - challengeStartTime) / 1000);
      const pointsEarned = isCorrect ? currentChallenge.points : 0;
      const newTotalScore = totalScore + pointsEarned;

      // Submit response
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

      // Show feedback
      toast({
        title: isCorrect ? "Correct! 🎉" : "Incorrect",
        description: currentChallenge.explanation,
        variant: isCorrect ? "default" : "destructive",
      });

      // Move to next challenge or finish
      if (currentChallengeIndex < challenges.length - 1) {
        setTimeout(() => {
          setCurrentChallengeIndex(currentChallengeIndex + 1);
          setChallengeStartTime(Date.now());
        }, 3000);
      } else {
        // Game complete
        const totalTimeMinutes = Math.floor((Date.now() - startTime) / 60000);
        await updateSessionMutation.mutateAsync({
          totalScore: newTotalScore,
          timeSpentMinutes: totalTimeMinutes,
          isCompleted: true,
          completedAt: new Date().toISOString(),
        });

        toast({
          title: "Game Complete! 🏆",
          description: `Final Score: ${newTotalScore} points`,
        });

        setTimeout(() => {
          setLocation(`/results/${sessionId}`);
        }, 2000);
      }
    };

    if (!currentChallenge) {
      return <div>Loading...</div>;
    }

    const businessCase = Object.values(businessCases).find(
      bc => bc.sector === currentChallenge.sector
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IPO Learning Game</h1>
                <p className="text-sm text-gray-600">
                  Challenge {currentChallengeIndex + 1} of {challenges.length}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold">{totalScore} pts</span>
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Business Case Info */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${businessCase?.color} flex items-center justify-center text-2xl`}>
                  {businessCase?.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{businessCase?.name}</CardTitle>
                  <CardDescription>{businessCase?.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Challenge */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {currentChallenge.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {currentChallenge.points} points
                    </span>
                  </div>
                  <CardTitle className="text-lg">{currentChallenge.question}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentChallenge.type === "drag-drop" && (
                <DragDropChallenge challenge={currentChallenge} onAnswer={handleAnswer} />
              )}
              {currentChallenge.type === "multiple-choice" && (
                <MultipleChoiceChallenge challenge={currentChallenge} onAnswer={handleAnswer} />
              )}
              {currentChallenge.type === "scenario" && (
                <MultipleChoiceChallenge challenge={currentChallenge} onAnswer={handleAnswer} />
              )}
              {currentChallenge.type === "classification" && (
                <ClassificationChallenge challenge={currentChallenge} onAnswer={handleAnswer} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  