import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="text-center mb-10 animate-slide-up">
          <div className="text-7xl mb-4 animate-float">🎮</div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3" data-testid="text-main-title">
            IPO Quest
          </h1>
          <p className="text-xl text-gray-600 mb-1" data-testid="text-subtitle">
            Learn How Digital Businesses Really Work
          </p>
          <p className="text-sm text-gray-500">
            ICDI - Chiang Mai University
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Card className="text-center p-4 hover:scale-105 transition-transform" data-testid="card-info-cases">
            <div className="text-3xl mb-2">🌍</div>
            <div className="font-bold text-lg">5 Worlds</div>
            <p className="text-xs text-gray-500">Real companies to explore</p>
          </Card>
          <Card className="text-center p-4 hover:scale-105 transition-transform" data-testid="card-info-challenges">
            <div className="text-3xl mb-2">⚔️</div>
            <div className="font-bold text-lg">30 Quests</div>
            <p className="text-xs text-gray-500">Interactive challenges</p>
          </Card>
          <Card className="text-center p-4 hover:scale-105 transition-transform" data-testid="card-info-time">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="font-bold text-lg">30-45 min</div>
            <p className="text-xs text-gray-500">Go at your own pace</p>
          </Card>
          <Card className="text-center p-4 hover:scale-105 transition-transform" data-testid="card-info-points">
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold text-lg">4,500 pts</div>
            <p className="text-xs text-gray-500">Compete with classmates</p>
          </Card>
        </div>

        <Card className="mb-8 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">🗺️ Your Adventure Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { emoji: "🎬", name: "Netflix", quest: "Streaming Kingdom", desc: "How 300M people get their shows", color: "from-red-50 to-red-100 border-red-200" },
                { emoji: "🎵", name: "Spotify", quest: "Music Forest", desc: "AI that knows your music taste", color: "from-green-50 to-green-100 border-green-200" },
                { emoji: "🚗", name: "Grab", quest: "City Rush", desc: "Rides, food, and payments in one app", color: "from-emerald-50 to-emerald-100 border-emerald-200" },
                { emoji: "🛒", name: "Shopify", quest: "Market Square", desc: "Build your own online store", color: "from-purple-50 to-purple-100 border-purple-200" },
                { emoji: "🏡", name: "Airbnb", quest: "Travel World", desc: "Stay anywhere on Earth", color: "from-pink-50 to-pink-100 border-pink-200" },
              ].map((c, i) => (
                <div key={c.name} className={`p-3 rounded-xl bg-gradient-to-b ${c.color} border text-center hover:scale-105 transition-transform`} data-testid={`case-${c.name.toLowerCase()}`}>
                  <div className="text-3xl mb-1">{c.emoji}</div>
                  <div className="font-bold text-sm">{c.name}</div>
                  <div className="text-[10px] font-semibold text-gray-500 mb-1">{c.quest}</div>
                  <p className="text-[11px] text-gray-600">{c.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">🎯 How You'll Play</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { emoji: "📦", name: "Drag & Drop", desc: "Sort items into the right boxes" },
                { emoji: "🏷️", name: "Classify", desc: "Put things in the right category" },
                { emoji: "📋", name: "Put in Order", desc: "Arrange steps in sequence" },
                { emoji: "🔗", name: "Connect Pairs", desc: "Match items that go together" },
                { emoji: "🧮", name: "Calculate", desc: "Solve real-world math problems" },
              ].map(t => (
                <div key={t.name} className="p-3 bg-white rounded-xl border text-center hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="font-semibold text-xs">{t.name}</div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💡</div>
              <h3 className="font-bold text-lg mb-2">What is IPO?</h3>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-xl mb-1">📥</div>
                  <div className="font-bold text-sm text-blue-700">Input</div>
                  <p className="text-[11px] text-gray-600">Data going IN</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-xl mb-1">⚙️</div>
                  <div className="font-bold text-sm text-purple-700">Processing</div>
                  <p className="text-[11px] text-gray-600">Work being done</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center text-xl mb-1">📤</div>
                  <div className="font-bold text-sm text-green-700">Output</div>
                  <p className="text-[11px] text-gray-600">Results coming OUT</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            className="text-lg px-10 py-7 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-xl"
            onClick={() => setLocation("/register")}
            data-testid="button-start"
          >
            Start Your Adventure! 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}
