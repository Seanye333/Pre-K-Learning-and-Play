"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onScore: (c: number, t: number) => void; }

const ANIMALS = [
  { adult: "🐕", baby: "🐶", name: "Dog", babyName: "Puppy", fact: "Puppies are born with their eyes closed!" },
  { adult: "🐈", baby: "🐱", name: "Cat", babyName: "Kitten", fact: "Kittens purr to talk to their moms!" },
  { adult: "🐄", baby: "🐮", name: "Cow", babyName: "Calf", fact: "Calves can walk just hours after birth!" },
  { adult: "🐴", baby: "🐎", name: "Horse", babyName: "Foal", fact: "Foals can run on their very first day!" },
  { adult: "🐑", baby: "🐑", name: "Sheep", babyName: "Lamb", fact: "Lambs know their mom's voice right away!" },
  { adult: "🐷", baby: "🐗", name: "Pig", babyName: "Piglet", fact: "Piglets are very smart animals!" },
  { adult: "🦆", baby: "🦆", name: "Duck", babyName: "Duckling", fact: "Ducklings follow their mom everywhere!" },
  { adult: "🐔", baby: "🐣", name: "Chicken", babyName: "Chick", fact: "Chicks hatch by pecking out of their egg!" },
  { adult: "🪿", baby: "🪿", name: "Goose", babyName: "Gosling", fact: "Goslings can swim right after hatching!" },
  { adult: "🐻", baby: "🐻", name: "Bear", babyName: "Cub", fact: "Bear cubs are born tiny — smaller than a squirrel!" },
  { adult: "🦁", baby: "🦁", name: "Lion", babyName: "Cub", fact: "Lion cubs play together in their pride!" },
  { adult: "🐘", baby: "🐘", name: "Elephant", babyName: "Calf", fact: "Baby elephants hold their mom's tail to walk!" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function getChoices(correct: string, all: string[]): string[] {
  const others = shuffle(all.filter(n => n !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function BabyAnimals({ onScore }: Props) {
  const [tab, setTab] = useState<"learn" | "match">("learn");
  const [selected, setSelected] = useState<number | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [fb, setFb] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const allBabyNames = ANIMALS.map(a => a.babyName);
  const questions = shuffle(ANIMALS);
  const q = questions[qIdx % questions.length];
  const choices = getChoices(q.babyName, allBabyNames);

  function handleAnswer(choice: string) {
    if (fb !== "idle") return;
    const isCorrect = choice === q.babyName;
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
        {(["learn", "match"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-full font-bold text-sm capitalize transition-all ${tab === t ? "bg-white text-green-700 shadow-lg scale-105" : "bg-white/30 text-white"}`}>
            {t === "learn" ? "📚 Learn" : "🎯 Match"}
          </button>
        ))}
      </div>

      {tab === "learn" && (
        <div className="w-full max-w-md">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {ANIMALS.map((a, i) => (
              <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => setSelected(i)}
                className="bg-white/20 rounded-2xl p-2 text-3xl flex items-center justify-center aspect-square hover:bg-white/40 transition-all">
                {a.adult}
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {selected !== null && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-3xl p-5 shadow-xl text-center">
                <div className="flex items-center justify-center gap-3 text-5xl mb-2">
                  <span>{ANIMALS[selected].adult}</span>
                  <span className="text-2xl text-gray-400">→</span>
                  <span>{ANIMALS[selected].baby}</span>
                </div>
                <p className="text-2xl font-black text-gray-800 mb-1">
                  {ANIMALS[selected].name} → <span className="text-green-600">{ANIMALS[selected].babyName}</span>
                </p>
                <p className="text-sm text-gray-500 italic mb-3">{ANIMALS[selected].fact}</p>
                <button onClick={() => setSelected(null)}
                  className="bg-green-500 text-white px-6 py-2 rounded-full font-bold">
                  OK!
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {tab === "match" && (
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="bg-white/20 rounded-3xl p-6 text-center w-full">
            <div className="text-7xl mb-2">{q.adult}</div>
            <p className="text-white text-xl font-bold">
              What is a baby <span className="text-yellow-300">{q.name}</span> called?
            </p>
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
                className={`py-4 rounded-2xl text-lg font-black transition-all shadow-md
                  ${fb !== "idle" && c === q.babyName ? "bg-green-400 text-white" :
                    fb === "wrong" && c !== q.babyName ? "bg-white/30 text-white/50" :
                    "bg-white text-green-800 hover:bg-green-50"}`}>
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
