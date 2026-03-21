"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

const ANIMALS = ["🐶","🐱","🐻","🐼","🦊","🐯","🦁","🐮","🐷","🐸","🐙","🦋"];
const ORDINALS = ["1st","2nd","3rd","4th","5th"];
const MEDALS   = ["🥇","🥈","🥉","4️⃣","5️⃣"];
const COLORS   = [
  "from-yellow-400 to-amber-500",
  "from-slate-300 to-slate-500",
  "from-amber-600 to-yellow-700",
  "from-blue-400 to-blue-600",
  "from-green-400 to-green-600",
];

type Mode = "learn" | "quiz";
type Feedback = "idle" | "correct" | "wrong";

interface Props { onScore: (c: number, t: number) => void; }

function makePuzzle() {
  const count  = 4 + Math.floor(Math.random() * 2); // 4 or 5
  const animals = shuffle(ANIMALS).slice(0, count);
  const target  = Math.floor(Math.random() * count);
  return { animals, target, count };
}

export default function OrdinalGame({ onScore }: Props) {
  const [mode, setMode]         = useState<Mode>("learn");
  const [puzzle, setPuzzle]     = useState(makePuzzle);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [correct, setCorrect]   = useState(0);
  const [total, setTotal]       = useState(0);

  function newPuzzle() { setPuzzle(makePuzzle()); setFeedback("idle"); }

  function handleTap(i: number) {
    if (feedback !== "idle") return;
    const isRight = i === puzzle.target;
    const nt = total + 1;
    setTotal(nt);
    if (isRight) {
      setCorrect((c) => { onScore(c + 1, nt); return c + 1; });
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => newPuzzle(), 1100);
  }

  if (mode === "learn") {
    return (
      <div className="flex flex-col items-center gap-5 p-4">
        <div className="flex gap-2">
          <button onClick={() => setMode("learn")}
            className="px-4 py-1 rounded-full font-black text-sm bg-white text-amber-700">Learn</button>
          <button onClick={() => { setMode("quiz"); newPuzzle(); }}
            className="px-4 py-1 rounded-full font-black text-sm bg-white/20 text-white">Quiz</button>
        </div>

        <p className="text-white font-bold text-base">Ordinal numbers tell us the ORDER of things!</p>

        {/* Podium display */}
        <div className="flex items-end justify-center gap-3 mt-2">
          {/* 3rd */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl">🐻</span>
            <div className="bg-gradient-to-b from-amber-600 to-yellow-700 w-16 h-12 rounded-t-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">3rd</span>
            </div>
          </div>
          {/* 1st */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl">🐶</span>
            <div className="bg-gradient-to-b from-yellow-400 to-amber-500 w-16 h-20 rounded-t-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">1st</span>
            </div>
          </div>
          {/* 2nd */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl">🐱</span>
            <div className="bg-gradient-to-b from-slate-300 to-slate-500 w-16 h-16 rounded-t-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">2nd</span>
            </div>
          </div>
        </div>

        {/* Row explanation */}
        <div className="bg-white/10 rounded-2xl p-4 w-full max-w-sm">
          <p className="text-white text-sm font-bold text-center mb-3">In a LINE, we count from left ➡️</p>
          <div className="flex gap-2 justify-center">
            {["🐶","🐱","🐻","🐼","🦊"].map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{a}</span>
                <span className={`text-xs font-black text-white bg-gradient-to-b ${COLORS[i]} px-2 py-0.5 rounded-full`}>
                  {MEDALS[i]} {ORDINALS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          onClick={() => { setMode("quiz"); newPuzzle(); }}
          className="bg-white text-amber-700 font-black text-lg px-8 py-3 rounded-2xl shadow-lg"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Play Quiz! 🎉
        </motion.button>
      </div>
    );
  }

  // Quiz mode
  const targetOrdinal = ORDINALS[puzzle.target];

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("learn")}
          className="px-4 py-1 rounded-full font-black text-sm bg-white/20 text-white">Learn</button>
        <button onClick={() => setMode("quiz")}
          className="px-4 py-1 rounded-full font-black text-sm bg-white text-amber-700">Quiz</button>
      </div>

      <motion.p
        key={puzzle.target}
        className="text-white font-black text-2xl drop-shadow"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        Which animal is <span className="text-yellow-300">{targetOrdinal}</span>?
      </motion.p>

      {/* Animal row */}
      <div className="flex gap-2 justify-center flex-wrap">
        {puzzle.animals.map((animal, i) => {
          const isTarget = i === puzzle.target;
          const showCorrect = feedback === "correct" && isTarget;
          const showWrong   = feedback === "wrong"   && isTarget;
          return (
            <motion.button
              key={i}
              onClick={() => handleTap(i)}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 min-w-[60px] transition-colors
                ${feedback === "idle" ? "border-white/30 bg-white/10 hover:bg-white/20" : ""}
                ${showCorrect ? "border-green-400 bg-green-400/30" : ""}
                ${showWrong   ? "border-red-400 bg-red-400/30" : ""}
                ${feedback !== "idle" && !showCorrect && !showWrong ? "border-white/20 bg-white/5 opacity-60" : ""}`}
              whileHover={feedback === "idle" ? { scale: 1.1 } : {}}
              whileTap={feedback === "idle" ? { scale: 0.9 } : {}}
              disabled={feedback !== "idle"}>
              <span className="text-4xl">{animal}</span>
              <span className="text-white/80 text-xs font-bold">{ORDINALS[i]}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className={`text-3xl font-black px-6 py-3 rounded-2xl ${feedback === "correct" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {feedback === "correct" ? "🌟 Correct!" : `❌ It was ${targetOrdinal}!`}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total} 🏆</p>
    </div>
  );
}
