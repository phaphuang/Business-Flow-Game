import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { AVATARS } from "@shared/gameData";

export default function RegistrationPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);

  const registerMutation = useMutation({
    mutationFn: async (data: { fullName: string; studentId: string }) => {
      const res = await apiRequest("POST", "/api/students/register", data);
      return res.json();
    },
    onSuccess: async (student) => {
      try {
        // Start a completely new session every time they register/start
        const newSessionRes = await apiRequest("POST", "/api/sessions/start", { studentId: student.id });
        const newSession = await newSessionRes.json();
        const targetSessionId = newSession.id;

        localStorage.setItem("ipo_avatar", selectedAvatar);
        localStorage.setItem("ipo_player_name", student.fullName);

        toast({
          title: "Let's go!",
          description: `Welcome ${student.fullName}! Your adventure begins now...`,
        });

        setTimeout(() => {
          setLocation(`/game/${targetSessionId}`);
        }, 800);
      } catch (err: any) {
        toast({
          title: "Error starting game",
          description: err.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Oops!",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      toast({ title: "Need your name!", description: "Please type your full name (at least 2 characters)", variant: "destructive" });
      return;
    }
    if (studentId.trim().length < 5) {
      toast({ title: "Need your Student ID!", description: "Please type your student ID (at least 5 characters)", variant: "destructive" });
      return;
    }
    registerMutation.mutate({ fullName: fullName.trim(), studentId: studentId.trim() });
  };

  const currentAvatar = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center pb-3">
          <div className="text-5xl sm:text-6xl mb-2 animate-float">{currentAvatar.emoji}</div>
          <CardTitle className="text-xl sm:text-2xl">Choose Your Character!</CardTitle>
          <CardDescription className="text-sm">Pick an avatar and enter your info to start</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Your Avatar</Label>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    data-testid={`avatar-${av.id}`}
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-xl border-2 transition-all active:scale-95 touch-manipulation ${
                      selectedAvatar === av.id
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 scale-105"
                        : "border-gray-200 active:border-gray-300"
                    }`}
                  >
                    <span className="text-xl sm:text-2xl">{av.emoji}</span>
                    <span className="text-[10px] font-medium text-gray-600">{av.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Your Name</Label>
              <Input
                id="fullName"
                data-testid="input-full-name"
                placeholder="What's your name?"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={registerMutation.isPending}
                className="h-12 touch-manipulation"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                data-testid="input-student-id"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={registerMutation.isPending}
                className="h-12 touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-base py-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 touch-manipulation"
              disabled={registerMutation.isPending}
              data-testid="button-start-game"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing your adventure...
                </>
              ) : (
                "Start Adventure!"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full py-5 touch-manipulation"
              onClick={() => setLocation("/")}
              disabled={registerMutation.isPending}
              data-testid="button-back"
            >
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
