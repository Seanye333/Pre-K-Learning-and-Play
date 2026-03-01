"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface GameCardProps {
  label: string;
  emoji: string;
  color: string;
  href: string;
  description: string;
}

export default function GameCard({
  label,
  emoji,
  color,
  href,
  description,
}: GameCardProps) {
  return (
    <Link href={href} className="block">
      <motion.div
        className={`bg-gradient-to-br ${color} rounded-3xl shadow-xl p-4 sm:p-5 flex flex-col items-center justify-center cursor-pointer min-w-[140px] min-h-[150px] sm:min-w-[160px] sm:min-h-[170px]`}
        whileHover={{ scale: 1.08, rotate: 2 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span className="text-5xl sm:text-6xl mb-2 select-none">{emoji}</span>
        <span className="text-lg sm:text-xl font-extrabold text-white text-center leading-tight">
          {label}
        </span>
        <span className="text-xs sm:text-sm text-white/80 mt-1 text-center">
          {description}
        </span>
      </motion.div>
    </Link>
  );
}
