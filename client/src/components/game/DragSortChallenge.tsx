import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GripVertical, X } from "lucide-react";
import type { Challenge } from "@shared/gameData";

interface Props {
  challenge: Challenge;
  onAnswer: (answer: any, isCorrect: boolean) => void;
  disabled?: boolean;
}

const IPO_ZONES = [
  { key: "input", label: "INPUT", description: "Data entering the system", bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", dragBg: "bg-blue-100" },
  { key: "processing", label: "PROCESSING", description: "Transformation & computation", bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700", dragBg: "bg-purple-100" },
  { key: "output", label: "OUTPUT", description: "Value delivered", bg: "bg-green-50", border: "border-green-300", text: "text-green-700", dragBg: "bg-green-100" },
];

const CLASSIFY_ZONES = [
  { key: "tool", label: "DIGITAL TOOL", description: "Specific software/hardware", bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", dragBg: "bg-blue-100" },
  { key: "technology", label: "DIGITAL TECHNOLOGY", description: "Broad technical paradigm", bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700", dragBg: "bg-purple-100" },
  { key: "business", label: "BUSINESS CONCEPT", description: "Strategic model", bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700", dragBg: "bg-amber-100" },
];

export default function DragSortChallenge({ challenge, onAnswer, disabled }: Props) {
  const zones = challenge.type === "drag-drop-ipo" ? IPO_ZONES : CLASSIFY_ZONES;
  const [unassigned, setUnassigned] = useState<string[]>(
    challenge.items?.map(i => i.id) || []
  );
  const [assignment, setAssignment] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  const getItem = (id: string) => challenge.items?.find(i => i.id === id);

  const handleDrop = (itemId: string, zone: string) => {
    if (disabled) return;
    if (assignment[itemId] === zone) { setDragOver(null); return; }
    setAssignment(prev => ({ ...prev, [itemId]: zone }));
    setUnassigned(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : prev);
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
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Drag items to the correct zone</p>
        <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
          {unassigned.length === 0 && (
            <p className="text-sm text-muted-foreground italic">All items placed. Review your choices below.</p>
          )}
          {unassigned.map(id => {
            const item = getItem(id);
            return (
              <div
                key={id}
                data-testid={`drag-item-${id}`}
                draggable={!disabled}
                onDragStart={e => { e.dataTransfer.setData("text/plain", id); e.dataTransfer.effectAllowed = "move"; }}
                className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg cursor-grab shadow-sm text-sm select-none hover:border-slate-500 active:scale-95 transition-all"
              >
                <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{item?.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {zones.map(z => (
          <Card
            key={z.key}
            data-testid={`drop-zone-${z.key}`}
            className={`p-3 min-h-[160px] border-2 transition-colors ${
              dragOver === z.key ? `${z.border} ${z.dragBg}` : "border-dashed border-slate-300"
            }`}
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOver(z.key); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); if (id) handleDrop(id, z.key); }}
          >
            <div className={`text-center mb-2 pb-2 border-b ${z.border}`}>
              <h3 className={`font-bold text-sm ${z.text}`}>{z.label}</h3>
              <p className="text-xs text-muted-foreground">{z.description}</p>
            </div>
            <div className="space-y-2">
              {Object.entries(assignment)
                .filter(([, zone]) => zone === z.key)
                .map(([itemId]) => {
                  const item = getItem(itemId);
                  return (
                    <div
                      key={itemId}
                      data-testid={`assigned-${itemId}`}
                      draggable={!disabled}
                      onDragStart={e => { e.dataTransfer.setData("text/plain", itemId); e.dataTransfer.effectAllowed = "move"; }}
                      className={`flex items-center justify-between gap-1 px-2 py-1.5 ${z.bg} border ${z.border} rounded text-xs cursor-grab active:cursor-grabbing`}
                    >
                      <GripVertical className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="flex-1 leading-tight">{item?.text}</span>
                      <button onClick={() => handleRemove(itemId)} disabled={disabled} data-testid={`remove-${itemId}`} className="text-red-400 hover:text-red-600 shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={unassigned.length > 0 || disabled} className="w-full" size="lg" data-testid="button-submit-answer">
        {disabled ? "Submitting..." : `Submit (${Object.keys(assignment).length}/${challenge.items?.length || 0} placed)`}
      </Button>
    </div>
  );
}
