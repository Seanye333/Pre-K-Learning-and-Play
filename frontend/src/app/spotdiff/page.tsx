"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import SpotDiff from "@/components/spotdiff/SpotDiff";
import { useSession } from "@/hooks/useSession";

export default function SpotDiffPage() {
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("abc" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 3 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-orange-400 to-rose-700 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          🔍 Spot the Difference
        </h1>
      </div>

      <div className="flex-1 overflow-auto">
        <SpotDiff onScore={handleScore} />
      </div>

      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
