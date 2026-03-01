"use client";

import { motion } from "framer-motion";
import { BRUSH_SIZES } from "@/lib/constants";

interface BrushSizerProps {
  selected: number;
  onChange: (size: number) => void;
}

export default function BrushSizer({ selected, onChange }: BrushSizerProps) {
  return (
    <div className="flex flex-col gap-3 p-2 items-center">
      {BRUSH_SIZES.map(({ label, size }) => (
        <motion.button
          key={size}
          onClick={() => onChange(size)}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors
            ${selected === size ? "bg-white/40 ring-2 ring-white" : "bg-white/10"}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div
            className="rounded-full bg-white"
            style={{ width: size, height: size }}
          />
          <span className="text-white text-xs font-bold">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
