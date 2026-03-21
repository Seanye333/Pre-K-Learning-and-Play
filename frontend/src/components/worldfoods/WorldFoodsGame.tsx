"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onScore: (c: number, t: number) => void; }

const FOODS = [
  { emoji: "🍕", name: "Pizza", country: "Italy", flag: "🇮🇹" },
  { emoji: "🍣", name: "Sushi", country: "Japan", flag: "🇯🇵" },
  { emoji: "🌮", name: "Taco", country: "Mexico", flag: "🇲🇽" },
  { emoji: "🥐", name: "Croissant", country: "France", flag: "🇫🇷" },
  { emoji: "🍜", name: "Noodles", country: "China", flag: "🇨🇳" },
  { emoji: "🌯", name: "Gyro", country: "Greece", flag: "🇬🇷" },
  { emoji: "🥘", name: "Paella", country: "Spain", flag: "🇪🇸" },
  { emoji: "🍛", name: "Curry", country: "India", flag: "🇮🇳" },
  { emoji: "🥗", name: "Salad", country: "USA", flag: "🇺🇸" },
  { emoji: "🍱", name: "Bento", country: "Japan", flag: "🇯🇵" },
  { emoji: "🫔", name: "Burrito", country: "Mexico", flag: "🇲🇽" },
  { emoji: "🧆", name: "Falafel", country: "Lebanon", flag: "🇱🇧" },
  { emoji: "🍲", name: "Stew", country: "Africa", flag: "🌍" },
  { emoji: "🥟", name: "Dumpling", country: "China", flag: "🇨🇳" },
  { emoji: "🧁", name: "Muffin", country: "USA", flag: "🇺🇸" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function getChoices(correct: string, all: string[]): string[] {
  const unique = [...new Set(all)];
  const others = shuffle(unique.filter(n => n !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function WorldFoodsGame({ onScore }: Props) {
  const [tab, setTab] = useState<"learn" | "quiz">("learn");
  const [popup, setPopup] = useState<number | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [fb, setFb] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const allCountries = FOODS.map(f => f.country);
  const questions = shuffle(FOODS);
  const q = questions[qIdx % questions.length];
  const choices = getChoices(q.country, allCountries);

  function handleAnswer(choice: string) {
    if (fb !== "idle") return;
    const isCorrect = choice === q.country;
    const newCorrect = correct + (isCorrect ? 1 : 0);
    const newTotal = total + 1;
    setCorrect(newCorrect);
    setTotal(newTotal);
    onScore(newCorrect, newTotal);
    setFb(isCorrect ? "correct" : "wrong");
    setTimeout(() => { setFb("idle"); setQIdx(i => i + 1); }, 1000);
  }

  return (
    <div className="flex flex-col items-center px-4 pb-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["learn", "quiz"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-full font-bold text-sm capitalize transition-all ${tab === t ? "bg-white text-orange-700 shadow-lg scale-105" : "bg-white/30 text-white"}`}>
            {t === "learn" ? "📚 Learn" : "🎯 Quiz"}
          </button>
        ))}
      </div>

      {tab === "learn" && (
        <div className="w-full max-w-md">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {FOODS.map((f, i) => (
              <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => setPopup(i)}
                className="bg-white/20 rounded-2xl p-3 flex flex-col items-center gap-1 hover:bg-white/40 transition-all">
                <span className="text-4xl">{f.emoji}</span>
                <span className="text-white text-xs font-bold">{f.name}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {popup !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-6"
                onClick={() => setPopup(null)}>
                <motion.div className="bg-white rounded-3xl p-6 shadow-2xl text-center max-w-xs w-full"
                  onClick={e => e.stopPropagation()}>
                  <div className="text-7xl mb-2">{FOODS[popup].emoji}</div>
                  <div className="text-5xl mb-1">{FOODS[popup].flag}</div>
                  <p className="text-2xl font-black text-gray-800 mb-1">{FOODS[popup].name}</p>
                  <p className="text-orange-600 font-bold text-lg mb-2">{FOODS[popup].country}</p>
                  <p className="text-gray-500 text-sm mb-4">
                    This is {FOODS[popup].name} from {FOODS[popup].country}!
                  </p>
                  <button onClick={() => setPopup(null)}
                    className="bg-orange-500 text-white px-8 py-2 rounded-full font-bold">
                    Yum! 😋
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {tab === "quiz" && (
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="bg-white/20 rounded-3xl p-6 text-center w-full">
            <div className="text-7xl mb-2">{q.emoji}</div>
            <p className="text-white font-bold text-lg">{q.name}</p>
            <p className="text-white/80 text-base mt-1">Where is this food from?</p>
          </div>

          <AnimatePresence mode="wait">
            {fb !== "idle" && (
              <motion.div key={fb} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className={`text-4xl font-black ${fb === "correct" ? "text-yellow-300" : "text-red-300"}`}>
                {fb === "correct" ? "⭐ Correct!" : "❌ Try Again!"}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-3 w-full">
            {choices.map(c => (
              <motion.button key={c} whileTap={{ scale: 0.93 }} onClick={() => handleAnswer(c)}
                className={`py-4 rounded-2xl text-base font-black transition-all shadow-md
                  ${fb !== "idle" && c === q.country ? "bg-green-400 text-white" :
                    fb === "wrong" && c !== q.country ? "bg-white/20 text-white/40" :
                    "bg-white text-orange-800 hover:bg-orange-50"}`}>
                {c}
              </motion.button>
            ))}
          </div>

          <p className="text-white/70 text-sm">Score: {correct}/{total}</p>
        </div>
      )}
    </div>
  );
}
