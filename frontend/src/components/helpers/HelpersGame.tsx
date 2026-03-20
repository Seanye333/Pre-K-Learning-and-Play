"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HELPERS, type Helper } from "./helpersData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

type Mode = "learn" | "match-tool" | "match-vehicle";

function makeQ(queue: Helper[], idx: number, mode: Mode) {
  const target = queue[idx % queue.length];
  const others = shuffle(queue.filter((_, i) => i !== idx % queue.length)).slice(0, 3);
  return { target, choices: shuffle([target, ...others]) };
}

interface Props { onScore: (c: number, t: number) => void; }

export default function HelpersGame({ onScore }: Props) {
  const [mode, setMode] = useState<Mode>("learn");
  const [selected, setSelected] = useState<Helper | null>(null);
  const [queue]   = useState(() => shuffle(HELPERS));
  const [idx, setIdx]         = useState(0);
  const [q, setQ]             = useState(() => makeQ(shuffle(HELPERS), 0, "match-tool"));
  const [feedback, setFB]     = useState<"idle"|"correct"|"wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total,   setTotal]   = useState(0);

  function handleChoice(chosen: Helper) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (chosen.id === q.target.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => {
      setFB("idle");
      const next = idx + 1; setIdx(next); setQ(makeQ(queue, next, mode));
    }, 1200);
  }

  if (mode === "learn") {
    return (
      <div className="flex flex-col items-center gap-4 p-4 w-full">
        <div className="flex gap-2 mb-1">
          <button onClick={() => setMode("match-tool")}    className="bg-white/30 text-white font-bold px-3 py-1 rounded-full text-xs">🎯 Match Tool</button>
          <button onClick={() => setMode("match-vehicle")} className="bg-white/30 text-white font-bold px-3 py-1 rounded-full text-xs">🚗 Match Vehicle</button>
        </div>
        <p className="text-white font-bold text-sm">Tap a helper to learn about them!</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {HELPERS.map((h) => (
            <motion.button key={h.id} onClick={() => setSelected(h.id === selected?.id ? null : h)}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl font-bold text-sm ${selected?.id === h.id ? "bg-white text-gray-800 ring-2 ring-yellow-300" : "bg-white/20 text-white"}`}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
              <span className="text-4xl">{h.emoji}</span>
              <span className="text-xs">{h.name}</span>
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {selected && (
            <motion.div key={selected.id}
              className={`${selected.color} rounded-2xl p-4 max-w-xs text-center`}
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <p className="font-black text-gray-800 text-lg">{selected.name}</p>
              <p className="text-gray-700 text-sm mt-1">{selected.job}</p>
              <div className="flex justify-center gap-6 mt-2 text-2xl">{selected.toolEmoji} {selected.vehicleEmoji}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const prompt = mode === "match-tool"
    ? { label: "Who uses this tool?", display: `${q.target.toolEmoji} ${q.target.tool}` }
    : { label: "Who rides this vehicle?", display: `${q.target.vehicleEmoji} ${q.target.vehicle}` };

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <div className="flex gap-2">
        <button onClick={() => setMode("learn")}          className="bg-white/30 text-white font-bold px-3 py-1 rounded-full text-xs">📚 Learn</button>
        <button onClick={() => setMode("match-vehicle")}  className={`text-white font-bold px-3 py-1 rounded-full text-xs ${mode==="match-vehicle"?"bg-white/50":"bg-white/20"}`}>🚗 Vehicle</button>
        <button onClick={() => setMode("match-tool")}     className={`text-white font-bold px-3 py-1 rounded-full text-xs ${mode==="match-tool"?"bg-white/50":"bg-white/20"}`}>🔧 Tool</button>
      </div>

      <motion.div key={q.target.id + mode}
        className="bg-white/20 rounded-2xl px-8 py-4 text-center"
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <p className="text-white/70 text-sm font-bold">{prompt.label}</p>
        <p className="text-white font-black text-4xl mt-1">{prompt.display}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {q.choices.map((c) => (
          <motion.button key={c.id} onClick={() => handleChoice(c)}
            className={`flex flex-col items-center gap-1 p-4 rounded-2xl font-bold shadow
              ${feedback !== "idle" && c.id === q.target.id ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && c.id !== q.target.id ? "bg-red-300/40 text-white/60" : ""}
              ${feedback === "idle" ? "bg-white/30 text-white" : ""}`}
            whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.9 }}>
            <span className="text-4xl">{c.emoji}</span>
            <span className="text-xs font-black">{c.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}>🌟 Correct!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg"    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>Try again! 💪</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
