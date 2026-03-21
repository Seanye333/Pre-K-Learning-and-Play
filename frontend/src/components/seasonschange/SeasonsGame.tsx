"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Season = "spring" | "summer" | "autumn" | "winter";

const SEASONS: Record<Season, {
  label: string; emoji: string; color: string; bg: string;
  desc: string; emojis: string[]; clothes: string; clothesEmoji: string;
  activities: string[]; quizEmojis: { emoji: string; name: string }[];
}> = {
  spring: {
    label: "Spring", emoji: "🌸", color: "text-pink-200",
    bg: "from-pink-400 to-purple-400",
    desc: "Spring is warm with pretty flowers! Birds come back and baby animals are born.",
    emojis: ["🌸","🌷","🌧️","🐣","🦋"],
    clothes: "Light Jacket", clothesEmoji: "🧤",
    activities: ["🪁 Fly a kite", "🌱 Gardening", "🌈 Chase rainbows"],
    quizEmojis: [
      { emoji: "🌸", name: "Cherry blossom" },
      { emoji: "🐣", name: "Baby chick" },
      { emoji: "🌷", name: "Tulip" },
    ],
  },
  summer: {
    label: "Summer", emoji: "☀️", color: "text-yellow-200",
    bg: "from-yellow-400 to-orange-400",
    desc: "Summer is hot and sunny! Days are long and it's perfect for swimming.",
    emojis: ["☀️","🏖️","🍦","🌊","🌻"],
    clothes: "Shorts & T-Shirt", clothesEmoji: "👙",
    activities: ["🏊 Swimming", "⛺ Camping", "🍉 Eat watermelon"],
    quizEmojis: [
      { emoji: "🏖️", name: "Beach" },
      { emoji: "🍦", name: "Ice cream" },
      { emoji: "🌊", name: "Ocean wave" },
    ],
  },
  autumn: {
    label: "Autumn", emoji: "🍂", color: "text-orange-200",
    bg: "from-orange-400 to-red-500",
    desc: "Autumn is cool and colorful! Leaves fall and it's harvest time.",
    emojis: ["🍂","🍁","🎃","🌽","🍎"],
    clothes: "Cozy Sweater", clothesEmoji: "🧣",
    activities: ["🍎 Apple picking", "🍃 Jump in leaves", "🎃 Carve pumpkins"],
    quizEmojis: [
      { emoji: "🍂", name: "Falling leaf" },
      { emoji: "🎃", name: "Jack-o-lantern" },
      { emoji: "🍁", name: "Maple leaf" },
    ],
  },
  winter: {
    label: "Winter", emoji: "❄️", color: "text-blue-200",
    bg: "from-blue-400 to-indigo-600",
    desc: "Winter is cold and snowy! Days are short and holidays are cozy.",
    emojis: ["❄️","⛄","🎄","🧤","🛷"],
    clothes: "Heavy Coat & Scarf", clothesEmoji: "🧥",
    activities: ["🛷 Sledding", "⛄ Build snowman", "🎄 Decorate the tree"],
    quizEmojis: [
      { emoji: "⛄", name: "Snowman" },
      { emoji: "🎄", name: "Christmas tree" },
      { emoji: "❄️", name: "Snowflake" },
    ],
  },
};

const SEASON_ORDER: Season[] = ["spring", "summer", "autumn", "winter"];

// Quiz questions: emoji -> correct season
const QUIZ_QS = SEASON_ORDER.flatMap((s) =>
  SEASONS[s].quizEmojis.map((q) => ({ ...q, answer: s }))
);

// Clothing quiz: season -> correct clothesEmoji (wrong options from other seasons)
const CLOTHING_QS: { season: Season; correct: string; options: string[] }[] =
  SEASON_ORDER.map((s) => {
    const others = SEASON_ORDER.filter((x) => x !== s).map((x) => SEASONS[x].clothesEmoji);
    const opts = [SEASONS[s].clothesEmoji, ...others].sort(() => Math.random() - 0.5);
    return { season: s, correct: SEASONS[s].clothesEmoji, options: opts };
  });

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

export default function SeasonsGame({ onScore }: Props) {
  const [tab, setTab] = useState<"learn" | "quiz" | "wear">("learn");
  const [learnSeason, setLearnSeason] = useState<Season>("spring");

  // Quiz state
  const [quizQueue]   = useState(() => shuffle(QUIZ_QS));
  const [quizIdx, setQuizIdx]   = useState(0);
  const [quizFB, setQuizFB]     = useState<"idle" | "correct" | "wrong">("idle");
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizTotal, setQuizTotal]     = useState(0);

  // Wear state
  const [wearQueue]   = useState(() => shuffle(CLOTHING_QS));
  const [wearIdx, setWearIdx]   = useState(0);
  const [wearFB, setWearFB]     = useState<"idle" | "correct" | "wrong">("idle");
  const [wearCorrect, setWearCorrect] = useState(0);
  const [wearTotal, setWearTotal]     = useState(0);
  const [wearChosen, setWearChosen]   = useState<string | null>(null);

  function quizAnswer(s: Season) {
    if (quizFB !== "idle") return;
    const q = quizQueue[quizIdx % quizQueue.length];
    const nt = quizTotal + 1; setQuizTotal(nt);
    if (s === q.answer) {
      const nc = quizCorrect + 1; setQuizCorrect(nc); onScore(nc, nt);
      setQuizFB("correct");
    } else {
      setQuizFB("wrong");
    }
    setTimeout(() => { setQuizFB("idle"); setQuizIdx((i) => i + 1); }, 1400);
  }

  function wearAnswer(opt: string) {
    if (wearFB !== "idle") return;
    const q = wearQueue[wearIdx % wearQueue.length];
    setWearChosen(opt);
    const nt = wearTotal + 1; setWearTotal(nt);
    if (opt === q.correct) {
      const nc = wearCorrect + 1; setWearCorrect(nc); onScore(nc, nt);
      setWearFB("correct");
    } else {
      setWearFB("wrong");
    }
    setTimeout(() => { setWearFB("idle"); setWearChosen(null); setWearIdx((i) => i + 1); }, 1400);
  }

  const s = SEASONS[learnSeason];
  const qq = quizQueue[quizIdx % quizQueue.length];
  const wq = wearQueue[wearIdx % wearQueue.length];
  const wSeason = SEASONS[wq.season];

  return (
    <div className="flex flex-col items-center gap-3 p-4 w-full">
      {/* Tabs */}
      <div className="flex gap-2">
        {(["learn", "quiz", "wear"] as const).map((t) => (
          <motion.button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-black text-sm shadow ${tab === t ? "bg-white text-sky-700" : "bg-white/20 text-white"}`}
            whileTap={{ scale: 0.9 }}>
            {t === "learn" ? "📚 Learn" : t === "quiz" ? "❓ Quiz" : "👗 Wear?"}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* LEARN TAB */}
        {tab === "learn" && (
          <motion.div key="learn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 w-full">
            <div className="flex gap-1 flex-wrap justify-center">
              {SEASON_ORDER.map((sn) => (
                <motion.button key={sn} onClick={() => setLearnSeason(sn)}
                  className={`px-4 py-2 rounded-xl font-black text-sm shadow ${learnSeason === sn ? `bg-gradient-to-r ${SEASONS[sn].bg} text-white` : "bg-white/20 text-white"}`}
                  whileTap={{ scale: 0.9 }}>
                  {SEASONS[sn].emoji} {SEASONS[sn].label}
                </motion.button>
              ))}
            </div>
            <motion.div key={learnSeason} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white/20 rounded-3xl p-5 max-w-sm w-full shadow-xl text-center">
              <p className="text-5xl mb-1">{s.emojis.join(" ")}</p>
              <p className="text-white font-black text-xl">{s.emoji} {s.label}</p>
              <p className="text-white/90 text-sm mt-2">{s.desc}</p>
              <div className="mt-3 bg-white/20 rounded-2xl p-3">
                <p className="text-white font-black text-xs uppercase tracking-wide mb-1">What to Wear</p>
                <p className="text-3xl">{s.clothesEmoji}</p>
                <p className="text-white text-sm font-bold">{s.clothes}</p>
              </div>
              <div className="mt-3">
                <p className="text-white font-black text-xs uppercase tracking-wide mb-1">Activities</p>
                {s.activities.map((a) => (
                  <p key={a} className="text-white/90 text-sm">{a}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* QUIZ TAB */}
        {tab === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 w-full">
            <p className="text-white font-bold">Which season is this?</p>
            <AnimatePresence mode="wait">
              <motion.div key={qq.emoji + quizIdx}
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
                className="flex flex-col items-center bg-white/20 rounded-3xl px-12 py-6 shadow-lg">
                <span className="text-9xl leading-none">{qq.emoji}</span>
                <p className="text-white font-bold text-base mt-2">{qq.name}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 flex-wrap justify-center">
              {SEASON_ORDER.map((sn) => (
                <motion.button key={sn} onClick={() => quizAnswer(sn)} disabled={quizFB !== "idle"}
                  className={`flex flex-col items-center px-5 py-3 rounded-2xl font-black shadow text-white disabled:opacity-50 bg-gradient-to-br ${SEASONS[sn].bg}`}
                  whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.88 }}>
                  <span className="text-2xl">{SEASONS[sn].emoji}</span>
                  <span className="text-sm">{SEASONS[sn].label}</span>
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {quizFB !== "idle" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className={`rounded-2xl px-6 py-3 font-black text-white text-lg ${quizFB === "correct" ? "bg-green-400/90" : "bg-red-400/80"}`}>
                  {quizFB === "correct" ? "🌟 Great job!" : `It's ${SEASONS[qq.answer].label}! ${SEASONS[qq.answer].emoji}`}
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-white/60 text-sm">Score: {quizCorrect}/{quizTotal}</p>
          </motion.div>
        )}

        {/* WEAR TAB */}
        {tab === "wear" && (
          <motion.div key="wear" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 w-full">
            <p className="text-white font-bold">What do you wear in...</p>
            <div className={`bg-gradient-to-br ${wSeason.bg} rounded-3xl px-10 py-4 shadow-lg text-center`}>
              <span className="text-5xl">{wSeason.emoji}</span>
              <p className="text-white font-black text-2xl">{wSeason.label}</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {wq.options.map((opt) => (
                <motion.button key={opt} onClick={() => wearAnswer(opt)} disabled={wearFB !== "idle"}
                  className={`flex flex-col items-center bg-white/20 rounded-2xl px-7 py-5 shadow font-black text-white text-4xl disabled:opacity-50
                    ${wearChosen === opt && wearFB === "correct" ? "ring-4 ring-green-300" : ""}
                    ${wearChosen === opt && wearFB === "wrong"   ? "ring-4 ring-red-300"   : ""}`}
                  whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.88 }}>
                  {opt}
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {wearFB !== "idle" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className={`rounded-2xl px-6 py-3 font-black text-white text-lg ${wearFB === "correct" ? "bg-green-400/90" : "bg-red-400/80"}`}>
                  {wearFB === "correct" ? "🌟 Perfect outfit!" : `Wear ${wq.correct} in ${wSeason.label}!`}
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-white/60 text-sm">Score: {wearCorrect}/{wearTotal}</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
