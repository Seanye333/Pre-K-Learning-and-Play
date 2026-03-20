"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import ShadowMatch from "@/components/shadow/ShadowMatch";
import { useSession } from "@/hooks/useSession";

export default function ShadowPage() {
  const [showBurst, setShowBurst] = useState(false);
  useSession("memory" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 3 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-gray-700 to-gray-900 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">🌑 Shadow Match</h1>
      </div>
      <p className="text-center text-white/60 text-xs pb-2">Look at the dark shadow and find the matching picture!</p>
      <div className="flex-1 overflow-auto">
        <ShadowMatch onScore={handleScore} />
      </div>
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
