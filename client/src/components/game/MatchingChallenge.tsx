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
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link2 className="w-4 h-4 text-muted-foreground" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Click a left item, then click the matching right item to connect them
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Components</p>
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
                className={`p-3 cursor-pointer transition-all text-sm ${
                  isSelected ? "border-2 border-primary ring-2 ring-primary/20 bg-primary/5" :
                  isConnected ? `border-2 ${color?.border} ${color?.bg}` :
                  "hover:border-slate-400"
                } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-2">
                  {isConnected && (
                    <span className={`w-5 h-5 rounded-full ${color?.badge} text-white text-xs flex items-center justify-center font-bold shrink-0`}>
                      {connIdx + 1}
                    </span>
                  )}
                  <span className="flex-1">{pair.left}</span>
                  {isConnected && (
                    <X className="w-3.5 h-3.5 text-red-400 hover:text-red-600 shrink-0" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Descriptions</p>
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
                className={`p-3 transition-all text-sm ${
                  canClick ? "cursor-pointer hover:border-primary hover:bg-primary/5" : "cursor-default"
                } ${
                  isConnected ? `border-2 ${color?.border} ${color?.bg}` : ""
                } ${disabled ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-2">
                  {isConnected && (
                    <span className={`w-5 h-5 rounded-full ${color?.badge} text-white text-xs flex items-center justify-center font-bold shrink-0`}>
                      {connIdx + 1}
                    </span>
                  )}
                  <span className="flex-1">{pair.right}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={!allConnected || disabled} className="w-full" size="lg" data-testid="button-submit-answer">
        {disabled ? "Submitting..." : `Submit Connections (${Object.keys(connections).length}/${pairs.length})`}
      </Button>
    </div>
  );
}
