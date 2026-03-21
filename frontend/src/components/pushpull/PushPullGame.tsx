"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS = [
  { id: "cart",    emoji: "🛒", name: "Shopping Cart", type: "push" as const, fun: "You push a cart to move it forward!" },
  { id: "swing",   emoji: "🪃", name: "Swing",         type: "push" as const, fun: "You push a swing to make it go!" },
  { id: "door",    emoji: "🚪", name: "Door Open",     type: "push" as const, fun: "Push the door and it swings open!" },
  { id: "button",  emoji: "🔘", name: "Button",        type: "push" as const, fun: "You push a button to press it!" },
  { id: "toycar",  emoji: "🚗", name: "Toy Car",       type: "push" as const, fun: "Push the toy car and it zooms!" },
  { id: "ball",    emoji: "⚽", name: "Ball",           type: "push" as const, fun: "Push a ball to kick it away!" },
  { id: "stroller",emoji: "👶", name: "Stroller",      type: "push" as const, fun: "Grown-ups push the stroller!" },
  { id: "key",     emoji: "⌨️", name: "Keyboard Key",  type: "push" as const, fun: "Your fingers push the keys!" },
  { id: "drawer",  emoji: "🗄️", name: "Drawer",        type: "pull" as const, fun: "Pull the drawer to open it!" },
  { id: "sled",    emoji: "🛷", name: "Sled",           type: "pull" as const, fun: "Pull the sled up the snowy hill!" },
  { id: "leash",   emoji: "🐕", name: "Dog on Leash",  type: "pull" as const, fun: "Your dog pulls on its leash!" },
  { id: "wagon",   emoji: "🪣", name: "Wagon",          type: "pull" as const, fun: "Pull the wagon to carry things!" },
  { id: "zipper",  emoji: "🧥", name: "Zipper",        type: "pull" as const, fun: "Pull the zipper to close your coat!" },
  { id: "lever",   emoji: "🕹️", name: "Lever",          type: "pull" as const, fun: "Pull the lever to make it work!" },
  { id: "curtain", emoji: "🏠", name: "Curtain",       type: "pull" as const, fun: "Pull the curtain to close it!" },
  { id: "rope",    emoji: "🪢", name: "Rope",           type: "pull" as const, fun: "Pull the rope in tug of war!" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

export default function PushPullGame({ onScore }: Props) {
  const [queue]   = useState(() => shuffle(ITEMS));
  const [idx, setIdx]     = useState(0);
  const [fb, setFB]       = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal]     = useState(0);
  const [done, setDone]       = useState(false);

  const item = queue[idx % queue.length];
  const progress = idx >= queue.length ? 100 : Math.round((idx / queue.length) * 100);

  function answer(choice: "push" | "pull") {
    if (fb !== "idle") return;
    const nt = total + 1;
    setTotal(nt);
    if (choice === item.type) {
      const nc = correct + 1;
      setCorrect(nc);
      onScore(nc, nt);
      setFB("correct");
    } else {
      setFB("wrong");
    }
    setTimeout(() => {
      setFB("idle");
      if (idx + 1 >= queue.length) {
        setDone(true);
      } else {
        setIdx((i) => i + 1);
      }
    }, 1400);
  }

  function restart() {
    setIdx(0);
    setCorrect(0);
    setTotal(0);
    setFB("idle");
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 p-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <p className="text-6xl mb-3">🎉</p>
          <p className="text-white font-black text-3xl">All Done!</p>
          <p className="text-white/80 text-xl mt-2">You got <span className="text-yellow-300 font-black">{correct}</span> out of <span className="font-black">{queue.length}</span>!</p>
        </motion.div>
        <motion.button
          onClick={restart}
          className="bg-white text-orange-600 font-black text-xl px-10 py-4 rounded-2xl shadow-lg"
          whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.9 }}>
          Play Again! 🔄
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Progress */}
      <div className="w-full max-w-xs bg-white/20 rounded-full h-3">
        <div className="bg-yellow-300 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-white/70 text-xs font-bold">{idx + 1} / {queue.length}</p>

      {/* Item card */}
      <AnimatePresence mode="wait">
        <motion.div key={item.id}
          initial={{ scale: 0.7, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 20 }}
          className="flex flex-col items-center gap-2 bg-white/20 rounded-3xl px-10 py-6 shadow-xl">
          <span className="text-8xl leading-none">{item.emoji}</span>
          <p className="text-white font-black text-2xl text-center">{item.name}</p>
        </motion.div>
      </AnimatePresence>

      {/* Question */}
      <p className="text-white font-bold text-lg">Do you <span className="text-yellow-200 font-black">push</span> or <span className="text-cyan-200 font-black">pull</span> this?</p>

      {/* Buttons */}
      <div className="flex gap-5">
        <motion.button
          onClick={() => answer("push")}
          disabled={fb !== "idle"}
          className="flex flex-col items-center gap-1 bg-orange-400/90 text-white font-black px-8 py-5 rounded-2xl shadow-lg text-xl disabled:opacity-50"
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}>
          <span className="text-4xl">➡️</span>
          PUSH
        </motion.button>
        <motion.button
          onClick={() => answer("pull")}
          disabled={fb !== "idle"}
          className="flex flex-col items-center gap-1 bg-cyan-500/90 text-white font-black px-8 py-5 rounded-2xl shadow-lg text-xl disabled:opacity-50"
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}>
          <span className="text-4xl">⬅️</span>
          PULL
        </motion.button>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {fb !== "idle" && (
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            className={`rounded-2xl px-6 py-4 text-center max-w-xs shadow-lg ${fb === "correct" ? "bg-green-400/90" : "bg-red-400/80"}`}>
            <p className="text-white font-black text-xl">
              {fb === "correct" ? "🌟 That's right!" : `❌ It's a ${item.type.toUpperCase()}!`}
            </p>
            <p className="text-white/90 text-sm mt-1">{item.fun}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-sm font-bold">Score: {correct}/{total}</p>
    </div>
  );
}
