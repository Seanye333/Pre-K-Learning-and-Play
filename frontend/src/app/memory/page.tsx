"use client";

import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import MemoryBoard from "@/components/memory/MemoryBoard";
import { useSession } from "@/hooks/useSession";
import { MEMORY_PAIRS_EASY } from "@/lib/constants";

export default function MemoryPage() {
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("memory");

  const handleGameEnd = (flips: number, totalPairs: number) => {
    setShowBurst(true);
    // Score: 1 - fraction of extra flips above minimum (min = pairs * 2)
    const minFlips = totalPairs * 2;
    const score = Math.max(0, 1 - (flips - minFlips) / (minFlips * 2));
    endSession(Math.min(1, score), { flips, totalPairs, minFlips });
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-purple-400 to-pink-600 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          🃏 Memory Match
        </h1>
      </div>

      <div className="flex-1 overflow-auto flex items-start justify-center">
        <MemoryBoard onGameEnd={handleGameEnd} />
      </div>

      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
