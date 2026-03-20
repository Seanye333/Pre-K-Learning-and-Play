"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FOODS, GROUP_META, type FoodGroup } from "./foodData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

export default function FoodSort({ onScore }: Props) {
  const [pool, setPool]       = useState(() => shuffle(FOODS));
  const [correct, setCorrect] = useState(0);
  const [total,   setTotal]   = useState(0);
  const [flash, setFlash]     = useState<FoodGroup | null>(null);

  const current = pool[0];

  function handle(group: FoodGroup) {
    if (!current) return;
    const isRight = current.group === group;
    const nt = total + 1; setTotal(nt);
    if (isRight) { const nc = correct + 1; setCorrect(nc); onScore(nc, nt); }
    setFlash(group);
    setTimeout(() => { setFlash(null); setPool((p) => p.slice(1)); }, 500);
  }

  function reset() { setPool(shuffle(FOODS)); setCorrect(0); setTotal(0); }

  return (
    <div className="flex flex-col items-center gap-4 p-3 w-full">
      <p className="text-white font-bold text-sm">Which food group does this belong to?</p>

      <AnimatePresence mode="wait">
        {current ? (
          <motion.div key={current.id} className="flex flex-col items-center gap-1"
            initial={{ scale: 0, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
            <span className="text-7xl">{current.emoji}</span>
            <p className="text-white font-black text-2xl">{current.name}</p>
            <p className="text-white/60 text-xs">{pool.length} left</p>
          </motion.div>
        ) : (
          <motion.div className="flex flex-col items-center gap-2" initial={{ scale:0 }} animate={{ scale:1 }}>
            <span className="text-6xl">🎉</span>
            <p className="text-white font-black text-2xl">All sorted!</p>
            <p className="text-white/70 text-lg">{correct}/{total} correct</p>
            <motion.button onClick={reset} className="mt-1 bg-white/30 text-white font-bold px-6 py-2 rounded-xl"
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.92 }}>Play Again 🔄</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {current && (
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs mt-1">
          {(Object.entries(GROUP_META) as [FoodGroup, typeof GROUP_META[FoodGroup]][]).map(([g, m]) => (
            <motion.button key={g} onClick={() => handle(g)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl font-bold text-white bg-gradient-to-b ${m.color}
                ${flash === g ? "opacity-50 scale-95" : ""}`}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] font-black leading-tight text-center">{m.label}</span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
