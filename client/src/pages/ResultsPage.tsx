import { useRoute, useLocation } from "wouter";
  import { useQuery } from "@tanstack/react-query";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Trophy, Clock, Target, Award, Home } from "lucide-react";
  import { businessCases } from "@shared/gameData";

  export default function ResultsPage() {
    const [, params] = useRoute("/results/:sessionId");
    const [, setLocation] = useLocation();
    const sessionId = params?.sessionId;

    const { data: session } = useQuery({
      queryKey: ["session", sessionId],
      queryFn: async () => {
        const res = await fetch(`/api/sessions/${sessionId}`);
        return res.json();
      },
      enabled: !!sessionId,
    });

    const { data: responses } = useQuery({
      queryKey: ["responses", sessionId],
      queryFn: async () => {
        const res = await fetch(`/api/sessions/${sessionId}/responses`);
        return res.json();
      },
      enabled: !!sessionId,
    });

    const { data: leaderboard } = useQuery({
      queryKey: ["leaderboard"],
      queryFn: async () => {
        const res = await fetch("/api/leaderboard");
        return res.json();
      },
    });

    if (!session || !responses) {
      return <div>Loading...</div>;
    }

    const correctAnswers = responses.filter((r: any) => r.isCorrect).length;
    const totalQuestions = responses.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

    // Calculate sector performance
    const sectorStats = responses.reduce((acc: any, r: any) => {
      if (!acc[r.sector]) {
        acc[r.sector] = { correct: 0, total: 0, points: 0 };
      }
      acc[r.sector].total++;
      if (r.isCorrect) {
        acc[r.sector].correct++;
        acc[r.sector].points += r.pointsEarned;
      }
      return acc;
    }, {});

    const getPerformanceMessage = () => {
      if (accuracy >= 90) return { text: "Outstanding! 🌟", color: "text-green-600" };
      if (accuracy >= 75) return { text: "Great Job! 🎉", color: "text-blue-600" };
      if (accuracy >= 60) return { text: "Good Effort! 👍", color: "text-yellow-600" };
      return { text: "Keep Learning! 📚", color: "text-orange-600" };
    };

    const performance = getPerformanceMessage();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
              <Trophy className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Game Complete!</h1>
            <p className={`text-2xl font-semibold ${performance.color}`}>{performance.text}</p>
          </div>

          {/* Score Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{session.totalScore}</div>
                  <div className="text-xs text-gray-600">Total Points</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{correctAnswers}/{totalQuestions}</div>
                  <div className="text-xs text-gray-600">Correct</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{session.timeSpentMinutes}</div>
                  <div className="text-xs text-gray-600">Minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sector Performance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Performance by Business Case</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(sectorStats).map(([sector, stats]: [string, any]) => {
                  const businessCase = Object.values(businessCases).find(bc => bc.sector === sector);
                  const sectorAccuracy = Math.round((stats.correct / stats.total) * 100);
                  
                  return (
                    <div key={sector} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full ${businessCase?.color} flex items-center justify-center text-xl`}>
                        {businessCase?.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">{businessCase?.name}</span>
                          <span className="text-sm text-gray-600">
                            {stats.correct}/{stats.total} correct • {stats.points} pts
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${businessCase?.color}`}
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

          {/* Leaderboard */}
          {leaderboard && leaderboard.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.slice(0, 10).map((entry: any, index: number) => (
                    <div
                      key={entry.studentId}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        entry.studentId === session.studentId ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-orange-400 text-orange-900' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{entry.fullName}</div>
                          <div className="text-xs text-gray-500">{entry.timeSpentMinutes} minutes</div>
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

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setLocation("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
  