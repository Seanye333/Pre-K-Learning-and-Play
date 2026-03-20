"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import MoneyGame from "@/components/money/MoneyGame";
import { useSession } from "@/hooks/useSession";

export default function MoneyPage() {
  const [showBurst, setShowBurst] = useState(false);
  useSession("money" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-yellow-500 to-green-700 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">🪙 Money & Coins</h1>
      </div>
      <p className="text-center text-white/70 text-xs pb-2">Learn about pennies, nickels, dimes and quarters!</p>
      <div className="flex-1 overflow-auto">
        <MoneyGame onScore={(c, t) => {
          scoreRef.current = { correct: c, total: t };
          if (c > 0 && c % 4 === 0) setShowBurst(true);
        }} />
      </div>
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
