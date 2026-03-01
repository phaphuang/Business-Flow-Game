import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-5xl">
        <div className="text-center mb-8 sm:mb-10 animate-slide-up">
          <div className="text-5xl sm:text-7xl mb-3 sm:mb-4 animate-float">{"\uD83C\uDFAE"}</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3" data-testid="text-main-title">
            IPO Quest
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-1" data-testid="text-subtitle">
            Learn How Digital Businesses Really Work
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            ICDI - Chiang Mai University
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 mb-6 sm:mb-8">
          {[
            { emoji: "\uD83C\uDF0D", title: "5 Worlds", desc: "Real companies to explore", tid: "card-info-cases" },
            { emoji: "\u2694\uFE0F", title: "30 Quests", desc: "Interactive challenges", tid: "card-info-challenges" },
            { emoji: "\u23F1\uFE0F", title: "30-45 min", desc: "Go at your own pace", tid: "card-info-time" },
            { emoji: "\uD83C\uDFC6", title: "4,500 pts", desc: "Compete with classmates", tid: "card-info-points" },
          ].map(c => (
            <Card key={c.tid} className="text-center p-3 sm:p-4 active:scale-95 transition-transform" data-testid={c.tid}>
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{c.emoji}</div>
              <div className="font-bold text-sm sm:text-lg">{c.title}</div>
              <p className="text-[11px] sm:text-xs text-gray-500">{c.desc}</p>
            </Card>
          ))}
        </div>

        <Card className="mb-6 sm:mb-8 overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-xl">{"\uD83D\uDDFA\uFE0F"} Your Adventure Map</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
              {[
                { emoji: "\uD83C\uDFAC", name: "Netflix", quest: "Streaming Kingdom", desc: "How 300M people get their shows", color: "from-red-50 to-red-100 border-red-200" },
                { emoji: "\uD83C\uDFB5", name: "Spotify", quest: "Music Forest", desc: "AI that knows your music taste", color: "from-green-50 to-green-100 border-green-200" },
                { emoji: "\uD83D\uDE97", name: "Grab", quest: "City Rush", desc: "Rides, food, and payments in one app", color: "from-emerald-50 to-emerald-100 border-emerald-200" },
                { emoji: "\uD83D\uDED2", name: "Shopify", quest: "Market Square", desc: "Build your own online store", color: "from-purple-50 to-purple-100 border-purple-200" },
                { emoji: "\uD83C\uDFE1", name: "Airbnb", quest: "Travel World", desc: "Stay anywhere on Earth", color: "from-pink-50 to-pink-100 border-pink-200" },
              ].map((c) => (
                <div key={c.name} className={`p-3 rounded-xl bg-gradient-to-b ${c.color} border text-center active:scale-95 transition-transform`} data-testid={`case-${c.name.toLowerCase()}`}>
                  <div className="text-2xl sm:text-3xl mb-1">{c.emoji}</div>
                  <div className="font-bold text-xs sm:text-sm">{c.name}</div>
                  <div className="text-[10px] sm:text-[10px] font-semibold text-gray-500 mb-1">{c.quest}</div>
                  <p className="text-[11px] text-gray-600 hidden sm:block">{c.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-xl">{"\uD83C\uDFAF"} How You'll Play</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
              {[
                { emoji: "\uD83D\uDCE6", name: "Sort", desc: "Put items in boxes" },
                { emoji: "\uD83C\uDFF7\uFE0F", name: "Classify", desc: "Pick categories" },
                { emoji: "\uD83D\uDCCB", name: "Order", desc: "Arrange steps" },
                { emoji: "\uD83D\uDD17", name: "Connect", desc: "Match pairs" },
                { emoji: "\uD83E\uDDEE", name: "Calculate", desc: "Solve problems" },
              ].map(t => (
                <div key={t.name} className="p-2 sm:p-3 bg-white rounded-xl border text-center">
                  <div className="text-xl sm:text-2xl mb-1">{t.emoji}</div>
                  <div className="font-semibold text-xs">{t.name}</div>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="pt-5 sm:pt-6 px-3 sm:px-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-2">{"\uD83D\uDCA1"}</div>
              <h3 className="font-bold text-base sm:text-lg mb-2">What is IPO?</h3>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-lg sm:text-xl mb-1">{"\uD83D\uDCE5"}</div>
                  <div className="font-bold text-xs sm:text-sm text-blue-700">Input</div>
                  <p className="text-[10px] sm:text-[11px] text-gray-600">Data going IN</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-lg sm:text-xl mb-1">{"\u2699\uFE0F"}</div>
                  <div className="font-bold text-xs sm:text-sm text-purple-700">Processing</div>
                  <p className="text-[10px] sm:text-[11px] text-gray-600">Work done</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center text-lg sm:text-xl mb-1">{"\uD83D\uDCE4"}</div>
                  <div className="font-bold text-xs sm:text-sm text-green-700">Output</div>
                  <p className="text-[10px] sm:text-[11px] text-gray-600">Results OUT</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pb-6">
          <Button
            size="lg"
            className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-7 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg active:scale-95 transition-all rounded-xl touch-manipulation"
            onClick={() => setLocation("/register")}
            data-testid="button-start"
          >
            Start Your Adventure!
          </Button>
        </div>
      </div>
    </div>
  );
}
