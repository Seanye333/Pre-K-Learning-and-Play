"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SHAPES } from "./ShapeDisplay";
import ShapeDisplay from "./ShapeDisplay";

interface IdentifyShapeProps {
  onScore: (correct: number, total: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function IdentifyShape({ onScore }: IdentifyShapeProps) {
  const [target, setTarget] = useState(SHAPES[0]);
  const [choices, setChoices] = useState<typeof SHAPES>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const newRound = () => {
    const t = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setTarget(t);
    const others = shuffle(SHAPES.filter((s) => s.name !== t.name)).slice(0, 3);
    setChoices(shuffle([t, ...others]));
    setFeedback("idle");
  };

  useEffect(() => { newRound(); }, []);

  const handleChoice = (s: typeof SHAPES[0]) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (s.name === target.name) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(newRound, 1100);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-extrabold text-xl">
        Which shape is this? 🤔
      </p>

      {/* Target shape */}
      <motion.div
        key={target.name}
        className="bg-white/20 rounded-3xl p-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <ShapeDisplay shape={target} size={120} />
      </motion.div>

      {/* Name choices */}
      <div className="grid grid-cols-2 gap-4">
        {choices.map((s) => (
          <motion.button
            key={s.name}
            onClick={() => handleChoice(s)}
            className={`px-6 py-4 rounded-2xl text-2xl font-black text-white shadow-lg
              ${feedback === "correct" && s.name === target.name ? "bg-green-400" : "bg-white/30"}
              ${feedback === "wrong" && s.name !== target.name ? "opacity-50" : ""}`}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.9 }}
            animate={
              feedback === "wrong" && s.name !== target.name
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
            }
          >
            {s.name}
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p
          className="text-3xl font-black text-yellow-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 Yes! That&apos;s a {target.name}!
        </motion.p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
