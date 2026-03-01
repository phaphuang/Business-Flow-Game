import { useRef, useEffect } from "react";
import { challenges, businessCases } from "@shared/gameData";

const COMPANY_STYLES: Record<string, { bg: string; ring: string; fill: string; text: string }> = {
  Netflix: { bg: "bg-red-400", ring: "ring-red-300", fill: "bg-red-100", text: "text-red-700" },
  Spotify: { bg: "bg-green-400", ring: "ring-green-300", fill: "bg-green-100", text: "text-green-700" },
  Grab: { bg: "bg-emerald-400", ring: "ring-emerald-300", fill: "bg-emerald-100", text: "text-emerald-700" },
  Shopify: { bg: "bg-purple-400", ring: "ring-purple-300", fill: "bg-purple-100", text: "text-purple-700" },
  Airbnb: { bg: "bg-pink-400", ring: "ring-pink-300", fill: "bg-pink-100", text: "text-pink-700" },
};

interface Props {
  currentIndex: number;
  completedIndexes: Set<number>;
  avatar: string;
}

export default function QuestMap({ currentIndex, completedIndexes, avatar }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const active = activeRef.current;
      const left = active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  }, [currentIndex]);

  let lastCompany = "";

  return (
    <div className="relative mb-4">
      <div
        ref={scrollRef}
        className="flex items-center gap-1 overflow-x-auto pb-2 px-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {challenges.map((ch, idx) => {
          const style = COMPANY_STYLES[ch.company] || COMPANY_STYLES.Netflix;
          const isCurrent = idx === currentIndex;
          const isCompleted = completedIndexes.has(idx);
          const showLabel = ch.company !== lastCompany;
          lastCompany = ch.company;
          const bc = Object.values(businessCases).find(b => b.name === ch.company);

          return (
            <div key={ch.id} className="flex items-center gap-1 shrink-0">
              {showLabel && (
                <div className={`flex items-center gap-1 mr-1 ml-2 first:ml-0`}>
                  <span className="text-sm">{bc?.emoji}</span>
                  <span className={`text-[10px] font-bold ${style.text} whitespace-nowrap`}>{bc?.questName}</span>
                </div>
              )}
              <div className="flex flex-col items-center relative" ref={isCurrent ? activeRef : undefined}>
                {isCurrent && (
                  <div className="absolute -top-7 animate-walk text-xl z-10">
                    {avatar}
                  </div>
                )}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all ${
                    isCurrent
                      ? `${style.bg} text-white border-white ring-2 ${style.ring} animate-pulse-glow scale-125`
                      : isCompleted
                      ? `${style.bg} text-white border-white opacity-90`
                      : `${style.fill} border-gray-300 opacity-50`
                  }`}
                >
                  {isCompleted ? "\u2713" : idx + 1}
                </div>
                {isCurrent && (
                  <div className={`text-[8px] ${style.text} font-semibold mt-0.5 whitespace-nowrap`}>
                    {ch.difficulty === "easy" ? "\u2B50" : ch.difficulty === "medium" ? "\u2B50\u2B50" : "\u2B50\u2B50\u2B50"}
                  </div>
                )}
              </div>
              {idx < challenges.length - 1 && (
                <div className={`w-3 h-0.5 ${isCompleted ? style.bg : "bg-gray-300"} rounded-full shrink-0`} />
              )}
            </div>
          );
        })}
        <div className="shrink-0 ml-2 text-lg">🏆</div>
      </div>
    </div>
  );
}
