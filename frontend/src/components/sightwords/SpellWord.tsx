"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SIGHT_WORDS } from "./sightWordData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

export default function SpellSightWord({ onScore }: Props) {
  const [queue] = useState(() => shuffle(SIGHT_WORDS));
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [tiles, setTiles] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const target = queue[idx % queue.length];

  useEffect(() => {
    setTyped([]);
    // Build shuffled letter tiles: target letters + 2 extras
    const extra = shuffle("abcdefghijklmnopqrstuvwxyz".split(""))
      .filter((l) => !target.word.includes(l))
      .slice(0, 2);
    setTiles(shuffle([...target.word.split(""), ...extra]));
    setFeedback("idle");
  }, [idx, target.word]);

  function tapTile(letter: string, tileIdx: number) {
    if (feedback !== "idle") return;
    const newTyped = [...typed, letter];
    setTyped(newTyped);
    setTiles((prev) => prev.filter((_, i) => i !== tileIdx));

    if (newTyped.length === target.word.length) {
      const isRight = newTyped.join("") === target.word;
      const newTotal = total + 1;
      setTotal(newTotal);
      if (isRight) {
        const newCorrect = correct + 1;
        setCorrect(newCorrect);
        onScore(newCorrect, newTotal);
        setFeedback("correct");
      } else {
        setFeedback("wrong");
      }
      setTimeout(() => setIdx((i) => i + 1), 1400);
    }
  }

  function tapSlot(i: number) {
    if (feedback !== "idle" || typed.length === 0) return;
    const removed = typed[i];
    const newTyped = typed.filter((_, j) => j !== i);
    setTyped(newTyped);
    setTiles((prev) => shuffle([...prev, removed]));
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="flex items-center gap-3 bg-white/20 rounded-2xl px-6 py-3">
        <span className="text-4xl">{target.emoji}</span>
        <p className="text-white font-black text-base text-center">{target.sentence}</p>
      </div>
      <p className="text-yellow-200 font-bold text-sm">Spell the highlighted word!</p>

      {/* Answer slots */}
      <div className="flex gap-2">
        {target.word.split("").map((_, i) => (
          <motion.div
            key={i}
            onClick={() => tapSlot(i)}
            className={`w-10 h-12 rounded-xl flex items-center justify-center font-black text-2xl border-2
              ${typed[i]
                ? feedback === "correct" ? "bg-green-400 border-green-300 text-white"
                : feedback === "wrong" ? "bg-red-400 border-red-300 text-white"
                : "bg-white text-indigo-700 border-indigo-300 cursor-pointer"
                : "bg-white/20 border-white/30 text-white/0"}`}
            animate={feedback === "wrong" ? { x: [-4, 4, -4, 0] } : {}}
          >
            {typed[i] ?? ""}
          </motion.div>
        ))}
      </div>

      {/* Letter tiles */}
      <div className="flex gap-2 flex-wrap justify-center max-w-xs">
        {tiles.map((letter, i) => (
          <motion.button
            key={`${letter}-${i}`}
            onClick={() => tapTile(letter, i)}
            className="w-11 h-11 bg-white rounded-xl font-black text-xl text-indigo-700 shadow"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
          >
            {letter}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && (
          <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✅ Spelled it!</motion.p>
        )}
        {feedback === "wrong" && (
          <motion.p className="text-red-200 font-black text-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Not quite — try the next one! 💪</motion.p>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
