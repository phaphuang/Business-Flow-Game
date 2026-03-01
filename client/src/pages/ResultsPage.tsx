import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target, Award, Home, Loader2 } from "lucide-react";
import { businessCases } from "@shared/gameData";

export default function ResultsPage() {
  const [, params] = useRoute("/results/:sessionId");
  const [, setLocation] = useLocation();
  const sessionId = params?.sessionId;

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/sessions", sessionId],
    enabled: !!sessionId,
  });

  const { data: responses, isLoading: responsesLoading } = useQuery({
    queryKey: ["/api/sessions", sessionId, "responses"],
    enabled: !!sessionId,
  });

  const { data: leaderboard } = useQuery({
    queryKey: ["/api/leaderboard"],
  });

  if (sessionLoading || responsesLoading || !session || !responses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const correctAnswers = Array.isArray(responses) ? responses.filter((r: any) => r.isCorrect).length : 0;
  const totalQuestions = Array.isArray(responses) ? responses.length : 0;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const sectorStats = Array.isArray(responses) ? responses.reduce((acc: any, r: any) => {
    if (!acc[r.sector]) {
      acc[r.sector] = { correct: 0, total: 0, points: 0 };
    }
    acc[r.sector].total++;
    if (r.isCorrect) {
      acc[r.sector].correct++;
      acc[r.sector].points += r.pointsEarned;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number; points: number }>) : {};

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { text: "Outstanding!", color: "text-green-600" };
    if (accuracy >= 75) return { text: "Great Job!", color: "text-blue-600" };
    if (accuracy >= 60) return { text: "Good Effort!", color: "text-yellow-600" };
    return { text: "Keep Learning!", color: "text-orange-600" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
            <Trophy className="w-12 h-12 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2" data-testid="text-game-complete">Game Complete!</h1>
          <p className={`text-2xl font-semibold ${performance.color}`} data-testid="text-performance">{performance.text}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg" data-testid="stat-total-score">
                <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{session.totalScore}</div>
                <div className="text-xs text-gray-600">Total Points</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg" data-testid="stat-accuracy">
                <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg" data-testid="stat-correct">
                <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{correctAnswers}/{totalQuestions}</div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg" data-testid="stat-time">
                <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{session.timeSpentMinutes || 0}</div>
                <div className="text-xs text-gray-600">Minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance by Business Case</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(sectorStats).map(([sector, stats]: [string, any]) => {
                const businessCase = Object.values(businessCases).find(bc => bc.sector === sector);
                const sectorAccuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={sector} className="flex items-center gap-4" data-testid={`sector-result-${sector}`}>
                    <div className={`w-10 h-10 rounded-full ${businessCase?.color || 'bg-gray-500'} flex items-center justify-center text-xl text-white`}>
                      {businessCase?.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm">{businessCase?.name || sector}</span>
                        <span className="text-sm text-gray-600">
                          {stats.correct}/{stats.total} correct - {stats.points} pts
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${businessCase?.color || 'bg-blue-500'}`}
                          style={{ width: `${sectorAccuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {leaderboard && Array.isArray(leaderboard) && leaderboard.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((entry: any, index: number) => (
                  <div
                    key={entry.sessionId || index}
                    data-testid={`leaderboard-entry-${index}`}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.studentDbId === session.studentId ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{entry.fullName}</div>
                        <div className="text-xs text-gray-500">{entry.timeSpentMinutes || 0} minutes</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{entry.totalScore} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => setLocation("/")} data-testid="button-back-home">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
