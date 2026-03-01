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
      const sessionRes = await apiRequest("POST", "/api/sessions/start", { studentId: student.id });
      const session = await sessionRes.json();

      localStorage.setItem("ipo_avatar", selectedAvatar);
      localStorage.setItem("ipo_player_name", student.fullName);

      toast({
        title: "Let's go!",
        description: `Welcome ${student.fullName}! Your adventure begins now...`,
      });

      setTimeout(() => {
        setLocation(`/game/${session.id}`);
      }, 800);
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
        <CardHeader className="text-center">
          <div className="text-6xl mb-2 animate-float">{currentAvatar.emoji}</div>
          <CardTitle className="text-2xl">Choose Your Character!</CardTitle>
          <CardDescription>Pick an avatar and enter your info to start the adventure</CardDescription>
        </CardHeader>
        <CardContent>
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
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedAvatar === av.id
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{av.emoji}</span>
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
              />
            </div>

            <Button
              type="submit"
              className="w-full text-base py-5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
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
              className="w-full"
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
