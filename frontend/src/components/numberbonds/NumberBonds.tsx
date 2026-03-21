"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }
interface Props { onScore: (c: number, t: number) => void; }

function makeRound(target: number) {
  const partA = Math.floor(Math.random() * (target + 1));
  const partB = target - partA;
  const wrong = shuffle([...new Set([partA - 1, partA + 1, partB - 1, partB + 1, partA + 2].filter(n => n >= 0 && n <= target && n !== partB))]).slice(0, 3);
  return { target, partA, partB, choices: shuffle([partB, ...wrong.slice(0, 3)]) };
}

export default function NumberBonds({ onScore }: Props) {
  const [total, setTotal] = useState<5 | 10>(5);
  const [round, setRound] = useState(() => makeRound(5));
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);

  function pick(n: number) {
    if (feedback !== "idle") return;
    const nt = score + 1; setScore(nt);
    if (n === round.partB) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else setFB("wrong");
    setTimeout(() => { setFB("idle"); setRound(makeRound(total)); }, 1000);
  }

  function switchTotal(t: 5 | 10) { setTotal(t); setRound(makeRound(t)); setFB("idle"); }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <div className="flex gap-3">
        {([5, 10] as const).map(t => (
          <button key={t} onClick={() => switchTotal(t)}
            className={`px-5 py-2 rounded-full font-black text-lg ${total === t ? "bg-white text-pink-700" : "bg-white/20 text-white"}`}>
            Bonds to {t}
          </button>
        ))}
      </div>
      <p className="text-white font-bold text-sm">What number completes the bond?</p>
      <motion.div key={`${round.partA}-${round.target}`} className="flex flex-col items-center gap-4"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-pink-700 font-black text-4xl shadow-lg">
          {round.target}
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-1">
            <div className="w-1 h-8 bg-white/60" />
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-white font-black text-3xl">
              {round.partA}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-1 h-8 bg-white/60" />
            <div className="w-16 h-16 rounded-full border-4 border-dashed border-white/70 flex items-center justify-center text-white/50 font-black text-3xl">
              {feedback === "correct" ? round.partB : "?"}
            </div>
          </div>
        </div>
        <p className="text-white/70 text-sm">{round.partA} + ? = {round.target}</p>
      </motion.div>
      <div className="flex gap-3">
        {round.choices.map(n => (
          <motion.button key={n} onClick={() => pick(n)}
            className={`w-16 h-16 rounded-2xl font-black text-2xl shadow
              ${feedback !== "idle" && n === round.partB ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && n !== round.partB ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white text-pink-700" : ""}`}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}>{n}</motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {round.partA} + {round.partB} = {round.target}!</motion.p>}
        {feedback === "wrong" && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>What makes {round.target}?</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{score}</p>
    </div>
  );
}
