"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SHAPES } from "./ShapeDisplay";
import ShapeDisplay from "./ShapeDisplay";

export default function LearnShapes() {
  const [selected, setSelected] = useState(SHAPES[0]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const handleClick = (s: typeof SHAPES[0]) => {
    setSelected(s);
    setRevealed((prev) => new Set(prev).add(s.name));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-extrabold text-xl">
        Tap a shape to learn about it! 👆
      </p>

      {/* Big shape display */}
      <motion.div
        key={selected.name}
        className="rounded-3xl bg-white/20 p-6 flex flex-col items-center gap-2"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <ShapeDisplay shape={selected} size={130} animated />
        <p className="text-4xl font-black text-white">{selected.name}</p>
        <p className="text-white/80 text-lg font-bold">
          {selected.sides === 0
            ? "No flat sides — all curves!"
            : `${selected.sides} side${selected.sides !== 1 ? "s" : ""}`}
        </p>
      </motion.div>

      {/* Shape grid */}
      <div className="grid grid-cols-4 gap-3">
        {SHAPES.map((s) => (
          <motion.button
            key={s.name}
            onClick={() => handleClick(s)}
            className={`rounded-2xl p-3 flex flex-col items-center gap-1 transition-colors relative
              ${selected.name === s.name ? "bg-white/40 ring-4 ring-white" : "bg-white/20"}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShapeDisplay shape={s} size={50} />
            <span className="text-white text-xs font-bold">{s.name}</span>
            {revealed.has(s.name) && (
              <span className="absolute -top-1 -right-1 text-xs">✅</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
