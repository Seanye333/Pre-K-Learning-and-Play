"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SIGHT_WORDS } from "./sightWordData";

export default function FlashCard() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const word = SIGHT_WORDS[idx];

  const next = () => { setFlipped(false); setTimeout(() => setIdx((i) => (i + 1) % SIGHT_WORDS.length), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setIdx((i) => (i - 1 + SIGHT_WORDS.length) % SIGHT_WORDS.length), 150); };

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Tap the card to see it in a sentence!</p>

      {/* Card */}
      <motion.div
        className="cursor-pointer w-64 h-40 rounded-3xl shadow-xl flex items-center justify-center"
        onClick={() => setFlipped((f) => !f)}
        whileTap={{ scale: 0.95 }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ perspective: 800 }}
      >
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div
              key="front"
              className="absolute inset-0 rounded-3xl bg-white flex flex-col items-center justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <span className="text-6xl font-black text-indigo-700">{word.word}</span>
              <span className="text-white/60 text-xs mt-2">tap to flip</span>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              className="absolute inset-0 rounded-3xl bg-indigo-500 flex flex-col items-center justify-center gap-2 px-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <span className="text-5xl">{word.emoji}</span>
              <p className="text-white font-black text-lg text-center leading-tight">
                {word.sentence.split(word.word).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="text-yellow-300 underline">{word.word}</span>
                    )}
                  </span>
                ))}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Nav */}
      <div className="flex gap-4 items-center">
        <motion.button onClick={prev} className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>← Back</motion.button>
        <span className="text-white/70 text-sm">{idx + 1} / {SIGHT_WORDS.length}</span>
        <motion.button onClick={next} className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>Next →</motion.button>
      </div>

      {/* Dots */}
      <div className="flex gap-1 flex-wrap justify-center max-w-xs">
        {SIGHT_WORDS.map((_, i) => (
          <div key={i} onClick={() => { setFlipped(false); setIdx(i); }}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i === idx ? "bg-white scale-150" : "bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}
