"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Tall vs Short ────────────────────────────────────────────────────────────
type CompareType = { a: string; b: string; emojiA: string; emojiB: string; sizeA: number; sizeB: number; category: string };

const HEIGHT_PAIRS: CompareType[] = [
  { a: "Giraffe", b: "Cat",       emojiA: "🦒", emojiB: "🐱", sizeA: 5.0, sizeB: 1.5, category: "height" },
  { a: "Tree",    b: "Flower",    emojiA: "🌳", emojiB: "🌸", sizeA: 5.0, sizeB: 1.2, category: "height" },
  { a: "Elephant",b: "Mouse",     emojiA: "🐘", emojiB: "🐭", sizeA: 4.5, sizeB: 0.8, category: "height" },
  { a: "Bus",     b: "Car",       emojiA: "🚌", emojiB: "🚗", sizeA: 4.0, sizeB: 2.0, category: "height" },
  { a: "Bear",    b: "Rabbit",    emojiA: "🐻", emojiB: "🐰", sizeA: 3.5, sizeB: 1.0, category: "height" },
];

const WEIGHT_PAIRS: CompareType[] = [
  { a: "Elephant", b: "Feather", emojiA: "🐘", emojiB: "🪶", sizeA: 4.0, sizeB: 0.5, category: "weight" },
  { a: "Watermelon",b: "Grape",  emojiA: "🍉", emojiB: "🍇", sizeA: 3.5, sizeB: 0.8, category: "weight" },
  { a: "Rock",    b: "Balloon",   emojiA: "🪨", emojiB: "🎈", sizeA: 3.0, sizeB: 0.4, category: "weight" },
  { a: "Truck",   b: "Pencil",    emojiA: "🚚", emojiB: "✏️",  sizeA: 4.5, sizeB: 0.5, category: "weight" },
  { a: "Pumpkin", b: "Egg",       emojiA: "🎃", emojiB: "🥚", sizeA: 3.5, sizeB: 0.6, category: "weight" },
];

const CAPACITY_PAIRS: CompareType[] = [
  { a: "Bucket",   b: "Spoon",  emojiA: "🪣", emojiB: "🥄", sizeA: 4.0, sizeB: 0.5, category: "capacity" },
  { a: "Swimming Pool",b:"Cup", emojiA: "🏊", emojiB: "☕", sizeA: 5.0, sizeB: 0.8, category: "capacity" },
  { a: "Bathtub",  b: "Glass",  emojiA: "🛁", emojiB: "🥛", sizeA: 4.5, sizeB: 1.0, category: "capacity" },
  { a: "Pot",      b: "Bottle", emojiA: "🍲", emojiB: "🍾", sizeA: 3.0, sizeB: 1.2, category: "capacity" },
];

type Mode = "height" | "weight" | "capacity";

const MODE_CONFIG: Record<Mode, { label: string; emoji: string; question: string; bigger: string; pairs: CompareType[]; color: string }> = {
  height:   { label: "Tall/Short",  emoji: "📏", question: "Which is TALLER?",  bigger: "taller",  pairs: HEIGHT_PAIRS,   color: "from-blue-500 to-indigo-700"   },
  weight:   { label: "Heavy/Light", emoji: "⚖️",  question: "Which is HEAVIER?", bigger: "heavier", pairs: WEIGHT_PAIRS,   color: "from-amber-500 to-orange-700"  },
  capacity: { label: "More/Less",   emoji: "🫙", question: "Which holds MORE?",  bigger: "more",    pairs: CAPACITY_PAIRS, color: "from-teal-500 to-cyan-700"     },
};

// ── Compare Game ──────────────────────────────────────────────────────────────
function CompareGame({ onScore }: Props) {
  const [mode, setMode] = useState<Mode>("height");
  const [pairIdx, setPairIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const cfg = MODE_CONFIG[mode];
  const pairs = shuffle(cfg.pairs);
  const pair = pairs[pairIdx % pairs.length];
  const [flipped] = useState(() => Math.random() < 0.5); // randomise which side has the bigger item

  const left  = flipped ? pair : { ...pair, a: pair.b, b: pair.a, emojiA: pair.emojiB, emojiB: pair.emojiA, sizeA: pair.sizeB, sizeB: pair.sizeA };
  const answer = left.sizeA > left.sizeB ? "left" : "right";

  function pick(side: "left" | "right") {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (side === answer) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setPairIdx((i) => i + 1); }, 1000);
  }

  function changeMode(m: Mode) { setMode(m); setPairIdx(0); setFB("idle"); }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="flex gap-2 flex-wrap justify-center">
        {(Object.keys(MODE_CONFIG) as Mode[]).map((m) => (
          <button key={m} onClick={() => changeMode(m)}
            className={`px-3 py-1 rounded-full font-black text-sm ${mode === m ? "bg-white text-teal-700" : "bg-white/20 text-white"}`}>
            {MODE_CONFIG[m].emoji} {MODE_CONFIG[m].label}
          </button>
        ))}
      </div>

      <p className="text-white font-bold text-sm">{cfg.question}</p>

      <div className="flex gap-6 items-end">
        {/* Left */}
        <motion.button onClick={() => pick("left")}
          className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl shadow
            ${feedback !== "idle" && answer === "left" ? "bg-green-400" : ""}
            ${feedback === "wrong" && answer !== "left" ? "bg-red-300/40 opacity-60" : ""}
            ${feedback === "idle" ? "bg-white/20" : ""}`}
          style={{ height: `${Math.max(80, left.sizeA * 28)}px`, justifyContent: "flex-end" }}
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
          <span style={{ fontSize: `${Math.max(2, left.sizeA * 0.7)}rem` }}>{left.emojiA}</span>
          <span className="text-white font-black text-xs">{left.a}</span>
        </motion.button>

        {/* Right */}
        <motion.button onClick={() => pick("right")}
          className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl shadow
            ${feedback !== "idle" && answer === "right" ? "bg-green-400" : ""}
            ${feedback === "wrong" && answer !== "right" ? "bg-red-300/40 opacity-60" : ""}
            ${feedback === "idle" ? "bg-white/20" : ""}`}
          style={{ height: `${Math.max(80, left.sizeB * 28)}px`, justifyContent: "flex-end" }}
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
          <span style={{ fontSize: `${Math.max(1.5, left.sizeB * 0.7)}rem` }}>{left.emojiB}</span>
          <span className="text-white font-black text-xs">{left.b}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {answer === "left" ? left.a : left.b} is {cfg.bigger}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Look at the sizes!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Ruler counting (how many units long?) ────────────────────────────────────
function RulerGame({ onScore }: Props) {
  const MAX = 8;
  function makeQ() {
    const len = 2 + Math.floor(Math.random() * (MAX - 1));
    const choices = shuffle([...new Set([len, len - 1, len + 1, len + 2])].filter((v) => v > 0 && v <= MAX)).slice(0, 4);
    return { len, choices };
  }

  const [q, setQ] = useState(() => makeQ());
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  function pick(n: number) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (n === q.len) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setQ(makeQ()); }, 1000);
  }

  const EMOJIS = ["🐛", "🐍", "🚂", "🌈", "🪱", "🦎"];
  const [emojiIdx] = useState(() => Math.floor(Math.random() * EMOJIS.length));

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">How many units long?</p>

      <div className="bg-white/20 rounded-2xl p-4 flex flex-col gap-2 w-full max-w-sm">
        {/* Ruler object */}
        <div className="flex">
          {Array.from({ length: q.len }).map((_, i) => (
            <div key={i} className="w-10 h-10 border-2 border-white/50 flex items-center justify-center text-xl bg-white/10">
              {i === 0 ? EMOJIS[emojiIdx] : ""}
            </div>
          ))}
        </div>
        {/* Ruler ticks */}
        <div className="flex">
          {Array.from({ length: q.len + 1 }).map((_, i) => (
            <div key={i} className="w-10 flex flex-col items-center">
              <div className="h-2 w-0.5 bg-white/60" />
              <span className="text-white/60 text-xs">{i}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {q.choices.map((n) => (
          <motion.button key={n} onClick={() => pick(n)}
            className={`py-5 rounded-2xl font-black text-2xl shadow
              ${feedback !== "idle" && n === q.len ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && n !== q.len ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white text-teal-700" : ""}`}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
            {n}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {q.len} units!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Count each box!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Compare", "Ruler"] as const;
type Tab = typeof TABS[number];

export default function MeasureGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Compare");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-teal-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Compare" ? "⚖️ Compare" : "📏 Ruler"}
          </button>
        ))}
      </div>
      {tab === "Compare" && <CompareGame onScore={onScore} />}
      {tab === "Ruler"   && <RulerGame   onScore={onScore} />}
    </div>
  );
}
