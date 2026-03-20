"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Dir = "left" | "right" | "up" | "down";

const DIR_INFO: Record<Dir, { emoji: string; label: string; arrow: string; color: string }> = {
  left:  { emoji: "⬅️",  label: "Left",  arrow: "←", color: "bg-blue-400"   },
  right: { emoji: "➡️",  label: "Right", arrow: "→", color: "bg-orange-400" },
  up:    { emoji: "⬆️",  label: "Up",    arrow: "↑", color: "bg-green-400"  },
  down:  { emoji: "⬇️",  label: "Down",  arrow: "↓", color: "bg-rose-400"   },
};

const ALL_DIRS: Dir[] = ["left", "right", "up", "down"];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Learn mode ──────────────────────────────────────────────────────────────
function LearnDirections() {
  const [active, setActive] = useState<Dir | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-bold text-sm">Tap each arrow to learn the direction!</p>

      {/* Compass layout */}
      <div className="relative w-48 h-48">
        {/* Up */}
        <motion.button onClick={() => setActive("up")}
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl ${active === "up" ? "bg-green-400" : "bg-white/30"} text-white font-black text-3xl flex items-center justify-center`}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>↑</motion.button>
        {/* Down */}
        <motion.button onClick={() => setActive("down")}
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl ${active === "down" ? "bg-rose-400" : "bg-white/30"} text-white font-black text-3xl flex items-center justify-center`}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>↓</motion.button>
        {/* Left */}
        <motion.button onClick={() => setActive("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl ${active === "left" ? "bg-blue-400" : "bg-white/30"} text-white font-black text-3xl flex items-center justify-center`}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>←</motion.button>
        {/* Right */}
        <motion.button onClick={() => setActive("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl ${active === "right" ? "bg-orange-400" : "bg-white/30"} text-white font-black text-3xl flex items-center justify-center`}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>→</motion.button>
        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-2xl">🌟</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div key={active}
            className={`flex flex-col items-center gap-2 px-8 py-4 rounded-2xl ${DIR_INFO[active].color} text-white`}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
            <span className="text-6xl">{DIR_INFO[active].emoji}</span>
            <p className="font-black text-2xl">{DIR_INFO[active].label}!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {ALL_DIRS.map((d) => (
          <div key={d} className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20`}>
            <span className="text-2xl">{DIR_INFO[d].arrow}</span>
            <span className="text-white font-black">{DIR_INFO[d].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Follow the arrow quiz ───────────────────────────────────────────────────
function ArrowQuiz({ onScore }: Props) {
  const [seq] = useState<Dir[]>(() => Array.from({ length: 20 }, () => ALL_DIRS[Math.floor(Math.random() * 4)]));
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const target = seq[idx % seq.length];

  function tap(dir: Dir) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (dir === target) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 900);
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-bold text-sm">Tap the button that matches this arrow!</p>

      {/* Show the target direction as a big arrow */}
      <motion.div key={`${idx}`}
        className="flex flex-col items-center bg-white/20 rounded-3xl px-12 py-6"
        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-8xl">{DIR_INFO[target].emoji}</span>
        <p className="text-white/60 text-sm mt-2">Which way?</p>
      </motion.div>

      {/* 4 direction buttons */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {ALL_DIRS.map((d) => (
          <motion.button key={d} onClick={() => tap(d)}
            className={`flex flex-col items-center py-5 rounded-2xl font-black shadow text-white
              ${feedback !== "idle" && d === target ? "bg-green-400" : ""}
              ${feedback === "wrong" && d !== target ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? DIR_INFO[d].color : ""}`}
            whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.9 }}>
            <span className="text-4xl">{DIR_INFO[d].arrow}</span>
            <span className="text-sm">{DIR_INFO[d].label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {DIR_INFO[target].label}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Look at the arrow!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Move the character game ─────────────────────────────────────────────────
type Cell = { row: number; col: number };

function MoveGame({ onScore }: Props) {
  const GRID = 5;
  const [pos, setPos] = useState<Cell>({ row: 2, col: 2 });
  const [target, setTarget] = useState<Cell>(() => ({ row: 0, col: 4 }));
  const [instruction, setInstruction] = useState<Dir>(() => ALL_DIRS[Math.floor(Math.random() * 4)]);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const DELTA: Record<Dir, Cell> = {
    up:    { row: -1, col:  0 },
    down:  { row:  1, col:  0 },
    left:  { row:  0, col: -1 },
    right: { row:  0, col:  1 },
  };

  function randomTarget(curPos: Cell): Cell {
    let t: Cell;
    do { t = { row: Math.floor(Math.random() * GRID), col: Math.floor(Math.random() * GRID) }; }
    while (t.row === curPos.row && t.col === curPos.col);
    return t;
  }

  function tap(dir: Dir) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (dir === instruction) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
      const d = DELTA[dir];
      const newPos = {
        row: Math.max(0, Math.min(GRID - 1, pos.row + d.row)),
        col: Math.max(0, Math.min(GRID - 1, pos.col + d.col)),
      };
      setPos(newPos);
      setTimeout(() => {
        setFB("idle");
        setInstruction(ALL_DIRS[Math.floor(Math.random() * 4)]);
        if (newPos.row === target.row && newPos.col === target.col) {
          setTarget(randomTarget(newPos));
        }
      }, 900);
    } else {
      setFB("wrong");
      setTimeout(() => setFB("idle"), 800);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">
        Move the 🐥 — tap <span className="text-yellow-200 font-black">{DIR_INFO[instruction].label} {DIR_INFO[instruction].arrow}</span>
      </p>

      {/* Grid */}
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}>
        {Array.from({ length: GRID }).map((_, row) =>
          Array.from({ length: GRID }).map((_, col) => {
            const isPlayer = pos.row === row && pos.col === col;
            const isStar   = target.row === row && target.col === col;
            return (
              <div key={`${row}-${col}`}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  ${isPlayer ? "bg-yellow-300" : isStar ? "bg-pink-300/50" : "bg-white/10"}`}>
                {isPlayer ? "🐥" : isStar ? "⭐" : ""}
              </div>
            );
          })
        )}
      </div>

      {/* Arrow buttons */}
      <div className="flex flex-col items-center gap-1">
        <motion.button onClick={() => tap("up")}
          className={`w-16 h-16 rounded-2xl font-black text-3xl text-white flex items-center justify-center
            ${feedback !== "idle" && "up" === instruction ? "bg-green-400" : "bg-white/30"}`}
          whileTap={{ scale: 0.88 }}>↑</motion.button>
        <div className="flex gap-1">
          <motion.button onClick={() => tap("left")}
            className={`w-16 h-16 rounded-2xl font-black text-3xl text-white flex items-center justify-center
              ${feedback !== "idle" && "left" === instruction ? "bg-green-400" : "bg-white/30"}`}
            whileTap={{ scale: 0.88 }}>←</motion.button>
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">🐥</div>
          <motion.button onClick={() => tap("right")}
            className={`w-16 h-16 rounded-2xl font-black text-3xl text-white flex items-center justify-center
              ${feedback !== "idle" && "right" === instruction ? "bg-green-400" : "bg-white/30"}`}
            whileTap={{ scale: 0.88 }}>→</motion.button>
        </div>
        <motion.button onClick={() => tap("down")}
          className={`w-16 h-16 rounded-2xl font-black text-3xl text-white flex items-center justify-center
            ${feedback !== "idle" && "down" === instruction ? "bg-green-400" : "bg-white/30"}`}
          whileTap={{ scale: 0.88 }}>↓</motion.button>
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {DIR_INFO[instruction].label}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Wrong way!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Learn", "Quiz", "Move"] as const;
type Tab = typeof TABS[number];

export default function DirectionsGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-indigo-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "📚 Learn" : t === "Quiz" ? "🎯 Quiz" : "🕹️ Move"}
          </button>
        ))}
      </div>
      {tab === "Learn" && <LearnDirections />}
      {tab === "Quiz"  && <ArrowQuiz   onScore={onScore} />}
      {tab === "Move"  && <MoveGame    onScore={onScore} />}
    </div>
  );
}
