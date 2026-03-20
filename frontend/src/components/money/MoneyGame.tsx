"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Coin { id: string; name: string; emoji: string; value: number; color: string; fact: string }

const COINS: Coin[] = [
  { id: "penny",   name: "Penny",   emoji: "🟤", value: 1,  color: "bg-amber-700",  fact: "Worth 1 cent. It's copper-colored!" },
  { id: "nickel",  name: "Nickel",  emoji: "⚪", value: 5,  color: "bg-gray-400",   fact: "Worth 5 cents. It's silver-colored!" },
  { id: "dime",    name: "Dime",    emoji: "⚪", value: 10, color: "bg-gray-300",   fact: "Worth 10 cents — the smallest coin!" },
  { id: "quarter", name: "Quarter", emoji: "⚪", value: 25, color: "bg-gray-400",   fact: "Worth 25 cents — the biggest coin!" },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Learn Coins ──────────────────────────────────────────────────────────────
function LearnCoins() {
  const [selected, setSelected] = useState<Coin | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">Tap each coin to learn about it!</p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {COINS.map((c) => (
          <motion.button key={c.id} onClick={() => setSelected(c)}
            className={`flex flex-col items-center ${c.color} rounded-2xl py-5 px-3 gap-2 shadow-lg`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }}>
            <div className={`w-14 h-14 rounded-full ${c.color} border-4 border-white/50 flex items-center justify-center shadow-inner`}>
              <span className="text-white font-black text-lg">{c.value}¢</span>
            </div>
            <p className="text-white font-black">{c.name}</p>
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
              <div className={`w-24 h-24 rounded-full ${selected.color} flex items-center justify-center shadow-xl`}>
                <span className="text-white font-black text-3xl">{selected.value}¢</span>
              </div>
              <p className="text-yellow-700 font-black text-2xl">{selected.name}</p>
              <p className="text-gray-500 text-sm text-center">{selected.fact}</p>
              <p className="text-green-600 font-black text-lg">= {selected.value} cent{selected.value !== 1 ? "s" : ""}</p>
              <button onClick={() => setSelected(null)}
                className="bg-green-500 text-white font-bold px-6 py-2 rounded-full">Got it! ✓</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Name the Coin quiz ───────────────────────────────────────────────────────
function CoinQuiz({ onScore }: Props) {
  const [seq] = useState(() => {
    const arr: Coin[] = [];
    for (let i = 0; i < 20; i++) arr.push(COINS[Math.floor(Math.random() * COINS.length)]);
    return arr;
  });
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const target = seq[idx % seq.length];
  const roundChoices = shuffle(COINS);

  function pick(c: Coin) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (c.id === target.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1000);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">What is the name of this coin?</p>

      <motion.div key={idx} className="flex flex-col items-center gap-2 bg-white/20 rounded-2xl px-10 py-6"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className={`w-24 h-24 rounded-full ${target.color} flex items-center justify-center shadow-xl border-4 border-white/30`}>
          <span className="text-white font-black text-2xl">{target.value}¢</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {roundChoices.map((c) => (
          <motion.button key={c.id} onClick={() => pick(c)}
            className={`py-4 rounded-2xl font-black text-lg shadow
              ${feedback !== "idle" && c.id === target.id ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && c.id !== target.id ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white text-yellow-700" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            {c.name}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {target.name}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Look at the value!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Count coins ──────────────────────────────────────────────────────────────
function CountCoins({ onScore }: Props) {
  type Round = { coins: Coin[]; total: number; choices: number[] };

  function makeRound(): Round {
    const count = 2 + Math.floor(Math.random() * 3); // 2–4 coins
    const coins = Array.from({ length: count }, () => COINS[Math.floor(Math.random() * 2)]); // penny/nickel only to keep it simple
    const total = coins.reduce((s, c) => s + c.value, 0);
    const wrongs = new Set<number>();
    while (wrongs.size < 3) {
      const w = total + (Math.floor(Math.random() * 5) - 2);
      if (w !== total && w > 0) wrongs.add(w);
    }
    return { coins, total, choices: shuffle([total, ...Array.from(wrongs)]) };
  }

  const [round, setRound] = useState<Round>(() => makeRound());
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  function pick(val: number) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (val === round.total) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setRound(makeRound()); }, 1100);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">How many cents altogether?</p>

      <motion.div key={round.total + round.coins.length} className="flex flex-col items-center bg-white/20 rounded-2xl px-8 py-5 gap-4"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="flex gap-3 flex-wrap justify-center">
          {round.coins.map((c, i) => (
            <div key={i} className={`w-14 h-14 rounded-full ${c.color} flex items-center justify-center border-4 border-white/30`}>
              <span className="text-white font-black">{c.value}¢</span>
            </div>
          ))}
        </div>
        <p className="text-white/70 text-xs">{round.coins.map((c) => `${c.value}¢`).join(" + ")}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {round.choices.map((val) => (
          <motion.button key={val} onClick={() => pick(val)}
            className={`py-5 rounded-2xl font-black text-2xl shadow
              ${feedback !== "idle" && val === round.total ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && val !== round.total ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white text-green-700" : ""}`}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
            {val}¢
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {round.total}¢!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Add them up!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Learn", "Name", "Count"] as const;
type Tab = typeof TABS[number];

export default function MoneyGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-green-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "📚 Learn" : t === "Name" ? "🏷️ Name It" : "🔢 Count It"}
          </button>
        ))}
      </div>
      {tab === "Learn" && <LearnCoins />}
      {tab === "Name"  && <CoinQuiz  onScore={onScore} />}
      {tab === "Count" && <CountCoins onScore={onScore} />}
    </div>
  );
}
