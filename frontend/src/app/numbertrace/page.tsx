"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import NumberTraceCanvas from "@/components/numbertrace/NumberTraceCanvas";
import { useSession } from "@/hooks/useSession";

export default function NumberTracePage() {
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("math" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  const handleScore = (correct: number, total: number) => {
    scoreRef.current = { correct, total };
    if (correct > 0 && correct % 3 === 0) setShowBurst(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-purple-500 to-indigo-800 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          🔢 Number Trace
        </h1>
      </div>
      <div className="flex-1 overflow-auto">
        <NumberTraceCanvas onScore={handleScore} />
      </div>
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
