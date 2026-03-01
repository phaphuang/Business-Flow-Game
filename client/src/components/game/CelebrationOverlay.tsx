import { useEffect, useState } from "react";

interface Props {
  isCorrect: boolean;
  points: number;
  explanation: string;
  avatar: string;
  onComplete: () => void;
}

const CONFETTI = ["\u2B50", "\uD83C\uDF89", "\u2728", "\uD83C\uDF1F", "\uD83C\uDFC6", "\uD83D\uDCAB"];
const ENCOURAGE = ["\uD83D\uDCAA", "\uD83E\uDD14", "\uD83E\uDDE0", "\uD83D\uDCDA"];

export default function CelebrationOverlay({ isCorrect, points, explanation, avatar, onComplete }: Props) {
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; delay: number }[]>([]);

  useEffect(() => {
    if (isCorrect) {
      const p = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: CONFETTI[Math.floor(Math.random() * CONFETTI.length)],
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(p);
    }
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      data-testid="celebration-overlay"
      onClick={onComplete}
    >
      {isCorrect && particles.map(p => (
        <div
          key={p.id}
          className="absolute text-xl sm:text-2xl pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: "20%",
            animation: `confetti-fall 1.5s ease-in ${p.delay}s forwards`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      <div className={`animate-bounce-in rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center shadow-2xl ${
        isCorrect ? "bg-gradient-to-b from-green-50 to-green-100 border-2 border-green-300" : "bg-gradient-to-b from-orange-50 to-orange-100 border-2 border-orange-300"
      }`}>
        <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 animate-float">
          {isCorrect ? avatar : ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]}
        </div>
        <h2 className={`text-xl sm:text-2xl font-bold mb-1 ${isCorrect ? "text-green-700" : "text-orange-700"}`}>
          {isCorrect ? "Awesome! \uD83C\uDF89" : "Not quite! \uD83D\uDCAA"}
        </h2>
        {isCorrect && points > 0 && (
          <div className="animate-star inline-block text-base sm:text-lg font-bold text-yellow-600 mb-2">
            +{points} points!
          </div>
        )}
        <p className="text-sm text-gray-600 leading-relaxed mt-2">{explanation}</p>
        <p className="text-xs text-gray-400 mt-3">Tap anywhere to continue</p>
      </div>
    </div>
  );
}
