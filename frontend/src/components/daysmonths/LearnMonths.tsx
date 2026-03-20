"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MONTHS, SEASONS } from "./calendarData";

export default function LearnMonths() {
  const [selected, setSelected] = useState<number | null>(null);
  const thisMonth = new Date().getMonth(); // 0-based

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">
        This month is <span className="text-yellow-300 font-black">{MONTHS[thisMonth].name}!</span>
      </p>

      {/* Months grid */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
        {MONTHS.map((m, i) => (
          <motion.button
            key={m.name}
            onClick={() => setSelected(i === selected ? null : i)}
            className={`flex flex-col items-center py-2 px-1 rounded-xl font-bold text-xs
              ${i === thisMonth ? "ring-2 ring-yellow-300" : ""}
              ${selected === i ? "bg-white text-purple-700 shadow" : "bg-white/20 text-white"}`}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[10px] leading-tight text-center">{m.name.slice(0, 3)}</span>
            <span className="text-[10px] opacity-60">#{m.num}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key={selected}
            className="bg-white/20 rounded-2xl px-6 py-3 text-center max-w-xs"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          >
            <span className="text-5xl">{MONTHS[selected].emoji}</span>
            <p className="text-white font-black text-2xl mt-1">{MONTHS[selected].name}</p>
            <p className="text-white/70 text-sm">Month #{MONTHS[selected].num} · {MONTHS[selected].season}</p>
            {selected === thisMonth && <p className="text-yellow-300 font-bold text-xs mt-1">⭐ That&apos;s this month!</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seasons */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {SEASONS.map((s) => (
          <div key={s.name} className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${s.color}`}>
            <span className="text-2xl">{s.emoji}</span>
            <div>
              <p className="font-black text-white text-sm">{s.name}</p>
              <p className="text-white/80 text-[10px]">{s.months}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
