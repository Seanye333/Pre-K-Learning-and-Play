"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SIGHT_WORDS, type SightWord } from "./sightWordData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

export default function FindWord({ onScore }: Props) {
  const [queue] = useState(() => shuffle(SIGHT_WORDS));
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [choices, setChoices] = useState<SightWord[]>(() => buildChoices(shuffle(SIGHT_WORDS), 0));

  function buildChoices(q: SightWord[], i: number) {
    const curr = q[i % q.length];
    const others = shuffle(q.filter((_, j) => j !== i % q.length)).slice(0, 3);
    return shuffle([curr, ...others]);
  }

  function handle(chosen: SightWord) {
    if (feedback !== "idle") return;
    const target = queue[idx % queue.length];
    const isRight = chosen.word === target.word;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (isRight) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      onScore(newCorrect, newTotal);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("idle");
      const next = idx + 1;
      setIdx(next);
      setChoices(buildChoices(queue, next));
    }, 1100);
  }

  const target = queue[idx % queue.length];

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Find the word that matches!</p>

      {/* Sentence prompt */}
      <motion.div
        key={target.word}
        className="bg-white/20 rounded-2xl px-6 py-4 text-center max-w-xs"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      >
        <span className="text-5xl">{target.emoji}</span>
        <p className="text-white font-black text-lg mt-2">{target.sentence}</p>
        <p className="text-yellow-200 text-sm mt-1">Which word is highlighted?</p>
      </motion.div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map((c) => (
          <motion.button
            key={c.word}
            onClick={() => handle(c)}
            className={`px-6 py-4 rounded-2xl font-black text-2xl shadow
              ${feedback !== "idle" && c.word === target.word ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && c.word !== target.word ? "bg-red-300/50 text-white/60" : ""}
              ${feedback === "idle" ? "bg-white text-indigo-700" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}
            animate={feedback === "wrong" && c.word !== target.word ? { x: [-4, 4, -4, 4, 0] } : {}}
          >
            {c.word}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && (
          <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 Great reading!</motion.p>
        )}
        {feedback === "wrong" && (
          <motion.p className="text-red-200 font-black text-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Try again! 💪</motion.p>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
