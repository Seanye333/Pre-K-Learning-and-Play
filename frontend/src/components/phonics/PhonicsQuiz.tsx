"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = [
  { word: "Apple",    emoji: "🍎", letter: "A" },
  { word: "Ball",     emoji: "⚽", letter: "B" },
  { word: "Cat",      emoji: "🐱", letter: "C" },
  { word: "Dog",      emoji: "🐶", letter: "D" },
  { word: "Egg",      emoji: "🥚", letter: "E" },
  { word: "Fish",     emoji: "🐟", letter: "F" },
  { word: "Goat",     emoji: "🐐", letter: "G" },
  { word: "Hat",      emoji: "🎩", letter: "H" },
  { word: "Igloo",    emoji: "🏔️",  letter: "I" },
  { word: "Jar",      emoji: "🫙", letter: "J" },
  { word: "Kite",     emoji: "🪁", letter: "K" },
  { word: "Lion",     emoji: "🦁", letter: "L" },
  { word: "Moon",     emoji: "🌙", letter: "M" },
  { word: "Nest",     emoji: "🪺", letter: "N" },
  { word: "Orange",   emoji: "🍊", letter: "O" },
  { word: "Pig",      emoji: "🐷", letter: "P" },
  { word: "Queen",    emoji: "👑", letter: "Q" },
  { word: "Rain",     emoji: "🌧️",  letter: "R" },
  { word: "Sun",      emoji: "☀️",  letter: "S" },
  { word: "Tree",     emoji: "🌳", letter: "T" },
  { word: "Umbrella", emoji: "☂️",  letter: "U" },
  { word: "Volcano",  emoji: "🌋", letter: "V" },
  { word: "Whale",    emoji: "🐋", letter: "W" },
  { word: "Fox",      emoji: "🦊", letter: "X" },
  { word: "Yarn",     emoji: "🧶", letter: "Y" },
  { word: "Zebra",    emoji: "🦓", letter: "Z" },
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

function makeQ(queue: typeof WORDS, idx: number) {
  const target = queue[idx % queue.length];
  const wrong  = shuffle(LETTERS.filter((l) => l !== target.letter)).slice(0, 3);
  return { target, choices: shuffle([target.letter, ...wrong]) };
}

interface Props { onScore: (c: number, t: number) => void; }

export default function PhonicsQuiz({ onScore }: Props) {
  const [queue]   = useState(() => shuffle(WORDS));
  const [idx, setIdx] = useState(0);
  const [q, setQ]     = useState(() => makeQ(shuffle(WORDS), 0));
  const [feedback, setFB] = useState<"idle"|"correct"|"wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total,   setTotal]   = useState(0);

  function handle(letter: string) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (letter === q.target.letter) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => {
      setFB("idle");
      const next = idx + 1; setIdx(next); setQ(makeQ(queue, next));
    }, 1100);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">What letter does it <span className="text-yellow-300 font-black">start</span> with?</p>

      <motion.div key={q.target.word}
        className="flex flex-col items-center gap-1 bg-white/20 px-10 py-5 rounded-3xl"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-8xl">{q.target.emoji}</span>
        <p className="text-white font-black text-3xl">{q.target.word}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {q.choices.map((l) => (
          <motion.button key={l} onClick={() => handle(l)}
            className={`py-4 rounded-2xl font-black text-4xl shadow
              ${feedback !== "idle" && l === q.target.letter ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && l !== q.target.letter ? "bg-red-300/40 text-white/60" : ""}
              ${feedback === "idle" ? "bg-white text-indigo-700" : ""}`}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}>
            {l}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}>🌟 {q.target.word} starts with {q.target.letter}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg"    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>Say the word slowly — what&apos;s the first sound?</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
