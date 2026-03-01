"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface NumberCardProps {
  difficulty: "easy" | "medium" | "hard";
  onScore: (correct: number, total: number) => void;
}

const RANGES = { easy: [1, 5], medium: [1, 10], hard: [1, 20] };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const NUMBER_EMOJIS: Record<number, string> = {
  1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣", 5: "5️⃣",
  6: "6️⃣", 7: "7️⃣", 8: "8️⃣", 9: "9️⃣", 10: "🔟",
};

export default function NumberCard({ difficulty, onScore }: NumberCardProps) {
  const [target, setTarget] = useState(3);
  const [cards, setCards] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const newRound = () => {
    const [min, max] = RANGES[difficulty];
    const t = Math.floor(Math.random() * (max - min + 1)) + min;
    setTarget(t);
    const distractors = new Set<number>();
    while (distractors.size < 3) {
      const d = Math.floor(Math.random() * (max - min + 1)) + min;
      if (d !== t) distractors.add(d);
    }
    setCards(shuffle([t, ...Array.from(distractors)]));
    setFeedback("idle");
  };

  useEffect(() => { newRound(); }, [difficulty]);

  const handleCard = (n: number) => {
    if (feedback !== "idle") return;
    const newTotal = total + 1;
    setTotal(newTotal);
    if (n === target) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback("correct");
      onScore(newCorrect, newTotal);
      setTimeout(newRound, 1100);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <p className="text-white font-extrabold text-xl">
        Find number <span className="text-yellow-200 text-3xl">{target}</span>! 👇
      </p>
      <p className="text-6xl">{NUMBER_EMOJIS[target] ?? target}</p>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((n) => (
          <motion.button
            key={n}
            onClick={() => handleCard(n)}
            className={`w-28 h-28 rounded-2xl text-6xl font-black text-white shadow-xl
              ${feedback === "correct" && n === target ? "bg-green-400" : ""}
              ${n % 4 === 0 ? "bg-yellow-500" : n % 3 === 0 ? "bg-purple-500" : n % 2 === 0 ? "bg-blue-500" : "bg-teal-500"}
              ${feedback === "correct" && n === target ? "!bg-green-400" : ""}`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
            animate={feedback === "wrong" && n !== target ? { x: [-5, 5, -5, 5, 0] } : {}}
          >
            {n}
          </motion.button>
        ))}
      </div>

      {feedback === "correct" && (
        <motion.p className="text-3xl font-black text-yellow-200" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          🌟 Yes, that&apos;s {target}!
        </motion.p>
      )}

      <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
