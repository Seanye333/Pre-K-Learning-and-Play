"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = 2 | 5 | 10;

const CONFIG: Record<Step, { emoji: string; color: string; max: number }> = {
  2:  { emoji:"👟", color:"from-purple-400 to-violet-600", max:20 },
  5:  { emoji:"⭐", color:"from-yellow-400 to-orange-500", max:50 },
  10: { emoji:"🔟", color:"from-teal-400 to-cyan-600",    max:100 },
};

function makeSeq(step: Step) {
  const nums: number[] = [];
  for (let n = step; n <= CONFIG[step].max; n += step) nums.push(n);
  const pool    = nums.map((_, i) => i);
  const hidden  = new Set<number>();
  for (let i = 0; i < 3; i++) {
    const ri = Math.floor(Math.random() * pool.length);
    hidden.add(pool.splice(ri, 1)[0]);
  }
  return { nums, hidden };
}

interface Props { onScore: (c: number, t: number) => void; }

export default function SkipCount({ onScore }: Props) {
  const [step,   setStep]   = useState<Step>(2);
  const [seq,    setSeq]    = useState(() => makeSeq(2));
  const [answers, setAnswers] = useState<Map<number, boolean>>(new Map());
  const [active,  setActive]  = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total,   setTotal]   = useState(0);

  function changeStep(s: Step) {
    setStep(s); setSeq(makeSeq(s)); setAnswers(new Map()); setActive(null);
  }

  function tapBlank(i: number) {
    if (!answers.has(i)) setActive(i);
  }

  function tapChoice(val: number) {
    if (active === null) return;
    const isRight = val === seq.nums[active];
    const nt = total + 1;
    setTotal(nt);
    setAnswers((prev) => new Map(prev).set(active, isRight));
    if (isRight) setCorrect((c) => { onScore(c + 1, nt); return c + 1; });
    setActive(null);
    if (answers.size + 1 >= seq.hidden.size) {
      setTimeout(() => { setSeq(makeSeq(step)); setAnswers(new Map()); }, 1500);
    }
  }

  const choices = active !== null
    ? (() => {
        const ans    = seq.nums[active];
        const wrongs = [-2, -1, 1, 2]
          .map((d) => ans + d * step)
          .filter((n) => n > 0 && n !== ans)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        return [ans, ...wrongs].sort(() => Math.random() - 0.5);
      })()
    : [];

  const cfg = CONFIG[step];

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="flex gap-2">
        {([2, 5, 10] as Step[]).map((s) => (
          <button key={s} onClick={() => changeStep(s)}
            className={`px-4 py-1 rounded-full font-black text-sm
              ${step === s ? "bg-white text-purple-700" : "bg-white/20 text-white"}`}>
            By {s}s
          </button>
        ))}
      </div>

      <p className="text-white font-bold text-sm">
        Tap the <span className="text-yellow-300 font-black">?</span> and fill in the missing numbers!
      </p>

      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {seq.nums.map((n, i) => {
          const isHidden   = seq.hidden.has(i);
          const isAnswered = answers.has(i);
          const wasRight   = answers.get(i);
          const isActive   = active === i;
          return (
            <motion.button key={i}
              onClick={() => isHidden && !isAnswered ? tapBlank(i) : undefined}
              className={`w-14 h-12 rounded-xl font-black text-base shadow
                ${!isHidden ? `bg-gradient-to-b ${cfg.color} text-white` : ""}
                ${isHidden && !isAnswered && !isActive ? "bg-white/20 text-white border-2 border-dashed border-white/40" : ""}
                ${isActive ? "bg-yellow-300 text-yellow-900 scale-110" : ""}
                ${isAnswered && wasRight  ? "bg-green-400 text-white" : ""}
                ${isAnswered && !wasRight ? "bg-red-400   text-white" : ""}`}
              whileHover={isHidden && !isAnswered ? { scale: 1.1 } : {}}
              whileTap={isHidden && !isAnswered ? { scale: 0.9 } : {}}>
              {isHidden && !isAnswered ? "?" : n}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div className="flex gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {choices.map((c) => (
              <motion.button key={c} onClick={() => tapChoice(c)}
                className="w-14 h-14 bg-white text-indigo-700 font-black text-xl rounded-2xl shadow"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}>{c}</motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total} · counting by {step}s {cfg.emoji}</p>
    </div>
  );
}
