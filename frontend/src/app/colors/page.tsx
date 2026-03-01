"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import LearnColors from "@/components/colors/LearnColors";
import ColorMixer from "@/components/colors/ColorMixer";
import FindColor from "@/components/colors/FindColor";
import { useSession } from "@/hooks/useSession";

type Tab = "learn" | "mix" | "find";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "learn", label: "Learn Colors", emoji: "🎨" },
  { id: "mix", label: "Mix Colors", emoji: "🔬" },
  { id: "find", label: "Find the Color", emoji: "🔍" },
];

export default function ColorsPage() {
  const [tab, setTab] = useState<Tab>("learn");
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("colors" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 4 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden game-area"
      style={{ background: "linear-gradient(to bottom, #f43f5e, #be185d)" }}>
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          🎨 Color Mixer
        </h1>
      </div>

      <div className="flex justify-center gap-2 px-4 pb-3">
        {TABS.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl font-extrabold text-sm transition-colors
              ${tab === t.id ? "bg-white text-rose-600 shadow-lg" : "bg-white/30 text-white"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.emoji} {t.label}
          </motion.button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === "learn" && <LearnColors />}
        {tab === "mix" && <ColorMixer onScore={handleScore} />}
        {tab === "find" && <FindColor onScore={handleScore} />}
      </div>

      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
