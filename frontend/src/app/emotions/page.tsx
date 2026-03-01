"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import LearnEmotions from "@/components/emotions/LearnEmotions";
import MatchEmotion from "@/components/emotions/MatchEmotion";
import { useSession } from "@/hooks/useSession";

type Tab = "learn" | "match";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "learn", label: "Learn Feelings", emoji: "📖" },
  { id: "match", label: "Match Feeling", emoji: "🎯" },
];

export default function EmotionsPage() {
  const [tab, setTab] = useState<Tab>("learn");
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("emotions" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 5 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-amber-400 to-orange-600 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          😊 Emotion Match
        </h1>
      </div>

      <div className="flex justify-center gap-3 px-4 pb-3">
        {TABS.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-xl font-extrabold text-sm transition-colors
              ${tab === t.id ? "bg-white text-orange-500 shadow-lg" : "bg-white/30 text-white"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.emoji} {t.label}
          </motion.button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === "learn" && <LearnEmotions />}
        {tab === "match" && <MatchEmotion onScore={handleScore} />}
      </div>

      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
