import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
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

  if (!data) return null;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-slate-50 border-slate-200">
        <div className="flex items-start gap-3">
          <Calculator className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm sm:text-base font-semibold text-slate-700 mb-1">{data.prompt}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Use the data from the scenario above.</p>
          </div>
        </div>
      </Card>

      {data.hints.length > 0 && (
        <div>
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium w-full py-2 touch-manipulation"
            data-testid="button-toggle-hints"
          >
            <Lightbulb className="w-4 h-4" />
            {showHints ? "Hide calculation hints" : "Show calculation hints"}
            {showHints ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
          </button>
          {showHints && (
            <Card className="mt-2 p-3 sm:p-4 bg-amber-50 border-amber-200">
              <ul className="space-y-2">
                {data.hints.map((hint, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="font-bold text-amber-600 shrink-0 mt-0.5">Step {i + 1}:</span>
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
            inputMode="decimal"
            placeholder="Your answer..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            disabled={disabled}
            className="text-lg h-14 touch-manipulation"
            data-testid="input-calculation"
          />
        </div>
        <div className="text-sm font-semibold text-muted-foreground shrink-0 min-w-[60px]">
          {data.unit}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={answer.trim() === "" || disabled}
        className="w-full py-6 text-base touch-manipulation"
        size="lg"
        data-testid="button-submit-answer"
      >
        {disabled ? "Submitting..." : "Submit Calculation"}
      </Button>
    </div>
  );
}
