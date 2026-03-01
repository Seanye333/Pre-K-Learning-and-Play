"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ANIMALS_DATA } from "./animalData";

interface AnimalSoundsProps {
  onScore: (correct: number, total: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function AnimalSounds({ onScore }: AnimalSoundsProps) {
  const [target, setTarget] = useState(ANIMALS_DATA[0]);
  const [choices, setChoices] = useState<typeof ANIMALS_DATA>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const newRound = () => {
    const t = ANIMALS_DATA[Math.floor(Math.random() * ANIMALS_DATA.length)];
    setTarget(t);
    const others = shuffle(ANIMALS_DATA.filter((a) => a.name !== t.name)).slice(0, 3);
    setChoices(shuffle([t, ...others]));
    setFeedback("idle");
    setRevealed(false);
  };

  useEffect(() => { newRound(); }, []);

  const handleChoice = (a: typeof ANIMALS_DATA[0]) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (a.name === target.name) {
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
        Which animal says this? 🔊
      </p>

      {/* Sound display */}
      <motion.div
        key={target.name}
        className="bg-white/20 rounded-3xl p-6 flex flex-col items-center gap-2 cursor-pointer"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setRevealed(true)}
      >
        <motion.p
          className="text-5xl font-black text-yellow-200"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          &ldquo;{target.sound}&rdquo;
        </motion.p>
        {revealed && (
          <motion.span
            className="text-7xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {target.emoji}
          </motion.span>
        )}
        {!revealed && (
          <p className="text-white/60 text-sm">Tap to see the animal 👆</p>
        )}
      </motion.div>

      {/* Animal choices */}
      <div className="grid grid-cols-2 gap-4">
        {choices.map((a) => (
          <motion.button
            key={a.name}
            onClick={() => handleChoice(a)}
            className={`rounded-2xl p-4 flex flex-col items-center gap-1 shadow-lg
              ${feedback === "correct" && a.name === target.name
                ? "bg-green-300/50 ring-4 ring-green-300"
                : "bg-white/25"}`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            animate={
              feedback === "wrong" && a.name !== target.name
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
            }
          >
            <span className="text-6xl">{a.emoji}</span>
            <span className="text-white font-extrabold text-lg">{a.name}</span>
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p
          className="text-2xl font-black text-yellow-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 The {target.name} {target.soundVerb}!
        </motion.p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
