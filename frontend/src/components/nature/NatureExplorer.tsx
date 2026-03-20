"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NATURE_ITEMS, type NatureItem } from "./natureData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Learn tab ───────────────────────────────────────────────────────────────
function LearnNature() {
  const [tab, setTab] = useState<"living" | "nonliving">("living");
  const [selected, setSelected] = useState<NatureItem | null>(null);
  const shown = NATURE_ITEMS.filter((n) => n.living === (tab === "living"));

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="flex gap-2">
        <button onClick={() => setTab("living")}
          className={`px-4 py-2 rounded-full font-black text-sm ${tab === "living" ? "bg-green-400 text-white" : "bg-white/20 text-white"}`}>
          🌱 Living
        </button>
        <button onClick={() => setTab("nonliving")}
          className={`px-4 py-2 rounded-full font-black text-sm ${tab === "nonliving" ? "bg-gray-400 text-white" : "bg-white/20 text-white"}`}>
          🪨 Non-Living
        </button>
      </div>

      <p className="text-white/80 text-xs text-center">
        {tab === "living"
          ? "Living things grow, eat, and breathe!"
          : "Non-living things do not grow or breathe."}
      </p>

      <div className="grid grid-cols-3 gap-3">
        {shown.map((item) => (
          <motion.button key={item.id} onClick={() => setSelected(item)}
            className="flex flex-col items-center bg-white/20 rounded-2xl py-3 px-2 gap-1"
            whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.92 }}>
            <span className="text-4xl">{item.emoji}</span>
            <span className="text-white font-black text-xs">{item.name}</span>
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
              <p className="text-green-700 font-black text-2xl">{selected.name}</p>
              <div className={`px-4 py-1 rounded-full font-bold text-sm ${selected.living ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {selected.living ? "🌱 Living" : "🪨 Non-Living"}
              </div>
              <p className="text-gray-500 text-sm text-center">{selected.fact}</p>
              <button onClick={() => setSelected(null)}
                className="bg-green-500 text-white font-bold px-6 py-2 rounded-full">
                Cool! ✓
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sort tab ────────────────────────────────────────────────────────────────
function SortNature({ onScore }: Props) {
  const [queue, setQueue] = useState(() => shuffle(NATURE_ITEMS));
  const [living, setLiving] = useState<NatureItem[]>([]);
  const [nonliving, setNonliving] = useState<NatureItem[]>([]);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const current = queue[0];

  function place(isLiving: boolean) {
    if (!current || feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (current.living === isLiving) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
      if (isLiving) setLiving((l) => [...l, current]);
      else setNonliving((l) => [...l, current]);
      setQueue((q) => q.slice(1));
    } else {
      setFB("wrong");
    }
    setTimeout(() => setFB("idle"), 900);
  }

  if (!current) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <span className="text-6xl">🎉</span>
        <p className="text-white font-black text-2xl">You sorted everything!</p>
        <p className="text-white/80">Living: {living.length} · Non-Living: {nonliving.length}</p>
        <p className="text-white/80">Score: {correct}/{total}</p>
        <button onClick={() => { setQueue(shuffle(NATURE_ITEMS)); setLiving([]); setNonliving([]); setCorrect(0); setTotal(0); }}
          className="bg-white text-green-700 font-black px-6 py-3 rounded-2xl text-lg">
          Play Again 🔄
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Is this living or non-living?</p>

      <motion.div key={current.id} className="flex flex-col items-center bg-white/20 rounded-2xl px-10 py-5"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-7xl">{current.emoji}</span>
        <p className="text-white font-black text-xl mt-2">{current.name}</p>
      </motion.div>

      <div className="flex gap-4">
        <motion.button onClick={() => place(true)}
          className="flex flex-col items-center bg-green-500 text-white font-black rounded-2xl px-8 py-5 shadow-lg"
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
          <span className="text-4xl">🌱</span>
          <span>Living</span>
          <span className="text-xs opacity-80">{living.length} sorted</span>
        </motion.button>
        <motion.button onClick={() => place(false)}
          className="flex flex-col items-center bg-gray-500 text-white font-black rounded-2xl px-8 py-5 shadow-lg"
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
          <span className="text-4xl">🪨</span>
          <span>Non-Living</span>
          <span className="text-xs opacity-80">{nonliving.length} sorted</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 Correct!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Think again!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total} · {queue.length} left</p>
    </div>
  );
}

// ── Quiz tab ────────────────────────────────────────────────────────────────
function NatureQuiz({ onScore }: Props) {
  const [queue] = useState(() => shuffle(NATURE_ITEMS));
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const target = queue[idx % queue.length];
  const wrongs = shuffle(NATURE_ITEMS.filter((n) => n.id !== target.id)).slice(0, 3);
  const roundChoices = shuffle([target, ...wrongs]);

  function guess(item: NatureItem) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (item.id === target.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1200);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">What is this called?</p>

      <motion.div key={target.id} className="flex flex-col items-center bg-white/20 rounded-2xl px-10 py-5"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-7xl">{target.emoji}</span>
        <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${target.living ? "bg-green-400/40 text-green-200" : "bg-gray-400/40 text-gray-200"}`}>
          {target.living ? "🌱 Living" : "🪨 Non-Living"}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {roundChoices.map((item) => (
          <motion.button key={item.id} onClick={() => guess(item)}
            className={`flex flex-col items-center py-4 rounded-2xl font-bold shadow
              ${feedback !== "idle" && item.id === target.id ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && item.id !== target.id ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white/30 text-white" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            <span className="text-4xl">{item.emoji}</span>
            <span className="text-sm font-black">{item.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {target.name}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Look carefully!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Learn", "Sort", "Quiz"] as const;
type Tab = typeof TABS[number];

export default function NatureExplorer({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-green-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "📚 Learn" : t === "Sort" ? "🗂️ Sort" : "🎯 Quiz"}
          </button>
        ))}
      </div>
      {tab === "Learn" && <LearnNature />}
      {tab === "Sort"  && <SortNature onScore={onScore} />}
      {tab === "Quiz"  && <NatureQuiz onScore={onScore} />}
    </div>
  );
}
