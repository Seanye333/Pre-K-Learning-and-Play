"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { COLORS } from "./colorData";

interface FindColorProps {
  onScore: (correct: number, total: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function FindColor({ onScore }: FindColorProps) {
  const [target, setTarget] = useState(COLORS[0]);
  const [object, setObject] = useState("");
  const [choices, setChoices] = useState<typeof COLORS>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const newRound = () => {
    const t = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTarget(t);
    setObject(t.objects[Math.floor(Math.random() * t.objects.length)]);
    const others = shuffle(COLORS.filter((c) => c.name !== t.name)).slice(0, 3);
    setChoices(shuffle([t, ...others]));
    setFeedback("idle");
  };

  useEffect(() => { newRound(); }, []);

  const handleChoice = (c: typeof COLORS[0]) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (c.name === target.name) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(newRound, 1200);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-extrabold text-xl text-center">
        What color is a <span className="text-yellow-200">{object}</span>?
      </p>

      {/* Object display */}
      <motion.div
        key={object}
        className="bg-white/20 rounded-3xl p-8 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <span className="text-9xl">{object.split(" ").pop()}</span>
      </motion.div>

      {/* Color swatch choices */}
      <div className="grid grid-cols-2 gap-4">
        {choices.map((c) => (
          <motion.button
            key={c.name}
            onClick={() => handleChoice(c)}
            className={`rounded-2xl p-4 flex items-center gap-3 shadow-lg min-w-[150px]
              ${feedback === "correct" && c.name === target.name
                ? "ring-4 ring-green-300 bg-green-300/20"
                : "bg-white/20"}`}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.9 }}
            animate={
              feedback === "wrong" && c.name !== target.name
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
            }
          >
            <div
              className="w-12 h-12 rounded-xl shadow-inner flex-shrink-0"
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-xl font-black text-white">{c.name}</span>
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p
          className="text-3xl font-black text-yellow-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🌟 Yes! {object.split(" ").pop()} is {target.name}!
        </motion.p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
