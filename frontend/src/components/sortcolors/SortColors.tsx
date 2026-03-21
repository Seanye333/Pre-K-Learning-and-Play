"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ColorGroup {
  name: string;
  hex: string;
  emoji: string;
  items: { emoji: string; label: string }[];
}

const COLOR_GROUPS: ColorGroup[] = [
  {
    name: "Red",
    hex: "#ef4444",
    emoji: "🔴",
    items: [
      { emoji: "🍎", label: "apple" },
      { emoji: "🌹", label: "rose" },
      { emoji: "🚒", label: "fire truck" },
      { emoji: "🍓", label: "strawberry" },
    ],
  },
  {
    name: "Yellow",
    hex: "#eab308",
    emoji: "🟡",
    items: [
      { emoji: "🍋", label: "lemon" },
      { emoji: "🌻", label: "sunflower" },
      { emoji: "⭐", label: "star" },
      { emoji: "🍌", label: "banana" },
    ],
  },
  {
    name: "Blue",
    hex: "#3b82f6",
    emoji: "🔵",
    items: [
      { emoji: "🫐", label: "blueberry" },
      { emoji: "🐋", label: "whale" },
      { emoji: "💙", label: "blue heart" },
      { emoji: "🧢", label: "blue cap" },
    ],
  },
  {
    name: "Green",
    hex: "#22c55e",
    emoji: "🟢",
    items: [
      { emoji: "🐸", label: "frog" },
      { emoji: "🌿", label: "leaf" },
      { emoji: "🥦", label: "broccoli" },
      { emoji: "🍀", label: "clover" },
    ],
  },
  {
    name: "Orange",
    hex: "#f97316",
    emoji: "🟠",
    items: [
      { emoji: "🍊", label: "orange" },
      { emoji: "🦊", label: "fox" },
      { emoji: "🥕", label: "carrot" },
      { emoji: "🎃", label: "pumpkin" },
    ],
  },
  {
    name: "Purple",
    hex: "#a855f7",
    emoji: "🟣",
    items: [
      { emoji: "🍇", label: "grapes" },
      { emoji: "🔮", label: "crystal ball" },
      { emoji: "🌂", label: "umbrella" },
      { emoji: "🫛", label: "plum" },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface AllItem {
  emoji: string;
  label: string;
  colorName: string;
}

function buildQueue(): AllItem[] {
  const all: AllItem[] = [];
  for (const g of COLOR_GROUPS) {
    for (const item of g.items) {
      all.push({ ...item, colorName: g.name });
    }
  }
  return shuffle(all);
}

interface Props {
  onScore: (c: number, t: number) => void;
}

export default function SortColors({ onScore }: Props) {
  const [queue] = useState<AllItem[]>(() => buildQueue());
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [wrongColor, setWrongColor] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);

  const currentItem = queue[idx];
  const choices = COLOR_GROUPS;

  const handlePick = (colorName: string) => {
    if (feedback !== "idle" || done) return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (colorName === currentItem.colorName) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(() => {
        setFeedback("idle");
        setWrongColor(null);
        if (idx + 1 >= queue.length) {
          setDone(true);
        } else {
          setIdx(idx + 1);
        }
      }, 1000);
    } else {
      setFeedback("wrong");
      setWrongColor(colorName);
      setTimeout(() => {
        setFeedback("idle");
        setWrongColor(null);
      }, 800);
    }
  };

  const handleRestart = () => {
    setIdx(0);
    setCorrect(0);
    setTotal(0);
    setDone(false);
    setFeedback("idle");
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 h-full">
        <motion.div
          className="text-8xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ type: "spring" }}
        >
          🎨
        </motion.div>
        <p className="text-4xl font-black text-white text-center drop-shadow">
          You sorted them all!
        </p>
        <p className="text-2xl text-white/80">
          {correct} out of {total} correct!
        </p>
        <motion.button
          onClick={handleRestart}
          className="bg-white text-purple-600 font-black text-xl px-8 py-4 rounded-2xl shadow-lg"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Play Again!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Progress */}
      <p className="text-white/70 text-sm font-bold">
        {idx + 1} / {queue.length}
      </p>

      {/* Question prompt */}
      <p className="text-white font-extrabold text-xl text-center">
        What color is this?
      </p>

      {/* Item display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="bg-white/20 rounded-3xl p-6 flex flex-col items-center gap-2 shadow-xl"
          initial={{ scale: 0.7, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-8xl">{currentItem.emoji}</span>
          <p className="text-2xl font-black text-white capitalize">{currentItem.label}</p>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback === "correct" && (
          <motion.p
            className="text-2xl font-black text-yellow-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            Great sorting! 🌟
          </motion.p>
        )}
        {feedback === "wrong" && (
          <motion.p
            className="text-2xl font-black text-red-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            Try again! 💪
          </motion.p>
        )}
      </AnimatePresence>

      {/* Color bucket buttons */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {choices.map((c) => (
          <motion.button
            key={c.name}
            onClick={() => handlePick(c.name)}
            className="rounded-2xl py-3 px-2 flex flex-col items-center gap-1 shadow-lg font-extrabold text-white text-sm"
            style={{
              backgroundColor: c.hex,
              border: wrongColor === c.name ? "3px solid white" : "3px solid transparent",
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            animate={
              wrongColor === c.name
                ? { x: [-6, 6, -6, 6, 0] }
                : feedback === "correct" && c.name === currentItem.colorName
                ? { scale: [1, 1.15, 1] }
                : {}
            }
          >
            <span className="text-2xl">{c.emoji}</span>
            <span>{c.name}</span>
          </motion.button>
        ))}
      </div>

      <p className="text-white/60 text-xs">Score: {correct}/{total}</p>
    </div>
  );
}
