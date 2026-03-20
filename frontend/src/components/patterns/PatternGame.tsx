"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = { id: string; emoji: string; label: string };

const SETS: Item[][] = [
  [{ id: "red",    emoji: "🔴", label: "Red"    }, { id: "blue",   emoji: "🔵", label: "Blue"   }],
  [{ id: "star",   emoji: "⭐", label: "Star"   }, { id: "heart",  emoji: "❤️",  label: "Heart"  }],
  [{ id: "cat",    emoji: "🐱", label: "Cat"    }, { id: "dog",    emoji: "🐶", label: "Dog"    }],
  [{ id: "sun",    emoji: "☀️",  label: "Sun"    }, { id: "moon",   emoji: "🌙", label: "Moon"   }],
  [{ id: "apple",  emoji: "🍎", label: "Apple"  }, { id: "banana", emoji: "🍌", label: "Banana" }],
  [{ id: "circle", emoji: "⭕", label: "Circle" }, { id: "square", emoji: "🟥", label: "Square" }],
  [{ id: "frog",   emoji: "🐸", label: "Frog"   }, { id: "duck",   emoji: "🦆", label: "Duck"   }, { id: "fish", emoji: "🐟", label: "Fish" }],
  [{ id: "fire",   emoji: "🔥", label: "Fire"   }, { id: "water",  emoji: "💧", label: "Water"  }, { id: "leaf", emoji: "🍃", label: "Leaf" }],
];

type PatternType = "ABAB" | "AABB" | "ABC";

function makePattern(items: Item[], type: PatternType): Item[] {
  const [A, B, C] = items;
  if (type === "ABAB") return [A, B, A, B, A, B];
  if (type === "AABB") return [A, A, B, B, A, A];
  return [A, B, C, A, B, C]; // ABC
}

function getAnswer(items: Item[], type: PatternType, visible: number): Item {
  const full = makePattern(items, type);
  return full[visible];
}

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

export default function PatternGame({ onScore }: Props) {
  const [level, setLevel] = useState<PatternType>("ABAB");
  const [setIdx, setSetIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const VISIBLE = 5; // show 5 items, hide the 6th
  const itemSet = SETS[setIdx % SETS.length];
  const pattern = makePattern(itemSet, level);
  const shown   = pattern.slice(0, VISIBLE);
  const answer  = pattern[VISIBLE];
  const choices = level === "ABC"
    ? shuffle(itemSet)
    : shuffle(itemSet.slice(0, 2));

  function pick(item: Item) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (item.id === answer.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => {
      setFB("idle");
      setSetIdx((i) => i + 1);
    }, 1000);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      {/* Level selector */}
      <div className="flex gap-2">
        {(["ABAB", "AABB", "ABC"] as PatternType[]).map((l) => (
          <button key={l} onClick={() => { setLevel(l); setSetIdx(0); setFB("idle"); }}
            className={`px-4 py-1 rounded-full font-black text-sm ${level === l ? "bg-white text-pink-700" : "bg-white/20 text-white"}`}>
            {l}
          </button>
        ))}
      </div>

      <p className="text-white font-bold text-sm">What comes next in the pattern?</p>

      {/* Pattern display */}
      <div className="flex gap-2 items-center flex-wrap justify-center">
        {shown.map((item, i) => (
          <motion.div key={`${setIdx}-${i}`}
            className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.07 }}>
            {item.emoji}
          </motion.div>
        ))}
        {/* Hidden slot */}
        <motion.div className="w-14 h-14 rounded-2xl border-4 border-dashed border-white/60 flex items-center justify-center text-3xl"
          animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          {feedback === "correct" ? answer.emoji : "❓"}
        </motion.div>
      </div>

      {/* Choices */}
      <div className="flex gap-4 justify-center">
        {choices.map((item) => (
          <motion.button key={item.id} onClick={() => pick(item)}
            className={`w-20 h-20 rounded-2xl font-bold shadow text-4xl flex items-center justify-center
              ${feedback !== "idle" && item.id === answer.id ? "bg-green-400" : ""}
              ${feedback === "wrong" && item.id !== answer.id ? "bg-red-300/40 opacity-50" : ""}
              ${feedback === "idle" ? "bg-white text-purple-700" : ""}`}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}>
            {item.emoji}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {answer.emoji} is next!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Follow the pattern!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Pattern: <span className="font-bold">{level}</span> · Score: {correct}/{total}</p>
    </div>
  );
}
