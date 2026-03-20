"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BODY_PARTS } from "./bodyData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// Grid of body part buttons — tap the one that matches the prompt
export default function TapBody({ onScore }: Props) {
  const [queue] = useState(() => shuffle([...BODY_PARTS, ...BODY_PARTS]).slice(0, 20));
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [choices, setChoices] = useState<typeof BODY_PARTS>(() => buildChoices(queue, 0));

  function buildChoices(q: typeof BODY_PARTS, i: number) {
    const curr = q[i % q.length];
    const others = shuffle(BODY_PARTS.filter((p) => p.id !== curr.id)).slice(0, 3);
    return shuffle([curr, ...others]);
  }

  function handle(chosen: (typeof BODY_PARTS)[0]) {
    if (feedback !== "idle") return;
    const target = queue[idx % queue.length];
    const newTotal = total + 1;
    setTotal(newTotal);
    if (chosen.id === target.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, newTotal);
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
      {/* Prompt */}
      <motion.div
        key={target.id}
        className="bg-white/20 rounded-2xl px-8 py-4 text-center"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      >
        <p className="text-white/70 text-sm font-bold">Tap the…</p>
        <p className="text-white font-black text-4xl mt-1">{target.name}</p>
      </motion.div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map((c) => (
          <motion.button
            key={c.id}
            onClick={() => handle(c)}
            className={`flex flex-col items-center gap-1 px-4 py-4 rounded-2xl font-bold shadow
              ${feedback !== "idle" && c.id === target.id ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && c.id !== target.id ? "bg-red-300/50 text-white/60" : ""}
              ${feedback === "idle" ? "bg-white/30 text-white" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}
          >
            <span className="text-5xl">{c.emoji}</span>
            <span className="text-sm font-black">{c.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 Correct!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-xl"    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Try again! 💪</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
