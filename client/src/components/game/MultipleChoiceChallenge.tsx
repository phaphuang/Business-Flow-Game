import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Challenge } from "@shared/gameData";

interface Props {
  challenge: Challenge;
  onAnswer: (answer: number, isCorrect: boolean) => void;
  disabled?: boolean;
}

export default function MultipleChoiceChallenge({ challenge, onAnswer, disabled }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedOption === null || disabled) return;
    const isCorrect = selectedOption === challenge.correctAnswer;
    onAnswer(selectedOption, isCorrect);
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        value={selectedOption !== null ? selectedOption.toString() : undefined}
        onValueChange={(value) => !disabled && setSelectedOption(parseInt(value))}
      >
        <div className="space-y-3">
          {challenge.options?.map((option, index) => (
            <Card
              key={index}
              data-testid={`option-card-${index}`}
              className={`p-4 cursor-pointer transition-colors ${
                selectedOption === index
                  ? 'border-primary bg-blue-50'
                  : 'hover:bg-gray-50'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && setSelectedOption(index)}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={disabled} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 text-sm">
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
        {disabled ? "Submitting..." : "Submit Answer"}
      </Button>
    </div>
  );
}
