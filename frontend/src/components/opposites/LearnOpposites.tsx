"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PAIRS } from "./oppositeData";

export default function LearnOpposites() {
  const [idx, setIdx] = useState(0);
  const pair = PAIRS[idx];

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">
        Swipe through opposites — things that are totally different!
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={pair.id}
          className="flex gap-4 items-center"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
        >
          {/* Side A */}
          <div className={`flex flex-col items-center gap-2 px-6 py-5 rounded-3xl shadow-lg ${pair.colorA}`}>
            <span className="text-6xl">{pair.emojiA}</span>
            <span className="font-black text-2xl text-gray-800">{pair.wordA}</span>
          </div>

          {/* vs */}
          <div className="flex flex-col items-center">
            <span className="text-white font-black text-2xl">vs</span>
            <span className="text-3xl">↔️</span>
          </div>

          {/* Side B */}
          <div className={`flex flex-col items-center gap-2 px-6 py-5 rounded-3xl shadow-lg ${pair.colorB}`}>
            <span className="text-6xl">{pair.emojiB}</span>
            <span className="font-black text-2xl text-gray-800">{pair.wordB}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-4 items-center">
        <motion.button
          onClick={() => setIdx((i) => (i - 1 + PAIRS.length) % PAIRS.length)}
          className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
        >
          ← Back
        </motion.button>
        <span className="text-white/70 text-sm">{idx + 1} / {PAIRS.length}</span>
        <motion.button
          onClick={() => setIdx((i) => (i + 1) % PAIRS.length)}
          className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
        >
          Next →
        </motion.button>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 flex-wrap justify-center max-w-xs">
        {PAIRS.map((_, i) => (
          <div
            key={i}
            onClick={() => setIdx(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all
              ${i === idx ? "bg-white scale-125" : "bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
