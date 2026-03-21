"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LETTER_COLORS } from "@/lib/constants";

interface MatchGameProps {
  difficulty: "easy" | "medium" | "hard";
  onScore: (correct: number, total: number) => void;
}

const PAIR_COUNTS = { easy: 3, medium: 5, hard: 8 };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MatchGame({ difficulty, onScore }: MatchGameProps) {
  const pairCount = PAIR_COUNTS[difficulty];
  const [letters, setLetters] = useState<string[]>([]);
  const [shuffledLower, setShuffledLower] = useState<string[]>([]);
  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [rounds, setRounds] = useState(0);

  const initGame = () => {
    const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const picked = shuffle(pool).slice(0, pairCount);
    setLetters(picked);
    setShuffledLower(shuffle(picked));
    setMatched(new Set());
    setSelectedUpper(null);
    setWrong(null);
    setCorrect(0);
    setAttempts(0);
    setRounds(0);
  };

  useEffect(() => { initGame(); }, [difficulty]);

  const handleUpperClick = (letter: string) => {
    if (matched.has(letter)) return;
    if (letter !== selectedUpper) {
      setRounds(r => r + 1);
    }
    setSelectedUpper(letter);
  };

  const handleLowerClick = (lower: string) => {
    if (!selectedUpper) return;
    const upper = lower.toUpperCase();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (upper === selectedUpper) {
      const newMatched = new Set(matched);
      newMatched.add(selectedUpper);
      const newCorrect = correct + 1;
      setMatched(newMatched);
      setCorrect(newCorrect);
      setSelectedUpper(null);
      if (newMatched.size === pairCount) {
        onScore(newCorrect, rounds);
      }
    } else {
      setWrong(lower);
      setTimeout(() => {
        setWrong(null);
        setSelectedUpper(null);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-extrabold text-xl">
        Match the big letter to the small letter! ✨
      </p>

      <div className="flex gap-12 justify-center">
        {/* Uppercase column */}
        <div className="flex flex-col gap-3">
          <p className="text-white font-bold text-center text-sm mb-1">Big Letters</p>
          {letters.map((l, i) => (
            <motion.button
              key={l}
              onClick={() => handleUpperClick(l)}
              disabled={matched.has(l)}
              className={`w-20 h-16 rounded-2xl text-3xl font-black text-white shadow-md
                ${matched.has(l) ? "bg-green-400 opacity-50" : LETTER_COLORS[i % LETTER_COLORS.length]}
                ${selectedUpper === l ? "ring-4 ring-white" : ""}`}
              whileHover={!matched.has(l) ? { scale: 1.1 } : {}}
              whileTap={!matched.has(l) ? { scale: 0.9 } : {}}
            >
              {matched.has(l) ? "✅" : l}
            </motion.button>
          ))}
        </div>

        {/* Lowercase column */}
        <div className="flex flex-col gap-3">
          <p className="text-white font-bold text-center text-sm mb-1">Small Letters</p>
          {shuffledLower.map((l, i) => (
            <motion.button
              key={l}
              onClick={() => handleLowerClick(l)}
              disabled={matched.has(l.toUpperCase())}
              className={`w-20 h-16 rounded-2xl text-3xl font-black text-white shadow-md
                ${matched.has(l.toUpperCase()) ? "bg-green-400 opacity-50" : "bg-indigo-400"}
                ${wrong === l ? "bg-red-400" : ""}`}
              animate={wrong === l ? { x: [-6, 6, -6, 6, 0] } : {}}
              whileHover={!matched.has(l.toUpperCase()) ? { scale: 1.1 } : {}}
              whileTap={!matched.has(l.toUpperCase()) ? { scale: 0.9 } : {}}
            >
              {matched.has(l.toUpperCase()) ? "✅" : l.toLowerCase()}
            </motion.button>
          ))}
        </div>
      </div>

      {matched.size === pairCount && (
        <motion.div
          className="flex flex-col items-center gap-2 text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <p className="text-3xl font-black text-yellow-300">
            🎉 All matched! Great job!
          </p>
          <p className="text-white/80 text-lg font-bold">⭐ {correct} / {pairCount} correct!</p>
        </motion.div>
      )}

      <p className="bg-white/20 rounded-full px-4 py-1 text-white font-black text-sm">⭐ {correct} matched</p>

      <button
        onClick={initGame}
        className="mt-2 bg-white/30 text-white font-bold px-6 py-2 rounded-xl hover:bg-white/50 transition-colors"
      >
        🔄 New Game
      </button>
    </div>
  );
}
