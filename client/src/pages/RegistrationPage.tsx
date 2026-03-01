import { useState } from "react";
  import { useLocation } from "wouter";
  import { useMutation } from "@tanstack/react-query";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { useToast } from "@/hooks/use-toast";
  import { Loader2, UserPlus } from "lucide-react";

  export default function RegistrationPage() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [fullName, setFullName] = useState("");
    const [studentId, setStudentId] = useState("");

    const registerMutation = useMutation({
      mutationFn: async (data: { fullName: string; studentId: string }) => {
        const res = await fetch("/api/students/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }
        return res.json();
      },
      onSuccess: async (student) => {
        // Create new game session
        const sessionRes = await fetch("/api/sessions/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: student.id }),
        });
        const session = await sessionRes.json();
        
        toast({
          title: "Registration Successful!",
          description: `Welcome ${student.fullName}! Starting your learning journey...`,
        });
        
        setTimeout(() => {
          setLocation(`/game/${session.id}`);
        }, 1000);
      },
      onError: (error: Error) => {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (fullName.trim().length < 2) {
        toast({
          title: "Invalid Name",
          description: "Please enter your full name (at least 2 characters)",
          variant: "destructive",
        });
        return;
      }
      if (studentId.trim().length < 5) {
        toast({
          title: "Invalid Student ID",
          description: "Please enter your student ID (at least 5 characters)",
          variant: "destructive",
        });
        return;
      }
      registerMutation.mutate({ fullName: fullName.trim(), studentId: studentId.trim() });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Student Registration</CardTitle>
            <CardDescription>
              Enter your details to start the IPO Learning Game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={registerMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="12345678"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={registerMutation.isPending}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Start Game"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/")}
                disabled={registerMutation.isPending}
              >
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  