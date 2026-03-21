"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onScore: (c: number, t: number) => void; }

const SHAPES = [
  {
    name: "Sphere", emoji: "🔵", color: "bg-blue-400",
    fact: "No flat sides!", faces: "0 flat faces",
    examples: ["⚽", "🍊", "🌍", "🎱"],
    exampleNames: ["Ball", "Orange", "Globe", "Pool Ball"],
  },
  {
    name: "Cube", emoji: "🧊", color: "bg-cyan-400",
    fact: "6 equal square faces!", faces: "6 square faces",
    examples: ["🎲", "📦", "🧊", "🟦"],
    exampleNames: ["Dice", "Box", "Ice Cube", "Block"],
  },
  {
    name: "Cylinder", emoji: "🥫", color: "bg-red-400",
    fact: "2 circles and 1 curved side!", faces: "2 circle faces",
    examples: ["🥫", "🥁", "🪵", "🥤"],
    exampleNames: ["Can", "Drum", "Log", "Cup"],
  },
  {
    name: "Cone", emoji: "🍦", color: "bg-pink-400",
    fact: "1 circle base and 1 pointy tip!", faces: "1 circle base",
    examples: ["🍦", "🎉", "🚧", "🌋"],
    exampleNames: ["Ice Cream", "Party Hat", "Traffic Cone", "Volcano"],
  },
  {
    name: "Rectangular Prism", emoji: "📦", color: "bg-amber-400",
    fact: "6 rectangular faces!", faces: "6 rectangular faces",
    examples: ["📚", "🧱", "🥣", "🚪"],
    exampleNames: ["Book", "Brick", "Cereal Box", "Door"],
  },
  {
    name: "Pyramid", emoji: "🔺", color: "bg-orange-400",
    fact: "Square base + 4 triangles!", faces: "5 faces total",
    examples: ["🏛️", "🧀", "⛺", "⛰️"],
    exampleNames: ["Pyramid", "Cheese", "Tent", "Mountain"],
  },
  {
    name: "Torus", emoji: "🍩", color: "bg-purple-400",
    fact: "Like a stretched circle — has a hole!", faces: "0 flat faces",
    examples: ["🍩", "💍", "🛟", "🏈"],
    exampleNames: ["Donut", "Ring", "Life Ring", "Hula Hoop"],
  },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function getChoices(correct: string, all: string[]): string[] {
  const others = shuffle(all.filter(n => n !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function Shapes3DGame({ onScore }: Props) {
  const [tab, setTab] = useState<"learn" | "nameit" | "findit">("learn");
  const [learnIdx, setLearnIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [fb, setFb] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const allNames = SHAPES.map(s => s.name);
  const allEmojis = SHAPES.map(s => s.emoji);
  const nameQuestions = shuffle(SHAPES);
  const findQuestions = shuffle(SHAPES);
  const nq = nameQuestions[qIdx % nameQuestions.length];
  const fq = findQuestions[qIdx % findQuestions.length];
  const nameChoices = getChoices(nq.name, allNames);
  const emojiChoices = getChoices(fq.emoji, allEmojis);
  const ls = SHAPES[learnIdx];

  function handleAnswer(choice: string, correctVal: string) {
    if (fb !== "idle") return;
    const isCorrect = choice === correctVal;
    const newCorrect = correct + (isCorrect ? 1 : 0);
    const newTotal = total + 1;
    setCorrect(newCorrect);
    setTotal(newTotal);
    onScore(newCorrect, newTotal);
    setFb(isCorrect ? "correct" : "wrong");
    setTimeout(() => { setFb("idle"); setQIdx(i => i + 1); }, 1000);
  }

  return (
    <div className="flex flex-col items-center px-4 pb-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {(["learn", "nameit", "findit"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full font-bold text-xs capitalize transition-all ${tab === t ? "bg-white text-violet-700 shadow-lg scale-105" : "bg-white/30 text-white"}`}>
            {t === "learn" ? "📚 Learn" : t === "nameit" ? "🏷️ Name It" : "🔍 Find It"}
          </button>
        ))}
      </div>

      {tab === "learn" && (
        <div className="w-full max-w-sm flex flex-col items-center gap-3">
          {/* Shape nav dots */}
          <div className="flex gap-2 mb-1">
            {SHAPES.map((_, i) => (
              <button key={i} onClick={() => setLearnIdx(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === learnIdx ? "bg-white scale-125" : "bg-white/40"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={learnIdx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              className="bg-white/20 rounded-3xl p-6 text-center w-full">
              <div className={`w-24 h-24 ${ls.color} rounded-full mx-auto flex items-center justify-center text-5xl mb-3 shadow-lg`}
                style={ls.name === "Cube" ? { borderRadius: "12px" } :
                  ls.name === "Cylinder" ? { borderRadius: "50% / 30%", height: "80px" } :
                  ls.name === "Cone" ? { clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", borderRadius: "0" } :
                  ls.name === "Rectangular Prism" ? { borderRadius: "8px", width: "110px", height: "72px" } :
                  ls.name === "Pyramid" ? { clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", borderRadius: "0" } :
                  ls.name === "Torus" ? { borderRadius: "50%", border: "16px solid", borderColor: "rgba(168,85,247,0.7)", background: "transparent", boxShadow: "none" } :
                  {}}>
                {ls.name !== "Torus" ? ls.emoji : ""}
              </div>
              <p className="text-white text-2xl font-black mb-1">{ls.name}</p>
              <p className="text-yellow-200 font-bold text-sm mb-1">{ls.faces}</p>
              <p className="text-white/80 text-sm mb-4 italic">{ls.fact}</p>
              <p className="text-white/60 text-xs mb-2">Examples:</p>
              <div className="flex justify-center gap-3 text-3xl mb-2">
                {ls.examples.map((e, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span>{e}</span>
                    <span className="text-white/60 text-xs">{ls.exampleNames[i]}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4">
            <button onClick={() => setLearnIdx(i => (i - 1 + SHAPES.length) % SHAPES.length)}
              className="bg-white/30 text-white px-5 py-2 rounded-full font-bold">← Prev</button>
            <button onClick={() => setLearnIdx(i => (i + 1) % SHAPES.length)}
              className="bg-white/30 text-white px-5 py-2 rounded-full font-bold">Next →</button>
          </div>
        </div>
      )}

      {tab === "nameit" && (
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="bg-white/20 rounded-3xl p-6 text-center w-full">
            <div className="text-7xl mb-2">{nq.emoji}</div>
            <p className="text-white text-sm">Example: {nq.examples[0]} {nq.exampleNames[0]}</p>
            <p className="text-white font-bold text-lg mt-1">What shape is this?</p>
          </div>

          <AnimatePresence mode="wait">
            {fb !== "idle" && (
              <motion.div key={fb} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className={`text-3xl font-black ${fb === "correct" ? "text-yellow-300" : "text-red-300"}`}>
                {fb === "correct" ? "⭐ Correct!" : "❌ Try Again!"}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-3 w-full">
            {nameChoices.map(c => (
              <motion.button key={c} whileTap={{ scale: 0.93 }} onClick={() => handleAnswer(c, nq.name)}
                className={`py-3 px-2 rounded-2xl text-sm font-black transition-all shadow-md
                  ${fb !== "idle" && c === nq.name ? "bg-green-400 text-white" :
                    fb === "wrong" && c !== nq.name ? "bg-white/20 text-white/40" :
                    "bg-white text-violet-800 hover:bg-violet-50"}`}>
                {c}
              </motion.button>
            ))}
          </div>
          <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
        </div>
      )}

      {tab === "findit" && (
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="bg-white/20 rounded-3xl p-6 text-center w-full">
            <p className="text-white/80 text-sm mb-1">Find the shape:</p>
            <p className="text-white text-3xl font-black">{fq.name}</p>
            <p className="text-yellow-200 text-sm">{fq.fact}</p>
          </div>

          <AnimatePresence mode="wait">
            {fb !== "idle" && (
              <motion.div key={fb} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className={`text-3xl font-black ${fb === "correct" ? "text-yellow-300" : "text-red-300"}`}>
                {fb === "correct" ? "⭐ Correct!" : "❌ Try Again!"}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4 w-full">
            {emojiChoices.map(c => (
              <motion.button key={c} whileTap={{ scale: 0.93 }} onClick={() => handleAnswer(c, fq.emoji)}
                className={`py-6 rounded-2xl text-5xl transition-all shadow-md
                  ${fb !== "idle" && c === fq.emoji ? "bg-green-400" :
                    fb === "wrong" && c !== fq.emoji ? "bg-white/10" :
                    "bg-white hover:bg-violet-50"}`}>
                {c}
              </motion.button>
            ))}
          </div>
          <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
        </div>
      )}
    </div>
  );
}
