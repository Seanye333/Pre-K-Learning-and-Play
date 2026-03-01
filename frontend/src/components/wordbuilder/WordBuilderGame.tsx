"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LETTER_COLORS } from "@/lib/constants";

interface WordEntry {
  word: string;
  emoji: string;
  hint: string;
}

const EASY_WORDS: WordEntry[] = [
  { word: "cat", emoji: "🐱", hint: "A furry pet that meows" },
  { word: "dog", emoji: "🐶", hint: "A furry pet that barks" },
  { word: "sun", emoji: "☀️", hint: "It shines bright in the sky" },
  { word: "hat", emoji: "🎩", hint: "You wear it on your head" },
  { word: "bug", emoji: "🐛", hint: "A tiny creature with legs" },
  { word: "cup", emoji: "🥤", hint: "You drink from this" },
  { word: "pig", emoji: "🐷", hint: "A pink farm animal" },
  { word: "fox", emoji: "🦊", hint: "An orange animal with a bushy tail" },
];

const MEDIUM_WORDS: WordEntry[] = [
  { word: "frog", emoji: "🐸", hint: "It jumps and says ribbit" },
  { word: "bird", emoji: "🐦", hint: "It has wings and can fly" },
  { word: "fish", emoji: "🐟", hint: "It swims in the water" },
  { word: "duck", emoji: "🦆", hint: "It quacks and loves water" },
  { word: "bear", emoji: "🐻", hint: "A big furry animal that loves honey" },
  { word: "star", emoji: "⭐", hint: "It twinkles in the night sky" },
  { word: "cake", emoji: "🎂", hint: "A yummy treat on your birthday" },
  { word: "rain", emoji: "🌧️", hint: "Water that falls from clouds" },
];

const HARD_WORDS: WordEntry[] = [
  { word: "tiger", emoji: "🐯", hint: "A striped jungle cat" },
  { word: "cloud", emoji: "☁️", hint: "White and fluffy in the sky" },
  { word: "train", emoji: "🚂", hint: "It rides on tracks and says choo choo" },
  { word: "grape", emoji: "🍇", hint: "A small purple or green fruit" },
  { word: "smile", emoji: "😊", hint: "When you are happy" },
  { word: "plane", emoji: "✈️", hint: "It flies people through the sky" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildLetterPool(word: string): { letter: string; id: number }[] {
  const upper = word.toUpperCase();
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const distractorCount = Math.max(2, 6 - word.length);
  const distractors = shuffle(allLetters.filter((l) => !upper.includes(l))).slice(
    0,
    distractorCount
  );
  return shuffle([...upper.split(""), ...distractors]).map((letter, id) => ({
    letter,
    id,
  }));
}

interface WordBuilderGameProps {
  difficulty: "easy" | "medium" | "hard";
  onScore: (correct: number, total: number) => void;
}

export default function WordBuilderGame({
  difficulty,
  onScore,
}: WordBuilderGameProps) {
  const wordList =
    difficulty === "easy"
      ? EASY_WORDS
      : difficulty === "medium"
      ? MEDIUM_WORDS
      : HARD_WORDS;

  const [queue] = useState(() => shuffle(wordList));
  const [wordIdx, setWordIdx] = useState(0);
  const [pool, setPool] = useState<{ letter: string; id: number }[]>([]);
  const [chosen, setChosen] = useState<{ letter: string; id: number }[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong" | "partial">(
    "idle"
  );
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);

  const currentWord = queue[wordIdx % queue.length];

  useEffect(() => {
    setPool(buildLetterPool(currentWord.word));
    setChosen([]);
    setFeedback("idle");
    setShowHint(false);
  }, [wordIdx]);

  const handlePickLetter = (tile: { letter: string; id: number }) => {
    if (feedback === "correct" || feedback === "wrong") return;
    if (chosen.some((c) => c.id === tile.id)) return;

    const newChosen = [...chosen, tile];
    setChosen(newChosen);

    if (newChosen.length === currentWord.word.length) {
      const spelled = newChosen.map((c) => c.letter).join("").toLowerCase();
      const newTotal = total + 1;
      setTotal(newTotal);

      if (spelled === currentWord.word) {
        const newCorrect = correct + 1;
        setCorrect(newCorrect);
        setStreak((s) => s + 1);
        setFeedback("correct");
        onScore(newCorrect, newTotal);
        setTimeout(() => {
          setWordIdx((i) => i + 1);
        }, 1600);
      } else {
        setStreak(0);
        setFeedback("wrong");
        setTimeout(() => {
          setChosen([]);
          setFeedback("idle");
        }, 1000);
      }
    }
  };

  const handleRemoveLetter = (idx: number) => {
    if (feedback === "correct" || feedback === "wrong") return;
    setChosen((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Streak badge */}
      {streak >= 3 && (
        <motion.div
          className="bg-yellow-300 text-yellow-900 font-black px-4 py-1 rounded-full text-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🔥 {streak} in a row!
        </motion.div>
      )}

      <p className="text-white font-extrabold text-xl">Build the word! 🏗️</p>

      {/* Word card */}
      <motion.div
        key={currentWord.word}
        className="bg-white/20 rounded-3xl p-5 flex flex-col items-center gap-2 w-full max-w-sm"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <span className="text-7xl">{currentWord.emoji}</span>
        {showHint && (
          <motion.p
            className="text-white/80 text-sm font-medium text-center"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentWord.hint}
          </motion.p>
        )}
        <button
          onClick={() => setShowHint((v) => !v)}
          className="text-white/60 text-xs underline"
        >
          {showHint ? "Hide hint" : "Show hint 💡"}
        </button>
      </motion.div>

      {/* Letter slots */}
      <div className="flex gap-2">
        {currentWord.word.split("").map((_, i) => (
          <motion.div
            key={i}
            onClick={() => chosen[i] && handleRemoveLetter(i)}
            className={`w-14 h-14 rounded-2xl border-4 flex items-center justify-center text-2xl font-black cursor-pointer select-none
              ${chosen[i]
                ? feedback === "correct"
                  ? "border-green-400 bg-green-200 text-green-800"
                  : feedback === "wrong"
                  ? "border-red-400 bg-red-200 text-red-800"
                  : "border-white bg-white text-indigo-700"
                : "border-white/40 bg-white/10 text-transparent"}`}
            animate={
              feedback === "wrong" && chosen[i]
                ? { x: [-6, 6, -6, 6, 0] }
                : feedback === "correct" && chosen[i]
                ? { scale: [1, 1.15, 1] }
                : {}
            }
            transition={{ delay: i * 0.05 }}
          >
            {chosen[i]?.letter ?? ""}
          </motion.div>
        ))}
      </div>

      {/* Letter pool */}
      <div className="flex flex-wrap justify-center gap-2 max-w-xs">
        <AnimatePresence>
          {pool.map((tile, i) => {
            const used = chosen.some((c) => c.id === tile.id);
            return (
              <motion.button
                key={tile.id}
                onClick={() => !used && handlePickLetter(tile)}
                disabled={used || feedback === "correct" || feedback === "wrong"}
                className={`w-12 h-12 rounded-xl text-xl font-black text-white shadow
                  ${LETTER_COLORS[i % LETTER_COLORS.length]}
                  ${used ? "opacity-20 cursor-not-allowed" : ""}`}
                whileHover={!used ? { scale: 1.15 } : {}}
                whileTap={!used ? { scale: 0.85 } : {}}
              >
                {tile.letter}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {feedback === "correct" && (
        <motion.p
          className="text-3xl font-black text-yellow-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 &quot;{currentWord.word.toUpperCase()}&quot; — well done!
        </motion.p>
      )}
      {feedback === "wrong" && (
        <motion.p className="text-2xl font-black text-red-200">
          Not quite — try again! 💪
        </motion.p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
