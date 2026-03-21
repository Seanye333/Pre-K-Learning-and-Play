"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ANIMALS } from "@/lib/constants";

interface CountingBoardProps {
  difficulty: "easy" | "medium" | "hard";
  onScore: (correct: number, total: number) => void;
}

const RANGES = { easy: [1, 5], medium: [1, 10], hard: [1, 20] };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function CountingBoard({ difficulty, onScore }: CountingBoardProps) {
  const [count, setCount] = useState(3);
  const [animal, setAnimal] = useState(ANIMALS[0]);
  const [choices, setChoices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);

  const newRound = () => {
    const [min, max] = RANGES[difficulty];
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    setCount(n);
    setAnimal(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);

    // Build choices: correct + 2 distractors
    const distractors = new Set<number>();
    while (distractors.size < 2) {
      const d = Math.floor(Math.random() * (max - min + 1)) + min;
      if (d !== n) distractors.add(d);
    }
    setChoices(shuffle([n, ...Array.from(distractors)]));
    setFeedback("idle");
    setChosen(null);
  };

  useEffect(() => { newRound(); }, [difficulty]);

  const handleChoice = (n: number) => {
    if (feedback !== "idle") return;
    setChosen(n);
    const newTotal = total + 1;
    setTotal(newTotal);
    if (n === count) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(newRound, 1500);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  const getButtonClass = (n: number): string => {
    if (feedback === "correct" && n === count) return "bg-green-400 text-white";
    if (feedback === "wrong" && n === chosen) return "bg-red-400 text-white";
    if (feedback === "wrong" && n === count) return "bg-yellow-300 text-gray-900";
    return "bg-indigo-500 text-white";
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-extrabold text-xl">
        How many {animal.name}s? 🔢
      </p>

      {/* Animal icons */}
      <div className="flex flex-wrap justify-center gap-1 max-w-sm">
        {Array.from({ length: count }).map((_, i) => (
          <motion.span
            key={i}
            className="text-4xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            {animal.emoji}
          </motion.span>
        ))}
      </div>

      {/* Number choices */}
      <div className="flex gap-4">
        {choices.map((n) => (
          <motion.button
            key={n}
            onClick={() => handleChoice(n)}
            className={`w-20 h-20 rounded-2xl text-4xl font-black shadow-lg ${getButtonClass(n)}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            animate={feedback === "wrong" && n !== count ? { x: [-4, 4, -4, 4, 0] } : {}}
          >
            {n}
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p
          className="text-3xl font-black text-yellow-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 Yes! {count}!
        </motion.p>
      )}
      {feedback === "wrong" && (
        <motion.p className="text-2xl font-black text-red-200">
          Try again! 💪
        </motion.p>
      )}

      <p className="bg-white/20 rounded-full px-4 py-1 text-white font-black text-sm">⭐ {correct} / {total}</p>
    </div>
  );
}
