"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Couplet {
  emoji: string;
  lineOne: string;
  lineTwo: string; // with blank at end
  answer: string;
  choices: string[];
}

const COUPLETS: Couplet[] = [
  {
    emoji: "🐱",
    lineOne: "The cat sat on the mat,",
    lineTwo: "It wore a big funny ___",
    answer: "hat",
    choices: ["hat", "bat", "cat", "mat"],
  },
  {
    emoji: "🐶",
    lineOne: "A dog ran through the fog,",
    lineTwo: "It jumped over a big ___",
    answer: "log",
    choices: ["log", "frog", "fog", "hog"],
  },
  {
    emoji: "🐝",
    lineOne: "The bee flew past a tree,",
    lineTwo: "It buzzed with so much ___",
    answer: "glee",
    choices: ["glee", "tree", "sea", "key"],
  },
  {
    emoji: "🐟",
    lineOne: "A fish made a wish,",
    lineTwo: "It wanted to eat a ___",
    answer: "dish",
    choices: ["dish", "fish", "wish", "swish"],
  },
  {
    emoji: "☀️",
    lineOne: "The sun was lots of fun,",
    lineTwo: "We played and started to ___",
    answer: "run",
    choices: ["run", "sun", "bun", "fun"],
  },
  {
    emoji: "🐸",
    lineOne: "A frog sat on a log,",
    lineTwo: "It slept in the morning ___",
    answer: "fog",
    choices: ["fog", "log", "dog", "bog"],
  },
  {
    emoji: "🐦",
    lineOne: "The bird said a word,",
    lineTwo: "The funniest thing I ever ___",
    answer: "heard",
    choices: ["heard", "bird", "word", "third"],
  },
  {
    emoji: "🐔",
    lineOne: "A hen counted to ten,",
    lineTwo: "Then she counted again and ___",
    answer: "then",
    choices: ["then", "ten", "hen", "when"],
  },
  {
    emoji: "🎂",
    lineOne: "I made a yummy cake,",
    lineTwo: "I ate it by the ___",
    answer: "lake",
    choices: ["lake", "cake", "rake", "snake"],
  },
  {
    emoji: "🌙",
    lineOne: "I saw the big full moon,",
    lineTwo: "I saw it rise at ___",
    answer: "noon",
    choices: ["noon", "moon", "spoon", "soon"],
  },
  {
    emoji: "🐻",
    lineOne: "A bear had long hair,",
    lineTwo: "It sat in a big soft ___",
    answer: "chair",
    choices: ["chair", "bear", "hair", "stair"],
  },
  {
    emoji: "🌧️",
    lineOne: "I danced in the rain,",
    lineTwo: "Then I ran home through the ___",
    answer: "lane",
    choices: ["lane", "rain", "train", "cane"],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Props {
  onScore: (c: number, t: number) => void;
}

export default function RhymeStory({ onScore }: Props) {
  const [queue] = useState<Couplet[]>(() => shuffle(COUPLETS));
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);

  const couplet = queue[idx];
  const [shuffledChoices] = useState<string[][]>(() =>
    queue.map((q) => shuffle(q.choices))
  );
  const choices = shuffledChoices[idx];

  const handlePick = (word: string) => {
    if (feedback !== "idle" || done) return;
    setChosen(word);
    const newTotal = total + 1;
    setTotal(newTotal);
    if (word === couplet.answer) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(() => {
        setFeedback("idle");
        setChosen(null);
        if (idx + 1 >= queue.length) {
          setDone(true);
        } else {
          setIdx(idx + 1);
        }
      }, 1400);
    } else {
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback("idle");
        setChosen(null);
      }, 900);
    }
  };

  const handleRestart = () => {
    setIdx(0);
    setCorrect(0);
    setTotal(0);
    setDone(false);
    setFeedback("idle");
    setChosen(null);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 h-full">
        <motion.div
          className="text-8xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ type: "spring" }}
        >
          📖
        </motion.div>
        <p className="text-3xl font-black text-white text-center drop-shadow">
          You finished all the rhymes!
        </p>
        <p className="text-2xl text-white/80">
          {correct} out of {total} correct!
        </p>
        <motion.button
          onClick={handleRestart}
          className="bg-white text-indigo-600 font-black text-xl px-8 py-4 rounded-2xl shadow-lg"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Read Again!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-lg mx-auto">
      {/* Progress */}
      <p className="text-white/70 text-sm font-bold">
        Rhyme {idx + 1} of {queue.length}
      </p>

      {/* Story card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="bg-white/20 rounded-3xl p-6 w-full flex flex-col items-center gap-4 shadow-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280 }}
        >
          <span className="text-7xl">{couplet.emoji}</span>
          <p className="text-xl font-extrabold text-white text-center italic leading-relaxed">
            {couplet.lineOne}
          </p>
          <p className="text-xl font-extrabold text-center leading-relaxed">
            {feedback === "correct" ? (
              <span className="text-white italic">
                {couplet.lineTwo.replace(
                  "___",
                  ""
                )}
                <motion.span
                  className="text-yellow-300 underline"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                >
                  {couplet.answer}
                </motion.span>
              </span>
            ) : (
              <span className="text-white italic">
                {couplet.lineTwo.replace("___", "")}
                <span className="text-yellow-200 tracking-widest border-b-2 border-yellow-200 px-1">
                  _ _ _
                </span>
              </span>
            )}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback === "correct" && (
          <motion.p
            className="text-2xl font-black text-yellow-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            That rhymes! 🎵
          </motion.p>
        )}
        {feedback === "wrong" && (
          <motion.p
            className="text-2xl font-black text-red-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            Try again! 💪
          </motion.p>
        )}
      </AnimatePresence>

      {/* Word choice buttons */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {choices.map((word) => {
          let bg = "bg-white/25";
          if (feedback !== "idle" && chosen !== null) {
            if (word === couplet.answer) bg = "bg-green-400/80";
            else if (word === chosen) bg = "bg-red-400/70";
            else bg = "bg-white/10";
          }
          return (
            <motion.button
              key={`${idx}-${word}`}
              onClick={() => handlePick(word)}
              className={`${bg} rounded-2xl py-4 px-3 font-black text-white text-2xl shadow-lg text-center`}
              whileHover={feedback === "idle" ? { scale: 1.06 } : {}}
              whileTap={feedback === "idle" ? { scale: 0.94 } : {}}
              animate={
                feedback === "wrong" && word === chosen
                  ? { x: [-6, 6, -6, 6, 0] }
                  : {}
              }
            >
              {word}
            </motion.button>
          );
        })}
      </div>

      <p className="text-white/60 text-xs">Score: {correct}/{total}</p>
    </div>
  );
}
