"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

const EMOJIS = ["🍎","🌟","🐶","🌸","🦋","🍪","🐸","🎈","🍕","🐱"];

type Mode = "compare" | "reveal";
type Answer = "more" | "less" | "equal";
type Feedback = "idle" | "correct" | "wrong";

function makePuzzle() {
  const maxVal = 8;
  const a = 1 + Math.floor(Math.random() * maxVal);
  let b = 1 + Math.floor(Math.random() * maxVal);
  // Occasionally make them equal for fun
  if (Math.random() < 0.2) b = a;
  const emoji = shuffle(EMOJIS)[0];
  const question: Answer[] = shuffle(
    a > b
      ? (["more","less","equal"] as Answer[])
      : b > a
      ? (["more","less","equal"] as Answer[])
      : (["more","less","equal"] as Answer[])
  );
  const correctAnswer: Answer = a > b ? "more" : a < b ? "less" : "equal";
  // Which side has more (for question phrasing)
  return { a, b, emoji, correctAnswer };
}

interface Props { onScore: (c: number, t: number) => void; }

export default function MoreLess({ onScore }: Props) {
  const [mode, setMode]         = useState<Mode>("compare");
  const [puzzle, setPuzzle]     = useState(makePuzzle);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [correct, setCorrect]   = useState(0);
  const [total, setTotal]       = useState(0);
  const [revealed, setRevealed] = useState<{ a: boolean; b: boolean }>({ a: false, b: false });
  const [question, setQuestion] = useState<"more" | "less" | "equal-check">("more");

  function newPuzzle() {
    setPuzzle(makePuzzle());
    setFeedback("idle");
    setRevealed({ a: false, b: false });
    setQuestion(shuffle(["more","less","equal-check"] as const)[0] as "more" | "less" | "equal-check");
  }

  function handleAnswer(ans: Answer) {
    if (feedback !== "idle") return;
    // For "equal-check" question, correct answer is "equal"
    const effectiveQuestion = question === "equal-check" ? "equal-check" : question;
    let isRight: boolean;
    if (effectiveQuestion === "equal-check") {
      isRight = (ans === "equal") === (puzzle.correctAnswer === "equal");
      if (ans === "equal" && puzzle.correctAnswer === "equal") isRight = true;
      else if (ans === "equal" && puzzle.correctAnswer !== "equal") isRight = false;
      else isRight = false;
    } else {
      // question is "more" or "less": we ask "Which side has more/less?"
      // but our buttons are "Left ⬅", "Right ➡", "Same"
      // re-think: simpler — just ask does LEFT have more/less/equal
      isRight = ans === puzzle.correctAnswer;
    }

    const nt = total + 1;
    setTotal(nt);
    if (isRight) {
      setCorrect((c) => { onScore(c + 1, nt); return c + 1; });
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(newPuzzle, 1100);
  }

  // Simpler: always ask "Does the left group have MORE, LESS, or EQUAL dots?"
  // Correct answer: puzzle.correctAnswer (more=left has more, less=left has less, equal)

  const questionText =
    mode === "compare"
      ? "Does the LEFT group have MORE, LESS, or EQUAL?"
      : revealed.a && revealed.b
      ? "Does the LEFT group have MORE, LESS, or EQUAL?"
      : !revealed.a && !revealed.b
      ? "Tap the covers to reveal! 🎲"
      : "Tap the other cover!";

  function renderGroup(side: "a" | "b", count: number) {
    const isRevealed = mode === "compare" || revealed[side];
    return (
      <div className="flex flex-col items-center gap-2">
        <motion.div
          onClick={() => mode === "reveal" && !revealed[side] ? setRevealed((r) => ({ ...r, [side]: true })) : undefined}
          className={`relative w-32 min-h-20 rounded-2xl border-4 flex flex-wrap items-center justify-center p-2 gap-1 cursor-pointer
            ${mode === "reveal" && !revealed[side] ? "bg-indigo-600 border-indigo-400" : "bg-white/15 border-white/30"}
            ${side === "a" ? "border-l-yellow-300" : "border-r-cyan-300"}`}
          whileHover={mode === "reveal" && !revealed[side] ? { scale: 1.04 } : {}}
          whileTap={mode === "reveal" && !revealed[side] ? { scale: 0.96 } : {}}>
          {!isRevealed ? (
            <span className="text-4xl">🎁</span>
          ) : (
            Array.from({ length: count }, (_, i) => (
              <motion.span
                key={i} className="text-2xl leading-none"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}>
                {puzzle.emoji}
              </motion.span>
            ))
          )}
        </motion.div>
        <span className="text-white font-black text-sm">{side === "a" ? "LEFT" : "RIGHT"}</span>
        {isRevealed && <span className="text-yellow-300 font-black text-lg">{count}</span>}
      </div>
    );
  }

  const canAnswer = mode === "compare" || (revealed.a && revealed.b);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Mode tabs */}
      <div className="flex gap-2">
        <button onClick={() => { setMode("compare"); newPuzzle(); }}
          className={`px-4 py-1 rounded-full font-black text-sm ${mode === "compare" ? "bg-white text-green-700" : "bg-white/20 text-white"}`}>
          Compare
        </button>
        <button onClick={() => { setMode("reveal"); newPuzzle(); }}
          className={`px-4 py-1 rounded-full font-black text-sm ${mode === "reveal" ? "bg-white text-green-700" : "bg-white/20 text-white"}`}>
          Reveal & Compare 🎁
        </button>
      </div>

      <motion.p
        key={puzzle.a + "-" + puzzle.b}
        className="text-white font-black text-lg drop-shadow text-center"
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        {questionText}
      </motion.p>

      {/* Two groups side by side */}
      <div className="flex gap-6 items-start justify-center">
        {renderGroup("a", puzzle.a)}
        <div className="flex items-center h-20 mt-2">
          <span className="text-white/50 font-black text-3xl">vs</span>
        </div>
        {renderGroup("b", puzzle.b)}
      </div>

      {/* Answer buttons */}
      <AnimatePresence>
        {canAnswer && feedback === "idle" && (
          <motion.div className="flex gap-3 flex-wrap justify-center"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {(["more","equal","less"] as Answer[]).map((ans) => (
              <motion.button
                key={ans}
                onClick={() => handleAnswer(ans)}
                className="px-5 py-3 rounded-2xl font-black text-lg shadow text-white
                  bg-white/20 hover:bg-white/30 border-2 border-white/30"
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                {ans === "more" ? "📈 MORE" : ans === "less" ? "📉 LESS" : "⚖️ EQUAL"}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}
            className={`text-2xl font-black px-6 py-2 rounded-2xl ${feedback === "correct" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {feedback === "correct"
              ? "🌟 Correct!"
              : `❌ Left has ${puzzle.correctAnswer}!`}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total} ⚖️</p>
    </div>
  );
}
