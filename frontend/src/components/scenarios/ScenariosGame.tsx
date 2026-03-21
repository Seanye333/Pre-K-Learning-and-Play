"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Scenario {
  emoji: string;
  question: string;
  answers: string[];
  correct: number;
}

const SCENARIOS: Scenario[] = [
  {
    emoji: "🧸",
    question: "You want the same toy as your friend. What do you do?",
    answers: ["Ask if you can take turns", "Grab it from them", "Cry and run away", "Break the toy"],
    correct: 0,
  },
  {
    emoji: "🧹",
    question: "You made a mess accidentally. What do you do?",
    answers: ["Clean it up and say sorry", "Pretend it wasn't you", "Blame your pet", "Leave it for someone else"],
    correct: 0,
  },
  {
    emoji: "🏫",
    question: "A new kid at school looks lonely. What do you do?",
    answers: ["Say hi and invite them to play", "Ignore them", "Laugh at them", "Run away"],
    correct: 0,
  },
  {
    emoji: "🥦",
    question: "You don't want to eat your vegetables. What do you do?",
    answers: ["Try one bite politely", "Throw them on the floor", "Spit them out", "Scream until you get dessert"],
    correct: 0,
  },
  {
    emoji: "🗣️",
    question: "Someone is talking. What do you do?",
    answers: ["Wait quietly for your turn", "Interrupt them", "Talk louder than them", "Walk away"],
    correct: 0,
  },
  {
    emoji: "😤",
    question: "You're feeling angry. What can you do?",
    answers: ["Take deep breaths and count to 10", "Hit something", "Scream very loud", "Break your toys"],
    correct: 0,
  },
  {
    emoji: "😢",
    question: "Your friend is sad. What do you do?",
    answers: ["Give them a hug and ask if they're okay", "Laugh at them", "Walk away", "Ignore them"],
    correct: 0,
  },
  {
    emoji: "🔍",
    question: "You find a toy that doesn't belong to you. What do you do?",
    answers: ["Give it to a teacher or grown-up", "Keep it forever", "Hide it", "Throw it away"],
    correct: 0,
  },
  {
    emoji: "😠",
    question: "Someone is being mean to you. What do you do?",
    answers: ["Tell a trusted grown-up", "Be mean back", "Keep it secret", "Run and hide forever"],
    correct: 0,
  },
  {
    emoji: "📚",
    question: "You finished your work early. What do you do?",
    answers: ["Read a book or help a friend", "Bother other kids", "Run around the room", "Fall asleep"],
    correct: 0,
  },
  {
    emoji: "🧺",
    question: "It's time to clean up. What do you do?",
    answers: ["Help put things away quickly", "Hide your mess", "Say \"not me!\"", "Keep playing"],
    correct: 0,
  },
  {
    emoji: "🤷",
    question: "You don't understand something. What do you do?",
    answers: ["Raise your hand and ask for help", "Give up", "Copy someone's work", "Cry loudly"],
    correct: 0,
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Props {
  onScore: (c: number, t: number) => void;
}

export default function ScenariosGame({ onScore }: Props) {
  const [queue] = useState<Scenario[]>(() => shuffle(SCENARIOS));
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);

  const scenario = queue[idx];

  const handleAnswer = (answerIdx: number) => {
    if (feedback !== "idle" || done) return;
    setChosen(answerIdx);
    const newTotal = total + 1;
    setTotal(newTotal);
    if (answerIdx === scenario.correct) {
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
      }, 1000);
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
          animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
          transition={{ type: "spring" }}
        >
          🌟
        </motion.div>
        <p className="text-3xl font-black text-white text-center drop-shadow">
          Amazing choices!
        </p>
        <p className="text-2xl text-white/80">
          {correct} out of {total} correct!
        </p>
        <motion.button
          onClick={handleRestart}
          className="bg-white text-blue-600 font-black text-xl px-8 py-4 rounded-2xl shadow-lg"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Play Again!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-lg mx-auto">
      {/* Progress */}
      <p className="text-white/70 text-sm font-bold">
        Story {idx + 1} of {queue.length}
      </p>

      {/* Scenario card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="bg-white/20 rounded-3xl p-5 w-full flex flex-col items-center gap-3 shadow-xl"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280 }}
        >
          <span className="text-7xl">{scenario.emoji}</span>
          <p className="text-lg font-extrabold text-white text-center leading-tight">
            {scenario.question}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Answer buttons */}
      <div className="flex flex-col gap-3 w-full">
        {scenario.answers.map((answer, i) => {
          let bg = "bg-white/25";
          if (feedback !== "idle" && chosen !== null) {
            if (i === scenario.correct) bg = "bg-green-400/80";
            else if (i === chosen && i !== scenario.correct) bg = "bg-red-400/70";
            else bg = "bg-white/10";
          }
          return (
            <motion.button
              key={`${idx}-${i}`}
              onClick={() => handleAnswer(i)}
              className={`${bg} rounded-2xl px-4 py-3 text-left font-extrabold text-white text-base shadow-md flex items-center gap-3`}
              whileHover={feedback === "idle" ? { scale: 1.03 } : {}}
              whileTap={feedback === "idle" ? { scale: 0.97 } : {}}
              animate={
                feedback === "wrong" && i === chosen
                  ? { x: [-6, 6, -6, 6, 0] }
                  : feedback === "correct" && i === scenario.correct
                  ? { scale: [1, 1.04, 1] }
                  : {}
              }
            >
              <span className="text-xl">{["🅰️", "🅱️", "🅲", "🅳"][i] || "•"}</span>
              {answer}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback message */}
      <AnimatePresence>
        {feedback === "correct" && (
          <motion.p
            className="text-2xl font-black text-yellow-200 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            Great choice! 🌟
          </motion.p>
        )}
        {feedback === "wrong" && (
          <motion.p
            className="text-2xl font-black text-red-200 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            Hmm, try again! 💪
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-xs">Score: {correct}/{total}</p>
    </div>
  );
}
