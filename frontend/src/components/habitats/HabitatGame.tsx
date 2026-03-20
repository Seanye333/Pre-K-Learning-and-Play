"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HABITATS, HABITAT_ANIMALS, type HabitatAnimal } from "./habitatData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Learn tab ────────────────────────────────────────────────────────────────
function LearnHabitats() {
  const [activeHabitat, setActiveHabitat] = useState<HabitatAnimal["habitat"]>("ocean");
  const [selected, setSelected] = useState<HabitatAnimal | null>(null);
  const habitat = HABITATS.find((h) => h.id === activeHabitat)!;
  const animals = HABITAT_ANIMALS.filter((a) => a.habitat === activeHabitat);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="flex gap-2 flex-wrap justify-center">
        {HABITATS.map((h) => (
          <button key={h.id} onClick={() => setActiveHabitat(h.id)}
            className={`px-3 py-1 rounded-full font-black text-sm ${activeHabitat === h.id ? "bg-white text-green-700" : "bg-white/20 text-white"}`}>
            {h.emoji} {h.name}
          </button>
        ))}
      </div>

      <div className={`w-full max-w-sm rounded-2xl bg-gradient-to-b ${habitat.color} p-4 text-center`}>
        <span className="text-5xl">{habitat.emoji}</span>
        <p className="text-white font-black text-lg mt-1">{habitat.name}</p>
        <p className="text-white/80 text-xs">{habitat.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {animals.map((a) => (
          <motion.button key={a.id} onClick={() => setSelected(a)}
            className="flex items-center gap-2 bg-white/20 rounded-2xl px-3 py-3"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>
            <span className="text-4xl">{a.emoji}</span>
            <span className="text-white font-black text-sm">{a.name}</span>
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
              <p className="text-gray-500 text-sm text-center">{selected.fact}</p>
              <button onClick={() => setSelected(null)}
                className="bg-green-500 text-white font-bold px-6 py-2 rounded-full">Cool! ✓</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sort animals into habitats ────────────────────────────────────────────────
function SortHabitats({ onScore }: Props) {
  const [pool, setPool] = useState(() => shuffle(HABITAT_ANIMALS));
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [sorted, setSorted] = useState(0);

  const current = pool[0];

  function place(habitatId: HabitatAnimal["habitat"]) {
    if (!current || feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (current.habitat === habitatId) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
      setPool((p) => p.slice(1)); setSorted((s) => s + 1);
    } else { setFB("wrong"); }
    setTimeout(() => setFB("idle"), 900);
  }

  if (!current) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <span className="text-6xl">🎉</span>
        <p className="text-white font-black text-2xl">All sorted!</p>
        <p className="text-white/80">Score: {correct}/{total}</p>
        <button onClick={() => { setPool(shuffle(HABITAT_ANIMALS)); setCorrect(0); setTotal(0); setSorted(0); }}
          className="bg-white text-green-700 font-black px-6 py-3 rounded-2xl text-lg">
          Play Again 🔄
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">Where does this animal live?</p>

      <motion.div key={current.id} className="flex flex-col items-center bg-white/20 rounded-2xl px-10 py-5"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-7xl">{current.emoji}</span>
        <p className="text-white font-black text-xl mt-1">{current.name}</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
        {HABITATS.map((h) => (
          <motion.button key={h.id} onClick={() => place(h.id)}
            className={`flex flex-col items-center py-3 rounded-2xl font-bold bg-gradient-to-b ${h.color} text-white shadow text-xs`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            <span className="text-2xl">{h.emoji}</span>
            <span className="font-black">{h.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 Correct!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Think about where it lives!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total} · {pool.length} left</p>
    </div>
  );
}

// ── Quiz ─────────────────────────────────────────────────────────────────────
function HabitatQuiz({ onScore }: Props) {
  const [queue] = useState(() => shuffle(HABITAT_ANIMALS));
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const target = queue[idx % queue.length];
  const correctHabitat = HABITATS.find((h) => h.id === target.habitat)!;
  const wrongHabitats = shuffle(HABITATS.filter((h) => h.id !== target.habitat)).slice(0, 3);
  const roundChoices = shuffle([correctHabitat, ...wrongHabitats]);

  function pick(h: typeof HABITATS[0]) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (h.id === target.habitat) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1100);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Where does this animal live?</p>

      <motion.div key={target.id} className="flex flex-col items-center bg-white/20 rounded-2xl px-10 py-5"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-7xl">{target.emoji}</span>
        <p className="text-white font-black text-xl mt-1">{target.name}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {roundChoices.map((h) => (
          <motion.button key={h.id} onClick={() => pick(h)}
            className={`flex flex-col items-center py-4 rounded-2xl font-bold shadow text-white
              ${feedback !== "idle" && h.id === target.habitat ? `bg-gradient-to-b ${h.color}` : ""}
              ${feedback === "wrong" && h.id !== target.habitat ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? `bg-gradient-to-b ${h.color}` : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            <span className="text-4xl">{h.emoji}</span>
            <span className="font-black">{h.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {correctHabitat.name}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Think again!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Learn", "Sort", "Quiz"] as const;
type Tab = typeof TABS[number];

export default function HabitatGame({ onScore }: Props) {
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
      {tab === "Learn" && <LearnHabitats />}
      {tab === "Sort"  && <SortHabitats onScore={onScore} />}
      {tab === "Quiz"  && <HabitatQuiz  onScore={onScore} />}
    </div>
  );
}
