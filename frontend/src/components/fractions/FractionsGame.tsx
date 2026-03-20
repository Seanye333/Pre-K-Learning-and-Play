"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Fraction = "whole" | "half" | "quarter";

interface FractionInfo {
  id: Fraction;
  label: string;
  description: string;
  parts: number;
  filled: number;
  emoji: string;
}

const FRACTIONS: FractionInfo[] = [
  { id: "whole",   label: "Whole",   description: "All of it!",        parts: 1, filled: 1, emoji: "1" },
  { id: "half",    label: "Half",    description: "Split into 2 equal parts — take 1!", parts: 2, filled: 1, emoji: "½" },
  { id: "quarter", label: "Quarter", description: "Split into 4 equal parts — take 1!", parts: 4, filled: 1, emoji: "¼" },
];

const FOODS = [
  { id: "pizza", name: "Pizza", emoji: "🍕", color: "#f97316" },
  { id: "cake",  name: "Cake",  emoji: "🎂", color: "#ec4899" },
  { id: "apple", name: "Apple", emoji: "🍎", color: "#ef4444" },
  { id: "pie",   name: "Pie",   emoji: "🥧", color: "#92400e" },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Visual fraction display (circle SVG) ────────────────────────────────────
function FractionCircle({ fraction, foodColor, size = 120 }: { fraction: FractionInfo; foodColor: string; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  const segments: { d: string; filled: boolean }[] = [];

  for (let i = 0; i < fraction.parts; i++) {
    const startAngle = (i / fraction.parts) * 2 * Math.PI - Math.PI / 2;
    const endAngle   = ((i + 1) / fraction.parts) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = fraction.parts === 1 ? 1 : 0;
    const d = fraction.parts === 1
      ? `M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 -${r * 2} 0`
      : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    segments.push({ d, filled: i < fraction.filled });
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => (
        <path key={i} d={seg.d}
          fill={seg.filled ? foodColor : "#e5e7eb"}
          stroke="white" strokeWidth="2" />
      ))}
    </svg>
  );
}

// ── Learn tab ────────────────────────────────────────────────────────────────
function LearnFractions() {
  const [foodIdx, setFoodIdx] = useState(0);
  const food = FOODS[foodIdx];

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Choose a food and see the fractions!</p>

      <div className="flex gap-2">
        {FOODS.map((f, i) => (
          <button key={f.id} onClick={() => setFoodIdx(i)}
            className={`text-3xl p-2 rounded-2xl ${foodIdx === i ? "bg-white" : "bg-white/20"}`}>
            {f.emoji}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        {FRACTIONS.map((frac) => (
          <motion.div key={frac.id} className="flex flex-col items-center bg-white/20 rounded-2xl py-4 px-2 gap-2"
            initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <FractionCircle fraction={frac} foodColor={food.color} size={80} />
            <p className="text-white font-black text-lg">{frac.emoji}</p>
            <p className="text-white font-black text-sm">{frac.label}</p>
            <p className="text-white/70 text-xs text-center">{frac.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Fraction Quiz ─────────────────────────────────────────────────────────────
function FractionQuiz({ onScore }: Props) {
  const [foodIdx, setFoodIdx] = useState(0);
  const [seq] = useState<Fraction[]>(() => {
    const arr: Fraction[] = [];
    for (let i = 0; i < 18; i++) arr.push(FRACTIONS[Math.floor(Math.random() * 3)].id);
    return arr;
  });
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const targetId = seq[idx % seq.length];
  const target = FRACTIONS.find((f) => f.id === targetId)!;
  const food = FOODS[foodIdx % FOODS.length];
  const choices = shuffle(FRACTIONS);

  function pick(f: FractionInfo) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (f.id === target.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => {
      setFB("idle");
      setIdx((i) => i + 1);
      setFoodIdx((i) => (i + 1) % FOODS.length);
    }, 1100);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Which picture shows <span className="text-yellow-200 font-black">{target.label}</span>?</p>

      <motion.div key={idx} className="flex flex-col items-center bg-white/20 rounded-2xl px-8 py-4 gap-2"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-5xl">{food.emoji}</span>
        <p className="text-white font-black text-3xl">{target.emoji}</p>
        <p className="text-white/70 text-sm">{target.label}</p>
      </motion.div>

      <div className="flex gap-4 justify-center">
        {choices.map((f) => (
          <motion.button key={f.id} onClick={() => pick(f)}
            className={`flex flex-col items-center p-3 rounded-2xl shadow
              ${feedback !== "idle" && f.id === target.id ? "bg-green-400" : ""}
              ${feedback === "wrong" && f.id !== target.id ? "bg-red-300/40 opacity-50" : ""}
              ${feedback === "idle" ? "bg-white/30" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            <FractionCircle fraction={f} foodColor={food.color} size={72} />
            <span className="text-white font-black text-sm mt-1">{f.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {target.label}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Count the pieces!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Share Game — tap the right fraction ─────────────────────────────────────
function ShareGame({ onScore }: Props) {
  type Q = { food: typeof FOODS[0]; fraction: FractionInfo };

  function makeQ(): Q {
    return {
      food: FOODS[Math.floor(Math.random() * FOODS.length)],
      fraction: FRACTIONS[Math.floor(Math.random() * FRACTIONS.length)],
    };
  }

  const [q, setQ] = useState<Q>(() => makeQ());
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  // Show 3 circles with different fractions; player picks the matching one
  const choices = shuffle(FRACTIONS);

  function pick(f: FractionInfo) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (f.id === q.fraction.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setQ(makeQ()); }, 1100);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">
        Tap the circle that shows <span className="text-yellow-200 font-black">{q.fraction.label}</span> of the {q.food.name}!
      </p>

      <motion.div key={`${q.food.id}-${q.fraction.id}`} className="flex flex-col items-center bg-white/20 rounded-2xl px-8 py-4"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-6xl">{q.food.emoji}</span>
        <p className="text-white font-black text-2xl">{q.fraction.emoji} {q.fraction.label}</p>
      </motion.div>

      <div className="flex gap-4 justify-center">
        {choices.map((f) => (
          <motion.button key={f.id} onClick={() => pick(f)}
            className={`flex flex-col items-center p-3 rounded-2xl shadow
              ${feedback !== "idle" && f.id === q.fraction.id ? "bg-green-400" : ""}
              ${feedback === "wrong" && f.id !== q.fraction.id ? "bg-red-300/40 opacity-50" : ""}
              ${feedback === "idle" ? "bg-white/30" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            <FractionCircle fraction={f} foodColor={q.food.color} size={80} />
            <span className="text-white font-black text-sm mt-1">{f.emoji}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 That's {q.fraction.label}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Count the coloured pieces!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Learn", "Name It", "Find It"] as const;
type Tab = typeof TABS[number];

export default function FractionsGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-orange-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "📚 Learn" : t === "Name It" ? "🏷️ Name It" : "🎯 Find It"}
          </button>
        ))}
      </div>
      {tab === "Learn"   && <LearnFractions />}
      {tab === "Name It" && <FractionQuiz onScore={onScore} />}
      {tab === "Find It" && <ShareGame    onScore={onScore} />}
    </div>
  );
}
