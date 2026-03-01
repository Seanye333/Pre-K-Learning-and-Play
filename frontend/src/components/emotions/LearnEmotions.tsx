"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EMOTIONS } from "./EmotionCard";

export default function LearnEmotions() {
  const [selected, setSelected] = useState(EMOTIONS[0]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-extrabold text-xl">
        Tap a face to learn about feelings! 😊
      </p>

      {/* Big selected emotion */}
      <motion.div
        key={selected.name}
        className="rounded-3xl p-6 flex flex-col items-center gap-3 w-64"
        style={{ backgroundColor: `${selected.color}44` }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <motion.span
          className="text-9xl"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          {selected.emoji}
        </motion.span>
        <p className="text-4xl font-black text-white">{selected.name}</p>
        <p className="text-white/80 text-center text-sm font-medium leading-relaxed">
          &ldquo;{selected.story}&rdquo;
        </p>
      </motion.div>

      {/* Emotion grid */}
      <div className="grid grid-cols-4 gap-3">
        {EMOTIONS.map((e) => (
          <motion.button
            key={e.name}
            onClick={() => setSelected(e)}
            className={`rounded-2xl p-3 flex flex-col items-center gap-1 transition-all
              ${selected.name === e.name ? "ring-4 ring-white" : ""}`}
            style={{ backgroundColor: `${e.color}33` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-4xl">{e.emoji}</span>
            <span className="text-white text-xs font-bold">{e.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
