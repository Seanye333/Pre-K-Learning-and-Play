"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { THREE_LETTER_WORDS, LETTER_COLORS } from "@/lib/constants";

interface SpellWordProps {
  onScore: (correct: number, total: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildTilePool(word: string): string[] {
  const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const distractors = shuffle(
    all.filter((l) => !word.toUpperCase().includes(l))
  ).slice(0, 3);
  return shuffle([...word.toUpperCase().split(""), ...distractors]);
}

export default function SpellWord({ onScore }: SpellWordProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [tiles, setTiles] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const currentWord = THREE_LETTER_WORDS[wordIndex % THREE_LETTER_WORDS.length];

  useEffect(() => {
    setTiles(buildTilePool(currentWord.word));
    setChosen([]);
    setUsedIndices(new Set());
    setFeedback("idle");
  }, [wordIndex]);

  const handleTile = (letter: string, tileIdx: number) => {
    if (usedIndices.has(tileIdx) || chosen.length >= currentWord.word.length) return;
    const newChosen = [...chosen, letter];
    const newUsed = new Set(usedIndices);
    newUsed.add(tileIdx);
    setChosen(newChosen);
    setUsedIndices(newUsed);

    if (newChosen.length === currentWord.word.length) {
      const spelled = newChosen.join("").toLowerCase();
      const newTotal = total + 1;
      setTotal(newTotal);
      if (spelled === currentWord.word) {
        const newCorrect = correct + 1;
        setCorrect(newCorrect);
        setFeedback("correct");
        onScore(newCorrect, newTotal);
        setTimeout(() => {
          setWordIndex((i) => i + 1);
        }, 1500);
      } else {
        setFeedback("wrong");
        setTimeout(() => {
          setChosen([]);
          setUsedIndices(new Set());
          setFeedback("idle");
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-extrabold text-xl">Spell the word! 🔤</p>

      {/* Word image or emoji */}
      <div className="text-center">
        <div className="text-8xl mb-2">
          {currentWord.image.startsWith("/images/animals/")
            ? ["🐱","🐶","🐷","🐔","🦊","🐮","🐜","🐝"][wordIndex % 8]
            : "🖼️"}
        </div>
        <p className="text-white/70 text-lg font-bold">{currentWord.word.toUpperCase().split("").map(() => "_ ").join("")}</p>
      </div>

      {/* Chosen letters display */}
      <div className="flex gap-3">
        {currentWord.word.split("").map((_, i) => (
          <motion.div
            key={i}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black border-4
              ${chosen[i] ? "bg-white text-indigo-600 border-indigo-400" : "bg-white/30 text-transparent border-white/50"}`}
            animate={feedback === "correct" ? { scale: [1, 1.2, 1], backgroundColor: "#bbf7d0" } :
                     feedback === "wrong" ? { x: [-6, 6, -6, 6, 0] } : {}}
          >
            {chosen[i] ?? ""}
          </motion.div>
        ))}
      </div>

      {/* Letter tile bank */}
      <div className="flex flex-wrap justify-center gap-3 max-w-xs">
        {tiles.map((letter, i) => (
          <motion.button
            key={i}
            onClick={() => handleTile(letter, i)}
            disabled={usedIndices.has(i) || feedback !== "idle"}
            className={`w-14 h-14 rounded-xl text-2xl font-black text-white shadow-md
              ${LETTER_COLORS[i % LETTER_COLORS.length]}
              ${usedIndices.has(i) ? "opacity-20 cursor-not-allowed" : ""}`}
            whileHover={!usedIndices.has(i) ? { scale: 1.15 } : {}}
            whileTap={!usedIndices.has(i) ? { scale: 0.85 } : {}}
          >
            {letter}
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p
          className="text-3xl font-black text-yellow-300"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 Yes! That&apos;s &quot;{currentWord.word}&quot;!
        </motion.p>
      )}
      {feedback === "wrong" && (
        <motion.p className="text-2xl font-black text-red-300">
          Try again! 💪
        </motion.p>
      )}

      <p className="text-white/70 text-sm">
        Score: {correct}/{total}
      </p>
    </div>
  );
}
