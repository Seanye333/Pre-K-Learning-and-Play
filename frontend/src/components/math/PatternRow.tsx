"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ANIMALS } from "@/lib/constants";

interface PatternRowProps {
  onScore: (correct: number, total: number) => void;
}

type Pattern = { sequence: string[]; answer: string; choices: string[] };

function buildPattern(): Pattern {
  const shuffled = [...ANIMALS].sort(() => Math.random() - 0.5);
  const [a, b, c] = shuffled.slice(0, 3).map((x) => x.emoji);
  const patterns = [
    // ABAB
    { sequence: [a, b, a, b, a], answer: b, choices: shuffleArr([b, c, a]) },
    // AABB
    { sequence: [a, a, b, b, a], answer: a, choices: shuffleArr([a, b, c]) },
    // ABBA
    { sequence: [a, b, b, a, a], answer: b, choices: shuffleArr([b, a, c]) },
    // ABC
    { sequence: [a, b, c, a, b], answer: c, choices: shuffleArr([c, a, b]) },
  ];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

function shuffleArr<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function PatternRow({ onScore }: PatternRowProps) {
  const [pattern, setPattern] = useState<Pattern>({ sequence: [], answer: "", choices: [] });
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const newRound = () => {
    setPattern(buildPattern());
    setFeedback("idle");
  };

  useEffect(() => { newRound(); }, []);

  const handleChoice = (choice: string) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (choice === pattern.answer) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(newRound, 1200);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-extrabold text-xl">
        What comes next? 🤔
      </p>

      {/* Pattern display */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {pattern.sequence.map((emoji, i) => (
          <motion.span
            key={i}
            className="text-5xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {emoji}
          </motion.span>
        ))}
        <motion.span
          className="text-5xl border-4 border-white/50 rounded-xl w-16 h-16 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: pattern.sequence.length * 0.1 }}
        >
          {feedback === "correct" ? pattern.answer : "❓"}
        </motion.span>
      </div>

      {/* Choices */}
      <div className="flex gap-5">
        {pattern.choices.map((choice) => (
          <motion.button
            key={choice}
            onClick={() => handleChoice(choice)}
            className={`w-20 h-20 rounded-2xl text-5xl bg-white/30 shadow-md flex items-center justify-center
              ${feedback === "correct" && choice === pattern.answer ? "bg-green-400/60" : ""}`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            animate={feedback === "wrong" && choice !== pattern.answer ? { x: [-4, 4, -4, 4, 0] } : {}}
          >
            {choice}
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p className="text-3xl font-black text-yellow-200" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          🌟 You got the pattern!
        </motion.p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
