"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onScore: (c: number, t: number) => void;
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

type Rule = "add-s" | "add-es" | "y-to-ies" | "special";

const WORDS = [
  { singular: "cat", plural: "cats", emoji: "🐱", rule: "add-s" as Rule },
  { singular: "dog", plural: "dogs", emoji: "🐶", rule: "add-s" as Rule },
  { singular: "bird", plural: "birds", emoji: "🐦", rule: "add-s" as Rule },
  { singular: "star", plural: "stars", emoji: "⭐", rule: "add-s" as Rule },
  { singular: "box", plural: "boxes", emoji: "📦", rule: "add-es" as Rule },
  { singular: "fox", plural: "foxes", emoji: "🦊", rule: "add-es" as Rule },
  { singular: "bus", plural: "buses", emoji: "🚌", rule: "add-es" as Rule },
  { singular: "dish", plural: "dishes", emoji: "🍽️", rule: "add-es" as Rule },
  { singular: "baby", plural: "babies", emoji: "👶", rule: "y-to-ies" as Rule },
  { singular: "bunny", plural: "bunnies", emoji: "🐰", rule: "y-to-ies" as Rule },
  { singular: "berry", plural: "berries", emoji: "🍓", rule: "y-to-ies" as Rule },
  { singular: "daisy", plural: "daisies", emoji: "🌼", rule: "y-to-ies" as Rule },
  { singular: "fish", plural: "fish", emoji: "🐟", rule: "special" as Rule },
  { singular: "sheep", plural: "sheep", emoji: "🐑", rule: "special" as Rule },
  { singular: "tooth", plural: "teeth", emoji: "🦷", rule: "special" as Rule },
  { singular: "foot", plural: "feet", emoji: "🦶", rule: "special" as Rule },
];

const RULE_COLORS: Record<Rule, string> = {
  "add-s": "bg-blue-300 text-blue-900",
  "add-es": "bg-green-300 text-green-900",
  "y-to-ies": "bg-pink-300 text-pink-900",
  "special": "bg-yellow-300 text-yellow-900",
};

const RULE_LABELS: Record<Rule, string> = {
  "add-s": "Add -s",
  "add-es": "Add -es",
  "y-to-ies": "Change y → ies",
  "special": "Special word!",
};

type Mode = "learn" | "quiz" | "count";

export default function PluralsGame({ onScore }: Props) {
  const [mode, setMode] = useState<Mode>("learn");
  const [learnIdx, setLearnIdx] = useState(0);
  const [queue] = useState(() => shuffle(WORDS));
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [countQueue] = useState(() =>
    shuffle(WORDS).map((w) => {
      const n = Math.random() > 0.5 ? 1 : 3;
      return { word: w, count: n };
    })
  );

  const [quizQueue] = useState(() =>
    shuffle(WORDS).map((item) => {
      const wrong = shuffle(WORDS.filter((w) => w.plural !== item.plural)).slice(0, 3).map((w) => w.plural);
      return { item, choices: shuffle([item.plural, ...wrong]) };
    })
  );

  const qi = qIdx % quizQueue.length;
  const ci = qIdx % countQueue.length;
  const learnWord = WORDS[learnIdx % WORDS.length];

  const handleQuiz = (choice: string) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (choice === quizQueue[qi].item.plural) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(() => { setQIdx((i) => i + 1); setFeedback("idle"); }, 1100);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 900);
    }
  };

  const handleCount = (isSingular: boolean) => {
    if (feedback !== "idle") return;
    const cItem = countQueue[ci];
    const correct_ = isSingular === (cItem.count === 1);
    const newTotal = total + 1;
    setTotal(newTotal);
    if (correct_) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(() => { setQIdx((i) => i + 1); setFeedback("idle"); }, 1100);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 900);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="flex gap-2 flex-wrap justify-center">
        {(["learn", "quiz", "count"] as Mode[]).map((m) => (
          <motion.button key={m} onClick={() => { setMode(m); setQIdx(0); setFeedback("idle"); }}
            className={`px-4 py-2 rounded-xl font-extrabold text-sm ${mode === m ? "bg-white text-red-600 shadow-lg" : "bg-white/30 text-white"}`}
            whileTap={{ scale: 0.95 }}>
            {m === "learn" ? "📖 Learn" : m === "quiz" ? "🧠 Quiz" : "🔢 Count"}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "learn" && (
          <motion.div key="learn" className="flex flex-col items-center gap-4 w-full"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <AnimatePresence mode="wait">
              <motion.div key={learnWord.singular} className="bg-white/20 rounded-3xl p-5 flex flex-col items-center gap-2"
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="text-7xl">{learnWord.emoji}</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-white">{learnWord.singular}</span>
                  <span className="text-2xl text-white/60">→</span>
                  <span className="text-3xl font-black text-yellow-200">{learnWord.plural}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${RULE_COLORS[learnWord.rule]}`}>
                  {RULE_LABELS[learnWord.rule]}
                </span>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-4">
              <motion.button onClick={() => setLearnIdx((i) => (i - 1 + WORDS.length) % WORDS.length)}
                className="bg-white/30 text-white px-5 py-2 rounded-xl font-bold" whileTap={{ scale: 0.95 }}>← Prev</motion.button>
              <motion.button onClick={() => setLearnIdx((i) => (i + 1) % WORDS.length)}
                className="bg-white/30 text-white px-5 py-2 rounded-xl font-bold" whileTap={{ scale: 0.95 }}>Next →</motion.button>
            </div>
          </motion.div>
        )}

        {mode === "quiz" && (
          <motion.div key={`quiz-${qi}`} className="flex flex-col items-center gap-4 w-full"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <p className="text-white font-extrabold text-lg">Pick the correct plural! ✏️</p>
            <div className="bg-white/20 rounded-3xl p-5 flex flex-col items-center gap-2">
              <span className="text-7xl">{quizQueue[qi].item.emoji}</span>
              <span className="text-4xl font-black text-white">{quizQueue[qi].item.singular.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {quizQueue[qi].choices.map((ch) => (
                <motion.button key={ch} onClick={() => handleQuiz(ch)}
                  className={`rounded-2xl py-3 px-2 font-black text-lg shadow-lg
                    ${feedback === "correct" && ch === quizQueue[qi].item.plural ? "bg-green-300 text-green-900" : "bg-white/30 text-white"}`}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>{ch}</motion.button>
              ))}
            </div>
            {feedback === "correct" && <motion.p className="text-xl font-black text-yellow-200" initial={{ scale: 0 }} animate={{ scale: 1 }}>🌟 {quizQueue[qi].item.plural}!</motion.p>}
            {feedback === "wrong" && <p className="text-xl font-black text-red-200">Try again! 💪</p>}
            <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
          </motion.div>
        )}

        {mode === "count" && (
          <motion.div key={`count-${ci}`} className="flex flex-col items-center gap-4 w-full"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <p className="text-white font-extrabold text-lg">Singular or plural?</p>
            <div className="bg-white/20 rounded-3xl p-5 flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-1">
                {Array.from({ length: countQueue[ci].count }).map((_, i) => (
                  <span key={i} className="text-5xl">{countQueue[ci].word.emoji}</span>
                ))}
              </div>
              <p className="text-white/70 text-sm mt-1">{countQueue[ci].count} {countQueue[ci].count === 1 ? countQueue[ci].word.singular : countQueue[ci].word.plural}</p>
            </div>
            <div className="flex gap-4">
              <motion.button onClick={() => handleCount(true)}
                className={`px-6 py-3 rounded-2xl font-black text-lg shadow-lg ${feedback === "correct" && countQueue[ci].count === 1 ? "bg-green-300 text-green-900" : "bg-white/30 text-white"}`}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                1 — Singular
              </motion.button>
              <motion.button onClick={() => handleCount(false)}
                className={`px-6 py-3 rounded-2xl font-black text-lg shadow-lg ${feedback === "correct" && countQueue[ci].count > 1 ? "bg-green-300 text-green-900" : "bg-white/30 text-white"}`}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                Many — Plural
              </motion.button>
            </div>
            {feedback === "correct" && <motion.p className="text-xl font-black text-yellow-200" initial={{ scale: 0 }} animate={{ scale: 1 }}>🌟 Great job!</motion.p>}
            {feedback === "wrong" && <p className="text-xl font-black text-red-200">Try again! 💪</p>}
            <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
