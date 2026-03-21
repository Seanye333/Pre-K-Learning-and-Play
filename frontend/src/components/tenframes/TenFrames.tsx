"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

type Mode = "count" | "fill";
type Feedback = "idle" | "correct" | "wrong";

function makeCountPuzzle() {
  const count = 1 + Math.floor(Math.random() * 10); // 1-10
  const wrongs = shuffle(
    Array.from({ length: 10 }, (_, i) => i + 1).filter((n) => n !== count)
  ).slice(0, 3);
  const choices = shuffle([count, ...wrongs]);
  return { count, choices };
}

interface Props { onScore: (c: number, t: number) => void; }

export default function TenFrames({ onScore }: Props) {
  const [mode, setMode]         = useState<Mode>("count");
  const [puzzle, setPuzzle]     = useState(makeCountPuzzle);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [correct, setCorrect]   = useState(0);
  const [total, setTotal]       = useState(0);

  // Fill mode state
  const [fillTarget, setFillTarget] = useState(() => 1 + Math.floor(Math.random() * 10));
  const [filled, setFilled]         = useState<Set<number>>(new Set());
  const [fillFeedback, setFillFeedback] = useState<Feedback>("idle");

  function newCountPuzzle() { setPuzzle(makeCountPuzzle()); setFeedback("idle"); }

  function newFillPuzzle() {
    setFillTarget(1 + Math.floor(Math.random() * 10));
    setFilled(new Set());
    setFillFeedback("idle");
  }

  function handleCount(chosen: number) {
    if (feedback !== "idle") return;
    const isRight = chosen === puzzle.count;
    const nt = total + 1;
    setTotal(nt);
    if (isRight) {
      setCorrect((c) => { onScore(c + 1, nt); return c + 1; });
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(newCountPuzzle, 1100);
  }

  function handleFillTap(i: number) {
    if (fillFeedback !== "idle") return;
    setFilled((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  function checkFill() {
    if (fillFeedback !== "idle") return;
    const isRight = filled.size === fillTarget;
    const nt = total + 1;
    setTotal(nt);
    if (isRight) {
      setCorrect((c) => { onScore(c + 1, nt); return c + 1; });
      setFillFeedback("correct");
    } else {
      setFillFeedback("wrong");
    }
    setTimeout(newFillPuzzle, 1200);
  }

  function switchMode(m: Mode) {
    setMode(m);
    setFeedback("idle");
    setFillFeedback("idle");
    if (m === "count") newCountPuzzle();
    else newFillPuzzle();
  }

  function renderFrame(dotsOn: Set<number> | number, interactive = false) {
    const onSet = typeof dotsOn === "number"
      ? new Set(Array.from({ length: dotsOn }, (_, i) => i))
      : dotsOn;
    return (
      <div className="grid grid-cols-5 gap-1.5 bg-white/10 p-3 rounded-2xl border-2 border-white/30">
        {Array.from({ length: 10 }, (_, i) => {
          const isOn = onSet.has(i);
          return (
            <motion.button
              key={i}
              onClick={interactive ? () => handleFillTap(i) : undefined}
              className={`w-10 h-10 rounded-lg border-2 transition-colors
                ${isOn
                  ? "bg-red-500 border-red-400 shadow-lg"
                  : "bg-white/10 border-white/20"}
                ${interactive ? "cursor-pointer hover:bg-white/20" : "cursor-default"}`}
              whileTap={interactive ? { scale: 0.88 } : {}}
              whileHover={interactive && !isOn ? { scale: 1.08 } : {}}>
              {isOn && <span className="text-xl leading-none">🔴</span>}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Mode tabs */}
      <div className="flex gap-2">
        <button onClick={() => switchMode("count")}
          className={`px-4 py-1 rounded-full font-black text-sm ${mode === "count" ? "bg-white text-violet-700" : "bg-white/20 text-white"}`}>
          Count Dots
        </button>
        <button onClick={() => switchMode("fill")}
          className={`px-4 py-1 rounded-full font-black text-sm ${mode === "fill" ? "bg-white text-violet-700" : "bg-white/20 text-white"}`}>
          Fill the Frame
        </button>
      </div>

      {mode === "count" ? (
        <>
          <motion.p
            key={puzzle.count}
            className="text-white font-black text-2xl drop-shadow"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            How many 🔴 dots?
          </motion.p>

          <motion.div key={"frame-" + puzzle.count} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            {renderFrame(puzzle.count)}
          </motion.div>

          <div className="flex gap-3 flex-wrap justify-center">
            {puzzle.choices.map((c) => (
              <motion.button
                key={c}
                onClick={() => handleCount(c)}
                className={`w-16 h-16 rounded-2xl font-black text-2xl shadow
                  ${feedback === "idle" ? "bg-white text-violet-700" : "bg-white/30 text-white/60"}
                  ${feedback === "correct" && c === puzzle.count ? "!bg-green-400 !text-white" : ""}
                  ${feedback === "wrong"   && c === puzzle.count ? "!bg-red-400 !text-white" : ""}`}
                whileHover={feedback === "idle" ? { scale: 1.1 } : {}}
                whileTap={feedback === "idle" ? { scale: 0.88 } : {}}
                disabled={feedback !== "idle"}>
                {c}
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <>
          <motion.p
            key={fillTarget}
            className="text-white font-black text-2xl drop-shadow"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            Fill <span className="text-yellow-300">{fillTarget}</span> dots! 👆
          </motion.p>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/70 text-sm font-bold">You filled:</span>
            <span className={`font-black text-lg ${filled.size === fillTarget ? "text-green-300" : filled.size > fillTarget ? "text-red-300" : "text-white"}`}>
              {filled.size}
            </span>
            <span className="text-white/50 text-sm">/ {fillTarget}</span>
          </div>

          {renderFrame(filled, true)}

          <motion.button
            onClick={checkFill}
            disabled={fillFeedback !== "idle"}
            className={`px-8 py-3 rounded-2xl font-black text-lg shadow
              ${fillFeedback === "idle" ? "bg-white text-violet-700" : "bg-white/30 text-white/60"}`}
            whileHover={fillFeedback === "idle" ? { scale: 1.06 } : {}}
            whileTap={fillFeedback === "idle" ? { scale: 0.94 } : {}}>
            Check! ✅
          </motion.button>
        </>
      )}

      <AnimatePresence>
        {(feedback !== "idle" || fillFeedback !== "idle") && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}
            className={`text-2xl font-black px-6 py-2 rounded-2xl
              ${(mode === "count" ? feedback : fillFeedback) === "correct" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {(mode === "count" ? feedback : fillFeedback) === "correct"
              ? "🌟 Perfect!"
              : mode === "count"
              ? `❌ It was ${puzzle.count}!`
              : `❌ Need ${fillTarget} dots!`}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total} 🔢</p>
    </div>
  );
}
