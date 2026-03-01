"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STORIES, type StoryStep } from "./storyData";

interface StoryGameProps {
  onScore: (correct: number, total: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function StoryGame({ onScore }: StoryGameProps) {
  const [storyIdx, setStoryIdx] = useState(0);
  const [queue] = useState(() => shuffle(STORIES));
  const [pool, setPool] = useState<(StoryStep & { id: number })[]>([]);
  const [placed, setPlaced] = useState<(StoryStep & { id: number }) | null>(null); // currently being placed
  const [answer, setAnswer] = useState<(StoryStep & { id: number })[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong" | "done">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const story = queue[storyIdx % queue.length];

  const buildRound = (idx: number) => {
    const s = queue[idx % queue.length];
    setPool(shuffle(s.steps.map((step, i) => ({ ...step, id: i }))));
    setAnswer([]);
    setPlaced(null);
    setFeedback("idle");
  };

  useEffect(() => { buildRound(0); }, []);

  const handlePickFromPool = (card: StoryStep & { id: number }) => {
    if (feedback !== "idle") return;
    setPlaced(card);
  };

  const handlePlaceInSlot = (slotIdx: number) => {
    if (!placed || feedback !== "idle") return;
    // Fill slot
    const newAnswer = [...answer];
    newAnswer[slotIdx] = placed;
    setAnswer(newAnswer);
    setPool((prev) => prev.filter((c) => c.id !== placed.id));
    setPlaced(null);

    // Check if all slots filled
    if (newAnswer.filter(Boolean).length === story.steps.length) {
      const newTotal = total + 1;
      setTotal(newTotal);
      const isCorrect = newAnswer.every((c, i) => c.id === i);
      if (isCorrect) {
        const newCorrect = correct + 1;
        setCorrect(newCorrect);
        setFeedback("done");
        onScore(newCorrect, newTotal);
        setTimeout(() => {
          const next = storyIdx + 1;
          setStoryIdx(next);
          buildRound(next);
        }, 2000);
      } else {
        setFeedback("wrong");
        setTimeout(() => {
          // return everything to pool
          setPool(shuffle(story.steps.map((step, i) => ({ ...step, id: i }))));
          setAnswer([]);
          setFeedback("idle");
        }, 1200);
      }
    }
  };

  const handleReturnToPool = (slotIdx: number) => {
    if (feedback !== "idle") return;
    const card = answer[slotIdx];
    if (!card) return;
    setPool((prev) => shuffle([...prev, card]));
    const newAnswer = [...answer];
    delete newAnswer[slotIdx];
    setAnswer(newAnswer);
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-extrabold text-xl text-center">
        Put the story in order! 📖
      </p>

      {/* Story title */}
      <motion.div
        key={story.title}
        className="bg-white/20 rounded-2xl px-5 py-2 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-3xl">{story.emoji}</span>
        <span className="text-white font-black text-lg">{story.title}</span>
      </motion.div>

      {/* Answer slots */}
      <div className="flex gap-3 flex-wrap justify-center">
        {story.steps.map((_, slotIdx) => {
          const card = answer[slotIdx];
          return (
            <motion.div
              key={slotIdx}
              onClick={() => card ? handleReturnToPool(slotIdx) : handlePlaceInSlot(slotIdx)}
              className={`w-20 h-28 rounded-2xl border-4 flex flex-col items-center justify-center gap-1 cursor-pointer select-none
                ${card
                  ? feedback === "done"
                    ? "border-green-400 bg-green-200/30"
                    : feedback === "wrong"
                    ? "border-red-400 bg-red-200/30"
                    : "border-white bg-white/20"
                  : placed
                  ? "border-yellow-300 border-dashed bg-yellow-200/10"
                  : "border-white/40 border-dashed bg-white/10"}`}
              whileHover={(!card && placed) || card ? { scale: 1.06 } : {}}
              animate={feedback === "wrong" && card ? { x: [-5, 5, -5, 5, 0] } : {}}
            >
              {card ? (
                <>
                  <span className="text-4xl">{card.emoji}</span>
                  <span className="text-white text-xs font-bold text-center px-1 leading-tight">
                    {card.caption}
                  </span>
                </>
              ) : (
                <span className="text-white/40 font-black text-xl">{slotIdx + 1}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Instruction */}
      {placed && (
        <motion.p
          className="text-white font-bold text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Now tap a numbered slot to place &ldquo;{placed.caption}&rdquo; 👆
        </motion.p>
      )}

      {/* Card pool */}
      <div className="flex gap-3 flex-wrap justify-center">
        <AnimatePresence>
          {pool.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handlePickFromPool(card)}
              className={`w-20 h-28 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg
                ${placed?.id === card.id
                  ? "bg-yellow-300/60 ring-4 ring-yellow-200"
                  : "bg-white/30"}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
            >
              <span className="text-4xl">{card.emoji}</span>
              <span className="text-white text-xs font-bold text-center px-1 leading-tight">
                {card.caption}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {feedback === "done" && (
        <motion.p
          className="text-3xl font-black text-yellow-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 Perfect order! Well done!
        </motion.p>
      )}
      {feedback === "wrong" && (
        <p className="text-2xl font-black text-red-200">
          Not quite — try again! 💪
        </p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
