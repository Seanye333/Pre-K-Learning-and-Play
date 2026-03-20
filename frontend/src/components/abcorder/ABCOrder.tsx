"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

// Pick N consecutive letters starting at a random position
function makeRound(n: number): { letters: string[]; sorted: string[] } {
  const start = Math.floor(Math.random() * (ALPHABET.length - n));
  const sorted = ALPHABET.slice(start, start + n);
  return { letters: shuffle(sorted), sorted };
}

interface Props { onScore: (c: number, t: number) => void; }

// ── A-B-C Order game ─────────────────────────────────────────────────────────
function OrderGame({ onScore }: Props) {
  const [size, setSize] = useState(3);
  const [round, setRound] = useState(() => makeRound(3));
  const [chosen, setChosen] = useState<string[]>([]);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  function tap(letter: string) {
    if (feedback !== "idle" || chosen.includes(letter)) return;
    const next = [...chosen, letter];
    setChosen(next);

    if (next.length === round.sorted.length) {
      const isCorrect = next.every((l, i) => l === round.sorted[i]);
      const nt = total + 1; setTotal(nt);
      if (isCorrect) {
        const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
      } else { setFB("wrong"); }
      setTimeout(() => {
        setFB("idle"); setChosen([]); setRound(makeRound(size));
      }, 1200);
    }
  }

  function changeSize(n: number) {
    setSize(n); setChosen([]); setFB("idle"); setRound(makeRound(n));
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      {/* Difficulty */}
      <div className="flex gap-2">
        {[3, 4, 5].map((n) => (
          <button key={n} onClick={() => changeSize(n)}
            className={`px-4 py-1 rounded-full font-black text-sm ${size === n ? "bg-white text-orange-700" : "bg-white/20 text-white"}`}>
            {n} Letters
          </button>
        ))}
      </div>

      <p className="text-white font-bold text-sm">Tap the letters in A-B-C order!</p>

      {/* Tap-order display */}
      <div className="flex gap-2">
        {Array.from({ length: round.sorted.length }).map((_, i) => (
          <div key={i} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl
            ${chosen[i] ? (feedback === "wrong" ? "bg-red-400 text-white" : "bg-green-400 text-white") : "border-4 border-dashed border-white/50 text-white/30"}`}>
            {chosen[i] ?? "?"}
          </div>
        ))}
      </div>

      {/* Letter pool */}
      <div className="flex gap-3 flex-wrap justify-center">
        {round.letters.map((l) => (
          <motion.button key={l} onClick={() => tap(l)}
            disabled={chosen.includes(l) || feedback !== "idle"}
            className={`w-16 h-16 rounded-2xl font-black text-3xl shadow
              ${chosen.includes(l) ? "bg-white/20 text-white/30" : "bg-white text-orange-700"}`}
            whileHover={{ scale: chosen.includes(l) ? 1 : 1.1 }} whileTap={{ scale: 0.88 }}>
            {l}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {round.sorted.join(" → ")}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Remember A comes before B!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Alphabet chart ────────────────────────────────────────────────────────────
function AlphabetChart() {
  const [highlighted, setHighlighted] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">Tap any letter to highlight it!</p>
      <div className="grid grid-cols-7 gap-2">
        {ALPHABET.map((l, i) => (
          <motion.button key={l} onClick={() => setHighlighted(l === highlighted ? null : l)}
            className={`w-10 h-10 rounded-xl font-black text-lg shadow
              ${highlighted === l ? "bg-yellow-300 text-orange-700" : "bg-white/20 text-white"}`}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {l}
          </motion.button>
        ))}
      </div>
      {highlighted && (
        <motion.div className="bg-white/20 rounded-2xl px-6 py-3 text-center"
          initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <p className="text-white font-black text-5xl">{highlighted}</p>
          <p className="text-white/70 text-sm">Letter #{ALPHABET.indexOf(highlighted) + 1}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── What comes next? ──────────────────────────────────────────────────────────
function NextLetterGame({ onScore }: Props) {
  const [seq] = useState<string[]>(() => {
    const arr: string[] = [];
    for (let i = 0; i < 24; i++) {
      const idx = Math.floor(Math.random() * (ALPHABET.length - 1));
      arr.push(ALPHABET[idx]);
    }
    return arr;
  });
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const shown = seq[idx % seq.length];
  const answerIdx = ALPHABET.indexOf(shown) + 1;
  const answer = ALPHABET[answerIdx];
  const wrongs = shuffle(ALPHABET.filter((l) => l !== answer && l !== shown)).slice(0, 3);
  const choices = shuffle([answer, ...wrongs]);

  function pick(l: string) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (l === answer) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1000);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">What letter comes after?</p>

      <motion.div key={idx} className="flex flex-col items-center bg-white/20 rounded-2xl px-12 py-6"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <p className="text-white font-black text-7xl">{shown}</p>
        <p className="text-white/60 text-sm">→ ?</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {choices.map((l) => (
          <motion.button key={l} onClick={() => pick(l)}
            className={`py-5 rounded-2xl font-black text-3xl shadow
              ${feedback !== "idle" && l === answer ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && l !== answer ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white text-orange-700" : ""}`}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
            {l}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {shown} → {answer}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Sing the ABC song!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Chart", "Order", "Next"] as const;
type Tab = typeof TABS[number];

export default function ABCOrder({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Chart");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-orange-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Chart" ? "📋 Chart" : t === "Order" ? "🔤 Order" : "➡️ What's Next"}
          </button>
        ))}
      </div>
      {tab === "Chart" && <AlphabetChart />}
      {tab === "Order" && <OrderGame    onScore={onScore} />}
      {tab === "Next"  && <NextLetterGame onScore={onScore} />}
    </div>
  );
}
