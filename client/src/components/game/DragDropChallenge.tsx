import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Challenge } from "@shared/gameData";
import { GripVertical } from "lucide-react";

interface Props {
  challenge: Challenge;
  onAnswer: (answer: any, isCorrect: boolean) => void;
  disabled?: boolean;
}

export default function DragDropChallenge({ challenge, onAnswer, disabled }: Props) {
  const [unassigned, setUnassigned] = useState<string[]>(
    challenge.items?.map(item => item.id) || []
  );
  const [assignment, setAssignment] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDrop = (itemId: string, category: string) => {
    if (disabled) return;
    setUnassigned(prev => prev.filter(id => id !== itemId));
    setAssignment(prev => ({ ...prev, [itemId]: category }));
    setDragOver(null);
  };

  const handleRemove = (itemId: string) => {
    if (disabled) return;
    setUnassigned(prev => [...prev, itemId]);
    setAssignment(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleSubmit = () => {
    if (disabled) return;
    const userAnswer: Record<string, string[]> = { input: [], processing: [], output: [] };
    Object.entries(assignment).forEach(([itemId, category]) => {
      userAnswer[category].push(itemId);
    });

    const correctAnswer = challenge.correctAnswer as Record<string, string[]>;
    let isCorrect = true;
    for (const category of ['input', 'processing', 'output']) {
      const userItems = new Set(userAnswer[category] || []);
      const correctItems = new Set(correctAnswer[category] || []);
      if (userItems.size !== correctItems.size) { isCorrect = false; break; }
      for (const item of correctItems) {
        if (!userItems.has(item)) { isCorrect = false; break; }
      }
      if (!isCorrect) break;
    }
    onAnswer(userAnswer, isCorrect);
  };

  const getItemById = (id: string) => challenge.items?.find(item => item.id === id);
  const isComplete = unassigned.length === 0;

  const categories = [
    { key: 'input', label: 'Input', icon: '[I]', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', textColor: 'text-blue-700' },
    { key: 'processing', label: 'Processing', icon: '[P]', bgColor: 'bg-amber-50', borderColor: 'border-amber-300', textColor: 'text-amber-700' },
    { key: 'output', label: 'Output', icon: '[O]', bgColor: 'bg-green-50', borderColor: 'border-green-300', textColor: 'text-green-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-muted-foreground">Drag items to the correct category:</h3>
        <div className="flex flex-wrap gap-2">
          {unassigned.map(itemId => {
            const item = getItemById(itemId);
            return (
              <div
                key={itemId}
                data-testid={`drag-item-${itemId}`}
                className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg cursor-grab hover:border-primary transition-colors flex items-center gap-2 shadow-sm"
                draggable={!disabled}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", itemId);
                  e.dataTransfer.effectAllowed = "move";
                }}
              >
                <GripVertical className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm">{item?.text}</span>
              </div>
            );
          })}
          {unassigned.length === 0 && (
            <p className="text-sm text-muted-foreground italic">All items assigned. Review your choices below.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(({ key, label, icon, bgColor, borderColor, textColor }) => (
          <Card
            key={key}
            data-testid={`drop-zone-${key}`}
            className={`p-4 min-h-[180px] border-2 transition-colors ${
              dragOver === key ? `${borderColor} ${bgColor}` : 'border-dashed border-gray-300'
            }`}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOver(key); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => { e.preventDefault(); const itemId = e.dataTransfer.getData("text/plain"); if (itemId) handleDrop(itemId, key); }}
          >
            <h3 className={`font-bold text-base mb-3 text-center ${textColor}`}>{icon} {label}</h3>
            <div className="space-y-2">
              {Object.entries(assignment)
                .filter(([, cat]) => cat === key)
                .map(([itemId]) => {
                  const item = getItemById(itemId);
                  return (
                    <div key={itemId} data-testid={`assigned-item-${itemId}`} className={`px-3 py-2 ${bgColor} border ${borderColor} rounded text-sm flex justify-between items-center gap-2`}>
                      <span className="flex-1">{item?.text}</span>
                      <button onClick={() => handleRemove(itemId)} className="text-red-500 hover:text-red-700 text-xs font-bold shrink-0" data-testid={`remove-item-${itemId}`} disabled={disabled}>x</button>
                    </div>
                  );
                })}
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={!isComplete || disabled} className="w-full" size="lg" data-testid="button-submit-answer">
        {disabled ? "Submitting..." : "Submit Answer"}
      </Button>
    </div>
  );
}
