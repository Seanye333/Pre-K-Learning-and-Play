"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import LearnClock from "@/components/clock/LearnClock";
import ClockQuiz from "@/components/clock/ClockQuiz";
import { useSession } from "@/hooks/useSession";

const TABS = ["Learn", "Quiz"] as const;
type Tab = (typeof TABS)[number];

export default function ClockPage() {
  const [tab, setTab] = useState<Tab>("Learn");
  const [showBurst, setShowBurst] = useState(false);
  useSession("math" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 3 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-slate-500 to-indigo-800 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">🕐 Telling Time</h1>
      </div>
      <div className="flex gap-2 justify-center pb-2 px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-slate-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "📚 Learn" : "🎯 Quiz"}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {tab === "Learn" && <LearnClock />}
        {tab === "Quiz"  && <ClockQuiz onScore={handleScore} />}
      </div>
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
