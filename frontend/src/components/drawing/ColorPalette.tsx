"use client";

import { motion } from "framer-motion";
import { DRAW_COLORS } from "@/lib/constants";

interface ColorPaletteProps {
  selected: string;
  onChange: (color: string) => void;
}

export default function ColorPalette({ selected, onChange }: ColorPaletteProps) {
  return (
    <div className="grid grid-cols-3 gap-2 p-2">
      {DRAW_COLORS.map((color) => (
        <motion.button
          key={color}
          onClick={() => onChange(color)}
          className="w-10 h-10 rounded-full shadow-md border-2"
          style={{
            backgroundColor: color,
            borderColor: selected === color ? "#fff" : "transparent",
            boxShadow:
              selected === color
                ? "0 0 0 3px rgba(255,255,255,0.8)"
                : undefined,
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
        />
      ))}
    </div>
  );
}
