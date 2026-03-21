"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }
interface Props { onScore: (c: number, t: number) => void; }

const NUMS = [
  { n: 1, word: "one",   emoji: "🐱" },
  { n: 2, word: "two",   emoji: "🐶" },
  { n: 3, word: "three", emoji: "🐸" },
  { n: 4, word: "four",  emoji: "🦋" },
  { n: 5, word: "five",  emoji: "⭐" },
  { n: 6, word: "six",   emoji: "🍎" },
  { n: 7, word: "seven", emoji: "🌈" },
  { n: 8, word: "eight", emoji: "🎈" },
  { n: 9, word: "nine",  emoji: "🐝" },
  { n: 10, word: "ten",  emoji: "🎉" },
];

function LearnMode() {
  const [idx, setIdx] = useState(0);
  const item = NUMS[idx];
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">Tap to go through the numbers!</p>
      <motion.div key={idx} className="flex flex-col items-center bg-white/20 rounded-3xl px-10 py-6 gap-3 w-full max-w-xs"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <p className="text-white font-black text-8xl">{item.n}</p>
        <div className="flex flex-wrap gap-1 justify-center">{Array.from({ length: item.n }).map((_, i) => <span key={i} className="text-3xl">{item.emoji}</span>)}</div>
        <p className="text-yellow-200 font-black text-4xl">{item.word}</p>
      </motion.div>
      <div className="flex gap-4">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} className="bg-white/20 text-white font-black px-6 py-3 rounded-2xl text-xl disabled:opacity-30" disabled={idx === 0}>← Back</button>
        <button onClick={() => setIdx(i => Math.min(9, i + 1))} className="bg-white/20 text-white font-black px-6 py-3 rounded-2xl text-xl disabled:opacity-30" disabled={idx === 9}>Next →</button>
      </div>
      <div className="flex gap-1">{NUMS.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === idx ? "bg-white" : "bg-white/30"}`} />)}</div>
    </div>
  );
}

function QuizMode({ onScore, reverse }: Props & { reverse: boolean }) {
  const [seq] = useState(() => { const a: typeof NUMS[0][] = []; for (let i = 0; i < 20; i++) a.push(NUMS[Math.floor(Math.random() * 10)]); return a; });
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const target = seq[idx % seq.length];
  const choices = shuffle([target, ...shuffle(NUMS.filter(n => n.n !== target.n)).slice(0, 3)]);

  function pick(item: typeof NUMS[0]) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (item.n === target.n) { const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct"); }
    else setFB("wrong");
    setTimeout(() => { setFB("idle"); setIdx(i => i + 1); }, 1000);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">{reverse ? "Tap the number word!" : "Tap the numeral!"}</p>
      <motion.div key={idx} className="flex flex-col items-center bg-white/20 rounded-2xl px-10 py-6"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        {reverse
          ? <p className="text-white font-black text-6xl">{target.word}</p>
          : <><p className="text-white font-black text-7xl">{target.n}</p><div className="flex flex-wrap gap-1 justify-center mt-2">{Array.from({ length: target.n }).map((_, i) => <span key={i} className="text-2xl">{target.emoji}</span>)}</div></>}
      </motion.div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {choices.map(item => (
          <motion.button key={item.n} onClick={() => pick(item)}
            className={`py-4 rounded-2xl font-black text-2xl shadow
              ${feedback !== "idle" && item.n === target.n ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && item.n !== target.n ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white text-teal-700" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            {reverse ? item.n : item.word}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {target.word}!</motion.p>}
        {feedback === "wrong" && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Try again!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

const TABS = ["Learn", "Number→Word", "Word→Number"] as const;
type Tab = typeof TABS[number];
export default function NumberWords({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${tab === t ? "bg-white text-teal-700 shadow" : "bg-white/20 text-white"}`}>{t === "Learn" ? "📚 Learn" : t === "Number→Word" ? "🔢→📝" : "📝→🔢"}</button>)}
      </div>
      {tab === "Learn" && <LearnMode />}
      {tab === "Number→Word" && <QuizMode onScore={onScore} reverse={false} />}
      {tab === "Word→Number" && <QuizMode onScore={onScore} reverse={true} />}
    </div>
  );
}
