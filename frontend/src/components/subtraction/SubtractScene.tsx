"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ANIMALS = ["🐶","🐱","🐸","🐔","🦆","🐢","🐠","🦋","🐝","🐙"];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

function makeQuestion() {
  const total = Math.floor(Math.random() * 6) + 3; // 3–8
  const take  = Math.floor(Math.random() * (total - 1)) + 1; // 1 to total-1
  const answer = total - take;
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  // wrong choices: answer ± small offset, clamped 0–total
  const wrongs = shuffle(
    [-2,-1,1,2].map(d => answer + d).filter(n => n >= 0 && n <= total && n !== answer)
  ).slice(0,3);
  const choices = shuffle([answer, ...wrongs]);
  return { total, take, answer, animal, choices };
}

interface Props { onScore: (c: number, t: number) => void; }

export default function SubtractScene({ onScore }: Props) {
  const [q, setQ]           = useState(makeQuestion);
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<"idle"|"correct"|"wrong">("idle");
  const [correct, setCorrect]   = useState(0);
  const [total,   setTotal]     = useState(0);
  const [phase, setPhase]       = useState<"remove"|"answer">("remove");

  // Step 1 — tap animals to remove them
  function tapAnimal(i: number) {
    if (phase !== "remove" || removed.has(i) || feedback !== "idle") return;
    const next = new Set(removed).add(i);
    setRemoved(next);
    if (next.size === q.take) setPhase("answer");
  }

  // Step 2 — tap the answer
  function tapChoice(n: number) {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (n === q.answer) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, newTotal);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("idle"); setPhase("remove"); setRemoved(new Set()); setQ(makeQuestion());
    }, 1300);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Equation display */}
      <motion.div key={q.total + "-" + q.take} className="bg-white/20 rounded-2xl px-6 py-3 text-center"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <p className="text-white font-black text-3xl">
          {q.total} <span className="text-red-300">−</span> {q.take} <span className="text-white/50">=</span>{" "}
          <span className="text-yellow-300">?</span>
        </p>
        {phase === "remove" && (
          <p className="text-white/70 text-sm mt-1">Tap <span className="text-red-300 font-bold">{q.take - removed.size}</span> {q.animal} to take them away!</p>
        )}
        {phase === "answer" && (
          <p className="text-white/70 text-sm mt-1">How many are left? Tap the answer!</p>
        )}
      </motion.div>

      {/* Animal grid */}
      <div className="flex flex-wrap justify-center gap-2 max-w-xs min-h-[80px]">
        {Array.from({ length: q.total }).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => tapAnimal(i)}
            className={`text-4xl rounded-xl p-1 transition-all ${removed.has(i) ? "opacity-20 scale-75 grayscale" : "opacity-100"}`}
            whileHover={!removed.has(i) && phase === "remove" ? { scale: 1.2 } : {}}
            whileTap={!removed.has(i) && phase === "remove" ? { scale: 0.85 } : {}}
          >
            {q.animal}
          </motion.button>
        ))}
      </div>

      {/* Answer choices */}
      <AnimatePresence>
        {phase === "answer" && (
          <motion.div className="flex gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {q.choices.map((n) => (
              <motion.button
                key={n}
                onClick={() => tapChoice(n)}
                className={`w-14 h-14 rounded-2xl font-black text-2xl shadow
                  ${feedback !== "idle" && n === q.answer ? "bg-green-400 text-white" : ""}
                  ${feedback === "wrong" && n !== q.answer ? "bg-red-300/40 text-white/60" : ""}
                  ${feedback === "idle" ? "bg-white text-indigo-700" : ""}`}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
              >{n}</motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 That&apos;s right!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-xl"    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Try again! 💪</motion.p>}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
