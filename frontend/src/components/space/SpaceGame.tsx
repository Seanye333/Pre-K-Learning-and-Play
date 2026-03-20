"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Planet {
  id: string;
  name: string;
  emoji: string;
  order: number;
  color: string;
  size: number; // relative
  fact: string;
  nickname: string;
}

const PLANETS: Planet[] = [
  { id: "mercury", name: "Mercury", emoji: "⚫", order: 1, color: "#9ca3af", size: 0.5, fact: "Mercury is the smallest planet.", nickname: "The Speedy Planet" },
  { id: "venus",   name: "Venus",   emoji: "🟡", order: 2, color: "#fbbf24", size: 0.8, fact: "Venus is the hottest planet!", nickname: "The Bright Planet" },
  { id: "earth",   name: "Earth",   emoji: "🌍", order: 3, color: "#3b82f6", size: 0.9, fact: "Earth is the only planet with life!", nickname: "Our Home" },
  { id: "mars",    name: "Mars",    emoji: "🔴", order: 4, color: "#ef4444", size: 0.7, fact: "Mars is the red planet.", nickname: "The Red Planet" },
  { id: "jupiter", name: "Jupiter", emoji: "🟠", order: 5, color: "#f97316", size: 2.0, fact: "Jupiter is the biggest planet!", nickname: "The Giant" },
  { id: "saturn",  name: "Saturn",  emoji: "🪐", order: 6, color: "#fde68a", size: 1.8, fact: "Saturn has beautiful rings!", nickname: "The Ringed Planet" },
  { id: "uranus",  name: "Uranus",  emoji: "🔵", order: 7, color: "#67e8f9", size: 1.3, fact: "Uranus spins on its side!", nickname: "The Tilted Planet" },
  { id: "neptune", name: "Neptune", emoji: "🫧", order: 8, color: "#3b82f6", size: 1.2, fact: "Neptune has the strongest winds!", nickname: "The Windy Planet" },
];

const SPACE_OBJECTS = [
  { id: "sun",     name: "Sun",      emoji: "☀️",  fact: "The Sun is a giant star at the center of our solar system!" },
  { id: "moon",    name: "Moon",     emoji: "🌙",  fact: "The Moon goes around Earth every 28 days!" },
  { id: "star",    name: "Star",     emoji: "⭐",  fact: "Stars are huge balls of hot glowing gas far away!" },
  { id: "comet",   name: "Comet",    emoji: "☄️",  fact: "Comets are giant snowballs that travel through space!" },
  { id: "rocket",  name: "Rocket",   emoji: "🚀",  fact: "Rockets carry astronauts to space!" },
  { id: "astronaut",name:"Astronaut",emoji: "👨‍🚀", fact: "Astronauts are people who travel to space!" },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Learn solar system ────────────────────────────────────────────────────────
function LearnSpace() {
  const [selected, setSelected] = useState<Planet | null>(null);
  const [selectedObj, setSelectedObj] = useState<typeof SPACE_OBJECTS[0] | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">Our Solar System — tap to learn!</p>

      {/* Sun at center with planets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full justify-center flex-wrap">
        <div className="flex flex-col items-center">
          <span className="text-5xl">☀️</span>
          <span className="text-yellow-200 font-black text-xs">Sun</span>
        </div>
        {PLANETS.map((p) => (
          <motion.button key={p.id} onClick={() => setSelected(p)}
            className="flex flex-col items-center gap-1"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <div className="rounded-full flex items-center justify-center bg-white/10 border-2 border-white/20"
              style={{ width: `${Math.max(32, p.size * 32)}px`, height: `${Math.max(32, p.size * 32)}px`, background: p.color + "33" }}>
              <span style={{ fontSize: `${Math.max(1, p.size * 1)}rem` }}>{p.emoji}</span>
            </div>
            <span className="text-white/80 text-xs font-bold">{p.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Other space objects */}
      <p className="text-white font-bold text-sm">Other Space Things</p>
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
        {SPACE_OBJECTS.map((obj) => (
          <motion.button key={obj.id} onClick={() => setSelectedObj(obj)}
            className="flex flex-col items-center bg-white/10 rounded-2xl py-3 px-2 gap-1"
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
            <span className="text-4xl">{obj.emoji}</span>
            <span className="text-white font-black text-xs">{obj.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}>
            <motion.div className="bg-indigo-900 border border-white/20 rounded-3xl p-8 flex flex-col items-center gap-3 mx-6"
              initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}
              onClick={(e) => e.stopPropagation()}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border-4 border-white/20"
                style={{ background: selected.color + "55" }}>{selected.emoji}</div>
              <p className="text-white font-black text-2xl">{selected.name}</p>
              <p className="text-yellow-300 text-sm">Planet #{selected.order}</p>
              <p className="text-indigo-300 text-xs italic">{selected.nickname}</p>
              <p className="text-white/80 text-sm text-center">{selected.fact}</p>
              <button onClick={() => setSelected(null)}
                className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-full">Awesome! ✓</button>
            </motion.div>
          </motion.div>
        )}
        {selectedObj && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedObj(null)}>
            <motion.div className="bg-indigo-900 border border-white/20 rounded-3xl p-8 flex flex-col items-center gap-3 mx-6"
              initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}
              onClick={(e) => e.stopPropagation()}>
              <span className="text-8xl">{selectedObj.emoji}</span>
              <p className="text-white font-black text-2xl">{selectedObj.name}</p>
              <p className="text-white/80 text-sm text-center">{selectedObj.fact}</p>
              <button onClick={() => setSelectedObj(null)}
                className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-full">Cool! ✓</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Planet order quiz ─────────────────────────────────────────────────────────
function PlanetQuiz({ onScore }: Props) {
  const [seq] = useState<Planet[]>(() => {
    const arr: Planet[] = [];
    for (let i = 0; i < 16; i++) arr.push(PLANETS[Math.floor(Math.random() * PLANETS.length)]);
    return arr;
  });
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const target = seq[idx % seq.length];
  const wrongs = shuffle(PLANETS.filter((p) => p.id !== target.id)).slice(0, 3);
  const roundChoices = shuffle([target, ...wrongs]);

  function pick(p: Planet) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (p.id === target.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1100);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Which planet is this?</p>

      <motion.div key={target.id} className="flex flex-col items-center bg-indigo-900/50 rounded-2xl px-12 py-6 gap-2 border border-white/20"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="w-28 h-28 rounded-full flex items-center justify-center text-6xl border-4 border-white/20"
          style={{ background: target.color + "55" }}>{target.emoji}</div>
        <p className="text-yellow-300 text-sm">Planet #{target.order}</p>
        <p className="text-white/70 text-xs italic">{target.nickname}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {roundChoices.map((p) => (
          <motion.button key={p.id} onClick={() => pick(p)}
            className={`py-4 rounded-2xl font-black text-base shadow
              ${feedback !== "idle" && p.id === target.id ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && p.id !== target.id ? "bg-red-300/30 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white/20 text-white" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            {p.emoji} {p.name}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {target.name}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Look at the colour and size!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Learn", "Quiz"] as const;
type Tab = typeof TABS[number];

export default function SpaceGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-indigo-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "🔭 Explore" : "🎯 Planet Quiz"}
          </button>
        ))}
      </div>
      {tab === "Learn" && <LearnSpace />}
      {tab === "Quiz"  && <PlanetQuiz onScore={onScore} />}
    </div>
  );
}
