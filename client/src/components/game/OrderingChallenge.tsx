import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { Challenge } from "@shared/gameData";

interface Props {
  challenge: Challenge;
  onAnswer: (answer: string[], isCorrect: boolean) => void;
  disabled?: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OrderingChallenge({ challenge, onAnswer, disabled }: Props) {
  const [orderedSteps, setOrderedSteps] = useState<typeof challenge.steps>(() =>
    shuffleArray(challenge.steps || [])
  );

  const moveStep = useCallback((fromIdx: number, toIdx: number) => {
    if (disabled) return;
    setOrderedSteps(prev => {
      if (!prev) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, [disabled]);

  const handleSubmit = () => {
    if (disabled || !orderedSteps) return;
    const userAnswer = orderedSteps.map(s => s.id);
    const correct = challenge.correctAnswer as string[];
    const isCorrect = userAnswer.every((id, i) => id === correct[i]);
    onAnswer(userAnswer, isCorrect);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Use the arrows to put steps in the correct order
      </p>

      <div className="space-y-2">
        {orderedSteps?.map((step, idx) => (
          <Card
            key={step.id}
            data-testid={`step-card-${step.id}`}
            className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 select-none transition-all"
          >
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-sm sm:text-base font-bold text-indigo-700 shrink-0">
              {idx + 1}
            </span>
            <span className="text-sm sm:text-base flex-1 leading-snug">{step.text}</span>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => idx > 0 && moveStep(idx, idx - 1)}
                disabled={idx === 0 || disabled}
                className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-30 transition-colors touch-manipulation"
                data-testid={`move-up-${step.id}`}
              >
                <ArrowUp className="w-5 h-5 sm:w-4 sm:h-4 text-slate-600" />
              </button>
              <button
                onClick={() => orderedSteps && idx < orderedSteps.length - 1 && moveStep(idx, idx + 1)}
                disabled={!orderedSteps || idx === orderedSteps.length - 1 || disabled}
                className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-30 transition-colors touch-manipulation"
                data-testid={`move-down-${step.id}`}
              >
                <ArrowDown className="w-5 h-5 sm:w-4 sm:h-4 text-slate-600" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full py-6 text-base touch-manipulation"
        size="lg"
        data-testid="button-submit-answer"
      >
        {disabled ? "Submitting..." : "Submit Order"}
      </Button>
    </div>
  );
}
