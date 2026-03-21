"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id: string;
  name: string;
  emoji: string;
  clock: string;
  period: "morning" | "afternoon" | "evening" | "night";
  order: number;
}

const ACTIVITIES: Activity[] = [
  { id: "wakeup",    name: "Wake Up",        emoji: "⏰", clock: "7:00 AM",  period: "morning",   order: 1  },
  { id: "teeth1",   name: "Brush Teeth",    emoji: "🪥", clock: "7:10 AM",  period: "morning",   order: 2  },
  { id: "face",     name: "Wash Face",      emoji: "🧼", clock: "7:15 AM",  period: "morning",   order: 3  },
  { id: "dressed",  name: "Get Dressed",    emoji: "👕", clock: "7:20 AM",  period: "morning",   order: 4  },
  { id: "breakfast",name: "Eat Breakfast",  emoji: "🥣", clock: "7:30 AM",  period: "morning",   order: 5  },
  { id: "school",   name: "Go to School",   emoji: "🎒", clock: "8:00 AM",  period: "morning",   order: 6  },
  { id: "play",     name: "Play",           emoji: "🎮", clock: "12:00 PM", period: "afternoon", order: 7  },
  { id: "lunch",    name: "Eat Lunch",      emoji: "🥪", clock: "12:30 PM", period: "afternoon", order: 8  },
  { id: "nap",      name: "Nap Time",       emoji: "😴", clock: "2:00 PM",  period: "afternoon", order: 9  },
  { id: "outside",  name: "Play Outside",   emoji: "🌳", clock: "4:00 PM",  period: "afternoon", order: 10 },
  { id: "dinner",   name: "Eat Dinner",     emoji: "🍽️", clock: "6:00 PM",  period: "evening",   order: 11 },
  { id: "bath",     name: "Bath Time",      emoji: "🛁", clock: "7:00 PM",  period: "evening",   order: 12 },
  { id: "book",     name: "Read a Book",    emoji: "📚", clock: "7:30 PM",  period: "evening",   order: 13 },
  { id: "sleep",    name: "Go to Sleep",    emoji: "😴", clock: "8:00 PM",  period: "night",     order: 14 },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

const PERIOD_COLORS: Record<Activity["period"], string> = {
  morning:   "from-yellow-400 to-orange-500",
  afternoon: "from-sky-400 to-blue-500",
  evening:   "from-purple-500 to-indigo-600",
  night:     "from-indigo-700 to-slate-800",
};

const PERIOD_EMOJI: Record<Activity["period"], string> = {
  morning: "🌅", afternoon: "☀️", evening: "🌆", night: "🌙",
};

function LearnRoutine() {
  const [period, setPeriod] = useState<Activity["period"]>("morning");
  const acts = ACTIVITIES.filter((a) => a.period === period).sort((a, b) => a.order - b.order);
  const periods: Activity["period"][] = ["morning", "afternoon", "evening", "night"];
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="flex gap-2 flex-wrap justify-center">
        {periods.map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-full font-black text-sm capitalize ${period === p ? "bg-white text-orange-600" : "bg-white/20 text-white"}`}>
            {PERIOD_EMOJI[p]} {p}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {acts.map((a, i) => (
          <motion.div key={a.id} className={`flex items-center gap-3 bg-gradient-to-r ${PERIOD_COLORS[period]} rounded-2xl px-4 py-3`}
            initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <span className="text-3xl">{a.emoji}</span>
            <div className="flex-1">
              <p className="text-white font-black text-sm">{a.name}</p>
              <p className="text-white/70 text-xs">🕐 {a.clock}</p>
            </div>
            <span className="bg-white/20 rounded-full w-7 h-7 flex items-center justify-center text-white font-bold text-xs">{i + 1}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OrderMode({ onScore }: Props) {
  const [roundKey, setRoundKey] = useState(0);
  const [queue] = useState(() => {
    const morning = ACTIVITIES.filter((a) => a.period === "morning").slice(0, 5);
    const evening = ACTIVITIES.filter((a) => a.period === "evening");
    return shuffle([morning, evening]);
  });
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<Activity[]>([]);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const group = queue[qIdx % queue.length];
  const [scrambled] = useState(() => shuffle(group));
  const remaining = scrambled.filter((a) => !selected.find((s) => s.id === a.id));

  function pick(a: Activity) {
    if (feedback !== "idle") return;
    const next = [...selected, a];
    setSelected(next);
    if (next.length === group.length) {
      const nt = total + 1; setTotal(nt);
      const correct_order = next.every((act, i) => act.order === group.sort((x, y) => x.order - y.order)[i].order);
      if (correct_order) {
        const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
      } else { setFB("wrong"); }
      setTimeout(() => { setFB("idle"); setSelected([]); setQIdx((i) => i + 1); setRoundKey((k) => k + 1); }, 1400);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full" key={roundKey}>
      <p className="text-white font-bold text-sm text-center">Tap the activities in the right order!</p>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <p className="text-white/70 text-xs text-center">Your order:</p>
        <div className="flex gap-2 flex-wrap justify-center min-h-12">
          {selected.map((a, i) => (
            <motion.div key={a.id} className="flex items-center gap-1 bg-white/30 rounded-full px-3 py-1"
              initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <span>{i + 1}.</span>
              <span className="text-xl">{a.emoji}</span>
              <span className="text-white text-xs font-bold">{a.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {remaining.map((a) => (
          <motion.button key={a.id} onClick={() => pick(a)}
            className="flex items-center gap-3 bg-white/20 rounded-2xl px-4 py-3"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <span className="text-3xl">{a.emoji}</span>
            <p className="text-white font-bold text-sm">{a.name}</p>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.p className={`font-black text-xl ${feedback === "correct" ? "text-yellow-200" : "text-red-200"}`}
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            {feedback === "correct" ? "🌟 Perfect order!" : "🤔 Try again!"}
          </motion.p>
        )}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

function WhenMode({ onScore }: Props) {
  const [queue] = useState(() => shuffle(ACTIVITIES));
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const act = queue[idx % queue.length];
  const periods: Activity["period"][] = ["morning", "afternoon", "evening", "night"];

  function answer(p: Activity["period"]) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (p === act.period) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1200);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">When do you do this?</p>
      <motion.div key={idx} className="flex flex-col items-center bg-white/20 rounded-2xl px-8 py-6 gap-3"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-6xl">{act.emoji}</span>
        <p className="text-white font-black text-lg">{act.name}</p>
        <p className="text-white/60 text-xs">🕐 Hint: {act.clock}</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {periods.map((p) => (
          <motion.button key={p} onClick={() => answer(p)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white capitalize
              ${feedback !== "idle" && p === act.period ? "bg-green-500" : "bg-white/20"}`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span>{PERIOD_EMOJI[p]}</span>
            <span>{p}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.p className={`font-black text-xl ${feedback === "correct" ? "text-yellow-200" : "text-red-200"}`}
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            {feedback === "correct" ? "🌟 That's right!" : `It's ${act.period}! ${PERIOD_EMOJI[act.period]}`}
          </motion.p>
        )}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

const TABS = ["Learn", "Order", "When"] as const;
type Tab = typeof TABS[number];

export default function RoutineGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-orange-600 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "📋 Learn" : t === "Order" ? "🔢 Order It" : "🕐 When?"}
          </button>
        ))}
      </div>
      {tab === "Learn" && <LearnRoutine />}
      {tab === "Order" && <OrderMode onScore={onScore} />}
      {tab === "When"  && <WhenMode  onScore={onScore} />}
    </div>
  );
}
