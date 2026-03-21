"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

interface PrepItem {
  id: string;
  word: string;
  sentence: string;
  catStyle: React.CSSProperties;
}

const PREPS: PrepItem[] = [
  { id: "on",        word: "ON",        sentence: "The cat is ON the box.",        catStyle: { top: "-36px", left: "50%", transform: "translateX(-50%)" } },
  { id: "under",     word: "UNDER",     sentence: "The cat is UNDER the box.",     catStyle: { top: "64px",  left: "50%", transform: "translateX(-50%)" } },
  { id: "in",        word: "IN",        sentence: "The cat is IN the box.",        catStyle: { top: "12px",  left: "50%", transform: "translateX(-50%)" } },
  { id: "next to",   word: "NEXT TO",   sentence: "The cat is NEXT TO the box.",   catStyle: { top: "8px",   left: "80px" } },
  { id: "behind",    word: "BEHIND",    sentence: "The cat is BEHIND the box.",    catStyle: { top: "4px",   left: "50%", transform: "translateX(-50%)", opacity: 0.45, fontSize: "28px" } },
  { id: "in front of", word: "IN FRONT OF", sentence: "The cat is IN FRONT OF the box.", catStyle: { top: "56px", left: "50%", transform: "translateX(-50%)" } },
  { id: "between",   word: "BETWEEN",   sentence: "The cat is BETWEEN the boxes.", catStyle: { top: "8px",   left: "50%", transform: "translateX(-50%)" } },
  { id: "over",      word: "OVER",      sentence: "The cat is OVER the box.",      catStyle: { top: "-48px", left: "50%", transform: "translateX(-50%)" } },
];

const WORDS = PREPS.map((p) => p.id);

function Scene({ item }: { item: PrepItem }) {
  const isBetween = item.id === "between";
  return (
    <div className="flex items-center justify-center gap-2">
      {isBetween && <span className="text-5xl">📦</span>}
      <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
        <span className="text-5xl">📦</span>
        <span className="absolute text-4xl select-none" style={item.catStyle}>🐱</span>
      </div>
      {isBetween && <span className="text-5xl">📦</span>}
    </div>
  );
}

export default function PrepositionsGame({ onScore }: Props) {
  const [tab, setTab] = useState<"learn" | "quiz">("learn");
  const [idx, setIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [choices, setChoices] = useState<string[]>(() => makeChoices(0));
  const [fb, setFb] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  function makeChoices(answerIdx: number): string[] {
    const answer = WORDS[answerIdx];
    const others = shuffle(WORDS.filter((w) => w !== answer)).slice(0, 3);
    return shuffle([answer, ...others]);
  }

  function advance() {
    const next = (qIdx + 1) % PREPS.length;
    setQIdx(next);
    setChoices(makeChoices(next));
  }

  function pick(word: string) {
    if (fb !== "idle") return;
    const isCorrect = word === PREPS[qIdx].id;
    const newCorrect = correct + (isCorrect ? 1 : 0);
    const newTotal = total + 1;
    setCorrect(newCorrect);
    setTotal(newTotal);
    onScore(newCorrect, newTotal);
    setFb(isCorrect ? "correct" : "wrong");
    setTimeout(() => { setFb("idle"); advance(); }, 1000);
  }

  const item = PREPS[idx];
  const qItem = PREPS[qIdx];

  return (
    <div className="flex flex-col items-center gap-3 p-4 w-full">
      {/* Tab bar */}
      <div className="flex gap-2">
        {(["learn", "quiz"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-indigo-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "learn" ? "📚 Learn" : "🎯 Quiz"}
          </button>
        ))}
      </div>

      {/* LEARN TAB */}
      {tab === "learn" && (
        <AnimatePresence mode="wait">
          <motion.div key={item.id}
            className="flex flex-col items-center gap-4 bg-white/20 rounded-3xl p-6 w-full max-w-sm"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            <div className="bg-white/30 rounded-2xl p-6 w-full flex justify-center min-h-[120px] items-center">
              <Scene item={item} />
            </div>
            <span className="text-4xl font-black text-white tracking-widest">{item.word}</span>
            <p className="text-white/90 text-lg font-semibold text-center">{item.sentence}</p>
            <div className="flex gap-4 items-center mt-2">
              <motion.button onClick={() => setIdx((i) => (i - 1 + PREPS.length) % PREPS.length)}
                className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>← Back</motion.button>
              <span className="text-white/70 text-sm">{idx + 1} / {PREPS.length}</span>
              <motion.button onClick={() => setIdx((i) => (i + 1) % PREPS.length)}
                className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>Next →</motion.button>
            </div>
            <div className="flex gap-1 flex-wrap justify-center">
              {PREPS.map((_, i) => (
                <div key={i} onClick={() => setIdx(i)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${i === idx ? "bg-white scale-125" : "bg-white/30"}`} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* QUIZ TAB */}
      {tab === "quiz" && (
        <AnimatePresence mode="wait">
          <motion.div key={qIdx}
            className="flex flex-col items-center gap-4 w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <p className="text-white font-bold text-lg text-center">Where is the cat? 🐱</p>
            <div className="bg-white/20 rounded-2xl p-6 w-full flex justify-center min-h-[130px] items-center">
              <Scene item={qItem} />
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              {choices.map((word) => {
                const isAnswer = word === qItem.id;
                let cls = "bg-white/90 text-indigo-800 font-black text-lg rounded-2xl py-4 w-full shadow transition-all";
                if (fb === "correct" && isAnswer) cls = "bg-green-400 text-white font-black text-lg rounded-2xl py-4 w-full shadow scale-105";
                if (fb === "wrong" && isAnswer) cls = "bg-red-400 text-white font-black text-lg rounded-2xl py-4 w-full shadow";
                return (
                  <motion.button key={word} onClick={() => pick(word)} className={cls}
                    whileHover={{ scale: fb === "idle" ? 1.04 : 1 }} whileTap={{ scale: fb === "idle" ? 0.95 : 1 }}>
                    {word.toUpperCase()}
                  </motion.button>
                );
              })}
            </div>
            <p className="text-white/70 text-sm">Score: {correct} / {total}</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
