import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link2, X } from "lucide-react";
import type { Challenge } from "@shared/gameData";

interface Props {
  challenge: Challenge;
  onAnswer: (answer: any, isCorrect: boolean) => void;
  disabled?: boolean;
}

const CONNECTION_COLORS = [
  { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-700", badge: "bg-blue-500" },
  { bg: "bg-green-100", border: "border-green-400", text: "text-green-700", badge: "bg-green-500" },
  { bg: "bg-orange-100", border: "border-orange-400", text: "text-orange-700", badge: "bg-orange-500" },
  { bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-700", badge: "bg-purple-500" },
  { bg: "bg-pink-100", border: "border-pink-400", text: "text-pink-700", badge: "bg-pink-500" },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchingChallenge({ challenge, onAnswer, disabled }: Props) {
  const pairs = challenge.pairs || [];
  const shuffledRight = useMemo(() => shuffleArray(pairs), []);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});

  const reverseConnections = useMemo(() => {
    const rev: Record<string, string> = {};
    Object.entries(connections).forEach(([leftId, rightId]) => { rev[rightId] = leftId; });
    return rev;
  }, [connections]);

  const getConnectionIndex = (pairId: string) => {
    const connected = Object.keys(connections);
    return connected.indexOf(pairId);
  };

  const getRightConnectionIndex = (pairId: string) => {
    const leftId = reverseConnections[pairId];
    if (!leftId) return -1;
    return Object.keys(connections).indexOf(leftId);
  };

  const handleLeftClick = (pairId: string) => {
    if (disabled) return;
    if (connections[pairId]) {
      setConnections(prev => {
        const next = { ...prev };
        delete next[pairId];
        return next;
      });
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(prev => prev === pairId ? null : pairId);
  };

  const handleRightClick = (pairId: string) => {
    if (disabled || !selectedLeft) return;
    if (reverseConnections[pairId]) {
      const oldLeft = reverseConnections[pairId];
      setConnections(prev => {
        const next = { ...prev };
        delete next[oldLeft];
        return next;
      });
    }
    setConnections(prev => ({ ...prev, [selectedLeft]: pairId }));
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    if (disabled || Object.keys(connections).length !== pairs.length) return;
    const isCorrect = pairs.every(p => connections[p.id] === p.id);
    onAnswer(connections, isCorrect);
  };

  const allConnected = Object.keys(connections).length === pairs.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
        <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {selectedLeft ? "Now tap a description on the right to connect" : "Tap a component on the left first"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Components</p>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Tap to select</span>
          </div>
          {pairs.map(pair => {
            const connIdx = getConnectionIndex(pair.id);
            const isConnected = connIdx >= 0;
            const color = isConnected ? CONNECTION_COLORS[connIdx % CONNECTION_COLORS.length] : null;
            const isSelected = selectedLeft === pair.id;
            
            return (
              <Card
                key={pair.id}
                data-testid={`left-item-${pair.id}`}
                onClick={() => handleLeftClick(pair.id)}
                className={`relative flex items-center p-3 sm:p-4 cursor-pointer transition-all duration-200 min-h-[4.5rem] ${
                  isSelected 
                    ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 shadow-md scale-[1.01] z-10" 
                    : isConnected 
                      ? `${color?.bg} ${color?.border} border-2 shadow-sm`
                      : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm"
                } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
              >
                <div className="flex items-center gap-3 w-full">
                  {isConnected && (
                    <span className={`w-7 h-7 rounded-full ${color?.badge} text-white text-xs flex items-center justify-center font-bold shrink-0 shadow-sm`}>
                      {connIdx + 1}
                    </span>
                  )}
                  <span className="flex-1 text-sm sm:text-base font-medium text-slate-700">{pair.left}</span>
                  {isConnected && (
                    <button 
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeftClick(pair.id);
                      }}
                    >
                      <X className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descriptions</p>
            {selectedLeft && (
              <span className="text-[10px] text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full animate-pulse">
                Tap to connect
              </span>
            )}
          </div>
          {shuffledRight.map(pair => {
            const connIdx = getRightConnectionIndex(pair.id);
            const isConnected = connIdx >= 0;
            const color = isConnected ? CONNECTION_COLORS[connIdx % CONNECTION_COLORS.length] : null;
            const canClick = !!selectedLeft && !disabled;
            
            return (
              <Card
                key={pair.id}
                data-testid={`right-item-${pair.id}`}
                onClick={() => handleRightClick(pair.id)}
                className={`relative flex items-center p-3 sm:p-4 transition-all duration-200 min-h-[4.5rem] ${
                  canClick 
                    ? "cursor-pointer border-dashed border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50" 
                    : "cursor-default border border-slate-200 bg-slate-50/50"
                } ${
                  isConnected 
                    ? `border-solid border-2 ${color?.bg} ${color?.border} shadow-sm` 
                    : ""
                } ${disabled ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-3 w-full">
                  {isConnected && (
                    <span className={`w-7 h-7 rounded-full ${color?.badge} text-white text-xs flex items-center justify-center font-bold shrink-0 shadow-sm`}>
                      {connIdx + 1}
                    </span>
                  )}
                  <span className={`flex-1 text-sm sm:text-base ${isConnected ? "font-medium text-slate-700" : "text-slate-600"}`}>
                    {pair.right}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!allConnected || disabled}
        className="w-full py-6 text-base touch-manipulation"
        size="lg"
        data-testid="button-submit-answer"
      >
        {disabled ? "Submitting..." : `Submit Connections (${Object.keys(connections).length}/${pairs.length})`}
      </Button>
    </div>
  );
}
