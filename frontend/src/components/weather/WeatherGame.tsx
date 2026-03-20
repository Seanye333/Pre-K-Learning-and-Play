"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WEATHER_TYPES, SEASONS, type WeatherType } from "./weatherData";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Learn tab ───────────────────────────────────────────────────────────────
function LearnWeather() {
  const [selected, setSelected] = useState<WeatherType | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">Tap each weather to learn about it!</p>
      <div className="grid grid-cols-4 gap-3">
        {WEATHER_TYPES.map((w) => (
          <motion.button key={w.id} onClick={() => setSelected(w)}
            className="flex flex-col items-center bg-white/20 rounded-2xl py-3 px-2 gap-1"
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <span className="text-4xl">{w.emoji}</span>
            <span className="text-white font-black text-xs">{w.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="w-full max-w-sm">
        <p className="text-white font-black text-sm mb-2">Seasons of the Year</p>
        <div className="grid grid-cols-2 gap-2">
          {SEASONS.map((s) => (
            <div key={s.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${s.color}`}>
              <span className="text-2xl">{s.emoji}</span>
              <div>
                <p className="text-white font-black text-sm">{s.name}</p>
                <p className="text-white/80 text-xs">{s.months}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}>
            <motion.div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-3 mx-6"
              initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}
              onClick={(e) => e.stopPropagation()}>
              <span className="text-8xl">{selected.emoji}</span>
              <p className="text-sky-700 font-black text-2xl">{selected.name}</p>
              <p className="text-gray-500 text-sm text-center">{selected.description}</p>
              <p className="text-gray-700 font-bold text-sm">What to wear:</p>
              <div className="flex gap-2">{selected.clothesEmoji.map((e, i) => <span key={i} className="text-3xl">{e}</span>)}</div>
              <button onClick={() => setSelected(null)}
                className="bg-sky-500 text-white font-bold px-6 py-2 rounded-full">Got it! ✓</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Dress for the weather quiz ───────────────────────────────────────────────
function DressQuiz({ onScore }: Props) {
  const [queue] = useState(() => shuffle(WEATHER_TYPES));
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const target = queue[idx % queue.length];
  const wrongs = shuffle(WEATHER_TYPES.filter((w) => w.id !== target.id)).slice(0, 3);
  const roundChoices = shuffle([target, ...wrongs]);

  function pick(w: WeatherType) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (w.id === target.id) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1100);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">What weather needs these clothes?</p>

      <motion.div key={idx} className="flex flex-col items-center bg-white/20 rounded-2xl px-10 py-5 gap-2"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="flex gap-3">{target.clothesEmoji.map((e, i) => <span key={i} className="text-5xl">{e}</span>)}</div>
        <p className="text-white/70 text-xs">{target.clothes.join(" · ")}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {roundChoices.map((w) => (
          <motion.button key={w.id} onClick={() => pick(w)}
            className={`flex flex-col items-center py-4 rounded-2xl font-bold shadow
              ${feedback !== "idle" && w.id === target.id ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && w.id !== target.id ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white/30 text-white" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            <span className="text-4xl">{w.emoji}</span>
            <span className="text-sm font-black">{w.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {target.name}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Look at the clothes again!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Season sort ─────────────────────────────────────────────────────────────
function SeasonSort({ onScore }: Props) {
  type Q = { weatherId: string; season: string };
  const questions: Q[] = SEASONS.flatMap((s) => s.weather.map((w) => ({ weatherId: w, season: s.id })));
  const [queue] = useState(() => shuffle(questions));
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const q = queue[idx % queue.length];
  const weatherItem = WEATHER_TYPES.find((w) => w.id === q.weatherId)!;

  function pick(seasonId: string) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (seasonId === q.season) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1000);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Which season has this weather?</p>

      <motion.div key={`${idx}`} className="flex flex-col items-center bg-white/20 rounded-2xl px-12 py-6"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-7xl">{weatherItem.emoji}</span>
        <p className="text-white font-black text-xl mt-1">{weatherItem.name}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {SEASONS.map((s) => (
          <motion.button key={s.id} onClick={() => pick(s.id)}
            className={`flex flex-col items-center py-4 rounded-2xl font-bold shadow bg-gradient-to-b text-white
              ${feedback !== "idle" && s.id === q.season ? "bg-green-400" : `${s.color}`}
              ${feedback === "wrong" && s.id !== q.season ? "opacity-40" : ""}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
            <span className="text-4xl">{s.emoji}</span>
            <span className="font-black">{s.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 {SEASONS.find((s) => s.id === q.season)?.name}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Think about the season!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Learn", "Dress", "Season"] as const;
type Tab = typeof TABS[number];

export default function WeatherGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-sky-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "📚 Learn" : t === "Dress" ? "👕 Dress Up" : "🍂 Seasons"}
          </button>
        ))}
      </div>
      {tab === "Learn"  && <LearnWeather />}
      {tab === "Dress"  && <DressQuiz  onScore={onScore} />}
      {tab === "Season" && <SeasonSort onScore={onScore} />}
    </div>
  );
}
