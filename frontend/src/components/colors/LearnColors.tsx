"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COLORS } from "./colorData";

export default function LearnColors() {
  const [selected, setSelected] = useState(COLORS[0]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-extrabold text-xl">Tap a color to explore! 🎨</p>

      {/* Big color showcase */}
      <motion.div
        key={selected.name}
        className="rounded-3xl p-6 flex flex-col items-center gap-3 w-72 shadow-xl"
        style={{ backgroundColor: selected.hex + "cc" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <motion.span
          className="text-8xl"
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          {selected.emoji}
        </motion.span>
        <p className="text-4xl font-black text-white drop-shadow">{selected.name}</p>
        {selected.isPrimary && (
          <span className="bg-white/30 text-white text-xs font-bold px-3 py-1 rounded-full">
            ⭐ Primary Color
          </span>
        )}
        <div className="flex flex-col gap-1 w-full mt-1">
          <p className="text-white/70 text-sm font-bold text-center">Things that are {selected.name}:</p>
          {selected.objects.map((obj) => (
            <p key={obj} className="text-white font-bold text-center">{obj}</p>
          ))}
        </div>
      </motion.div>

      {/* Color grid */}
      <div className="grid grid-cols-5 gap-2">
        {COLORS.map((c) => (
          <motion.button
            key={c.name}
            onClick={() => setSelected(c)}
            className={`w-14 h-14 rounded-2xl shadow-md flex items-center justify-center text-2xl
              ${selected.name === c.name ? "ring-4 ring-white scale-110" : ""}`}
            style={{ backgroundColor: c.hex }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
          >
            {selected.name === c.name ? "✓" : ""}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
