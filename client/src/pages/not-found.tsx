import { useLocation } from "wouter";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { Home } from "lucide-react";

  export default function NotFound() {
    const [, setLocation] = useLocation();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-4xl">404</CardTitle>
            <CardDescription className="text-lg">Page not found</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-gray-600">
              The page you're looking for doesn't exist.
            </p>
            <Button onClick={() => setLocation("/")}>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  