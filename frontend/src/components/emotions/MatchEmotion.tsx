"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EMOTIONS } from "./EmotionCard";

interface MatchEmotionProps {
  onScore: (correct: number, total: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MatchEmotion({ onScore }: MatchEmotionProps) {
  const [target, setTarget] = useState(EMOTIONS[0]);
  const [choices, setChoices] = useState<typeof EMOTIONS>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const newRound = () => {
    const t = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    setTarget(t);
    const others = shuffle(EMOTIONS.filter((e) => e.name !== t.name)).slice(0, 3);
    setChoices(shuffle([t, ...others]));
    setFeedback("idle");
  };

  useEffect(() => { newRound(); }, []);

  const handleChoice = (e: typeof EMOTIONS[0]) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (e.name === target.name) {
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
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-extrabold text-xl text-center">
        How does this person feel? 🧠
      </p>

      {/* Story prompt */}
      <motion.div
        key={target.name}
        className="bg-white/20 rounded-3xl p-5 max-w-sm text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <p className="text-white text-lg font-bold leading-relaxed">
          {target.story}
        </p>
        <p className="text-white/60 text-sm mt-2">How do you think they feel?</p>
      </motion.div>

      {/* Emotion face choices */}
      <div className="grid grid-cols-2 gap-4">
        {choices.map((e) => (
          <motion.button
            key={e.name}
            onClick={() => handleChoice(e)}
            className={`rounded-2xl p-5 flex flex-col items-center gap-2 shadow-lg transition-colors
              ${feedback === "correct" && e.name === target.name
                ? "ring-4 ring-green-300 bg-green-300/30"
                : "bg-white/25"}`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            animate={
              feedback === "wrong" && e.name !== target.name
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
            }
          >
            <span className="text-6xl">{e.emoji}</span>
            <span className="text-white font-extrabold text-lg">{e.name}</span>
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p
          className="text-3xl font-black text-yellow-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 Yes! That&apos;s {target.name}!
        </motion.p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
