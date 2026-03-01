import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator, Lightbulb } from "lucide-react";
import type { Challenge } from "@shared/gameData";

interface Props {
  challenge: Challenge;
  onAnswer: (answer: number, isCorrect: boolean) => void;
  disabled?: boolean;
}

export default function CalculationChallenge({ challenge, onAnswer, disabled }: Props) {
  const [answer, setAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const data = challenge.calcData;

  const handleSubmit = () => {
    if (disabled || !data || answer.trim() === "") return;
    const numAnswer = parseFloat(answer);
    if (isNaN(numAnswer)) return;
    const isCorrect = Math.abs(numAnswer - data.answer) <= data.tolerance;
    onAnswer(numAnswer, isCorrect);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (!data) return null;

  return (
    <div className="space-y-5">
      <Card className="p-4 bg-slate-50 border-slate-200">
        <div className="flex items-start gap-3">
          <Calculator className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">{data.prompt}</p>
            <p className="text-xs text-muted-foreground">Use the data from the scenario above to calculate your answer.</p>
          </div>
        </div>
      </Card>

      {data.hints.length > 0 && (
        <div>
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
            data-testid="button-toggle-hints"
          >
            <Lightbulb className="w-4 h-4" />
            {showHints ? "Hide calculation hints" : "Show calculation hints"}
          </button>
          {showHints && (
            <Card className="mt-2 p-3 bg-amber-50 border-amber-200">
              <ul className="space-y-1">
                {data.hints.map((hint, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="font-bold text-amber-600 shrink-0">Step {i + 1}:</span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Enter your answer..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="text-lg h-12"
            data-testid="input-calculation"
          />
        </div>
        <div className="text-sm font-semibold text-muted-foreground shrink-0 min-w-[80px]">
          {data.unit}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={answer.trim() === "" || disabled} className="w-full" size="lg" data-testid="button-submit-answer">
        {disabled ? "Submitting..." : "Submit Calculation"}
      </Button>
    </div>
  );
}
