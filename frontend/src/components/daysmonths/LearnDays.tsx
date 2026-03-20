"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DAYS } from "./calendarData";

export default function LearnDays() {
  const [selected, setSelected] = useState<number | null>(null);
  const today = new Date().getDay(); // 0=Sun

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">
        Today is <span className="text-yellow-300 font-black">{DAYS[today].name}!</span> Tap any day to learn about it.
      </p>

      {/* Day buttons */}
      <div className="grid grid-cols-7 gap-1 w-full max-w-sm">
        {DAYS.map((day, i) => (
          <motion.button
            key={day.name}
            onClick={() => setSelected(i === selected ? null : i)}
            className={`flex flex-col items-center py-2 rounded-xl font-bold text-xs
              ${i === today ? "ring-2 ring-yellow-300" : ""}
              ${selected === i ? "bg-white text-purple-700 shadow" : "bg-white/20 text-white"}`}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
          >
            <span className="text-xl">{day.emoji}</span>
            <span>{day.short}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key={selected}
            className="bg-white/20 rounded-2xl px-6 py-4 text-center max-w-xs"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          >
            <span className="text-5xl">{DAYS[selected].emoji}</span>
            <p className="text-white font-black text-2xl mt-1">{DAYS[selected].name}</p>
            <p className="text-white/80 text-sm mt-1">{DAYS[selected].fun}</p>
            {selected === today && (
              <p className="text-yellow-300 font-bold text-xs mt-2">⭐ That&apos;s today!</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Week order reminder */}
      <div className="flex gap-1 items-center text-white/60 text-xs">
        {DAYS.map((d, i) => (
          <span key={d.name}>{d.short}{i < 6 ? " →" : ""}</span>
        ))}
      </div>
    </div>
  );
}
