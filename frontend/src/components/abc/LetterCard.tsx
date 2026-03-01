"use client";

import { motion } from "framer-motion";
import { LETTER_COLORS, LETTER_WORDS } from "@/lib/constants";

interface LetterCardProps {
  letter: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function LetterCard({
  letter,
  index,
  isSelected,
  onClick,
}: LetterCardProps) {
  const colorClass = LETTER_COLORS[Math.floor(index / 5) % LETTER_COLORS.length];
  const info = LETTER_WORDS[letter];

  return (
    <motion.button
      onClick={onClick}
      className={`${colorClass} rounded-2xl p-3 flex flex-col items-center justify-center shadow-md min-w-[70px] min-h-[80px] relative overflow-hidden`}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      animate={isSelected ? { scale: [1, 1.15, 1], backgroundColor: "#fde68a" } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      <span className="text-3xl font-black text-white drop-shadow">{letter}</span>
      <span className="text-sm font-bold text-white/90">{letter.toLowerCase()}</span>
      {isSelected && info && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center bg-yellow-200 rounded-2xl"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <span className="text-4xl">{info.emoji}</span>
          <span className="text-xs font-bold text-gray-700 mt-1">{info.word}</span>
        </motion.div>
      )}
    </motion.button>
  );
}
