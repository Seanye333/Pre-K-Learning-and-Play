"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PUZZLES, type Puzzle } from "./puzzleData";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface SpotDiffProps {
  onScore: (correct: number, total: number) => void;
}

export default function SpotDiff({ onScore }: SpotDiffProps) {
  const [queue] = useState(() => shuffle(PUZZLES));
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const puzzle: Puzzle = queue[puzzleIdx % queue.length];
  const totalDiffs = puzzle.differences.length;
  const allFound = found.size === totalDiffs;

  const handleTapRight = (id: string) => {
    if (allFound) return;
    if (found.has(id)) return; // already found

    if (puzzle.differences.includes(id)) {
      const newFound = new Set(found).add(id);
      setFound(newFound);
      const newTotal = total + 1;
      const newCorrect = correct + 1;
      setTotal(newTotal);
      setCorrect(newCorrect);
      onScore(newCorrect, newTotal);
    } else {
      // Wrong tap
      setWrongFlash(true);
      setTotal((t) => t + 1);
      setTimeout(() => setWrongFlash(false), 600);
    }
  };

  const nextPuzzle = () => {
    const next = puzzleIdx + 1;
    setPuzzleIdx(next);
    setFound(new Set());
  };

  return (
    <div className="flex flex-col items-center gap-3 p-3 w-full">
      <p className="text-white font-bold text-sm text-center">
        Tap the differences in the <span className="text-yellow-300 font-black">RIGHT</span> picture!
        ({found.size}/{totalDiffs} found)
      </p>

      {/* Title */}
      <p className="text-white/80 font-bold text-xs">{puzzle.title}</p>

      {/* Two scenes side by side */}
      <div className="flex gap-2 w-full max-w-sm">
        {/* LEFT — original */}
        <div className="flex-1">
          <p className="text-center text-white/60 text-xs font-bold mb-1">Original</p>
          <div className={`relative w-full rounded-2xl bg-gradient-to-b ${puzzle.bg} border-2 border-white/30`}
            style={{ paddingBottom: "120%" }}>
            {puzzle.left.map((el) => (
              <span
                key={el.id}
                className={`absolute select-none ${el.size}`}
                style={{ left: `${el.x}%`, top: `${el.y}%`, transform: "translate(-50%,-50%)" }}
              >
                {el.emoji}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — modified */}
        <div className="flex-1">
          <p className="text-center text-yellow-300 text-xs font-bold mb-1">Find differences!</p>
          <div
            className={`relative w-full rounded-2xl bg-gradient-to-b ${puzzle.bg} border-2 border-yellow-300
              ${wrongFlash ? "border-red-400 bg-red-200/20" : ""}`}
            style={{ paddingBottom: "120%" }}
          >
            {puzzle.right.map((el) => {
              const isDiff = puzzle.differences.includes(el.id);
              const isFound = found.has(el.id);
              return (
                <motion.span
                  key={el.id}
                  className={`absolute select-none cursor-pointer ${el.size}
                    ${isFound ? "opacity-100" : "opacity-100"}`}
                  style={{ left: `${el.x}%`, top: `${el.y}%`, transform: "translate(-50%,-50%)" }}
                  onClick={() => handleTapRight(el.id)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.85 }}
                  animate={isFound ? { scale: [1, 1.4, 1] } : {}}
                >
                  {isFound ? (
                    <span className="relative">
                      {el.emoji}
                      <span className="absolute -top-2 -right-2 text-base">✅</span>
                    </span>
                  ) : el.emoji}
                </motion.span>
              );
            })}

            {/* Found circles overlay */}
            {puzzle.right.map((el) =>
              found.has(el.id) ? (
                <motion.div
                  key={`ring-${el.id}`}
                  className="absolute rounded-full border-4 border-green-400 pointer-events-none"
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    transform: "translate(-50%,-50%)",
                    width: "2.5rem",
                    height: "2.5rem",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* All found celebration */}
      <AnimatePresence>
        {allFound && (
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          >
            <p className="text-2xl font-black text-yellow-200">🌟 All found! Amazing!</p>
            <motion.button
              onClick={nextPuzzle}
              className="bg-green-400 text-white font-bold px-6 py-2 rounded-xl"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
            >
              Next Puzzle ➡️
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-1">
        {Array.from({ length: totalDiffs }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
              ${i < found.size ? "bg-green-400 text-white" : "bg-white/30 text-white/50"}`}
          >
            {i < found.size ? "✓" : i + 1}
          </div>
        ))}
      </div>

      <p className="text-white/60 text-xs">Puzzle {(puzzleIdx % queue.length) + 1}/{queue.length}</p>
    </div>
  );
}
