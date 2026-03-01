import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";
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
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

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

  const handleDragStart = (idx: number, e: React.DragEvent) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", idx.toString());
  };

  const handleDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(idx);
  };

  const handleDrop = (toIdx: number, e: React.DragEvent) => {
    e.preventDefault();
    const fromIdx = parseInt(e.dataTransfer.getData("text/plain"));
    if (!isNaN(fromIdx) && fromIdx !== toIdx) {
      moveStep(fromIdx, toIdx);
    }
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleSubmit = () => {
    if (disabled || !orderedSteps) return;
    const userAnswer = orderedSteps.map(s => s.id);
    const correct = challenge.correctAnswer as string[];
    const isCorrect = userAnswer.every((id, i) => id === correct[i]);
    onAnswer(userAnswer, isCorrect);
  };

  return (
    <div className="space-y-5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Drag steps into the correct order (first to last)
      </p>

      <div className="space-y-2">
        {orderedSteps?.map((step, idx) => (
          <Card
            key={step.id}
            data-testid={`step-card-${step.id}`}
            draggable={!disabled}
            onDragStart={e => handleDragStart(idx, e)}
            onDragOver={e => handleDragOver(idx, e)}
            onDragLeave={() => setDragOverIdx(null)}
            onDrop={e => handleDrop(idx, e)}
            onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
            className={`flex items-center gap-3 p-3 cursor-grab active:cursor-grabbing transition-all select-none ${
              dragIdx === idx ? "opacity-40 scale-95" : ""
            } ${dragOverIdx === idx && dragIdx !== idx ? "border-primary border-2 bg-primary/5" : ""}`}
          >
            <div className="flex items-center gap-2 shrink-0">
              <GripVertical className="w-4 h-4 text-slate-400" />
              <span className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                {idx + 1}
              </span>
            </div>
            <span className="text-sm flex-1">{step.text}</span>
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                onClick={() => idx > 0 && moveStep(idx, idx - 1)}
                disabled={idx === 0 || disabled}
                className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30"
                data-testid={`move-up-${step.id}`}
              >
                <ArrowUp className="w-4 h-4 text-slate-500" />
              </button>
              <button
                onClick={() => orderedSteps && idx < orderedSteps.length - 1 && moveStep(idx, idx + 1)}
                disabled={!orderedSteps || idx === orderedSteps.length - 1 || disabled}
                className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30"
                data-testid={`move-down-${step.id}`}
              >
                <ArrowDown className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={disabled} className="w-full" size="lg" data-testid="button-submit-answer">
        {disabled ? "Submitting..." : "Submit Order"}
      </Button>
    </div>
  );
}
