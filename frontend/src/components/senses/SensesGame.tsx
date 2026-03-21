"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onScore: (c: number, t: number) => void; }

const SENSES = [
  { id: "see", name: "See", organ: "👁️", examples: ["🌈", "🌸", "📚", "🌙", "🎨"] },
  { id: "hear", name: "Hear", organ: "👂", examples: ["🎵", "🐦", "🌊", "🔔", "🥁"] },
  { id: "smell", name: "Smell", organ: "👃", examples: ["🌺", "🍕", "🌿", "🧁", "🧦"] },
  { id: "taste", name: "Taste", organ: "👅", examples: ["🍰", "🍋", "🧂", "🍫", "🍉"] },
  { id: "touch", name: "Touch", organ: "✋", examples: ["☁️", "🪨", "🌵", "🧸", "🧊"] },
];

const QUIZ_ITEMS = [
  { emoji: "🌈", sense: "see" }, { emoji: "🎵", sense: "hear" }, { emoji: "🌺", sense: "smell" },
  { emoji: "🍰", sense: "taste" }, { emoji: "☁️", sense: "touch" }, { emoji: "📚", sense: "see" },
  { emoji: "🐦", sense: "hear" }, { emoji: "🍕", sense: "smell" }, { emoji: "🍋", sense: "taste" },
  { emoji: "🪨", sense: "touch" }, { emoji: "🌸", sense: "see" }, { emoji: "🔔", sense: "hear" },
  { emoji: "🧁", sense: "smell" }, { emoji: "🍫", sense: "taste" }, { emoji: "🌵", sense: "touch" },
];

const TABS = ["Learn", "Quiz", "Match"] as const;
type Tab = typeof TABS[number];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

function LearnTab() {
  const [sel, setSel] = useState<string | null>(null);
  const sense = SENSES.find(s => s.id === sel);
  return (
    <div className="p-4">
      <p className="text-center text-white/80 text-sm mb-4">We have 5 senses! Tap each one to learn.</p>
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {SENSES.map(s => (
          <motion.button key={s.id} whileTap={{ scale: 0.9 }}
            onClick={() => setSel(sel === s.id ? null : s.id)}
            className={`rounded-2xl p-4 flex flex-col items-center gap-1 border-2 w-24 transition-colors ${sel === s.id ? "bg-white/30 border-white" : "bg-white/10 border-white/20"}`}>
            <span className="text-4xl">{s.organ}</span>
            <span className="text-white font-bold text-xs">{s.name}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {sense && (
          <motion.div key={sense.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white/20 rounded-2xl p-4">
            <p className="text-white font-black text-lg text-center mb-2">{sense.organ} We {sense.name}...</p>
            <div className="flex gap-3 justify-center flex-wrap">
              {sense.examples.map((e, i) => (
                <span key={i} className="text-4xl">{e}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizTab({ onScore }: Props) {
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [items] = useState(() => shuffle(QUIZ_ITEMS));
  const [idx, setIdx] = useState(0);
  const item = items[idx % items.length];

  function handleAnswer(senseId: string) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (senseId === item.sense) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => { setFeedback("idle"); setIdx(i => i + 1); }, 1200);
  }

  const correctSense = SENSES.find(s => s.id === item.sense)!;

  return (
    <div className="p-4">
      <p className="text-center text-white font-bold mb-2">Which sense do you use?</p>
      <motion.div key={idx} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
        className="bg-white/20 rounded-3xl p-6 flex items-center justify-center mb-5">
        <span className="text-7xl">{item.emoji}</span>
      </motion.div>
      <div className="grid grid-cols-5 gap-2">
        {SENSES.map(s => (
          <motion.button key={s.id} whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(s.id)}
            className="bg-white/15 border-2 border-white/30 rounded-2xl p-2 flex flex-col items-center gap-1">
            <span className="text-3xl">{s.organ}</span>
            <span className="text-white font-bold text-xs">{s.name}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className={`mt-4 text-center text-xl font-black py-3 rounded-2xl ${feedback === "correct" ? "bg-green-400/50 text-white" : "bg-red-400/50 text-white"}`}>
            {feedback === "correct" ? "👏 You got it!" : `You ${correctSense.name} it with ${correctSense.organ}!`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MatchTab({ onScore }: Props) {
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [items, setItems] = useState(() => shuffle(QUIZ_ITEMS).slice(0, 5));
  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, string>>({});

  function handleItemTap(i: number) {
    if (matched[i] || feedback !== "idle") return;
    setSelected(selected === i ? null : i);
  }

  function handleSenseTap(senseId: string) {
    if (selected === null || feedback !== "idle") return;
    const item = items[selected];
    const nt = total + 1; setTotal(nt);
    if (senseId === item.sense) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt);
      setFeedback("correct");
      const newMatched = { ...matched, [selected]: senseId };
      setMatched(newMatched);
      if (Object.keys(newMatched).length === 5) {
        setTimeout(() => {
          setItems(shuffle(QUIZ_ITEMS).slice(0, 5));
          setMatched({});
          setSelected(null);
          setFeedback("idle");
        }, 1000);
        return;
      }
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => { setFeedback("idle"); setSelected(null); }, 1000);
  }

  return (
    <div className="p-4">
      <p className="text-center text-white font-bold mb-1">Tap an item, then tap its sense!</p>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {items.map((item, i) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }}
            onClick={() => handleItemTap(i)}
            className={`rounded-2xl p-3 border-2 transition-colors ${matched[i] ? "opacity-40 border-white/20 bg-white/10" : selected === i ? "bg-white/40 border-white" : "bg-white/15 border-white/30"}`}>
            <span className="text-4xl">{item.emoji}</span>
            {matched[i] && <div className="text-center text-xs text-white mt-1">{SENSES.find(s => s.id === matched[i])?.organ}</div>}
          </motion.button>
        ))}
      </div>
      {selected !== null && <p className="text-center text-white/70 text-xs mb-2">Now tap the sense for {items[selected].emoji}</p>}
      <div className="grid grid-cols-5 gap-2">
        {SENSES.map(s => (
          <motion.button key={s.id} whileTap={{ scale: 0.9 }}
            onClick={() => handleSenseTap(s.id)}
            className={`rounded-2xl p-2 flex flex-col items-center gap-1 border-2 transition-colors ${selected !== null ? "bg-white/20 border-white/50" : "bg-white/10 border-white/20"}`}>
            <span className="text-3xl">{s.organ}</span>
            <span className="text-white font-bold text-xs">{s.name}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className={`mt-3 text-center text-xl font-black py-2 rounded-2xl ${feedback === "correct" ? "bg-green-400/50 text-white" : "bg-red-400/50 text-white"}`}>
            {feedback === "correct" ? "✅ Match!" : "❌ Try again!"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SensesGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-2 px-4 mb-2">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${tab === t ? "bg-white text-pink-700" : "bg-white/20 text-white"}`}>
            {t}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          {tab === "Learn" && <LearnTab />}
          {tab === "Quiz" && <QuizTab onScore={onScore} />}
          {tab === "Match" && <MatchTab onScore={onScore} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
