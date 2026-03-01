"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ITEMS, type FruitItem } from "./fruitData";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface SortGameProps {
  onScore: (correct: number, total: number) => void;
}

export default function SortGame({ onScore }: SortGameProps) {
  const [pool, setPool] = useState<FruitItem[]>(() => shuffle(ITEMS));
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<"fruit" | "veggie" | null>(null);

  const handleSort = (item: FruitItem, basket: "fruit" | "veggie") => {
    const newTotal = total + 1;
    setTotal(newTotal);
    const isRight = item.type === basket;
    if (isRight) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      onScore(newCorrect, newTotal);
    }
    setFlash(basket);
    setTimeout(() => setFlash(null), 500);
    setPool((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleReset = () => {
    setPool(shuffle(ITEMS));
    setCorrect(0);
    setTotal(0);
  };

  const current = pool[0];

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">
        Is it a fruit or a vegetable? Tap the right basket!
      </p>

      {/* Current item */}
      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={current.id}
            className="flex flex-col items-center gap-1"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
          >
            <span className="text-8xl">{current.emoji}</span>
            <span className="text-white font-black text-2xl">{current.name}</span>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-6xl">🎉</span>
            <p className="text-white font-black text-2xl">All sorted!</p>
            <p className="text-white/80 text-lg">
              {correct} / {total} correct
            </p>
            <motion.button
              onClick={handleReset}
              className="mt-2 bg-white/30 text-white font-bold px-6 py-2 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
            >
              Play Again 🔄
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Baskets */}
      {current && (
        <div className="flex gap-6">
          <motion.button
            onClick={() => handleSort(current, "fruit")}
            className={`flex flex-col items-center gap-1 px-8 py-4 rounded-2xl font-black text-white shadow-lg transition-colors
              ${flash === "fruit" ? "bg-red-400" : "bg-red-500/60"}`}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-4xl">🍎</span>
            <span>Fruit</span>
          </motion.button>
          <motion.button
            onClick={() => handleSort(current, "veggie")}
            className={`flex flex-col items-center gap-1 px-8 py-4 rounded-2xl font-black text-white shadow-lg transition-colors
              ${flash === "veggie" ? "bg-green-400" : "bg-green-600/60"}`}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-4xl">🥦</span>
            <span>Veggie</span>
          </motion.button>
        </div>
      )}

      {current && (
        <p className="text-white/60 text-sm">
          {pool.length} left · {correct}/{total} correct
        </p>
      )}
    </div>
  );
}
