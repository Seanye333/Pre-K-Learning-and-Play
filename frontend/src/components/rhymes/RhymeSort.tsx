"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RhymeSortProps {
  onScore: (correct: number, total: number) => void;
}

const SORT_SETS = [
  {
    family: "at",
    target: { word: "cat", emoji: "🐱" },
    yes: [
      { word: "hat", emoji: "🎩" },
      { word: "bat", emoji: "🦇" },
    ],
    no: [
      { word: "dog", emoji: "🐶" },
      { word: "sun", emoji: "☀️" },
    ],
  },
  {
    family: "og",
    target: { word: "dog", emoji: "🐶" },
    yes: [
      { word: "log", emoji: "🪵" },
      { word: "frog", emoji: "🐸" },
    ],
    no: [
      { word: "cat", emoji: "🐱" },
      { word: "bee", emoji: "🐝" },
    ],
  },
  {
    family: "un",
    target: { word: "sun", emoji: "☀️" },
    yes: [
      { word: "run", emoji: "🏃" },
      { word: "bun", emoji: "🍞" },
    ],
    no: [
      { word: "moon", emoji: "🌙" },
      { word: "star", emoji: "⭐" },
    ],
  },
  {
    family: "ake",
    target: { word: "cake", emoji: "🎂" },
    yes: [
      { word: "lake", emoji: "🏞️" },
      { word: "snake", emoji: "🐍" },
    ],
    no: [
      { word: "pie", emoji: "🥧" },
      { word: "milk", emoji: "🥛" },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function RhymeSort({ onScore }: RhymeSortProps) {
  const [setIndex, setSetIndex] = useState(0);
  const [cards, setCards] = useState<{ word: string; emoji: string; isRhyme: boolean }[]>([]);
  const [sorted, setSorted] = useState<{ word: string; emoji: string; isRhyme: boolean }[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const buildRound = (idx: number) => {
    const s = SORT_SETS[idx % SORT_SETS.length];
    const pool = [
      ...s.yes.map((w) => ({ ...w, isRhyme: true })),
      ...s.no.map((w) => ({ ...w, isRhyme: false })),
    ];
    setCards(shuffle(pool));
    setSorted([]);
    setFeedback("idle");
  };

  useEffect(() => { buildRound(0); }, []);

  const current = SORT_SETS[setIndex % SORT_SETS.length];

  const handleCard = (card: { word: string; emoji: string; isRhyme: boolean }) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (card.isRhyme) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      const remaining = cards.filter((c) => c.word !== card.word);
      setSorted((prev) => [...prev, card]);
      setCards(remaining);
      setTimeout(() => {
        setFeedback("idle");
        if (remaining.filter((c) => c.isRhyme).length === 0) {
          setTimeout(() => {
            const next = setIndex + 1;
            setSetIndex(next);
            buildRound(next);
          }, 600);
        }
      }, 500);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-extrabold text-xl text-center">
        Tap the words that rhyme with&nbsp;
        <span className="text-yellow-200">&quot;{current.target.word}&quot;</span>&nbsp;
        {current.target.emoji}
      </p>

      {/* Cards to sort */}
      <div className="flex flex-wrap justify-center gap-3">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.button
              key={card.word}
              onClick={() => handleCard(card)}
              className="rounded-2xl p-4 flex flex-col items-center gap-1 bg-white/30 shadow-lg min-w-[100px]"
              initial={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
              animate={
                feedback === "wrong" && !card.isRhyme
                  ? { x: [-5, 5, -5, 5, 0] }
                  : {}
              }
            >
              <span className="text-4xl">{card.emoji}</span>
              <span className="text-lg font-black text-white">{card.word}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Rhyme bucket */}
      {sorted.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/70 text-sm font-bold">Rhymes found ✅</p>
          <div className="flex gap-3 flex-wrap justify-center">
            {sorted.map((s) => (
              <div key={s.word} className="bg-green-300/40 rounded-xl px-4 py-2 flex items-center gap-1">
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-white font-bold">{s.word}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
