"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SafetyRule {
  id: string;
  category: "road" | "home" | "fire" | "water";
  rule: string;
  emoji: string;
  isSafe: boolean; // for true/false quiz
  tip: string;
}

const SAFETY_RULES: SafetyRule[] = [
  // Road Safety
  { id: "r1", category: "road", rule: "Look both ways before crossing the street", emoji: "👀", isSafe: true,  tip: "Always stop, look left, right, then left again!" },
  { id: "r2", category: "road", rule: "Hold a grown-up's hand when crossing", emoji: "🤝", isSafe: true,  tip: "A grown-up can see dangers you might miss." },
  { id: "r3", category: "road", rule: "Run across the street quickly", emoji: "🏃", isSafe: false, tip: "Never run! Walk calmly so drivers can see you." },
  { id: "r4", category: "road", rule: "Wear a helmet when riding a bike", emoji: "⛑️", isSafe: true,  tip: "Helmets protect your head if you fall." },
  // Home Safety
  { id: "h1", category: "home", rule: "Never touch the hot stove", emoji: "🔥", isSafe: true,  tip: "The stove is very hot — ask a grown-up for help." },
  { id: "h2", category: "home", rule: "Play with electrical outlets", emoji: "⚡", isSafe: false, tip: "Outlets have electricity — never put anything in them!" },
  { id: "h3", category: "home", rule: "Tell a grown-up if a stranger knocks", emoji: "🚪", isSafe: true,  tip: "Never open the door without asking a grown-up." },
  { id: "h4", category: "home", rule: "Pick up medicines and eat them like candy", emoji: "💊", isSafe: false, tip: "Medicine is not candy — only take it from a grown-up." },
  // Fire Safety
  { id: "f1", category: "fire", rule: "Stop, drop, and roll if clothes catch fire", emoji: "🛑", isSafe: true,  tip: "Stop! Drop to ground! Roll to put out the fire!" },
  { id: "f2", category: "fire", rule: "Go back for toys in a fire", emoji: "🧸", isSafe: false, tip: "Leave everything! Get out fast and call for help." },
  { id: "f3", category: "fire", rule: "Know your home's meeting place", emoji: "🏠", isSafe: true,  tip: "Pick a spot outside where everyone meets in an emergency." },
  { id: "f4", category: "fire", rule: "Never play with matches or lighters", emoji: "🔥", isSafe: true,  tip: "Only grown-ups should use fire tools." },
  // Water Safety
  { id: "w1", category: "water", rule: "Always swim with a grown-up watching", emoji: "🏊", isSafe: true,  tip: "Never swim alone — even good swimmers need a buddy!" },
  { id: "w2", category: "water", rule: "Wear a life jacket on a boat", emoji: "🦺", isSafe: true,  tip: "Life jackets help you float if you fall in." },
  { id: "w3", category: "water", rule: "Run beside the swimming pool", emoji: "💨", isSafe: false, tip: "Pool decks are slippery — always walk!" },
  { id: "w4", category: "water", rule: "Jump into water you don't know", emoji: "🤿", isSafe: false, tip: "Check how deep the water is before jumping." },
];

const CATEGORIES: { id: SafetyRule["category"]; label: string; emoji: string; color: string }[] = [
  { id: "road",  label: "Road",  emoji: "🚗", color: "from-blue-500 to-indigo-700"  },
  { id: "home",  label: "Home",  emoji: "🏠", color: "from-green-500 to-emerald-700" },
  { id: "fire",  label: "Fire",  emoji: "🔥", color: "from-orange-500 to-red-700"   },
  { id: "water", label: "Water", emoji: "🌊", color: "from-sky-400 to-blue-700"     },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Learn tab ────────────────────────────────────────────────────────────────
function LearnSafety() {
  const [cat, setCat] = useState<SafetyRule["category"]>("road");
  const [selected, setSelected] = useState<SafetyRule | null>(null);
  const rules = SAFETY_RULES.filter((r) => r.category === cat && r.isSafe);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="flex gap-2 flex-wrap justify-center">
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={`px-3 py-1 rounded-full font-black text-sm ${cat === c.id ? "bg-white text-red-700" : "bg-white/20 text-white"}`}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {rules.map((r) => (
          <motion.button key={r.id} onClick={() => setSelected(r)}
            className="flex items-center gap-3 bg-white/20 rounded-2xl px-4 py-3 text-left"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <span className="text-4xl">{r.emoji}</span>
            <p className="text-white font-bold text-sm flex-1">{r.rule}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}>
            <motion.div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-3 mx-6"
              initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}
              onClick={(e) => e.stopPropagation()}>
              <span className="text-7xl">{selected.emoji}</span>
              <p className="text-green-600 font-black text-lg text-center">{selected.rule}</p>
              <div className="bg-green-50 rounded-2xl p-4">
                <p className="text-gray-600 text-sm text-center">💡 {selected.tip}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="bg-green-500 text-white font-bold px-6 py-2 rounded-full">Got it! ✓</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Safe or Not Safe quiz ─────────────────────────────────────────────────────
function SafeQuiz({ onScore }: Props) {
  const [queue] = useState(() => shuffle(SAFETY_RULES));
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const rule = queue[idx % queue.length];

  function answer(isSafe: boolean) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (isSafe === rule.isSafe) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1200);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Is this SAFE or NOT SAFE?</p>

      <motion.div key={idx} className="flex flex-col items-center bg-white/20 rounded-2xl px-8 py-6 gap-3"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-6xl">{rule.emoji}</span>
        <p className="text-white font-black text-base text-center">{rule.rule}</p>
      </motion.div>

      <div className="flex gap-4">
        <motion.button onClick={() => answer(true)}
          className={`flex flex-col items-center px-8 py-5 rounded-2xl font-black shadow text-white
            ${feedback !== "idle" && rule.isSafe ? "bg-green-500" : "bg-green-500/80"}`}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
          <span className="text-4xl">✅</span>
          <span>SAFE</span>
        </motion.button>
        <motion.button onClick={() => answer(false)}
          className={`flex flex-col items-center px-8 py-5 rounded-2xl font-black shadow text-white
            ${feedback !== "idle" && !rule.isSafe ? "bg-red-500" : "bg-red-500/80"}`}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
          <span className="text-4xl">❌</span>
          <span>NOT SAFE</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {feedback === "correct" && (
          <motion.div className="flex flex-col items-center gap-1" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <p className="text-yellow-200 font-black text-xl">🌟 Correct!</p>
            <p className="text-white/80 text-xs text-center max-w-xs">{rule.tip}</p>
          </motion.div>
        )}
        {feedback === "wrong" && (
          <motion.div className="flex flex-col items-center gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-red-200 font-black text-lg">Think about it!</p>
            <p className="text-white/80 text-xs text-center max-w-xs">{rule.tip}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Learn", "Quiz"] as const;
type Tab = typeof TABS[number];

export default function SafetyGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-red-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "📚 Learn" : "🎯 Safe or Not?"}
          </button>
        ))}
      </div>
      {tab === "Learn" && <LearnSafety />}
      {tab === "Quiz"  && <SafeQuiz onScore={onScore} />}
    </div>
  );
}
