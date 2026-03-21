"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GameCard from "@/components/ui/GameCard";
import { GAME_CARDS } from "@/lib/constants";

const FLOATERS = [
  { emoji: "☁️", top: "5%",  left: "3%",  cls: "animate-float",  delay: "0s" },
  { emoji: "⭐", top: "8%",  left: "85%", cls: "animate-floatB", delay: "0.5s" },
  { emoji: "🌈", top: "15%", left: "70%", cls: "animate-float",  delay: "1s" },
  { emoji: "🎈", top: "20%", left: "10%", cls: "animate-floatB", delay: "1.4s" },
  { emoji: "🦋", top: "35%", left: "90%", cls: "animate-float",  delay: "0.8s" },
  { emoji: "🌸", top: "45%", left: "2%",  cls: "animate-floatB", delay: "1.9s" },
  { emoji: "✨", top: "55%", left: "80%", cls: "animate-float",  delay: "0.3s" },
  { emoji: "🍀", top: "65%", left: "7%",  cls: "animate-floatB", delay: "2.1s" },
  { emoji: "🎀", top: "75%", left: "88%", cls: "animate-float",  delay: "1.2s" },
  { emoji: "💫", top: "12%", left: "45%", cls: "animate-floatB", delay: "0.7s" },
  { emoji: "🌺", top: "80%", left: "40%", cls: "animate-float",  delay: "1.6s" },
  { emoji: "🎠", top: "30%", left: "50%", cls: "animate-floatB", delay: "2.4s" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning! 🌅";
  if (h < 17) return "Good afternoon! ☀️";
  return "Good evening! 🌙";
}

export default function HomePage() {
  return (
    <main className="h-screen w-screen bg-gradient-to-b from-sky-300 via-blue-400 to-indigo-500 flex flex-col items-center justify-start game-area overflow-auto py-6 relative">

      {/* Floating background decorations */}
      <div className="pointer-events-none overflow-hidden absolute inset-0">
        {FLOATERS.map((f, i) => (
          <span
            key={i}
            className={`absolute text-3xl select-none ${f.cls}`}
            style={{ top: f.top, left: f.left, animationDelay: f.delay, opacity: 0.55 }}
          >
            {f.emoji}
          </span>
        ))}
      </div>

      {/* Title */}
      <div className="relative z-10 flex flex-col items-center mb-1">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-3xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            ✨
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-5xl font-black drop-shadow-lg text-center animate-rainbow px-2"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            Let&apos;s Play &amp; Learn!
          </motion.h1>
          <motion.span
            className="text-3xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
          >
            ✨
          </motion.span>
        </div>

        {/* Time-of-day greeting */}
        <motion.p
          className="text-white/90 text-sm font-bold mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {getGreeting()}
        </motion.p>
      </div>

      {/* Mascot */}
      <motion.div
        className="relative z-10 text-6xl mb-3 cursor-default select-none"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        whileHover={{ rotate: 15, scale: 1.25 }}
      >
        🦄
      </motion.div>

      {/* Game cards grid */}
      <motion.div
        className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 px-4 pb-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {GAME_CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i + 0.2 }}
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

      {/* Parent dashboard link */}
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
