"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import LearnDays from "@/components/daysmonths/LearnDays";
import LearnMonths from "@/components/daysmonths/LearnMonths";
import OrderGame from "@/components/daysmonths/OrderGame";
import { useSession } from "@/hooks/useSession";

const TABS = ["Days", "Months", "Order Game"] as const;
type Tab = (typeof TABS)[number];

export default function DaysMonthsPage() {
  const [tab, setTab] = useState<Tab>("Days");
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("abc" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 4 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-sky-400 to-blue-700 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">📅 Days &amp; Months</h1>
      </div>

      <div className="flex gap-2 justify-center pb-2 px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-full font-bold text-xs transition-all
              ${tab === t ? "bg-white text-blue-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Days" ? "📆 Days" : t === "Months" ? "🗓️ Months" : "🎯 Order"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === "Days"       && <LearnDays />}
        {tab === "Months"     && <LearnMonths />}
        {tab === "Order Game" && <OrderGame onScore={handleScore} />}
      </div>

      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
