"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import AnimalSounds from "@/components/animals/AnimalSounds";
import AnimalHomes from "@/components/animals/AnimalHomes";
import BabyAnimals from "@/components/animals/BabyAnimals";
import { useSession } from "@/hooks/useSession";

type Tab = "sounds" | "homes" | "babies";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "sounds", label: "Animal Sounds", emoji: "🔊" },
  { id: "homes",  label: "Where Do I Live?", emoji: "🏠" },
  { id: "babies", label: "Baby Animals",  emoji: "👶" },
];

export default function AnimalsPage() {
  const [tab, setTab] = useState<Tab>("sounds");
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("animals" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 5 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-lime-400 to-green-700 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          🐾 Animal World
        </h1>
      </div>

      <div className="flex justify-center gap-2 px-4 pb-3 flex-wrap">
        {TABS.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl font-extrabold text-sm transition-colors
              ${tab === t.id ? "bg-white text-green-700 shadow-lg" : "bg-white/30 text-white"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.emoji} {t.label}
          </motion.button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === "sounds" && <AnimalSounds onScore={handleScore} />}
        {tab === "homes"  && <AnimalHomes  onScore={handleScore} />}
        {tab === "babies" && <BabyAnimals  onScore={handleScore} />}
      </div>

      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
