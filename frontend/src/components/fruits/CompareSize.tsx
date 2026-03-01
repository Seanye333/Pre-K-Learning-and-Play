"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COMPARE_PAIRS } from "./fruitData";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface CompareSizeProps {
  onScore: (correct: number, total: number) => void;
}

export default function CompareSize({ onScore }: CompareSizeProps) {
  const [pairs] = useState(() => shuffle(COMPARE_PAIRS));
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [flipped, setFlipped] = useState(() =>
    pairs.map(() => Math.random() > 0.5)
  );

  const pair = pairs[idx % pairs.length];
  const isFlipped = flipped[idx % pairs.length];
  // left = bigger if not flipped, else smaller
  const left  = isFlipped ? pair[1] : pair[0]; // shown left
  const right = isFlipped ? pair[0] : pair[1]; // shown right
  const biggerSide: "left" | "right" = isFlipped ? "right" : "left";

  const handle = (side: "left" | "right") => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (side === biggerSide) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("idle");
      setIdx((i) => i + 1);
    }, 1200);
  };

  if (pairs.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-bold text-sm">
        Which one is <span className="text-yellow-300 font-black">BIGGER</span>? Tap it!
      </p>

      <div className="flex gap-8 items-center">
        {[left, right].map((item, i) => {
          const side = i === 0 ? "left" : "right";
          return (
            <motion.button
              key={item.id + side}
              onClick={() => handle(side)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl shadow-lg
                ${feedback === "correct" && side === biggerSide
                  ? "bg-green-400/60 ring-4 ring-green-300"
                  : feedback === "wrong" && side !== biggerSide
                  ? "bg-red-400/60 ring-4 ring-red-300"
                  : "bg-white/20"}`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              animate={
                feedback === "wrong" && side === (biggerSide === "left" ? "right" : "left")
                  ? { x: [-6, 6, -6, 6, 0] }
                  : {}
              }
            >
              <span className="text-7xl">{item.emoji}</span>
              <span className="text-white font-black text-lg">{item.name}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback === "correct" && (
          <motion.p
            className="text-2xl font-black text-yellow-200"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          >
            🌟 That&apos;s right!
          </motion.p>
        )}
        {feedback === "wrong" && (
          <motion.p
            className="text-xl font-black text-red-200"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            Not quite — try again! 💪
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
