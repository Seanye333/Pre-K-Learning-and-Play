"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ANIMALS_DATA } from "./animalData";

interface AnimalHomesProps {
  onScore: (correct: number, total: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Unique homes
const HOMES = [...new Map(ANIMALS_DATA.map((a) => [a.home, { home: a.home, emoji: a.homeEmoji }])).values()];

export default function AnimalHomes({ onScore }: AnimalHomesProps) {
  const [target, setTarget] = useState(ANIMALS_DATA[0]);
  const [choices, setChoices] = useState<{ home: string; emoji: string }[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const newRound = () => {
    const t = ANIMALS_DATA[Math.floor(Math.random() * ANIMALS_DATA.length)];
    setTarget(t);
    const others = shuffle(HOMES.filter((h) => h.home !== t.home)).slice(0, 3);
    setChoices(shuffle([{ home: t.home, emoji: t.homeEmoji }, ...others]));
    setFeedback("idle");
  };

  useEffect(() => { newRound(); }, []);

  const handleChoice = (home: string) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (home === target.home) {
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
        Where does this animal live? 🏠
      </p>

      {/* Animal */}
      <motion.div
        key={target.name}
        className="bg-white/20 rounded-3xl p-6 flex flex-col items-center gap-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <span className="text-8xl">{target.emoji}</span>
        <p className="text-3xl font-black text-white">{target.name}</p>
      </motion.div>

      {/* Home choices */}
      <div className="grid grid-cols-2 gap-4">
        {choices.map((h) => (
          <motion.button
            key={h.home}
            onClick={() => handleChoice(h.home)}
            className={`rounded-2xl p-5 flex flex-col items-center gap-2 shadow-lg
              ${feedback === "correct" && h.home === target.home
                ? "bg-green-300/50 ring-4 ring-green-300"
                : "bg-white/25"}`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            animate={
              feedback === "wrong" && h.home !== target.home
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
            }
          >
            <span className="text-5xl">{h.emoji}</span>
            <span className="text-white font-extrabold text-xl">{h.home}</span>
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p
          className="text-2xl font-black text-yellow-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 The {target.name} lives in the {target.home}!
        </motion.p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
