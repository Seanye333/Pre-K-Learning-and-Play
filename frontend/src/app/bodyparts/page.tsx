"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import LearnBody from "@/components/bodyparts/LearnBody";
import TapBody from "@/components/bodyparts/TapBody";
import { useSession } from "@/hooks/useSession";

const TABS = ["Learn", "Quiz"] as const;
type Tab = (typeof TABS)[number];

export default function BodyPartsPage() {
  const [tab, setTab] = useState<Tab>("Learn");
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("abc" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 4 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-pink-400 to-rose-700 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">🫀 Body Parts</h1>
      </div>

      <div className="flex gap-2 justify-center pb-2 px-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-rose-700 shadow" : "bg-white/20 text-white"}`}
          >
            {t === "Learn" ? "📚 Learn" : "🎯 Quiz"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === "Learn" && <LearnBody />}
        {tab === "Quiz"  && <TapBody onScore={handleScore} />}
      </div>

      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
