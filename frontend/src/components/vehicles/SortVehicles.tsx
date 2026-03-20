"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VEHICLES, ZONE_META, type Zone } from "./vehicleData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

export default function SortVehicles({ onScore }: Props) {
  const [pool, setPool]       = useState(() => shuffle(VEHICLES));
  const [correct, setCorrect] = useState(0);
  const [total,   setTotal]   = useState(0);
  const [flash, setFlash]     = useState<Zone | null>(null);

  const current = pool[0];

  function handle(zone: Zone) {
    if (!current) return;
    const isRight  = current.zone === zone;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (isRight) { const nc = correct + 1; setCorrect(nc); onScore(nc, newTotal); }
    setFlash(zone);
    setTimeout(() => { setFlash(null); setPool((p) => p.slice(1)); }, 500);
  }

  function reset() { setPool(shuffle(VEHICLES)); setCorrect(0); setTotal(0); }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Sort each vehicle into the right zone!</p>

      {/* Current vehicle */}
      <AnimatePresence mode="wait">
        {current ? (
          <motion.div key={current.id} className="flex flex-col items-center gap-1"
            initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 10 }}>
            <span className="text-8xl">{current.emoji}</span>
            <span className="text-white font-black text-2xl">{current.name}</span>
          </motion.div>
        ) : (
          <motion.div className="flex flex-col items-center gap-2" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <span className="text-6xl">🎉</span>
            <p className="text-white font-black text-2xl">All sorted!</p>
            <p className="text-white/70 text-lg">{correct} / {total} correct</p>
            <motion.button onClick={reset} className="mt-2 bg-white/30 text-white font-bold px-6 py-2 rounded-xl"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>Play Again 🔄</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone buckets */}
      {current && (
        <div className="flex gap-3">
          {(["land","sea","air"] as Zone[]).map((z) => {
            const m = ZONE_META[z];
            return (
              <motion.button key={z} onClick={() => handle(z)}
                className={`flex flex-col items-center gap-1 px-5 py-4 rounded-2xl font-black text-white shadow-lg bg-gradient-to-b ${m.color}
                  ${flash === z ? "opacity-60 scale-95" : ""}`}
                whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.9 }}>
                <span className="text-4xl">{m.emoji}</span>
                <span className="text-sm">{m.label}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {current && <p className="text-white/60 text-sm">{pool.length} left · {correct}/{total} correct</p>}
    </div>
  );
}
