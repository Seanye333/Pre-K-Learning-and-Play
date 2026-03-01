"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PAIRS, type OppositePair } from "./oppositeData";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface MatchOppositesProps {
  onScore: (correct: number, total: number) => void;
}

export default function MatchOpposites({ onScore }: MatchOppositesProps) {
  const [queue] = useState(() => shuffle(PAIRS));
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");

  const pair = queue[idx % queue.length];

  // Build choices: the correct opposite + 2 random distractors
  const [choices, setChoices] = useState<OppositePair[]>(() => buildChoices(queue, 0));

  function buildChoices(q: OppositePair[], i: number): OppositePair[] {
    const current = q[i % q.length];
    const others = q.filter((_, j) => j !== i % q.length);
    const distractors = shuffle(others).slice(0, 2);
    return shuffle([current, ...distractors]);
  }

  const handle = (chosen: OppositePair) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (chosen.id === pair.id) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("idle");
      const next = idx + 1;
      setIdx(next);
      setChoices(buildChoices(queue, next));
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">
        What is the <span className="text-yellow-300 font-black">opposite</span> of…
      </p>

      {/* Question */}
      <motion.div
        key={pair.id}
        className={`flex flex-col items-center gap-2 px-8 py-4 rounded-3xl shadow-lg ${pair.colorA}`}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
      >
        <span className="text-7xl">{pair.emojiA}</span>
        <span className="font-black text-3xl text-gray-800">{pair.wordA}</span>
      </motion.div>

      {/* Choices */}
      <div className="flex gap-3 flex-wrap justify-center">
        {choices.map((c) => (
          <motion.button
            key={c.id}
            onClick={() => handle(c)}
            className={`flex flex-col items-center gap-1 px-5 py-4 rounded-2xl font-bold shadow
              ${feedback !== "idle" && c.id === pair.id
                ? "bg-green-400 ring-4 ring-green-200"
                : feedback === "wrong" && c.id !== pair.id
                ? "bg-red-300/50"
                : "bg-white/30 text-white"}`}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.9 }}
            animate={
              feedback === "wrong" && c.id !== pair.id
                ? { x: [-4, 4, -4, 4, 0] }
                : {}
            }
          >
            <span className="text-4xl">{c.emojiB}</span>
            <span className="text-white font-black">{c.wordB}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && (
          <motion.p
            className="text-2xl font-black text-yellow-200"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          >
            🌟 Correct!
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
