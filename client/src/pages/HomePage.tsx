import { useLocation } from "wouter";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { BookOpen, Trophy, Clock, Target } from "lucide-react";

  export default function HomePage() {
    const [, setLocation] = useLocation();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              IPO Learning Game
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Master Input-Processing-Output Concepts in Digital Business Ecosystems
            </p>
            <p className="text-lg text-gray-500">
              ICDI Bachelor Program - Educational Game
            </p>
          </div>

          {/* Game Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="pb-3">
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">5 Business Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Netflix, Spotify, Grab, Shopify, Airbnb
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Target className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Interactive Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Drag & drop, multiple choice, scenarios
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Clock className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg">30-45 Minutes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Complete at your own pace with timed challenges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle className="text-lg">Earn Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Track your score and compete with classmates
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">What You'll Learn</CardTitle>
              <CardDescription>
                Apply IPO framework to real-world digital platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <span className="text-2xl mr-2">📺</span> Netflix
                  </h3>
                  <p className="text-sm text-gray-600">
                    Content delivery platform serving 300M+ subscribers with Open Connect CDN
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <span className="text-2xl mr-2">🎵</span> Spotify
                  </h3>
                  <p className="text-sm text-gray-600">
                    AI-powered music recommendation system with 600M+ users
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <span className="text-2xl mr-2">🚗</span> Grab
                  </h3>
                  <p className="text-sm text-gray-600">
                    Southeast Asia's super-app combining ride-hailing, delivery, and fintech
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <span className="text-2xl mr-2">🛍️</span> Shopify
                  </h3>
                  <p className="text-sm text-gray-600">
                    E-commerce platform powering 5.6M+ merchant stores globally
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <span className="text-2xl mr-2">🏠</span> Airbnb
                  </h3>
                  <p className="text-sm text-gray-600">
                    Two-sided marketplace connecting hosts and guests worldwide
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => setLocation("/register")}
            >
              Start Learning Journey
            </Button>
          </div>
        </div>
      </div>
    );
  }
  