"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SizeGroup {
  label: string;
  items: { emoji: string; name: string; size: number }[]; // size in em
}

const GROUPS: SizeGroup[] = [
  { label: "Animals",  items: [{ emoji:"🐭", name:"Mouse",    size:2 }, { emoji:"🐱", name:"Cat",      size:3 }, { emoji:"🐄", name:"Cow",      size:4.5 }, { emoji:"🐘", name:"Elephant", size:6 }] },
  { label: "Fruit",    items: [{ emoji:"🍇", name:"Grape",    size:2 }, { emoji:"🍎", name:"Apple",    size:3 }, { emoji:"🍉", name:"Melon",    size:5 }] },
  { label: "Buildings",items: [{ emoji:"🏠", name:"House",    size:3 }, { emoji:"🏢", name:"Building", size:4.5 }, { emoji:"🏙️", name:"City",     size:6 }] },
  { label: "Sea",      items: [{ emoji:"🐠", name:"Fish",     size:2 }, { emoji:"🦈", name:"Shark",    size:3.5 }, { emoji:"🐋", name:"Whale",    size:5.5 }] },
  { label: "Transport",items: [{ emoji:"🛴", name:"Scooter",  size:2 }, { emoji:"🚗", name:"Car",      size:3.5 }, { emoji:"🚌", name:"Bus",      size:5 }, { emoji:"🚂", name:"Train",    size:6 }] },
  { label: "Space",    items: [{ emoji:"⭐", name:"Star",     size:2 }, { emoji:"🌕", name:"Moon",     size:3.5 }, { emoji:"🌍", name:"Earth",    size:5 }, { emoji:"☀️",  name:"Sun",      size:7 }] },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

export default function SizeOrder({ onScore }: Props) {
  const [gIdx, setGIdx] = useState(0);
  const group = GROUPS[gIdx % GROUPS.length];
  const [shuffled, setShuffled] = useState(() => shuffle(group.items.map((it, i) => ({ ...it, id: i }))));
  const [placed,   setPlaced]   = useState<typeof shuffled>([]);
  const [feedback, setFB]       = useState<"idle"|"correct"|"wrong">("idle");
  const [correct,  setCorrect]  = useState(0);
  const [total,    setTotal]    = useState(0);

  function tapItem(item: typeof shuffled[0]) {
    if (feedback !== "idle") return;
    const next = [...placed, item];
    setPlaced(next);
    setShuffled((prev) => prev.filter((i) => i.id !== item.id));
    if (next.length === group.items.length) {
      // Check order smallest → biggest
      const correct = next.every((it, i) => i === 0 || it.size >= next[i - 1].size);
      const nt = total + 1; setTotal(nt);
      if (correct) {
        const nc = correct ? (prev => prev + 1)(0) : 0;
        setCorrect((c) => { onScore(c + 1, nt); return c + 1; });
        setFB("correct");
      } else {
        setFB("wrong");
      }
      setTimeout(() => {
        setFB("idle");
        const next = gIdx + 1; setGIdx(next);
        const ng = GROUPS[next % GROUPS.length];
        setShuffled(shuffle(ng.items.map((it, i) => ({ ...it, id: i }))));
        setPlaced([]);
      }, 1400);
    }
  }

  function removeLastPlaced() {
    if (placed.length === 0 || feedback !== "idle") return;
    const last = placed[placed.length - 1];
    setPlaced((p) => p.slice(0, -1));
    setShuffled((s) => shuffle([...s, last]));
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">
        Tap to order from <span className="text-yellow-300 font-black">smallest → biggest</span>!
      </p>
      <p className="text-white/60 text-xs">{group.label}</p>

      {/* Answer slots */}
      <div className="flex items-end gap-3 min-h-[90px]">
        {group.items.map((_, i) => (
          <div key={i}
            className={`flex flex-col items-center justify-end rounded-xl border-2 border-dashed transition-all
              ${placed[i] ? "border-transparent" : "border-white/30"}`}
            style={{ width: 56, height: 80 }}>
            {placed[i] && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ fontSize: `${placed[i].size * 0.7}rem` }}>
                {placed[i].emoji}
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {/* Pool */}
      <div className="flex gap-4 flex-wrap justify-center min-h-[80px]">
        {shuffled.map((it) => (
          <motion.button key={it.id} onClick={() => tapItem(it)}
            className="flex flex-col items-center"
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.88 }}>
            <span style={{ fontSize: `${it.size * 0.7}rem` }}>{it.emoji}</span>
          </motion.button>
        ))}
      </div>

      {placed.length > 0 && feedback === "idle" && (
        <motion.button onClick={removeLastPlaced}
          className="text-white/60 text-sm underline" whileTap={{ scale: 0.9 }}>
          ← Undo last
        </motion.button>
      )}

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}>🌟 Perfect order!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-xl"    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>Not quite — try again!</motion.p>}
      </AnimatePresence>

      <p className="text-white/60 text-sm">
        Group {(gIdx % GROUPS.length) + 1}/{GROUPS.length} · Score: {correct}/{total}
      </p>
    </div>
  );
}
