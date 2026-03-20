"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClockFace from "./ClockFace";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

// All o'clock 1–12 and half-past 1–12
const ALL_TIMES = [
  ...Array.from({ length: 12 }, (_, i) => ({ hour: i + 1, minutes: 0,  label: `${i + 1} o'clock` })),
  ...Array.from({ length: 12 }, (_, i) => ({ hour: i + 1, minutes: 30, label: `half past ${i + 1}` })),
];

function makeQ() {
  const pool    = shuffle(ALL_TIMES);
  const target  = pool[0];
  const wrongs  = shuffle(pool.slice(1)).slice(0, 3);
  return { target, choices: shuffle([target, ...wrongs]) };
}

interface Props { onScore: (c: number, t: number) => void; }

export default function ClockQuiz({ onScore }: Props) {
  const [q, setQ]           = useState(makeQ);
  const [feedback, setFB]   = useState<"idle"|"correct"|"wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total,   setTotal]   = useState(0);

  function handle(label: string) {
    if (feedback !== "idle") return;
    const newTotal = total + 1; setTotal(newTotal);
    if (label === q.target.label) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, newTotal); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setQ(makeQ()); }, 1200);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">What time does the clock show?</p>

      <motion.div key={q.target.label} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <ClockFace hour={q.target.hour} minutes={q.target.minutes} size={190} />
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {q.choices.map((c) => (
          <motion.button key={c.label} onClick={() => handle(c.label)}
            className={`py-3 px-2 rounded-2xl font-black text-sm shadow text-center
              ${feedback !== "idle" && c.label === q.target.label ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && c.label !== q.target.label ? "bg-red-300/40 text-white/60" : ""}
              ${feedback === "idle" ? "bg-white text-indigo-700" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}
            animate={feedback === "wrong" && c.label !== q.target.label ? { x: [-4,4,-4,0] } : {}}>
            {c.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}>🌟 Correct!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-xl"    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>Try again! 💪</motion.p>}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
