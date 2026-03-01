"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ANIMALS } from "@/lib/constants";

interface AdditionSceneProps {
  difficulty: "easy" | "medium" | "hard";
  onScore: (correct: number, total: number) => void;
}

const MAX_SUM = { easy: 10, medium: 15, hard: 20 };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function AdditionScene({ difficulty, onScore }: AdditionSceneProps) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [animalA, setAnimalA] = useState(ANIMALS[0]);
  const [animalB, setAnimalB] = useState(ANIMALS[1]);
  const [choices, setChoices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const newRound = () => {
    const maxSum = MAX_SUM[difficulty];
    const newA = Math.floor(Math.random() * (maxSum / 2 - 1)) + 1;
    const newB = Math.floor(Math.random() * (maxSum / 2 - 1)) + 1;
    setA(newA);
    setB(newB);
    setAnimalA(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
    setAnimalB(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);

    const sum = newA + newB;
    const distractors = new Set<number>();
    while (distractors.size < 2) {
      const d = Math.floor(Math.random() * maxSum) + 1;
      if (d !== sum) distractors.add(d);
    }
    setChoices(shuffle([sum, ...Array.from(distractors)]));
    setFeedback("idle");
  };

  useEffect(() => { newRound(); }, [difficulty]);

  const handleChoice = (n: number) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (n === a + b) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(newRound, 1300);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-extrabold text-xl">How many in all? ➕</p>

      {/* Visual equation */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="flex flex-wrap gap-1 justify-center max-w-[160px]">
          {Array.from({ length: a }).map((_, i) => (
            <motion.span key={i} className="text-3xl" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.06 }}>
              {animalA.emoji}
            </motion.span>
          ))}
        </div>
        <span className="text-5xl font-black text-white">+</span>
        <div className="flex flex-wrap gap-1 justify-center max-w-[160px]">
          {Array.from({ length: b }).map((_, i) => (
            <motion.span key={i} className="text-3xl" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.06 + 0.1 }}>
              {animalB.emoji}
            </motion.span>
          ))}
        </div>
        <span className="text-5xl font-black text-white">=</span>
        <span className="text-5xl font-black text-yellow-200">?</span>
      </div>

      {/* Choices */}
      <div className="flex gap-4">
        {choices.map((n) => (
          <motion.button
            key={n}
            onClick={() => handleChoice(n)}
            className={`w-20 h-20 rounded-2xl text-4xl font-black text-white shadow-lg
              ${feedback === "correct" && n === a + b ? "bg-green-400" : "bg-indigo-500"}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            animate={feedback === "wrong" && n !== a + b ? { x: [-4, 4, -4, 4, 0] } : {}}
          >
            {n}
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p className="text-3xl font-black text-yellow-200" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          🌟 {a} + {b} = {a + b}!
        </motion.p>
      )}
      {feedback === "wrong" && (
        <p className="text-2xl font-black text-red-200">Try again! 💪</p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
