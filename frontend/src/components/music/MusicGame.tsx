"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INSTRUMENTS, FAMILIES, type Instrument } from "./instrumentData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Learn tab ──────────────────────────────────────────────────────────────
function LearnInstruments() {
  const [selected, setSelected] = useState<Instrument | null>(null);
  const [activeFamily, setActiveFamily] = useState<Instrument["family"] | "all">("all");

  const shown = activeFamily === "all"
    ? INSTRUMENTS
    : INSTRUMENTS.filter((i) => i.family === activeFamily);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Family filter */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button onClick={() => setActiveFamily("all")}
          className={`px-3 py-1 rounded-full text-sm font-bold ${activeFamily === "all" ? "bg-white text-purple-700" : "bg-white/20 text-white"}`}>
          🎵 All
        </button>
        {FAMILIES.map((f) => (
          <button key={f.id} onClick={() => setActiveFamily(f.id)}
            className={`px-3 py-1 rounded-full text-sm font-bold ${activeFamily === f.id ? "bg-white text-purple-700" : "bg-white/20 text-white"}`}>
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {shown.map((inst) => (
          <motion.button key={inst.id} onClick={() => setSelected(inst)}
            className="flex flex-col items-center bg-white/20 rounded-2xl py-4 px-3 gap-1"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>
            <span className="text-5xl">{inst.emoji}</span>
            <span className="text-white font-black text-sm">{inst.name}</span>
            <span className="text-yellow-200 text-xs font-bold">{inst.sound}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}>
            <motion.div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-3 mx-6"
              initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}
              onClick={(e) => e.stopPropagation()}>
              <span className="text-8xl">{selected.emoji}</span>
              <p className="text-purple-700 font-black text-2xl">{selected.name}</p>
              <p className="text-gray-500 text-sm text-center">{selected.fact}</p>
              <p className="text-orange-500 font-black text-xl">{selected.sound}</p>
              <button onClick={() => setSelected(null)}
                className="bg-purple-500 text-white font-bold px-6 py-2 rounded-full">
                Got it! ✓
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sort tab ───────────────────────────────────────────────────────────────
function SortInstruments({ onScore }: Props) {
  const [pool, setPool] = useState(() => shuffle(INSTRUMENTS));
  const [buckets, setBuckets] = useState<Record<Instrument["family"], Instrument[]>>({
    strings: [], wind: [], percussion: [], keys: [],
  });
  const [feedback, setFB] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  if (pool.length === 0 && Object.values(buckets).every((b) => b.length > 0)) {
    // all sorted
  }

  const current = pool[0];

  function place(family: Instrument["family"]) {
    if (!current) return;
    const nt = total + 1; setTotal(nt);
    if (current.family === family) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt);
      setBuckets((b) => ({ ...b, [family]: [...b[family], current] }));
      setPool((p) => p.slice(1));
      setFB("correct");
    } else {
      setFB("wrong");
    }
    setTimeout(() => setFB(null), 900);
  }

  if (!current) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <span className="text-6xl">🎉</span>
        <p className="text-white font-black text-2xl">All sorted!</p>
        <p className="text-white/80 text-lg">Score: {correct}/{total}</p>
        <button onClick={() => { setPool(shuffle(INSTRUMENTS)); setBuckets({ strings: [], wind: [], percussion: [], keys: [] }); setCorrect(0); setTotal(0); }}
          className="bg-white text-purple-700 font-black px-6 py-3 rounded-2xl text-lg">
          Play Again 🔄
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">Which family does this belong to?</p>

      <motion.div key={current.id} className="flex flex-col items-center bg-white/20 rounded-2xl px-8 py-5"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-7xl">{current.emoji}</span>
        <p className="text-white font-black text-xl mt-1">{current.name}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {FAMILIES.map((f) => (
          <motion.button key={f.id} onClick={() => place(f.id)}
            className={`flex flex-col items-center py-4 rounded-2xl font-bold bg-gradient-to-b ${f.color} text-white shadow`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            <span className="text-3xl">{f.emoji}</span>
            <span className="text-sm font-black">{f.label}</span>
            <span className="text-xs opacity-80">{buckets[f.id].length} placed</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 Correct!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Try another family!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total} · {pool.length} left</p>
    </div>
  );
}

// ── Quiz tab ───────────────────────────────────────────────────────────────
function InstrumentQuiz({ onScore }: Props) {
  const [queue] = useState(() => shuffle(INSTRUMENTS));
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const target = queue[idx % queue.length];
  const wrongs = shuffle(INSTRUMENTS.filter((i) => i.id !== target.id)).slice(0, 3);
  const [choices] = useState(() => shuffle([target, ...shuffle(INSTRUMENTS.filter((i) => i.id !== queue[0].id)).slice(0, 3)]));

  // rebuild choices each round via key
  const roundChoices = shuffle([target, ...shuffle(INSTRUMENTS.filter((i) => i.id !== target.id)).slice(0, 3)]);

  function guess(inst: Instrument) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (inst.id === target.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1200);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Which instrument makes this sound?</p>

      <motion.div key={target.id} className="flex flex-col items-center bg-white/20 rounded-2xl px-10 py-5"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-6xl">🎵</span>
        <p className="text-yellow-200 font-black text-3xl mt-1">{target.sound}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {roundChoices.map((inst) => (
          <motion.button key={inst.id} onClick={() => guess(inst)}
            className={`flex flex-col items-center py-4 rounded-2xl font-bold shadow
              ${feedback !== "idle" && inst.id === target.id ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && inst.id !== target.id ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white/30 text-white" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            <span className="text-4xl">{inst.emoji}</span>
            <span className="text-sm font-black">{inst.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {target.name}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Listen again!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Learn", "Sort", "Quiz"] as const;
type Tab = typeof TABS[number];

export default function MusicGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-purple-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "📚 Learn" : t === "Sort" ? "🗂️ Sort" : "🎯 Quiz"}
          </button>
        ))}
      </div>
      {tab === "Learn" && <LearnInstruments />}
      {tab === "Sort"  && <SortInstruments onScore={onScore} />}
      {tab === "Quiz"  && <InstrumentQuiz  onScore={onScore} />}
    </div>
  );
}
