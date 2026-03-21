"use client";
import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import HabitsGame from "@/components/habits/HabitsGame";
import { useSession } from "@/hooks/useSession";

export default function HabitsPage() {
  const [showBurst, setShowBurst] = useState(false);
  useSession("habits" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });
  return (
    <main className="h-screen w-screen bg-gradient-to-b from-green-400 to-teal-600 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">🌟 Healthy Habits</h1>
      </div>
      <p className="text-center text-white/70 text-xs pb-2">Build great habits every day!</p>
      <div className="flex-1 overflow-auto">
        <HabitsGame onScore={(c, t) => {
          scoreRef.current = { correct: c, total: t };
          if (c > 0 && c % 4 === 0) setShowBurst(true);
        }} />
      </div>
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
