"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onScore: (c: number, t: number) => void;
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const PAIRS = [
  { a: "rain", aEmoji: "🌧️", b: "bow", bEmoji: "🌈", compound: "rainbow" },
  { a: "sun", aEmoji: "☀️", b: "flower", bEmoji: "🌸", compound: "sunflower" },
  { a: "foot", aEmoji: "🦶", b: "ball", bEmoji: "⚽", compound: "football" },
  { a: "snow", aEmoji: "❄️", b: "man", bEmoji: "⛄", compound: "snowman" },
  { a: "sea", aEmoji: "🌊", b: "horse", bEmoji: "🐴", compound: "seahorse" },
  { a: "fire", aEmoji: "🔥", b: "truck", bEmoji: "🚒", compound: "firetruck" },
  { a: "butter", aEmoji: "🧈", b: "fly", bEmoji: "🦋", compound: "butterfly" },
  { a: "rain", aEmoji: "🌧️", b: "coat", bEmoji: "🧥", compound: "raincoat" },
  { a: "tooth", aEmoji: "🦷", b: "brush", bEmoji: "🪥", compound: "toothbrush" },
  { a: "door", aEmoji: "🚪", b: "bell", bEmoji: "🔔", compound: "doorbell" },
];

type Mode = "combine" | "build";

export default function CompoundGame({ onScore }: Props) {
  const [mode, setMode] = useState<Mode>("combine");
  const [queue] = useState(() => shuffle(PAIRS));
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const current = queue[qIdx % queue.length];

  const buildChoices = () => {
    const wrong = shuffle(PAIRS.filter((p) => p.compound !== current.compound)).slice(0, 3);
    return shuffle([current, ...wrong]);
  };

  const buildBuildChoices = (): string[] => {
    const correct = current.b;
    const wrong = shuffle(PAIRS.filter((p) => p.b !== current.b)).slice(0, 3).map((p) => p.b);
    return shuffle([correct, ...wrong]);
  };

  const [combineChoices] = useState(() => buildChoices());
  const [buildOptions] = useState(() => buildBuildChoices());

  const [combineQueue] = useState(() =>
    queue.map((item) => {
      const wrong = shuffle(PAIRS.filter((p) => p.compound !== item.compound)).slice(0, 3);
      return { item, choices: shuffle([item, ...wrong]) };
    })
  );

  const [buildQueue] = useState(() =>
    queue.map((item) => {
      const opts = shuffle(PAIRS.filter((p) => p.b !== item.b)).slice(0, 3).map((p) => p.b);
      return { item, options: shuffle([item.b, ...opts]) };
    })
  );

  const ci = qIdx % combineQueue.length;
  const bi = qIdx % buildQueue.length;

  const handleCombine = (compound: string) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (compound === current.compound) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(() => { setQIdx((i) => i + 1); setFeedback("idle"); }, 1200);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 900);
    }
  };

  const handleBuild = (part: string) => {
    if (feedback !== "idle") return;
    const bItem = buildQueue[bi].item;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (part === bItem.b) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(() => { setQIdx((i) => i + 1); setFeedback("idle"); }, 1200);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 900);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="flex gap-3">
        {(["combine", "build"] as Mode[]).map((m) => (
          <motion.button key={m} onClick={() => { setMode(m); setQIdx(0); setFeedback("idle"); }}
            className={`px-5 py-2 rounded-xl font-extrabold text-sm ${mode === m ? "bg-white text-green-700 shadow-lg" : "bg-white/30 text-white"}`}
            whileTap={{ scale: 0.95 }}>
            {m === "combine" ? "➕ Combine" : "🔨 Build"}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "combine" && (
          <motion.div key={`combine-${ci}`} className="flex flex-col items-center gap-5 w-full"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <p className="text-white font-extrabold text-lg">What compound word do they make?</p>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center gap-1">
                <span className="text-5xl">{combineQueue[ci].item.aEmoji}</span>
                <span className="text-xl font-black text-white">{combineQueue[ci].item.a}</span>
              </div>
              <span className="text-4xl font-black text-yellow-200">+</span>
              <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center gap-1">
                <span className="text-5xl">{combineQueue[ci].item.bEmoji}</span>
                <span className="text-xl font-black text-white">{combineQueue[ci].item.b}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {combineQueue[ci].choices.map((c) => (
                <motion.button key={c.compound} onClick={() => handleCombine(c.compound)}
                  className={`rounded-2xl py-3 px-4 font-black text-lg shadow-lg
                    ${feedback === "correct" && c.compound === combineQueue[ci].item.compound ? "bg-green-300 text-green-900" : "bg-white/30 text-white"}`}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                  {c.compound}
                </motion.button>
              ))}
            </div>
            {feedback === "correct" && <motion.p className="text-2xl font-black text-yellow-200" initial={{ scale: 0 }} animate={{ scale: 1 }}>🌟 {combineQueue[ci].item.compound}!</motion.p>}
            {feedback === "wrong" && <p className="text-2xl font-black text-red-200">Try again! 💪</p>}
            <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
          </motion.div>
        )}

        {mode === "build" && (
          <motion.div key={`build-${bi}`} className="flex flex-col items-center gap-5 w-full"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <p className="text-white font-extrabold text-lg">Complete the compound word!</p>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center gap-1">
                <span className="text-5xl">{buildQueue[bi].item.aEmoji}</span>
                <span className="text-xl font-black text-white">{buildQueue[bi].item.a}</span>
              </div>
              <span className="text-4xl font-black text-yellow-200">+</span>
              <div className="bg-yellow-200/20 border-2 border-dashed border-yellow-200 rounded-2xl p-4 flex flex-col items-center gap-1 min-w-[80px]">
                <span className="text-3xl">❓</span>
              </div>
              <span className="text-4xl font-black text-yellow-200">=</span>
              <div className="bg-white/20 rounded-2xl p-3">
                <span className="text-xl font-black text-white">{buildQueue[bi].item.compound}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {buildQueue[bi].options.map((opt) => (
                <motion.button key={opt} onClick={() => handleBuild(opt)}
                  className={`rounded-2xl py-3 px-4 font-black text-lg shadow-lg
                    ${feedback === "correct" && opt === buildQueue[bi].item.b ? "bg-green-300 text-green-900" : "bg-white/30 text-white"}`}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                  {opt}
                </motion.button>
              ))}
            </div>
            {feedback === "correct" && <motion.p className="text-2xl font-black text-yellow-200" initial={{ scale: 0 }} animate={{ scale: 1 }}>🌟 {buildQueue[bi].item.compound}!</motion.p>}
            {feedback === "wrong" && <p className="text-2xl font-black text-red-200">Try again! 💪</p>}
            <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
