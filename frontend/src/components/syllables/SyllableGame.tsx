"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onScore: (c: number, t: number) => void;
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const WORDS = [
  { word: "cat", syllables: 1, parts: ["cat"], emoji: "🐱" },
  { word: "dog", syllables: 1, parts: ["dog"], emoji: "🐶" },
  { word: "bird", syllables: 1, parts: ["bird"], emoji: "🐦" },
  { word: "fish", syllables: 1, parts: ["fish"], emoji: "🐟" },
  { word: "cake", syllables: 1, parts: ["cake"], emoji: "🎂" },
  { word: "sun", syllables: 1, parts: ["sun"], emoji: "☀️" },
  { word: "rabbit", syllables: 2, parts: ["rab", "bit"], emoji: "🐰" },
  { word: "tiger", syllables: 2, parts: ["ti", "ger"], emoji: "🐯" },
  { word: "monkey", syllables: 2, parts: ["mon", "key"], emoji: "🐵" },
  { word: "apple", syllables: 2, parts: ["ap", "ple"], emoji: "🍎" },
  { word: "flower", syllables: 2, parts: ["flow", "er"], emoji: "🌸" },
  { word: "penguin", syllables: 2, parts: ["pen", "guin"], emoji: "🐧" },
  { word: "elephant", syllables: 3, parts: ["el", "e", "phant"], emoji: "🐘" },
  { word: "butterfly", syllables: 3, parts: ["but", "ter", "fly"], emoji: "🦋" },
  { word: "umbrella", syllables: 3, parts: ["um", "brel", "la"], emoji: "☂️" },
  { word: "banana", syllables: 3, parts: ["ba", "na", "na"], emoji: "🍌" },
];

const PART_COLORS = ["bg-yellow-300 text-yellow-900", "bg-pink-300 text-pink-900", "bg-sky-300 text-sky-900"];

type Mode = "learn" | "quiz";

export default function SyllableGame({ onScore }: Props) {
  const [mode, setMode] = useState<Mode>("learn");
  const [learnIdx, setLearnIdx] = useState(0);
  const [queue] = useState(() => shuffle(WORDS));
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [choices] = useState(() => [1, 2, 3]);

  const current = queue[qIdx % queue.length];
  const learnWord = WORDS[learnIdx % WORDS.length];

  const handleAnswer = (n: number) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (n === current.syllables) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(() => {
        setQIdx((i) => i + 1);
        setFeedback("idle");
      }, 1100);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 900);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Mode Tabs */}
      <div className="flex gap-3">
        {(["learn", "quiz"] as Mode[]).map((m) => (
          <motion.button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-xl font-extrabold text-sm ${mode === m ? "bg-white text-purple-700 shadow-lg" : "bg-white/30 text-white"}`}
            whileTap={{ scale: 0.95 }}
          >
            {m === "learn" ? "📖 Learn" : "🧠 Quiz"}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "learn" && (
          <motion.div key="learn" className="flex flex-col items-center gap-5 w-full"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <p className="text-white font-extrabold text-lg">Clap for each syllable! 👏</p>
            <motion.div key={learnWord.word} className="bg-white/20 rounded-3xl p-6 flex flex-col items-center gap-3"
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <span className="text-8xl">{learnWord.emoji}</span>
              <div className="flex gap-2 flex-wrap justify-center">
                {learnWord.parts.map((part, i) => (
                  <span key={i} className={`text-3xl font-black px-3 py-1 rounded-xl ${PART_COLORS[i % PART_COLORS.length]}`}>
                    {part}
                  </span>
                ))}
              </div>
              <p className="text-white/80 text-base">
                {learnWord.syllables === 1 ? "1 syllable" : learnWord.syllables === 2 ? "2 syllables" : "3 syllables"}
              </p>
            </motion.div>
            <div className="flex gap-4">
              <motion.button onClick={() => setLearnIdx((i) => i - 1 + WORDS.length)}
                className="bg-white/30 text-white px-5 py-2 rounded-xl font-bold" whileTap={{ scale: 0.95 }}>
                ← Prev
              </motion.button>
              <motion.button onClick={() => setLearnIdx((i) => i + 1)}
                className="bg-white/30 text-white px-5 py-2 rounded-xl font-bold" whileTap={{ scale: 0.95 }}>
                Next →
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === "quiz" && (
          <motion.div key="quiz" className="flex flex-col items-center gap-5 w-full"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <p className="text-white font-extrabold text-lg">How many syllables? 🤔</p>
            <AnimatePresence mode="wait">
              <motion.div key={current.word} className="bg-white/20 rounded-3xl p-6 flex flex-col items-center gap-2"
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="text-8xl">{current.emoji}</span>
                <p className="text-4xl font-black text-white">{current.word.toUpperCase()}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-5">
              {choices.map((n) => (
                <motion.button key={n} onClick={() => handleAnswer(n)}
                  className={`w-20 h-20 rounded-2xl text-4xl font-black shadow-lg flex items-center justify-center
                    ${feedback === "correct" && n === current.syllables ? "bg-green-300 text-green-900" :
                      feedback === "wrong" && n !== current.syllables ? "bg-red-300/60 text-red-900" : "bg-white/30 text-white"}`}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  {n}
                </motion.button>
              ))}
            </div>
            {feedback === "correct" && (
              <motion.p className="text-2xl font-black text-yellow-200" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                🌟 {current.parts.join("-")} = {current.syllables}!
              </motion.p>
            )}
            {feedback === "wrong" && (
              <p className="text-2xl font-black text-red-200">Try again! 💪</p>
            )}
            <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
