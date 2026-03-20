"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import SafetyGame from "@/components/safety/SafetyGame";
import { useSession } from "@/hooks/useSession";

export default function SafetyPage() {
  const [showBurst, setShowBurst] = useState(false);
  useSession("safety" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-red-500 to-rose-800 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">🦺 Safety Rules</h1>
      </div>
      <p className="text-center text-white/70 text-xs pb-2">Stay safe at home, on roads and near water!</p>
      <div className="flex-1 overflow-auto">
        <SafetyGame onScore={(c, t) => {
          scoreRef.current = { correct: c, total: t };
          if (c > 0 && c % 4 === 0) setShowBurst(true);
        }} />
      </div>
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
