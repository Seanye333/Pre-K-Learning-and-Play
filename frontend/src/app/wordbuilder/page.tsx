"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import WordBuilderGame from "@/components/wordbuilder/WordBuilderGame";
import { useSession } from "@/hooks/useSession";

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTIES: { id: Difficulty; label: string; emoji: string; desc: string }[] = [
  { id: "easy", label: "Easy", emoji: "🌱", desc: "3-letter words" },
  { id: "medium", label: "Medium", emoji: "🌿", desc: "4-letter words" },
  { id: "hard", label: "Hard", emoji: "🌳", desc: "5-letter words" },
];

export default function WordBuilderPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("wordbuilder" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 3 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-emerald-400 to-green-700 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          🏗️ Word Builder
        </h1>
      </div>

      {/* Difficulty selector */}
      <div className="flex justify-center gap-2 px-4 pb-3">
        {DIFFICULTIES.map((d) => (
          <motion.button
            key={d.id}
            onClick={() => setDifficulty(d.id)}
            className={`px-4 py-2 rounded-xl font-extrabold text-sm transition-colors
              ${difficulty === d.id
                ? "bg-white text-green-700 shadow-lg"
                : "bg-white/30 text-white"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {d.emoji} {d.label}
            <span className="block text-xs font-normal opacity-70">{d.desc}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <WordBuilderGame
          key={difficulty}
          difficulty={difficulty}
          onScore={handleScore}
        />
      </div>

      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
