import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserCircle, Target } from "lucide-react";
import type { Challenge } from "@shared/gameData";

interface Props {
  challenge: Challenge;
  onAnswer: (answer: number, isCorrect: boolean) => void;
  disabled?: boolean;
}

export default function ScenarioChallenge({ challenge, onAnswer, disabled }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedOption === null || disabled) return;
    const isCorrect = selectedOption === challenge.correctAnswer;
    onAnswer(selectedOption, isCorrect);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg" data-testid="text-role">
        <UserCircle className="w-5 h-5 text-indigo-600 shrink-0" />
        <span className="text-sm font-semibold text-indigo-700">Your Role: {challenge.role}</span>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed" data-testid="text-scenario">
        {challenge.scenario}
      </div>

      <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg" data-testid="text-mission">
        <Target className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <span className="text-sm font-semibold text-amber-800">{challenge.mission}</span>
      </div>

      <RadioGroup
        value={selectedOption !== null ? selectedOption.toString() : undefined}
        onValueChange={(value) => !disabled && setSelectedOption(parseInt(value))}
      >
        <div className="space-y-3">
          {challenge.options.map((option, index) => (
            <Card
              key={index}
              data-testid={`option-card-${index}`}
              className={`p-4 cursor-pointer transition-all ${
                selectedOption === index
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "hover:border-slate-400"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
              onClick={() => !disabled && setSelectedOption(index)}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={disabled} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 text-sm leading-relaxed">
                  {option}
                </Label>
              </div>
            </Card>
          ))}
        </div>
      </RadioGroup>

      <Button
        onClick={handleSubmit}
        disabled={selectedOption === null || disabled}
        className="w-full"
        size="lg"
        data-testid="button-submit-answer"
      >
        {disabled ? "Submitting..." : "Submit Decision"}
      </Button>
    </div>
  );
}
