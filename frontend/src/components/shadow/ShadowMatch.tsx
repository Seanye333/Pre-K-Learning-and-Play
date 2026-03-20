"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SHADOW_ITEMS, type ShadowItem } from "./shadowData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

function makeRound(queue: ShadowItem[], idx: number) {
  const target  = queue[idx % queue.length];
  const others  = shuffle(queue.filter((_, i) => i !== idx % queue.length)).slice(0, 3);
  return { target, choices: shuffle([target, ...others]) };
}

export default function ShadowMatch({ onScore }: Props) {
  const [queue]   = useState(() => shuffle(SHADOW_ITEMS));
  const [idx, setIdx]           = useState(0);
  const [feedback, setFB]       = useState<"idle"|"correct"|"wrong">("idle");
  const [correct, setCorrect]   = useState(0);
  const [total,   setTotal]     = useState(0);
  const [round, setRound]       = useState(() => makeRound(shuffle(SHADOW_ITEMS), 0));
  const [revealed, setRevealed] = useState(false);

  function handle(chosen: ShadowItem) {
    if (feedback !== "idle") return;
    const newTotal = total + 1; setTotal(newTotal);
    if (chosen.id === round.target.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, newTotal); setFB("correct");
      setRevealed(true);
    } else {
      setFB("wrong");
    }
    setTimeout(() => {
      setFB("idle"); setRevealed(false);
      const next = idx + 1;
      setIdx(next);
      setRound(makeRound(queue, next));
    }, 1400);
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-bold text-sm">Which one matches the shadow?</p>

      {/* Shadow */}
      <motion.div key={round.target.id}
        className="w-32 h-32 rounded-3xl bg-gray-900/70 flex items-center justify-center shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.span key="revealed" className="text-7xl"
              initial={{ scale: 0 }} animate={{ scale: 1 }}>
              {round.target.emoji}
            </motion.span>
          ) : (
            <motion.span key="shadow" className="text-7xl" style={{ filter: "brightness(0)" }}>
              {round.target.emoji}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {round.choices.map((c) => (
          <motion.button key={c.id} onClick={() => handle(c)}
            className={`flex flex-col items-center gap-1 px-5 py-4 rounded-2xl font-bold shadow
              ${feedback !== "idle" && c.id === round.target.id ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && c.id !== round.target.id ? "bg-red-300/40 text-white/60" : ""}
              ${feedback === "idle" ? "bg-white/30 text-white" : ""}`}
            whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.9 }}>
            <span className="text-5xl">{c.emoji}</span>
            <span className="text-sm font-black">{c.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}>🌟 You matched it!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-xl"    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>Look at the shape! 👀</motion.p>}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
