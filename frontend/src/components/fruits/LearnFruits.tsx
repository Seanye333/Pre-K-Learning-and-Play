"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ITEMS } from "./fruitData";

export default function LearnFruits() {
  const [selected, setSelected] = useState<string | null>(null);
  const item = ITEMS.find((i) => i.id === selected);

  return (
    <div className="flex flex-col items-center gap-4 p-2 w-full">
      <p className="text-white font-bold text-sm">Tap any fruit or veggie to learn its name!</p>

      <div className="grid grid-cols-5 gap-2">
        {ITEMS.map((it) => (
          <motion.button
            key={it.id}
            onClick={() => setSelected(it.id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-2xl p-2 shadow
              ${selected === it.id ? "ring-4 ring-white scale-110" : "bg-white/20"}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-3xl">{it.emoji}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {item && (
          <motion.div
            key={item.id}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl ${item.color} shadow-lg`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <span className="text-5xl">{item.emoji}</span>
            <div>
              <p className="font-black text-2xl text-gray-800">{item.name}</p>
              <p className="text-sm font-bold text-gray-600">
                {item.type === "fruit" ? "🍎 Fruit" : "🥦 Vegetable"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
