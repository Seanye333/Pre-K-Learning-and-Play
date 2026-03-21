"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

type Mode = "missing" | "hop";
type Feedback = "idle" | "correct" | "wrong";

function makeMissingPuzzle() {
  const hidden = Math.floor(Math.random() * 11); // 0-10
  const wrongs = shuffle(
    Array.from({ length: 11 }, (_, i) => i).filter((n) => n !== hidden)
  ).slice(0, 3);
  const choices = shuffle([hidden, ...wrongs]);
  return { hidden, choices };
}

function makeHopPuzzle() {
  const start = Math.floor(Math.random() * 7);      // 0-6
  const hops  = 1 + Math.floor(Math.random() * 4); // 1-4
  const dir   = Math.random() < 0.5 ? "right" : "left";
  const answer = dir === "right" ? start + hops : start - hops;
  if (answer < 0 || answer > 10) return makeHopPuzzle();
  const wrongs = shuffle(
    Array.from({ length: 11 }, (_, i) => i).filter((n) => n !== answer)
  ).slice(0, 3);
  const choices = shuffle([answer, ...wrongs]);
  return { start, hops, dir, answer, choices };
}

interface Props { onScore: (c: number, t: number) => void; }

export default function NumberLineGame({ onScore }: Props) {
  const [mode, setMode]         = useState<Mode>("missing");
  const [missing, setMissing]   = useState(makeMissingPuzzle);
  const [hop, setHop]           = useState(makeHopPuzzle);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [correct, setCorrect]   = useState(0);
  const [total, setTotal]       = useState(0);
  const [frogPos, setFrogPos]   = useState<number | null>(null);

  function handleAnswer(chosen: number, answer: number) {
    if (feedback !== "idle") return;
    const isRight = chosen === answer;
    const nt = total + 1;
    setTotal(nt);
    if (isRight) {
      if (mode === "hop") setFrogPos(answer);
      setCorrect((c) => { onScore(c + 1, nt); return c + 1; });
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("idle");
      setFrogPos(null);
      if (mode === "missing") setMissing(makeMissingPuzzle());
      else setHop(makeHopPuzzle());
    }, 1100);
  }

  function switchMode(m: Mode) {
    setMode(m); setFeedback("idle"); setFrogPos(null);
    if (m === "missing") setMissing(makeMissingPuzzle());
    else setHop(makeHopPuzzle());
  }

  const displayFrog = mode === "hop" ? (frogPos ?? hop.start) : null;

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Mode tabs */}
      <div className="flex gap-2">
        <button onClick={() => switchMode("missing")}
          className={`px-4 py-1 rounded-full font-black text-sm ${mode === "missing" ? "bg-white text-blue-700" : "bg-white/20 text-white"}`}>
          Missing Number
        </button>
        <button onClick={() => switchMode("hop")}
          className={`px-4 py-1 rounded-full font-black text-sm ${mode === "hop" ? "bg-white text-blue-700" : "bg-white/20 text-white"}`}>
          Frog Hop 🐸
        </button>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.p
          key={mode === "missing" ? missing.hidden : `${hop.start}-${hop.hops}-${hop.dir}`}
          className="text-white font-black text-xl drop-shadow text-center px-2"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {mode === "missing"
            ? <>What number is missing on the line?</>
            : <>🐸 starts at <span className="text-yellow-300">{hop.start}</span>, hops{" "}
               <span className="text-yellow-300">{hop.hops}</span> spaces{" "}
               <span className="text-yellow-300">{hop.dir}</span>. Where does it land?</>
          }
        </motion.p>
      </AnimatePresence>

      {/* Number line */}
      <div className="relative w-full max-w-xs">
        {/* Line track */}
        <div className="absolute top-7 left-4 right-4 h-1 bg-white/40 rounded-full" />

        <div className="flex justify-between px-0 relative">
          {Array.from({ length: 11 }, (_, i) => {
            const isMissing = mode === "missing" && i === missing.hidden;
            const isFrog    = mode === "hop" && i === displayFrog;
            const isStart   = mode === "hop" && i === hop.start && displayFrog !== hop.start;
            return (
              <div key={i} className="flex flex-col items-center gap-0 relative">
                {/* Frog */}
                {isFrog && (
                  <motion.span
                    className="text-2xl absolute -top-9"
                    initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}>
                    🐸
                  </motion.span>
                )}
                {/* Start flag */}
                {isStart && (
                  <span className="text-lg absolute -top-8">🚩</span>
                )}
                {/* Tick */}
                <div className="w-0.5 h-3 bg-white/60 mt-[22px]" />
                {/* Number or ? */}
                <span className={`text-sm font-black mt-0.5 ${isMissing ? "text-yellow-300 text-base" : "text-white/90"}`}>
                  {isMissing ? "?" : i}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hop arrow visualization */}
      {mode === "hop" && (
        <div className="text-white/70 text-sm font-bold flex items-center gap-2">
          <span className="text-yellow-300 font-black text-base">{hop.start}</span>
          <span>{hop.dir === "right" ? "→".repeat(Math.min(hop.hops, 5)) : "←".repeat(Math.min(hop.hops, 5))}</span>
          <span className="text-yellow-300 font-black text-base">?</span>
        </div>
      )}

      {/* Choice buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        {(mode === "missing" ? missing.choices : hop.choices).map((c) => (
          <motion.button
            key={c}
            onClick={() => handleAnswer(c, mode === "missing" ? missing.hidden : hop.answer)}
            className={`w-16 h-16 rounded-2xl font-black text-2xl shadow
              ${feedback === "idle" ? "bg-white text-blue-700" : "bg-white/40 text-white/60"}
              ${feedback === "correct" && c === (mode === "missing" ? missing.hidden : hop.answer) ? "!bg-green-400 !text-white" : ""}
              ${feedback === "wrong"   && c === (mode === "missing" ? missing.hidden : hop.answer) ? "!bg-red-400 !text-white" : ""}`}
            whileHover={feedback === "idle" ? { scale: 1.1 } : {}}
            whileTap={feedback === "idle" ? { scale: 0.88 } : {}}
            disabled={feedback !== "idle"}>
            {c}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className={`text-2xl font-black px-6 py-2 rounded-2xl ${feedback === "correct" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {feedback === "correct" ? "🌟 Yes!" : "❌ Not quite!"}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total} 📏</p>
    </div>
  );
}
