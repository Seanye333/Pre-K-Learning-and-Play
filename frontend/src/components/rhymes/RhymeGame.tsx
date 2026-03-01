"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface RhymePair {
  word: string;
  emoji: string;
  rhymes: { word: string; emoji: string }[];
  distractors: { word: string; emoji: string }[];
}

const RHYME_DATA: RhymePair[] = [
  {
    word: "cat",
    emoji: "🐱",
    rhymes: [
      { word: "hat", emoji: "🎩" },
      { word: "bat", emoji: "🦇" },
      { word: "mat", emoji: "🪑" },
    ],
    distractors: [
      { word: "dog", emoji: "🐶" },
      { word: "sun", emoji: "☀️" },
      { word: "cup", emoji: "🥤" },
      { word: "bird", emoji: "🐦" },
    ],
  },
  {
    word: "dog",
    emoji: "🐶",
    rhymes: [
      { word: "log", emoji: "🪵" },
      { word: "frog", emoji: "🐸" },
      { word: "fog", emoji: "🌫️" },
    ],
    distractors: [
      { word: "cat", emoji: "🐱" },
      { word: "hat", emoji: "🎩" },
      { word: "star", emoji: "⭐" },
      { word: "fish", emoji: "🐟" },
    ],
  },
  {
    word: "sun",
    emoji: "☀️",
    rhymes: [
      { word: "run", emoji: "🏃" },
      { word: "bun", emoji: "🍞" },
      { word: "fun", emoji: "🎉" },
    ],
    distractors: [
      { word: "moon", emoji: "🌙" },
      { word: "rain", emoji: "🌧️" },
      { word: "tree", emoji: "🌳" },
      { word: "bug", emoji: "🐛" },
    ],
  },
  {
    word: "bee",
    emoji: "🐝",
    rhymes: [
      { word: "tree", emoji: "🌳" },
      { word: "sea", emoji: "🌊" },
      { word: "tea", emoji: "🍵" },
    ],
    distractors: [
      { word: "ant", emoji: "🐜" },
      { word: "cat", emoji: "🐱" },
      { word: "cup", emoji: "🥤" },
      { word: "ball", emoji: "⚽" },
    ],
  },
  {
    word: "cake",
    emoji: "🎂",
    rhymes: [
      { word: "lake", emoji: "🏞️" },
      { word: "snake", emoji: "🐍" },
      { word: "rake", emoji: "🪣" },
    ],
    distractors: [
      { word: "pie", emoji: "🥧" },
      { word: "milk", emoji: "🥛" },
      { word: "duck", emoji: "🦆" },
      { word: "ship", emoji: "🚢" },
    ],
  },
  {
    word: "star",
    emoji: "⭐",
    rhymes: [
      { word: "car", emoji: "🚗" },
      { word: "jar", emoji: "🫙" },
      { word: "bar", emoji: "🎸" },
    ],
    distractors: [
      { word: "moon", emoji: "🌙" },
      { word: "sun", emoji: "☀️" },
      { word: "bird", emoji: "🐦" },
      { word: "cake", emoji: "🎂" },
    ],
  },
  {
    word: "house",
    emoji: "🏠",
    rhymes: [
      { word: "mouse", emoji: "🐭" },
      { word: "louse", emoji: "😠" },
    ],
    distractors: [
      { word: "dog", emoji: "🐶" },
      { word: "tree", emoji: "🌳" },
      { word: "fish", emoji: "🐟" },
      { word: "sun", emoji: "☀️" },
    ],
  },
  {
    word: "train",
    emoji: "🚂",
    rhymes: [
      { word: "rain", emoji: "🌧️" },
      { word: "brain", emoji: "🧠" },
      { word: "chain", emoji: "⛓️" },
    ],
    distractors: [
      { word: "car", emoji: "🚗" },
      { word: "bus", emoji: "🚌" },
      { word: "star", emoji: "⭐" },
      { word: "cat", emoji: "🐱" },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface RhymeGameProps {
  onScore: (correct: number, total: number) => void;
}

export default function RhymeGame({ onScore }: RhymeGameProps) {
  const [queueIndex, setQueueIndex] = useState(0);
  const [queue] = useState(() => shuffle(RHYME_DATA));
  const [targetRhyme, setTargetRhyme] = useState<{ word: string; emoji: string } | null>(null);
  const [choices, setChoices] = useState<{ word: string; emoji: string }[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const buildRound = (idx: number) => {
    const data = queue[idx % queue.length];
    const rhyme = data.rhymes[Math.floor(Math.random() * data.rhymes.length)];
    setTargetRhyme(rhyme);
    const distractors = shuffle(data.distractors).slice(0, 3);
    setChoices(shuffle([rhyme, ...distractors]));
    setFeedback("idle");
  };

  useEffect(() => { buildRound(0); }, []);

  const currentWord = queue[queueIndex % queue.length];

  const handleChoice = (choice: { word: string; emoji: string }) => {
    if (feedback !== "idle" || !targetRhyme) return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (choice.word === targetRhyme.word) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(() => {
        const next = queueIndex + 1;
        setQueueIndex(next);
        buildRound(next);
      }, 1300);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 900);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-extrabold text-xl">
        Find the word that rhymes! 🎵
      </p>

      {/* Source word */}
      <motion.div
        key={currentWord.word}
        className="bg-white/20 rounded-3xl p-6 flex flex-col items-center gap-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <span className="text-8xl">{currentWord.emoji}</span>
        <p className="text-4xl font-black text-white tracking-widest">
          {currentWord.word.toUpperCase()}
        </p>
        <p className="text-white/70 text-sm">Rhymes with...</p>
      </motion.div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-4">
        {choices.map((c) => (
          <motion.button
            key={c.word}
            onClick={() => handleChoice(c)}
            className={`rounded-2xl p-4 flex flex-col items-center gap-1 shadow-lg min-w-[120px]
              ${feedback === "correct" && c.word === targetRhyme?.word
                ? "bg-green-300/60 ring-4 ring-green-300"
                : "bg-white/30"}`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            animate={
              feedback === "wrong" && c.word !== targetRhyme?.word
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
            }
          >
            <span className="text-5xl">{c.emoji}</span>
            <span className="text-xl font-black text-white">{c.word}</span>
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p
          className="text-2xl font-black text-yellow-200 text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 Yes! &quot;{currentWord.word}&quot; rhymes with &quot;{targetRhyme?.word}&quot;!
        </motion.p>
      )}
      {feedback === "wrong" && (
        <p className="text-2xl font-black text-red-200">Try again! 💪</p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
