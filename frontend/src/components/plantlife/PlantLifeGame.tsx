"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onScore: (c: number, t: number) => void; }

const STAGES = [
  { emoji: "🌱", name: "Seed", desc: "A tiny seed waits in the soil for water and sun!" },
  { emoji: "🌿", name: "Sprout", desc: "The seed cracks open and a tiny sprout pops up!" },
  { emoji: "🪴", name: "Seedling", desc: "The seedling grows little leaves and gets stronger!" },
  { emoji: "🌳", name: "Plant", desc: "The plant grows tall with lots of leaves!" },
  { emoji: "🌸", name: "Flower", desc: "Beautiful flowers bloom to attract bees and butterflies!" },
  { emoji: "🍎", name: "Fruit", desc: "The flower becomes a yummy fruit full of new seeds!" },
];

const TABS = ["Learn", "Order", "Quiz"] as const;
type Tab = typeof TABS[number];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

function LearnTab() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="p-4">
      <p className="text-center text-white/80 text-sm mb-4">Tap a stage to learn more!</p>
      <div className="grid grid-cols-3 gap-3">
        {STAGES.map((s, i) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }}
            onClick={() => setSelected(selected === i ? null : i)}
            className={`rounded-2xl p-3 flex flex-col items-center gap-1 border-2 transition-colors ${selected === i ? "bg-white/30 border-white" : "bg-white/10 border-white/20"}`}>
            <span className="text-4xl">{s.emoji}</span>
            <span className="text-white font-bold text-xs">{s.name}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.div key={selected} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-4 bg-white/20 rounded-2xl p-4 text-center">
            <span className="text-5xl">{STAGES[selected].emoji}</span>
            <p className="text-white font-black text-lg mt-1">{STAGES[selected].name}</p>
            <p className="text-white/90 text-sm mt-1">{STAGES[selected].desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderTab({ onScore }: Props) {
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [picked, setPicked] = useState<number[]>([]);
  const [options, setOptions] = useState(() => {
    const idxs = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4);
    return idxs.sort((a, b) => a - b);
  });
  const [scrambled, setScrambled] = useState(() => shuffle([0, 1, 2, 3]));

  const correctOrder = [...options].sort((a, b) => a - b);

  function handlePick(slotIdx: number) {
    if (feedback !== "idle") return;
    const newPicked = [...picked, slotIdx];
    setPicked(newPicked);
    if (newPicked.length === 4) {
      const isCorrect = newPicked.every((v, i) => scrambled[v] === correctOrder.indexOf(options[correctOrder.indexOf(options[i])]));
      const mappedOrder = newPicked.map(i => options[scrambled[i]]);
      const ok = mappedOrder.every((v, i) => v === correctOrder[i]);
      const nt = total + 1; setTotal(nt);
      if (ok) {
        const nc = correct + 1; setCorrect(nc); onScore(nc, nt);
        setFeedback("correct");
      } else {
        setFeedback("wrong");
      }
      setTimeout(() => {
        setFeedback("idle");
        setPicked([]);
        const newIdxs = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4);
        setOptions(newIdxs.sort((a, b) => a - b));
        setScrambled(shuffle([0, 1, 2, 3]));
      }, 1200);
    }
  }

  const displayStages = scrambled.map(i => STAGES[options[i]]);

  return (
    <div className="p-4">
      <p className="text-center text-white font-bold mb-2">Tap the stages in the correct order!</p>
      <p className="text-center text-white/70 text-xs mb-4">Which comes first? Then next?</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {displayStages.map((s, i) => {
          const pickPos = picked.indexOf(i);
          return (
            <motion.button key={i} whileTap={{ scale: 0.9 }}
              onClick={() => handlePick(i)}
              disabled={picked.includes(i)}
              className={`rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-colors ${picked.includes(i) ? "bg-white/40 border-white opacity-60" : "bg-white/10 border-white/30"}`}>
              {pickPos >= 0 && <span className="text-white font-black text-lg absolute">{pickPos + 1}</span>}
              <span className="text-4xl">{s.emoji}</span>
              <span className="text-white font-bold text-sm">{s.name}</span>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className={`text-center text-2xl font-black py-3 rounded-2xl ${feedback === "correct" ? "bg-green-400/50 text-white" : "bg-red-400/50 text-white"}`}>
            {feedback === "correct" ? "🌱 Great job!" : "❌ Try again!"}
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
  const [current, setCurrent] = useState(() => Math.floor(Math.random() * 6));
  const [choices, setChoices] = useState(() => {
    const idx = Math.floor(Math.random() * 6);
    const others = shuffle([0, 1, 2, 3, 4, 5].filter(i => i !== idx)).slice(0, 3);
    return shuffle([idx, ...others]);
  });

  function newQ() {
    const idx = Math.floor(Math.random() * 6);
    setCurrent(idx);
    const others = shuffle([0, 1, 2, 3, 4, 5].filter(i => i !== idx)).slice(0, 3);
    setChoices(shuffle([idx, ...others]));
  }

  function handleAnswer(idx: number) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (idx === current) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => { setFeedback("idle"); newQ(); }, 1200);
  }

  return (
    <div className="p-4">
      <p className="text-center text-white/80 text-sm mb-3">Which stage is this?</p>
      <motion.div key={current} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
        className="bg-white/20 rounded-3xl p-6 flex flex-col items-center mb-5">
        <span className="text-7xl">{STAGES[current].emoji}</span>
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        {choices.map(idx => (
          <motion.button key={idx} whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(idx)}
            className="bg-white/15 border-2 border-white/30 rounded-2xl p-3 text-white font-bold text-sm">
            {STAGES[idx].name}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className={`mt-4 text-center text-xl font-black py-3 rounded-2xl ${feedback === "correct" ? "bg-green-400/50 text-white" : "bg-red-400/50 text-white"}`}>
            {feedback === "correct" ? "🌸 Correct!" : `It's the ${STAGES[current].name}!`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PlantLifeGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-2 px-4 mb-2">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${tab === t ? "bg-white text-green-700" : "bg-white/20 text-white"}`}>
            {t}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          {tab === "Learn" && <LearnTab />}
          {tab === "Order" && <OrderTab onScore={onScore} />}
          {tab === "Quiz" && <QuizTab onScore={onScore} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
