"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onScore: (c: number, t: number) => void; }

const HOMES = [
  { animal: "🐦", animalName: "Bird", home: "🪹", homeName: "Nest", sentence: "A bird lives in a nest high in the trees!" },
  { animal: "🐝", animalName: "Bee", home: "🍯", homeName: "Hive", sentence: "A bee lives in a hive made of honey!" },
  { animal: "🕷️", animalName: "Spider", home: "🕸️", homeName: "Web", sentence: "A spider lives in a web it spins itself!" },
  { animal: "🐟", animalName: "Fish", home: "🌊", homeName: "Ocean", sentence: "A fish lives in the ocean or a river!" },
  { animal: "🐕", animalName: "Dog", home: "🏠", homeName: "Kennel", sentence: "A dog lives in a cozy kennel!" },
  { animal: "🐻", animalName: "Bear", home: "🏔️", homeName: "Cave", sentence: "A bear lives in a dark, warm cave!" },
  { animal: "🐰", animalName: "Rabbit", home: "🕳️", homeName: "Burrow", sentence: "A rabbit lives in an underground burrow!" },
  { animal: "🐜", animalName: "Ant", home: "⛰️", homeName: "Anthill", sentence: "An ant lives in a busy anthill colony!" },
  { animal: "🦁", animalName: "Lion", home: "🌿", homeName: "Savanna", sentence: "A lion lives on the grassy savanna!" },
  { animal: "🐴", animalName: "Horse", home: "🏚️", homeName: "Stable", sentence: "A horse lives in a stable with hay!" },
  { animal: "🐧", animalName: "Penguin", home: "🧊", homeName: "Iceberg", sentence: "A penguin lives on cold icy icebergs!" },
  { animal: "🐒", animalName: "Monkey", home: "🌳", homeName: "Tree", sentence: "A monkey swings and lives in the trees!" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function getChoices(correct: string, all: string[]): string[] {
  const others = shuffle(all.filter(n => n !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function HomesGame({ onScore }: Props) {
  const [tab, setTab] = useState<"learn" | "match">("learn");
  const [qIdx, setQIdx] = useState(0);
  const [fb, setFb] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const allHomeEmojis = HOMES.map(h => h.home);
  const questions = shuffle(HOMES);
  const q = questions[qIdx % questions.length];
  const choices = getChoices(q.home, allHomeEmojis);

  function handleAnswer(choice: string) {
    if (fb !== "idle") return;
    const isCorrect = choice === q.home;
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
            className={`px-6 py-2 rounded-full font-bold text-sm capitalize transition-all ${tab === t ? "bg-white text-amber-700 shadow-lg scale-105" : "bg-white/30 text-white"}`}>
            {t === "learn" ? "📚 Learn" : "🎯 Match"}
          </button>
        ))}
      </div>

      {tab === "learn" && (
        <div className="w-full max-w-md space-y-3">
          {HOMES.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white/20 rounded-2xl p-4 flex items-center gap-4">
              <span className="text-4xl">{h.animal}</span>
              <div className="flex-1">
                <p className="text-white font-black text-lg">{h.animalName}</p>
                <p className="text-white/80 text-sm">{h.sentence}</p>
              </div>
              <span className="text-4xl">{h.home}</span>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "match" && (
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="bg-white/20 rounded-3xl p-6 text-center w-full">
            <div className="text-7xl mb-2">{q.animal}</div>
            <p className="text-white text-xl font-bold">
              Where does the <span className="text-yellow-300">{q.animalName}</span> live?
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
                className={`py-5 rounded-2xl text-4xl transition-all shadow-md
                  ${fb !== "idle" && c === q.home ? "bg-green-400" :
                    fb === "wrong" && c !== q.home ? "bg-white/20" :
                    "bg-white hover:bg-amber-50"}`}>
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
