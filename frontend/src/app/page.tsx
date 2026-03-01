"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GameCard from "@/components/ui/GameCard";
import { GAME_CARDS } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="h-screen w-screen bg-gradient-to-b from-sky-300 to-blue-500 flex flex-col items-center justify-start game-area overflow-auto py-6">
      {/* Title */}
      <motion.h1
        className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg mb-5 text-center px-4"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        🌟 Let&apos;s Play &amp; Learn! 🌟
      </motion.h1>

      {/* Game cards grid — 4 columns so all 8 games fit */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4 pb-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {GAME_CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.2 }}
          >
            <GameCard
              label={card.label}
              emoji={card.emoji}
              color={card.color}
              href={card.href}
              description={card.description}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Parent dashboard link — subtle lock icon */}
      <Link
        href="/parent"
        className="fixed bottom-5 right-5 z-10 text-white/60 hover:text-white/90 transition-colors"
        aria-label="Parent Dashboard"
      >
        <motion.div
          className="text-3xl"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          🔒
        </motion.div>
      </Link>
    </main>
  );
}
