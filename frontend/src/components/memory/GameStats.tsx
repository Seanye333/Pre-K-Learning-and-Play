"use client";

import { useEffect, useState } from "react";

interface GameStatsProps {
  flips: number;
  running: boolean;
}

export default function GameStats({ flips, running }: GameStatsProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex gap-8 text-white font-extrabold text-xl">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🖐️</span>
        <span>Flips: {flips}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">⏱️</span>
        <span>{mm}:{ss}</span>
      </div>
    </div>
  );
}
