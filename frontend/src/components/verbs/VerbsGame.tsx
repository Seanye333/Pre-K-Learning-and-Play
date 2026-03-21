"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }
interface Props { onScore: (c: number, t: number) => void; }

const VERBS = [
  { id: "run",   word: "run",   emoji: "🏃", sentence: "I can run fast!" },
  { id: "jump",  word: "jump",  emoji: "🦘", sentence: "Frogs jump high!" },
  { id: "swim",  word: "swim",  emoji: "🏊", sentence: "Fish swim in water!" },
  { id: "eat",   word: "eat",   emoji: "🍽️",  sentence: "We eat yummy food!" },
  { id: "sleep", word: "sleep", emoji: "😴", sentence: "Bears sleep in winter!" },
  { id: "read",  word: "read",  emoji: "📖", sentence: "I love to read books!" },
  { id: "dance", word: "dance", emoji: "💃", sentence: "We dance to music!" },
  { id: "sing",  word: "sing",  emoji: "🎤", sentence: "Birds sing every morning!" },
  { id: "draw",  word: "draw",  emoji: "✏️",  sentence: "I draw pictures!" },
  { id: "laugh", word: "laugh", emoji: "😂", sentence: "Jokes make us laugh!" },
  { id: "wave",  word: "wave",  emoji: "👋", sentence: "Wave hello to friends!" },
  { id: "hug",   word: "hug",   emoji: "🤗", sentence: "Hugs feel so warm!" },
  { id: "fly",   word: "fly",   emoji: "✈️",  sentence: "Birds and planes fly!" },
  { id: "clap",  word: "clap",  emoji: "👏", sentence: "Clap when you're happy!" },
  { id: "kick",  word: "kick",  emoji: "⚽", sentence: "Kick the ball!" },
];

function LearnMode() {
  const [idx, setIdx] = useState(0);
  const v = VERBS[idx];
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="grid grid-cols-5 gap-2 w-full max-w-sm">
        {VERBS.map((v, i) => <button key={v.id} onClick={() => setIdx(i)} className={`py-2 rounded-xl font-bold text-xs ${idx === i ? "bg-white text-sky-700" : "bg-white/20 text-white"}`}>{v.emoji}</button>)}
      </div>
      <motion.div key={v.id} className="flex flex-col items-center bg-white/20 rounded-3xl px-10 py-6 gap-3 w-full max-w-xs"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-8xl">{v.emoji}</span>
        <p className="text-white font-black text-4xl">{v.word}</p>
        <p className="text-white/80 text-sm text-center italic">"{v.sentence}"</p>
      </motion.div>
    </div>
  );
}

function QuizMode({ onScore, emojiFirst }: Props & { emojiFirst: boolean }) {
  const [seq] = useState(() => { const a: typeof VERBS[0][] = []; for (let i = 0; i < 20; i++) a.push(VERBS[Math.floor(Math.random() * VERBS.length)]); return a; });
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const target = seq[idx % seq.length];
  const choices = shuffle([target, ...shuffle(VERBS.filter(v => v.id !== target.id)).slice(0, 3)]);

  function pick(v: typeof VERBS[0]) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (v.id === target.id) { const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct"); }
    else setFB("wrong");
    setTimeout(() => { setFB("idle"); setIdx(i => i + 1); }, 1000);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">{emojiFirst ? "What action is this?" : "Find the action!"}</p>
      <motion.div key={idx} className="flex flex-col items-center bg-white/20 rounded-2xl px-10 py-6"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        {emojiFirst ? <span className="text-8xl">{target.emoji}</span> : <p className="text-white font-black text-4xl">{target.word}</p>}
      </motion.div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {choices.map(v => (
          <motion.button key={v.id} onClick={() => pick(v)}
            className={`flex flex-col items-center py-4 rounded-2xl font-bold shadow
              ${feedback !== "idle" && v.id === target.id ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && v.id !== target.id ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white/30 text-white" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            {emojiFirst ? <><span className="font-black text-lg">{v.word}</span></> : <><span className="text-4xl">{v.emoji}</span><span className="text-sm font-black">{v.word}</span></>}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {target.word}!</motion.p>}
        {feedback === "wrong" && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Look at the action!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

const TABS = ["Learn", "Emoji→Word", "Word→Emoji"] as const;
type Tab = typeof TABS[number];
export default function VerbsGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded-full font-bold text-sm transition-all ${tab === t ? "bg-white text-sky-700 shadow" : "bg-white/20 text-white"}`}>{t === "Learn" ? "📚 Learn" : t === "Emoji→Word" ? "🏃→Word" : "Word→🏃"}</button>)}
      </div>
      {tab === "Learn" && <LearnMode />}
      {tab === "Emoji→Word" && <QuizMode onScore={onScore} emojiFirst={true} />}
      {tab === "Word→Emoji" && <QuizMode onScore={onScore} emojiFirst={false} />}
    </div>
  );
}
