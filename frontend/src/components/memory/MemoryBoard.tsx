"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemoryCard from "./MemoryCard";
import GameStats from "./GameStats";
import { ANIMALS, MEMORY_PAIRS_EASY } from "@/lib/constants";

interface CardData {
  id: number;
  name: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryBoardProps {
  onGameEnd: (flips: number, totalPairs: number) => void;
}

function buildDeck(pairCount: number): CardData[] {
  const selected = [...ANIMALS]
    .sort(() => Math.random() - 0.5)
    .slice(0, pairCount);
  const pairs = [...selected, ...selected].map((a, i) => ({
    id: i,
    name: a.name,
    emoji: a.emoji,
    isFlipped: false,
    isMatched: false,
  }));
  return pairs.sort(() => Math.random() - 0.5);
}

export default function MemoryBoard({ onGameEnd }: MemoryBoardProps) {
  const pairCount = MEMORY_PAIRS_EASY;
  const [cards, setCards] = useState<CardData[]>(() => buildDeck(pairCount));
  const [firstIdx, setFirstIdx] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [flips, setFlips] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [matchFlash, setMatchFlash] = useState<{ emoji: string; name: string } | null>(null);

  const handleCardClick = (idx: number) => {
    if (locked) return;
    const card = cards[idx];
    if (card.isFlipped || card.isMatched) return;

    const newCards = cards.map((c, i) =>
      i === idx ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    const newFlips = flips + 1;
    setFlips(newFlips);

    if (firstIdx === null) {
      setFirstIdx(idx);
    } else {
      const first = newCards[firstIdx];
      const second = newCards[idx];
      setLocked(true);

      if (first.name === second.name) {
        // Match!
        const matched = newCards.map((c) =>
          c.name === first.name ? { ...c, isMatched: true, isFlipped: true } : c
        );
        setCards(matched);
        const newMatchedCount = matchedCount + 1;
        setMatchedCount(newMatchedCount);
        setFirstIdx(null);
        setLocked(false);

        setMatchFlash({ emoji: first.emoji, name: first.name });
        setTimeout(() => setMatchFlash(null), 900);

        if (newMatchedCount === pairCount) {
          setGameOver(true);
          onGameEnd(newFlips, pairCount);
        }
      } else {
        // No match — flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === idx ? { ...c, isFlipped: false } : c
            )
          );
          setFirstIdx(null);
          setLocked(false);
        }, 900);
      }
    }
  };

  const resetGame = () => {
    setCards(buildDeck(pairCount));
    setFirstIdx(null);
    setLocked(false);
    setFlips(0);
    setMatchedCount(0);
    setGameOver(false);
    setMatchFlash(null);
  };

  // 3x4 grid layout
  const cols = 4;

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <GameStats flips={flips} running={!gameOver} />

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, 80px)` }}
      >
        {cards.map((card, i) => (
          <MemoryCard
            key={card.id}
            emoji={card.emoji}
            name={card.name}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(i)}
          />
        ))}
      </div>

      {gameOver && (
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <p className="text-4xl font-black text-yellow-200 mb-3">
            🎉 All matched!
          </p>
          <p className="text-xl text-white/80 mb-4">
            You found all {pairCount} pairs in {flips} moves!
          </p>
          <button
            onClick={resetGame}
            className="bg-white text-purple-600 font-extrabold px-6 py-3 rounded-xl text-lg shadow-lg hover:bg-yellow-100 transition-colors"
          >
            🔄 Play Again
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {matchFlash && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-40"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-8xl">{matchFlash.emoji}</span>
              <p className="text-3xl font-black text-green-300 drop-shadow-lg mt-1">✓ Match!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
