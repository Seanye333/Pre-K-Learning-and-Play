"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import CountingBoard from "@/components/math/CountingBoard";
import AdditionScene from "@/components/math/AdditionScene";
import NumberCard from "@/components/math/NumberCard";
import PatternRow from "@/components/math/PatternRow";
import { useSession } from "@/hooks/useSession";

type Tab = "count" | "add" | "numbers" | "patterns";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "count", label: "Count", emoji: "🔢" },
  { id: "add", label: "Add", emoji: "➕" },
  { id: "numbers", label: "Numbers", emoji: "🃏" },
  { id: "patterns", label: "Patterns", emoji: "🔄" },
];

export default function MathPage() {
  const [tab, setTab] = useState<Tab>("count");
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("math");
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 5 === 0) {
      setShowBurst(true);
    }
  };

  const handleBurstDone = () => {
    setShowBurst(false);
    const { correct, total } = scoreRef.current;
    if (total > 0) {
      endSession(correct / total, { correct, total, mode: tab });
    }
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-green-400 to-teal-600 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          🔢 Math Playground
        </h1>
      </div>

      <div className="flex justify-center gap-2 px-4 pb-3 flex-wrap">
        {TABS.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl font-extrabold text-sm transition-colors
              ${tab === t.id ? "bg-white text-teal-600 shadow-lg" : "bg-white/30 text-white"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.emoji} {t.label}
          </motion.button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === "count" && <CountingBoard difficulty="medium" onScore={handleScore} />}
        {tab === "add" && <AdditionScene difficulty="easy" onScore={handleScore} />}
        {tab === "numbers" && <NumberCard difficulty="medium" onScore={handleScore} />}
        {tab === "patterns" && <PatternRow onScore={handleScore} />}
      </div>

      <StarBurst show={showBurst} onDone={handleBurstDone} />
      <BackButton />
    </main>
  );
}
