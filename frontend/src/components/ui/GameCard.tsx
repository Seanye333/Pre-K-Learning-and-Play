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
    <Link href={href} className="block group">
      <motion.div
        className={`relative bg-gradient-to-br ${color} rounded-3xl shadow-2xl p-4 sm:p-5 flex flex-col items-center justify-center cursor-pointer min-w-[140px] min-h-[150px] sm:min-w-[160px] sm:min-h-[170px] ring-2 ring-white/40`}
        whileHover={{ scale: 1.12, rotate: 2 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Sparkle badge */}
        <motion.span
          className="absolute top-2 right-2 text-base select-none opacity-60 group-hover:opacity-100"
          whileHover={{ scale: 1.4 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          ⭐
        </motion.span>

        {/* Bouncing emoji */}
        <motion.span
          className="text-5xl sm:text-6xl mb-2 select-none"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          {emoji}
        </motion.span>

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
