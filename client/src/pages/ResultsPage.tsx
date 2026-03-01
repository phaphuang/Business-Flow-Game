import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { businessCases, AVATARS } from "@shared/gameData";

const TROPHY = "\uD83C\uDFC6";
const TARGET = "\uD83C\uDFAF";
const CHECK = "\u2705";
const TIMER = "\u23F1\uFE0F";
const CHART = "\uD83D\uDCCA";
const MAP = "\uD83D\uDDFA\uFE0F";
const MEDAL = "\uD83C\uDFC5";
const HOUSE = "\uD83C\uDFE0";
const REFRESH = "\uD83D\uDD04";
const GLOBE = "\uD83C\uDF0D";
const FIRST = "\uD83E\uDD47";
const SECOND = "\uD83E\uDD48";
const THIRD = "\uD83E\uDD49";
const CROWN = "\uD83D\uDC51";
const STAR = "\u2B50";
const MUSCLE = "\uD83D\uDCAA";
const ROCKET = "\uD83D\uDE80";
const BOOK = "\uD83D\uDCDA";
const PARTY = "\uD83C\uDF89";
const SPARKLE = "\uD83C\uDF1F";

export default function ResultsPage() {
  const [, params] = useRoute("/results/:sessionId");
  const [, setLocation] = useLocation();
  const sessionId = params?.sessionId;

  const avatarId = localStorage.getItem("ipo_avatar") || "ninja";
  const avatarEmoji = AVATARS.find(a => a.id === avatarId)?.emoji || "\uD83E\uDD77";
  const playerName = localStorage.getItem("ipo_player_name") || "Adventurer";

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const correctAnswers = Array.isArray(responses) ? responses.filter((r: any) => r.isCorrect).length : 0;
  const totalQuestions = Array.isArray(responses) ? responses.length : 0;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const sectorStats = Array.isArray(responses) ? responses.reduce((acc: any, r: any) => {
    if (!acc[r.sector]) acc[r.sector] = { correct: 0, total: 0, points: 0 };
    acc[r.sector].total++;
    if (r.isCorrect) { acc[r.sector].correct++; acc[r.sector].points += r.pointsEarned; }
    return acc;
  }, {} as Record<string, { correct: number; total: number; points: number }>) : {};

  const getPerformance = () => {
    if (accuracy >= 90) return { text: `Legendary! ${CROWN}`, color: "text-yellow-600" };
    if (accuracy >= 75) return { text: `Amazing! ${SPARKLE}`, color: "text-blue-600" };
    if (accuracy >= 60) return { text: `Great job! ${MUSCLE}`, color: "text-green-600" };
    return { text: `Keep going! ${ROCKET}`, color: "text-orange-600" };
  };

  const perf = getPerformance();
  const medals = [FIRST, SECOND, THIRD];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 animate-bounce-in">
          <div className="text-7xl mb-3">{avatarEmoji}</div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1" data-testid="text-game-complete">Quest Complete!</h1>
          <p className={`text-2xl font-bold ${perf.color}`} data-testid="text-performance">{perf.text}</p>
          <p className="text-sm text-gray-500 mt-1">Well done, {playerName}!</p>
        </div>

        <Card className="mb-6 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{CHART} Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-yellow-50 rounded-xl border border-yellow-200" data-testid="stat-total-score">
                <div className="text-2xl mb-1">{TROPHY}</div>
                <div className="text-2xl font-extrabold text-yellow-600">{session.totalScore}</div>
                <div className="text-xs text-gray-500">Total Points</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200" data-testid="stat-accuracy">
                <div className="text-2xl mb-1">{TARGET}</div>
                <div className="text-2xl font-extrabold text-green-600">{accuracy}%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200" data-testid="stat-correct">
                <div className="text-2xl mb-1">{CHECK}</div>
                <div className="text-2xl font-extrabold text-blue-600">{correctAnswers}/{totalQuestions}</div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200" data-testid="stat-time">
                <div className="text-2xl mb-1">{TIMER}</div>
                <div className="text-2xl font-extrabold text-purple-600">{session.timeSpentMinutes || 0}</div>
                <div className="text-xs text-gray-500">Minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{MAP} World Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(sectorStats).map(([sector, stats]: [string, any]) => {
                const bc = Object.values(businessCases).find(b => b.sector === sector);
                const sectorAccuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={sector} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50" data-testid={`sector-result-${sector}`}>
                    <span className="text-2xl">{bc?.emoji || GLOBE}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm">{bc?.questName || sector}</span>
                        <span className="text-xs text-gray-500">{stats.correct}/{stats.total} {"\u2022"} {stats.points} pts</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${bc?.color || "bg-blue-500"} transition-all duration-1000`}
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
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{MEDAL} Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((entry: any, index: number) => {
                  const isYou = entry.studentDbId === session.studentId;
                  return (
                    <div
                      key={entry.sessionId || index}
                      data-testid={`leaderboard-entry-${index}`}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                        isYou ? "bg-indigo-50 border-2 border-indigo-300 ring-1 ring-indigo-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl w-8 text-center">
                          {index < 3 ? medals[index] : `#${index + 1}`}
                        </span>
                        <div>
                          <div className="font-semibold text-sm">
                            {entry.fullName} {isYou && <span className="text-indigo-500">(You!)</span>}
                          </div>
                          <div className="text-xs text-gray-500">{entry.timeSpentMinutes || 0} min</div>
                        </div>
                      </div>
                      <div className="font-bold text-indigo-600">{entry.totalScore} pts</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 py-5"
            onClick={() => setLocation("/")}
            data-testid="button-back-home"
          >
            {HOUSE} Back to Home
          </Button>
          <Button
            className="flex-1 py-5 bg-gradient-to-r from-indigo-500 to-purple-500"
            onClick={() => setLocation("/register")}
            data-testid="button-play-again"
          >
            {REFRESH} Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}
