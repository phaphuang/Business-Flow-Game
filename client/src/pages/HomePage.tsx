import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Clock, Target } from "lucide-react";

export default function HomePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4" data-testid="text-main-title">
            IPO Learning Game
          </h1>
          <p className="text-xl text-gray-600 mb-2" data-testid="text-subtitle">
            Master Input-Processing-Output Concepts in Digital Business Ecosystems
          </p>
          <p className="text-lg text-gray-500">
            International College of Digital Innovation - Chiang Mai University
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card data-testid="card-info-cases">
            <CardHeader className="pb-3">
              <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">5 Business Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Netflix, Spotify, Grab, Shopify, Airbnb</p>
            </CardContent>
          </Card>

          <Card data-testid="card-info-challenges">
            <CardHeader className="pb-3">
              <Target className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">15 Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Drag & drop, multiple choice, scenarios, classification</p>
            </CardContent>
          </Card>

          <Card data-testid="card-info-time">
            <CardHeader className="pb-3">
              <Clock className="w-8 h-8 text-orange-600 mb-2" />
              <CardTitle className="text-lg">30-45 Minutes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Complete at your own pace with timed challenges</p>
            </CardContent>
          </Card>

          <Card data-testid="card-info-points">
            <CardHeader className="pb-3">
              <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
              <CardTitle className="text-lg">2,250 Points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Track your score and compete with classmates</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">What You Will Learn</CardTitle>
            <CardDescription>Apply IPO framework to real-world digital platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" data-testid="case-netflix">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-lg shrink-0">N</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Netflix</h3>
                  <p className="text-sm text-gray-600">Content delivery platform serving 300M+ subscribers with Open Connect CDN</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" data-testid="case-spotify">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-lg shrink-0">S</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Spotify</h3>
                  <p className="text-sm text-gray-600">AI-powered music recommendation system with 600M+ users</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" data-testid="case-grab">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg shrink-0">G</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Grab</h3>
                  <p className="text-sm text-gray-600">Southeast Asia's super-app combining ride-hailing, delivery, and fintech</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" data-testid="case-shopify">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg shrink-0">Sh</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Shopify</h3>
                  <p className="text-sm text-gray-600">E-commerce platform powering 5.6M+ merchant stores globally</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" data-testid="case-airbnb">
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white text-lg shrink-0">A</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Airbnb</h3>
                  <p className="text-sm text-gray-600">Two-sided marketplace connecting hosts and guests worldwide</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Challenge Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-1 text-blue-700">Drag & Drop (IPO Categorization)</h4>
                <p className="text-sm text-gray-600">Sort components into Input, Processing, or Output categories</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-1 text-green-700">Multiple Choice</h4>
                <p className="text-sm text-gray-600">Answer questions about digital technologies and strategies</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold mb-1 text-purple-700">Scenario-Based</h4>
                <p className="text-sm text-gray-600">Apply IPO concepts to solve real business challenges</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="font-semibold mb-1 text-amber-700">Classification</h4>
                <p className="text-sm text-gray-600">Classify items as Digital Tools, Technologies, or Business Concepts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => setLocation("/register")}
            data-testid="button-start"
          >
            Start Learning Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
