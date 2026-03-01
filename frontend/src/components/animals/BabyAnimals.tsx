"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ANIMALS_DATA } from "./animalData";

interface BabyAnimalsProps {
  onScore: (correct: number, total: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function BabyAnimals({ onScore }: BabyAnimalsProps) {
  const [target, setTarget] = useState(ANIMALS_DATA[0]);
  const [choices, setChoices] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const newRound = () => {
    const t = ANIMALS_DATA[Math.floor(Math.random() * ANIMALS_DATA.length)];
    setTarget(t);
    const babyNames = [...new Set(ANIMALS_DATA.map((a) => a.baby))];
    const others = shuffle(babyNames.filter((b) => b !== t.baby)).slice(0, 3);
    setChoices(shuffle([t.baby, ...others]));
    setFeedback("idle");
  };

  useEffect(() => { newRound(); }, []);

  const handleChoice = (baby: string) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (baby === target.baby) {
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
      <p className="text-white font-extrabold text-xl text-center">
        What is a baby {target.name} called? 👶
      </p>

      {/* Parent + baby display */}
      <motion.div
        key={target.name}
        className="bg-white/20 rounded-3xl p-6 flex items-center gap-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-7xl">{target.emoji}</span>
          <span className="text-white font-bold text-sm">{target.name}</span>
        </div>
        <span className="text-4xl text-white">→</span>
        <div className="flex flex-col items-center gap-1">
          <span className="text-7xl">{target.babyEmoji}</span>
          <span className="text-white/60 font-bold text-sm">Baby?</span>
        </div>
      </motion.div>

      {/* Baby name choices */}
      <div className="grid grid-cols-2 gap-4">
        {choices.map((baby) => (
          <motion.button
            key={baby}
            onClick={() => handleChoice(baby)}
            className={`rounded-2xl px-6 py-5 text-2xl font-black text-white shadow-lg
              ${feedback === "correct" && baby === target.baby
                ? "bg-green-400/60 ring-4 ring-green-300"
                : "bg-white/25"}`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            animate={
              feedback === "wrong" && baby !== target.baby
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
            }
          >
            {baby}
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p
          className="text-2xl font-black text-yellow-200 text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 A baby {target.name} is a {target.baby}!
        </motion.p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
