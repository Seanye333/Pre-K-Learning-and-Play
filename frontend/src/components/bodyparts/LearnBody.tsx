"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BODY_PARTS } from "./bodyData";

// Simple cartoon character using emoji parts positioned absolutely
const CHARACTER_PARTS = [
  { emoji: "😊", top: "2%",  left: "50%",  size: "4rem",  label: "head"  },
  { emoji: "👕", top: "28%", left: "50%",  size: "5rem",  label: "body"  },
  { emoji: "🦵", top: "58%", left: "38%",  size: "3.5rem",label: "legL"  },
  { emoji: "🦵", top: "58%", left: "62%",  size: "3.5rem",label: "legR"  },
  { emoji: "🖐️", top: "42%", left: "20%",  size: "3rem",  label: "handL" },
  { emoji: "🤚", top: "42%", left: "80%",  size: "3rem",  label: "handR" },
  { emoji: "👟", top: "80%", left: "38%",  size: "3rem",  label: "footL" },
  { emoji: "👟", top: "80%", left: "62%",  size: "3rem",  label: "footR" },
];

export default function LearnBody() {
  const [active, setActive] = useState<string | null>(null);
  const part = BODY_PARTS.find((p) => p.id === active);

  return (
    <div className="flex flex-col items-center gap-4 p-3 w-full">
      <p className="text-white font-bold text-sm">Tap a body part to learn about it!</p>

      <div className="flex gap-6 items-start w-full max-w-sm">
        {/* Character */}
        <div className="relative flex-shrink-0" style={{ width: 140, height: 280 }}>
          {CHARACTER_PARTS.map((p) => (
            <span
              key={p.label}
              className="absolute"
              style={{
                fontSize: p.size,
                top: p.top,
                left: p.left,
                transform: "translate(-50%, 0)",
                lineHeight: 1,
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>

        {/* Body part buttons */}
        <div className="flex flex-col gap-2 flex-1">
          {BODY_PARTS.map((bp) => (
            <motion.button
              key={bp.id}
              onClick={() => setActive(bp.id === active ? null : bp.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm text-left
                ${active === bp.id ? "bg-white text-indigo-700 shadow-lg scale-105" : "bg-white/20 text-white"}`}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.92 }}
            >
              <span className="text-xl">{bp.emoji}</span>
              {bp.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Fun fact */}
      <AnimatePresence>
        {part && (
          <motion.div
            key={part.id}
            className="bg-white/20 rounded-2xl px-5 py-3 max-w-xs text-center"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          >
            <span className="text-4xl">{part.emoji}</span>
            <p className="text-white font-black text-base mt-1">{part.name}</p>
            <p className="text-white/80 text-sm mt-1">{part.fun}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
