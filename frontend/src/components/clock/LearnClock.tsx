"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ClockFace from "./ClockFace";

const EXAMPLES = [
  { hour: 7,  minutes: 0,  label: "7 o'clock",      context: "Wake up time! 🌅" },
  { hour: 8,  minutes: 0,  label: "8 o'clock",      context: "Breakfast time! 🥞" },
  { hour: 12, minutes: 0,  label: "12 o'clock",     context: "Lunchtime! 🥪" },
  { hour: 3,  minutes: 0,  label: "3 o'clock",      context: "Snack time! 🍎" },
  { hour: 6,  minutes: 0,  label: "6 o'clock",      context: "Dinner time! 🍽️" },
  { hour: 8,  minutes: 30, label: "half past 8",    context: "Bedtime soon! 🛏️" },
  { hour: 1,  minutes: 30, label: "half past 1",    context: "Nap time! 😴" },
  { hour: 9,  minutes: 30, label: "half past 9",    context: "Playtime! 🎮" },
];

export default function LearnClock() {
  const [idx, setIdx] = useState(0);
  const ex = EXAMPLES[idx];

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">The <span className="text-indigo-200 font-black">short hand</span> = hour · <span className="text-blue-200 font-black">long hand</span> = minutes</p>

      <motion.div key={idx} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-2">
        <ClockFace hour={ex.hour} minutes={ex.minutes} size={200} />
        <p className="text-white font-black text-3xl">{ex.label}</p>
        <p className="text-white/70 text-base">{ex.context}</p>
      </motion.div>

      <div className="flex gap-4 items-center">
        <motion.button onClick={() => setIdx((i) => (i - 1 + EXAMPLES.length) % EXAMPLES.length)}
          className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>← Back</motion.button>
        <span className="text-white/60 text-sm">{idx + 1}/{EXAMPLES.length}</span>
        <motion.button onClick={() => setIdx((i) => (i + 1) % EXAMPLES.length)}
          className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>Next →</motion.button>
      </div>

      <div className="flex gap-1 flex-wrap justify-center">
        {EXAMPLES.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i === idx ? "bg-white scale-150" : "bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}
