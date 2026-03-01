import { useEffect, useState } from "react";

interface Props {
  isCorrect: boolean;
  points: number;
  explanation: string;
  avatar: string;
  onComplete: () => void;
}

const CONFETTI = ["\u2B50", "\u{1F389}", "\u2728", "\u{1F31F}", "\u{1F3C6}", "\u{1F4AB}"];
const ENCOURAGE = ["\u{1F4AA}", "\u{1F914}", "\u{1F9E0}", "\u{1F4DA}"];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" data-testid="celebration-overlay">
      {isCorrect && particles.map(p => (
        <div
          key={p.id}
          className="absolute text-2xl pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: "20%",
            animation: `confetti-fall 1.5s ease-in ${p.delay}s forwards`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      <div className={`animate-bounce-in rounded-2xl p-6 max-w-sm mx-4 text-center shadow-2xl ${
        isCorrect ? "bg-gradient-to-b from-green-50 to-green-100 border-2 border-green-300" : "bg-gradient-to-b from-orange-50 to-orange-100 border-2 border-orange-300"
      }`}>
        <div className="text-5xl mb-3 animate-float">
          {isCorrect ? avatar : ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]}
        </div>
        <h2 className={`text-2xl font-bold mb-1 ${isCorrect ? "text-green-700" : "text-orange-700"}`}>
          {isCorrect ? "Awesome! \u{1F389}" : "Not quite! \u{1F4AA}"}
        </h2>
        {isCorrect && points > 0 && (
          <div className="animate-star inline-block text-lg font-bold text-yellow-600 mb-2">
            +{points} points!
          </div>
        )}
        <p className="text-sm text-gray-600 leading-relaxed mt-2">{explanation}</p>
      </div>
    </div>
  );
}
