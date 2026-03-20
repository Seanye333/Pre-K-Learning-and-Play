"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import FlashCard from "@/components/sightwords/FlashCard";
import FindWord from "@/components/sightwords/FindWord";
import SpellSightWord from "@/components/sightwords/SpellWord";
import { useSession } from "@/hooks/useSession";

const TABS = ["Flash Cards", "Find It", "Spell It"] as const;
type Tab = (typeof TABS)[number];

export default function SightWordsPage() {
  const [tab, setTab] = useState<Tab>("Flash Cards");
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("abc" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 4 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-blue-500 to-indigo-800 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">📖 Sight Words</h1>
      </div>

      <div className="flex gap-2 justify-center pb-2 px-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-full font-bold text-xs transition-all
              ${tab === t ? "bg-white text-blue-700 shadow" : "bg-white/20 text-white"}`}
          >
            {t === "Flash Cards" ? "🃏 Flash" : t === "Find It" ? "🔍 Find" : "✏️ Spell"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === "Flash Cards" && <FlashCard />}
        {tab === "Find It"     && <FindWord onScore={handleScore} />}
        {tab === "Spell It"    && <SpellSightWord onScore={handleScore} />}
      </div>

      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
