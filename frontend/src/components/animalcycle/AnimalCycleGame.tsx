"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onScore: (c: number, t: number) => void; }

const CYCLES = [
  {
    name: "Butterfly", emoji: "🦋",
    stages: [
      { emoji: "🥚", name: "Egg", desc: "A tiny egg on a leaf." },
      { emoji: "🐛", name: "Caterpillar", desc: "A hungry caterpillar hatches and eats!" },
      { emoji: "🫛", name: "Chrysalis", desc: "The caterpillar wraps itself up and transforms." },
      { emoji: "🦋", name: "Butterfly", desc: "A beautiful butterfly emerges and flies!" },
    ],
  },
  {
    name: "Frog", emoji: "🐸",
    stages: [
      { emoji: "🥚", name: "Egg", desc: "Frog eggs float in the pond water." },
      { emoji: "🐟", name: "Tadpole", desc: "A tadpole swims using its tail." },
      { emoji: "🐸", name: "Froglet", desc: "Legs grow and the tail starts shrinking!" },
      { emoji: "🐸", name: "Frog", desc: "A grown frog can swim and hop on land!" },
    ],
  },
  {
    name: "Chicken", emoji: "🐔",
    stages: [
      { emoji: "🥚", name: "Egg", desc: "A warm egg sits in the nest." },
      { emoji: "🐣", name: "Chick", desc: "The chick pecks through the shell!" },
      { emoji: "🐤", name: "Young Chicken", desc: "Growing bigger with soft feathers." },
      { emoji: "🐔", name: "Chicken", desc: "A full grown chicken!" },
    ],
  },
];

const TABS = ["Learn", "Order", "Quiz"] as const;
type Tab = typeof TABS[number];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

function LearnTab() {
  const [cycleIdx, setCycleIdx] = useState(0);
  const cycle = CYCLES[cycleIdx];
  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 justify-center">
        {CYCLES.map((c, i) => (
          <button key={i} onClick={() => setCycleIdx(i)}
            className={`px-3 py-1 rounded-xl font-bold text-sm ${cycleIdx === i ? "bg-white text-amber-700" : "bg-white/20 text-white"}`}>
            {c.emoji} {c.name}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {cycle.stages.map((s, i) => (
          <div key={i} className="flex items-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-white/20 rounded-2xl p-3 flex flex-col items-center gap-1 min-w-[70px]">
              <span className="text-4xl">{s.emoji}</span>
              <span className="text-white font-bold text-xs text-center">{s.name}</span>
              <span className="text-white/70 text-xs text-center">{s.desc}</span>
            </motion.div>
            {i < cycle.stages.length - 1 && <span className="text-white text-xl mx-1">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderTab({ onScore }: Props) {
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [cycleIdx, setCycleIdx] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [scrambled, setScrambled] = useState(() => shuffle([0, 1, 2, 3]));

  const cycle = CYCLES[cycleIdx];

  function reset(ci: number) {
    setCycleIdx(ci);
    setPicked([]);
    setScrambled(shuffle([0, 1, 2, 3]));
  }

  function handlePick(slotIdx: number) {
    if (feedback !== "idle" || picked.includes(slotIdx)) return;
    const newPicked = [...picked, slotIdx];
    setPicked(newPicked);
    if (newPicked.length === 4) {
      const mappedOrder = newPicked.map(i => scrambled[i]);
      const ok = mappedOrder.every((v, i) => v === i);
      const nt = total + 1; setTotal(nt);
      if (ok) {
        const nc = correct + 1; setCorrect(nc); onScore(nc, nt);
        setFeedback("correct");
      } else {
        setFeedback("wrong");
      }
      setTimeout(() => {
        setFeedback("idle");
        reset((cycleIdx + 1) % CYCLES.length);
      }, 1200);
    }
  }

  return (
    <div className="p-4">
      <p className="text-center text-white font-bold mb-1">Tap the stages in order!</p>
      <p className="text-center text-white/70 text-xs mb-3">{cycle.emoji} {cycle.name} Life Cycle</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {scrambled.map((stageIdx, i) => {
          const s = cycle.stages[stageIdx];
          const pickPos = picked.indexOf(i);
          return (
            <motion.button key={i} whileTap={{ scale: 0.9 }}
              onClick={() => handlePick(i)}
              disabled={picked.includes(i)}
              className={`relative rounded-2xl p-4 flex flex-col items-center gap-1 border-2 transition-colors ${picked.includes(i) ? "bg-white/40 border-white" : "bg-white/10 border-white/30"}`}>
              {pickPos >= 0 && (
                <span className="absolute top-1 right-2 text-white font-black text-base">{pickPos + 1}</span>
              )}
              <span className="text-4xl">{s.emoji}</span>
              <span className="text-white font-bold text-xs">{s.name}</span>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className={`text-center text-xl font-black py-3 rounded-2xl ${feedback === "correct" ? "bg-green-400/50 text-white" : "bg-red-400/50 text-white"}`}>
            {feedback === "correct" ? "🦋 Amazing!" : "❌ Let's try again!"}
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

  function makeQ() {
    const ci = Math.floor(Math.random() * 3);
    const si = Math.floor(Math.random() * 3);
    const cycle = CYCLES[ci];
    const shown = cycle.stages[si];
    const answer = cycle.stages[si + 1];
    const distractors = shuffle(
      CYCLES.flatMap(c => c.stages).filter(s => s.name !== answer.name)
    ).slice(0, 3);
    return { cycle, shown, answer, choices: shuffle([answer, ...distractors]) };
  }

  const [q, setQ] = useState(makeQ);

  function handleAnswer(name: string) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (name === q.answer.name) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => { setFeedback("idle"); setQ(makeQ()); }, 1200);
  }

  return (
    <div className="p-4">
      <p className="text-center text-white/80 text-sm mb-1">What comes next?</p>
      <p className="text-center text-white/60 text-xs mb-3">{q.cycle.name} life cycle</p>
      <div className="flex items-center justify-center gap-3 mb-5">
        <motion.div key={q.shown.name} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
          className="bg-white/20 rounded-2xl p-4 flex flex-col items-center">
          <span className="text-5xl">{q.shown.emoji}</span>
          <span className="text-white font-bold text-sm mt-1">{q.shown.name}</span>
        </motion.div>
        <span className="text-white text-3xl">→</span>
        <div className="bg-white/10 border-2 border-dashed border-white/40 rounded-2xl p-4 flex flex-col items-center w-24 h-24 justify-center">
          <span className="text-white/50 text-3xl">?</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.choices.map((ch, i) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(ch.name)}
            className="bg-white/15 border-2 border-white/30 rounded-2xl p-3 flex flex-col items-center gap-1">
            <span className="text-3xl">{ch.emoji}</span>
            <span className="text-white font-bold text-xs">{ch.name}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className={`mt-3 text-center text-xl font-black py-3 rounded-2xl ${feedback === "correct" ? "bg-green-400/50 text-white" : "bg-red-400/50 text-white"}`}>
            {feedback === "correct" ? "🐸 Yes!" : `It's the ${q.answer.name}!`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AnimalCycleGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-2 px-4 mb-2">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${tab === t ? "bg-white text-amber-700" : "bg-white/20 text-white"}`}>
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
