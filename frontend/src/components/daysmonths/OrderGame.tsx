"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DAYS, MONTHS } from "./calendarData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

type Mode = "days" | "months";

interface Props { onScore: (c: number, t: number) => void; }

export default function OrderGame({ onScore }: Props) {
  const [mode, setMode] = useState<Mode>("days");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");

  // Pick a random item and 3 neighbours as choices
  const items = mode === "days" ? DAYS : MONTHS;
  const [targetIdx, setTargetIdx] = useState(() => Math.floor(Math.random() * items.length));
  const [choices, setChoices] = useState<typeof items>(() => buildChoices(items, targetIdx));
  const [promptType, setPromptType] = useState<"what-comes-after" | "what-comes-before">("what-comes-after");

  function buildChoices(arr: typeof items, ti: number) {
    const correct = promptType === "what-comes-after"
      ? arr[(ti + 1) % arr.length]
      : arr[(ti - 1 + arr.length) % arr.length];
    const others = shuffle(arr.filter((_, i) => i !== ti && i !== (ti + 1) % arr.length && i !== (ti - 1 + arr.length) % arr.length)).slice(0, 3);
    return shuffle([correct, ...others]) as typeof items;
  }

  function nextQuestion(newMode: Mode = mode) {
    const arr = newMode === "days" ? DAYS : MONTHS;
    const ni = Math.floor(Math.random() * arr.length);
    const newPrompt = Math.random() > 0.5 ? "what-comes-after" : "what-comes-before";
    setTargetIdx(ni);
    setPromptType(newPrompt);
    setChoices(buildChoices(arr, ni) as typeof items);
  }

  function handle(chosen: (typeof items)[0]) {
    if (feedback !== "idle") return;
    const arr = mode === "days" ? DAYS : MONTHS;
    const correctItem = promptType === "what-comes-after"
      ? arr[(targetIdx + 1) % arr.length]
      : arr[(targetIdx - 1 + arr.length) % arr.length];

    const newTotal = total + 1;
    setTotal(newTotal);
    if (chosen.name === correctItem.name) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, newTotal);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => { setFeedback("idle"); nextQuestion(); }, 1200);
  }

  const arr = mode === "days" ? DAYS : MONTHS;
  const target = arr[targetIdx];

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Mode toggle */}
      <div className="flex gap-2">
        {(["days", "months"] as Mode[]).map((m) => (
          <button key={m} onClick={() => { setMode(m); nextQuestion(m); }}
            className={`px-4 py-1 rounded-full font-bold text-sm ${mode === m ? "bg-white text-purple-700" : "bg-white/20 text-white"}`}>
            {m === "days" ? "📅 Days" : "🗓️ Months"}
          </button>
        ))}
      </div>

      {/* Prompt */}
      <motion.div key={target.name + promptType}
        className="bg-white/20 rounded-2xl px-8 py-4 text-center"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      >
        <p className="text-white/70 text-sm font-bold">
          What comes <span className="text-yellow-300">{promptType === "what-comes-after" ? "after" : "before"}</span>…
        </p>
        <span className="text-5xl">{"emoji" in target ? target.emoji : ""}</span>
        <p className="text-white font-black text-3xl">{target.name}</p>
      </motion.div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {choices.map((c) => {
          const corrItem = arr[promptType === "what-comes-after" ? (targetIdx + 1) % arr.length : (targetIdx - 1 + arr.length) % arr.length];
          return (
            <motion.button key={c.name} onClick={() => handle(c)}
              className={`flex flex-col items-center gap-1 py-3 rounded-2xl font-bold text-sm shadow
                ${feedback !== "idle" && c.name === corrItem.name ? "bg-green-400 text-white" : ""}
                ${feedback === "wrong" && c.name !== corrItem.name ? "bg-red-300/50 text-white/60" : ""}
                ${feedback === "idle" ? "bg-white/30 text-white" : ""}`}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}
            >
              <span className="text-3xl">{"emoji" in c ? c.emoji : ""}</span>
              <span>{c.name}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 Correct!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-xl"    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Try again! 💪</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
