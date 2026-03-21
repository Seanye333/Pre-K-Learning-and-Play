"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

interface ColorItem {
  name: string;
  hex: string;
  examples: string[];
}

const COLORS: ColorItem[] = [
  { name: "red",    hex: "#ef4444", examples: ["🍎", "🌹", "🚒"] },
  { name: "orange", hex: "#f97316", examples: ["🍊", "🎃", "🦊"] },
  { name: "yellow", hex: "#eab308", examples: ["🌟", "🍋", "🌻"] },
  { name: "green",  hex: "#22c55e", examples: ["🐸", "🌿", "🥦"] },
  { name: "blue",   hex: "#3b82f6", examples: ["🌊", "🔵", "🐳"] },
  { name: "purple", hex: "#a855f7", examples: ["🍇", "🦄", "🪻"] },
  { name: "pink",   hex: "#ec4899", examples: ["🌸", "🩷", "🐷"] },
  { name: "brown",  hex: "#92400e", examples: ["🐻", "🍫", "🪵"] },
  { name: "black",  hex: "#1f2937", examples: ["🦇", "🎩", "🐈‍⬛"] },
  { name: "white",  hex: "#f3f4f6", examples: ["⛄", "🤍", "🕊️"] },
];

function ColorCircle({ hex, size = 80 }: { hex: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: hex, boxShadow: "0 4px 15px rgba(0,0,0,0.25)", border: "3px solid rgba(255,255,255,0.5)" }} />
  );
}

export default function ColorWords({ onScore }: Props) {
  const [tab, setTab] = useState<"learn" | "read" | "match">("learn");
  const [learnIdx, setLearnIdx] = useState(0);

  // Read tab: show word → pick circle
  const [readIdx, setReadIdx] = useState(0);
  const [readChoices, setReadChoices] = useState<ColorItem[]>(() => makeChoices(0));
  const [readFb, setReadFb] = useState<"idle" | "correct" | "wrong">("idle");

  // Match tab: show circle → pick word
  const [matchIdx, setMatchIdx] = useState(0);
  const [matchChoices, setMatchChoices] = useState<ColorItem[]>(() => makeChoices(0));
  const [matchFb, setMatchFb] = useState<"idle" | "correct" | "wrong">("idle");

  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  function makeChoices(answerIdx: number): ColorItem[] {
    const answer = COLORS[answerIdx];
    const others = shuffle(COLORS.filter((_, i) => i !== answerIdx)).slice(0, 3);
    return shuffle([answer, ...others]);
  }

  const pickRead = useCallback((color: ColorItem) => {
    if (readFb !== "idle") return;
    const isCorrect = color.name === COLORS[readIdx].name;
    const nc = correct + (isCorrect ? 1 : 0);
    const nt = total + 1;
    setCorrect(nc); setTotal(nt);
    onScore(nc, nt);
    setReadFb(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setReadFb("idle");
      const next = (readIdx + 1) % COLORS.length;
      setReadIdx(next);
      setReadChoices(makeChoices(next));
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readFb, readIdx, correct, total, onScore]);

  const pickMatch = useCallback((color: ColorItem) => {
    if (matchFb !== "idle") return;
    const isCorrect = color.name === COLORS[matchIdx].name;
    const nc = correct + (isCorrect ? 1 : 0);
    const nt = total + 1;
    setCorrect(nc); setTotal(nt);
    onScore(nc, nt);
    setMatchFb(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setMatchFb("idle");
      const next = (matchIdx + 1) % COLORS.length;
      setMatchIdx(next);
      setMatchChoices(makeChoices(next));
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchFb, matchIdx, correct, total, onScore]);

  const learnColor = COLORS[learnIdx];
  const readColor = COLORS[readIdx];
  const matchColor = COLORS[matchIdx];

  return (
    <div className="flex flex-col items-center gap-3 p-4 w-full">
      {/* Tabs */}
      <div className="flex gap-2">
        {(["learn", "read", "match"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-rose-600 shadow" : "bg-white/20 text-white"}`}>
            {t === "learn" ? "📚 Learn" : t === "read" ? "📖 Read" : "🎨 Match"}
          </button>
        ))}
      </div>

      {/* LEARN */}
      {tab === "learn" && (
        <AnimatePresence mode="wait">
          <motion.div key={learnIdx}
            className="flex flex-col items-center gap-4 bg-white/20 rounded-3xl p-6 w-full max-w-sm"
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
            <ColorCircle hex={learnColor.hex} size={110} />
            <span className="text-5xl font-black tracking-widest" style={{ color: learnColor.hex, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
              {learnColor.name.toUpperCase()}
            </span>
            <div className="flex gap-3 text-5xl">{learnColor.examples.map((e, i) => <span key={i}>{e}</span>)}</div>
            <p className="text-white/80 text-sm">Things that are {learnColor.name}!</p>
            <div className="flex gap-4 items-center mt-1">
              <motion.button onClick={() => setLearnIdx((i) => (i - 1 + COLORS.length) % COLORS.length)}
                className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>← Back</motion.button>
              <span className="text-white/70 text-sm">{learnIdx + 1} / {COLORS.length}</span>
              <motion.button onClick={() => setLearnIdx((i) => (i + 1) % COLORS.length)}
                className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>Next →</motion.button>
            </div>
            <div className="flex gap-1 flex-wrap justify-center">
              {COLORS.map((c, i) => (
                <div key={i} onClick={() => setLearnIdx(i)}
                  className="w-5 h-5 rounded-full cursor-pointer border-2 transition-all"
                  style={{ background: c.hex, borderColor: i === learnIdx ? "white" : "transparent", transform: i === learnIdx ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* READ: word → pick circle */}
      {tab === "read" && (
        <AnimatePresence mode="wait">
          <motion.div key={readIdx}
            className="flex flex-col items-center gap-4 w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <p className="text-white font-bold text-lg">Find the color! 👇</p>
            <div className="bg-white/20 rounded-2xl px-10 py-5">
              <span className="text-5xl font-black tracking-widest" style={{ color: readColor.hex, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                {readColor.name.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              {readChoices.map((color) => {
                const isAnswer = color.name === readColor.name;
                let ringCls = "rounded-2xl p-4 flex items-center justify-center cursor-pointer border-4 transition-all";
                if (readFb === "correct" && isAnswer) ringCls += " border-green-300 bg-green-400/30 scale-105";
                else if (readFb === "wrong" && isAnswer) ringCls += " border-red-300 bg-red-400/30";
                else ringCls += " border-white/30 bg-white/10";
                return (
                  <motion.div key={color.name} className={ringCls} onClick={() => pickRead(color)}
                    whileHover={{ scale: readFb === "idle" ? 1.06 : 1 }} whileTap={{ scale: readFb === "idle" ? 0.94 : 1 }}>
                    <ColorCircle hex={color.hex} size={60} />
                  </motion.div>
                );
              })}
            </div>
            <p className="text-white/70 text-sm">Score: {correct} / {total}</p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* MATCH: circle → pick word */}
      {tab === "match" && (
        <AnimatePresence mode="wait">
          <motion.div key={matchIdx}
            className="flex flex-col items-center gap-4 w-full max-w-sm"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            <p className="text-white font-bold text-lg">What color is this? 🤔</p>
            <ColorCircle hex={matchColor.hex} size={110} />
            <div className="grid grid-cols-2 gap-3 w-full">
              {matchChoices.map((color) => {
                const isAnswer = color.name === matchColor.name;
                let cls = "font-black text-lg rounded-2xl py-4 w-full shadow border-4 border-transparent transition-all";
                if (matchFb === "correct" && isAnswer) cls += " bg-green-400 text-white border-green-300";
                else if (matchFb === "wrong" && isAnswer) cls += " bg-red-400 text-white border-red-300";
                else cls += " bg-white/90 text-rose-700";
                return (
                  <motion.button key={color.name} onClick={() => pickMatch(color)} className={cls}
                    whileHover={{ scale: matchFb === "idle" ? 1.04 : 1 }} whileTap={{ scale: matchFb === "idle" ? 0.92 : 1 }}>
                    {color.name.toUpperCase()}
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
