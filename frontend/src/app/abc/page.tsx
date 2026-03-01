"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import AlphabetGrid from "@/components/abc/AlphabetGrid";
import MatchGame from "@/components/abc/MatchGame";
import SpellWord from "@/components/abc/SpellWord";
import { useSession } from "@/hooks/useSession";
import { LETTER_WORDS } from "@/lib/constants";

type Tab = "learn" | "match" | "spell";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "learn", label: "Learn Letters", emoji: "🔤" },
  { id: "match", label: "Match Game", emoji: "🔗" },
  { id: "spell", label: "Spell Words", emoji: "✏️" },
];

export default function ABCPage() {
  const [tab, setTab] = useState<Tab>("learn");
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("abc");
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleLetterClick = (letter: string) => {
    setExplored((prev) => {
      const next = new Set(prev);
      next.add(letter);
      if (next.size === 26) {
        setShowBurst(true);
      }
      return next;
    });
  };

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (total > 0 && correct === total) {
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
    <main className="h-screen w-screen bg-gradient-to-b from-yellow-400 to-orange-500 flex flex-col overflow-hidden game-area">
      {/* Header */}
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          🔤 ABC Adventure
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 px-4 pb-3">
        {TABS.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl font-extrabold text-sm transition-colors
              ${tab === t.id ? "bg-white text-orange-500 shadow-lg" : "bg-white/30 text-white"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.emoji} {t.label}
          </motion.button>
        ))}
      </div>

      {/* Game Area */}
      <div className="flex-1 overflow-auto">
        {tab === "learn" && (
          <AlphabetGrid
            onLetterClick={handleLetterClick}
            exploredLetters={explored}
          />
        )}
        {tab === "match" && (
          <MatchGame difficulty="medium" onScore={handleScore} />
        )}
        {tab === "spell" && <SpellWord onScore={handleScore} />}
      </div>

      <StarBurst show={showBurst} onDone={handleBurstDone} />
      <BackButton />
    </main>
  );
}
