"use client";

import { motion } from "framer-motion";

interface MemoryCardProps {
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function MemoryCard({
  emoji,
  name,
  isFlipped,
  isMatched,
  onClick,
}: MemoryCardProps) {
  return (
    <div
      className="relative cursor-pointer"
      style={{ width: 80, height: 80, perspective: 600 }}
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front face (hidden side — the ?) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-4xl">❓</span>
        </div>

        {/* Back face (revealed side) */}
        <div
          className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center shadow-lg
            ${isMatched ? "bg-green-200 ring-4 ring-green-400" : "bg-yellow-100"}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-4xl">{emoji}</span>
          <span className="text-xs font-bold text-gray-700 mt-1">{name}</span>
        </div>
      </motion.div>
    </div>
  );
}
