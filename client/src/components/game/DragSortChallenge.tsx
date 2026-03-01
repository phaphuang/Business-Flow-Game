import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowRight } from "lucide-react";
import type { Challenge } from "@shared/gameData";

interface Props {
  challenge: Challenge;
  onAnswer: (answer: any, isCorrect: boolean) => void;
  disabled?: boolean;
}

const IPO_ZONES = [
  { key: "input", label: "INPUT", description: "Data entering the system", bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", activeBg: "bg-blue-100", emoji: "\uD83D\uDCE5" },
  { key: "processing", label: "PROCESSING", description: "Transformation & computation", bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700", activeBg: "bg-purple-100", emoji: "\u2699\uFE0F" },
  { key: "output", label: "OUTPUT", description: "Value delivered", bg: "bg-green-50", border: "border-green-300", text: "text-green-700", activeBg: "bg-green-100", emoji: "\uD83D\uDCE4" },
];

const CLASSIFY_ZONES = [
  { key: "tool", label: "DIGITAL TOOL", description: "Specific software/hardware", bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", activeBg: "bg-blue-100", emoji: "\uD83D\uDD27" },
  { key: "technology", label: "DIGITAL TECHNOLOGY", description: "Broad technical paradigm", bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700", activeBg: "bg-purple-100", emoji: "\uD83D\uDCBB" },
  { key: "business", label: "BUSINESS CONCEPT", description: "Strategic model", bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700", activeBg: "bg-amber-100", emoji: "\uD83D\uDCBC" },
];

export default function DragSortChallenge({ challenge, onAnswer, disabled }: Props) {
  const zones = challenge.type === "drag-drop-ipo" ? IPO_ZONES : CLASSIFY_ZONES;
  const [unassigned, setUnassigned] = useState<string[]>(
    challenge.items?.map(i => i.id) || []
  );
  const [assignment, setAssignment] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const getItem = (id: string) => challenge.items?.find(i => i.id === id);

  const handleItemTap = (itemId: string) => {
    if (disabled) return;
    setSelectedItem(prev => prev === itemId ? null : itemId);
  };

  const handleZoneTap = (zoneKey: string) => {
    if (disabled || !selectedItem) return;
    setAssignment(prev => ({ ...prev, [selectedItem]: zoneKey }));
    setUnassigned(prev => prev.filter(id => id !== selectedItem));
    setSelectedItem(null);
  };

  const handleRemove = (itemId: string) => {
    if (disabled) return;
    setUnassigned(prev => [...prev, itemId]);
    setAssignment(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setSelectedItem(null);
  };

  const handleSubmit = () => {
    if (disabled || unassigned.length > 0) return;
    const userAnswer: Record<string, string[]> = {};
    zones.forEach(z => { userAnswer[z.key] = []; });
    Object.entries(assignment).forEach(([itemId, zone]) => {
      userAnswer[zone]?.push(itemId);
    });

    const correct = challenge.correctAnswer as Record<string, string[]>;
    let isCorrect = true;
    for (const z of zones) {
      const userSet = new Set(userAnswer[z.key] || []);
      const correctSet = new Set(correct[z.key] || []);
      if (userSet.size !== correctSet.size) { isCorrect = false; break; }
      for (const id of correctSet) {
        if (!userSet.has(id)) { isCorrect = false; break; }
      }
      if (!isCorrect) break;
    }
    onAnswer(userAnswer, isCorrect);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {selectedItem ? "Now tap a zone below to place it" : "Tap an item, then tap a zone to sort it"}
      </p>

      <div className="flex flex-wrap gap-2 min-h-[52px] p-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl">
        {unassigned.length === 0 && (
          <p className="text-sm text-muted-foreground italic w-full text-center py-1">All items placed! Review below.</p>
        )}
        {unassigned.map(id => {
          const item = getItem(id);
          const isSelected = selectedItem === id;
          return (
            <button
              key={id}
              type="button"
              data-testid={`drag-item-${id}`}
              onClick={() => handleItemTap(id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium select-none transition-all touch-manipulation ${
                isSelected
                  ? "bg-indigo-500 text-white border-2 border-indigo-600 shadow-lg scale-105 ring-2 ring-indigo-300"
                  : "bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-400 active:scale-95"
              }`}
            >
              {isSelected && <ArrowRight className="w-4 h-4 shrink-0" />}
              <span>{item?.text}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {zones.map(z => {
          const zoneItems = Object.entries(assignment).filter(([, zone]) => zone === z.key);
          const isTargetable = !!selectedItem;
          return (
            <Card
              key={z.key}
              data-testid={`drop-zone-${z.key}`}
              onClick={() => handleZoneTap(z.key)}
              className={`p-3 min-h-[80px] border-2 transition-all touch-manipulation ${
                isTargetable
                  ? `${z.border} ${z.activeBg} cursor-pointer ring-2 ring-offset-1 ${z.border} active:scale-[0.98]`
                  : `border-dashed border-slate-300`
              }`}
            >
              <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${z.border}`}>
                <span className="text-lg">{z.emoji}</span>
                <div>
                  <h3 className={`font-bold text-sm ${z.text}`}>{z.label}</h3>
                  <p className="text-xs text-muted-foreground">{z.description}</p>
                </div>
                {isTargetable && (
                  <span className={`ml-auto text-xs font-bold ${z.text} animate-pulse`}>Tap to place here</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {zoneItems.map(([itemId]) => {
                  const item = getItem(itemId);
                  return (
                    <div
                      key={itemId}
                      data-testid={`assigned-${itemId}`}
                      className={`flex items-center gap-2 px-3 py-2 ${z.bg} border ${z.border} rounded-lg text-sm`}
                    >
                      <span className="flex-1 leading-tight">{item?.text}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(itemId); }}
                        disabled={disabled}
                        data-testid={`remove-${itemId}`}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100 text-red-500 active:bg-red-200 touch-manipulation shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {zoneItems.length === 0 && !isTargetable && (
                  <p className="text-xs text-muted-foreground italic py-1">No items yet</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={unassigned.length > 0 || disabled}
        className="w-full py-6 text-base touch-manipulation"
        size="lg"
        data-testid="button-submit-answer"
      >
        {disabled ? "Submitting..." : `Submit (${Object.keys(assignment).length}/${challenge.items?.length || 0} placed)`}
      </Button>
    </div>
  );
}
