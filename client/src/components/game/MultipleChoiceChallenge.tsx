import { useState } from "react";
  import { Button } from "@/components/ui/button";
  import { Card } from "@/components/ui/card";
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
  import { Label } from "@/components/ui/label";
  import type { Challenge } from "@shared/gameData";

  interface Props {
    challenge: Challenge;
    onAnswer: (answer: number, isCorrect: boolean) => void;
  }

  export default function MultipleChoiceChallenge({ challenge, onAnswer }: Props) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleSubmit = () => {
      if (selectedOption === null) return;
      
      const isCorrect = selectedOption === challenge.correctAnswer;
      onAnswer(selectedOption, isCorrect);
    };

    return (
      <div className="space-y-6">
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => setSelectedOption(parseInt(value))}
        >
          <div className="space-y-3">
            {challenge.options?.map((option, index) => (
              <Card
                key={index}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedOption === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedOption(index)}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="cursor-pointer flex-1 text-sm"
                  >
                    {option}
                  </Label>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>

        <Button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="w-full"
          size="lg"
        >
          Submit Answer
        </Button>
      </div>
    );
  }
  