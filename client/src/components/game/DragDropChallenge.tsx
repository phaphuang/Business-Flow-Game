import { useState } from "react";
  import { Button } from "@/components/ui/button";
  import { Card } from "@/components/ui/card";
  import type { Challenge } from "@shared/gameData";
  import { GripVertical } from "lucide-react";

  interface Props {
    challenge: Challenge;
    onAnswer: (answer: any, isCorrect: boolean) => void;
  }

  export default function DragDropChallenge({ challenge, onAnswer }: Props) {
    const [categories] = useState<{ [key: string]: string[] }>({
      input: [],
      processing: [],
      output: [],
    });
    
    const [unassigned, setUnassigned] = useState<string[]>(
      challenge.items?.map(item => item.id) || []
    );
    
    const [assignment, setAssignment] = useState<{ [key: string]: string }>({});

    const handleDrop = (itemId: string, category: string) => {
      setUnassigned(prev => prev.filter(id => id !== itemId));
      setAssignment(prev => ({ ...prev, [itemId]: category }));
    };

    const handleRemove = (itemId: string) => {
      setUnassigned(prev => [...prev, itemId]);
      setAssignment(prev => {
        const newAssignment = { ...prev };
        delete newAssignment[itemId];
        return newAssignment;
      });
    };

    const handleSubmit = () => {
      const userAnswer: { [key: string]: string[] } = {
        input: [],
        processing: [],
        output: [],
      };

      Object.entries(assignment).forEach(([itemId, category]) => {
        userAnswer[category].push(itemId);
      });

      // Check if correct
      const correctAnswer = challenge.correctAnswer;
      let isCorrect = true;

      for (const category of ['input', 'processing', 'output']) {
        const userItems = new Set(userAnswer[category]);
        const correctItems = new Set(correctAnswer[category]);
        
        if (userItems.size !== correctItems.size) {
          isCorrect = false;
          break;
        }
        
        for (const item of correctItems) {
          if (!userItems.has(item)) {
            isCorrect = false;
            break;
          }
        }
      }

      onAnswer(userAnswer, isCorrect);
    };

    const getItemById = (id: string) => challenge.items?.find(item => item.id === id);

    const isComplete = unassigned.length === 0;

    return (
      <div className="space-y-6">
        {/* Unassigned Items */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-700">Items to Categorize:</h3>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(itemId => {
              const item = getItemById(itemId);
              return (
                <div
                  key={itemId}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:border-blue-400 transition-colors flex items-center gap-2"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("itemId", itemId)}
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{item?.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['input', 'processing', 'output'].map(category => (
            <Card
              key={category}
              className="p-4 min-h-[200px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData("itemId");
                if (itemId) handleDrop(itemId, category);
              }}
            >
              <h3 className="font-bold text-lg mb-3 capitalize text-center">
                {category === 'input' && '📥'} 
                {category === 'processing' && '⚙️'} 
                {category === 'output' && '📤'} 
                {' '}{category}
              </h3>
              <div className="space-y-2">
                {Object.entries(assignment)
                  .filter(([, cat]) => cat === category)
                  .map(([itemId]) => {
                    const item = getItemById(itemId);
                    return (
                      <div
                        key={itemId}
                        className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm flex justify-between items-center"
                      >
                        <span>{item?.text}</span>
                        <button
                          onClick={() => handleRemove(itemId)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="w-full"
          size="lg"
        >
          Submit Answer
        </Button>
      </div>
    );
  }
  