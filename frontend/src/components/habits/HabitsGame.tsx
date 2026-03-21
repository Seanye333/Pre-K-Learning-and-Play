"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Habit {
  id: string;
  name: string;
  emoji: string;
  why: string;
  color: string;
}

interface Scenario {
  id: string;
  text: string;
  emoji: string;
  isGood: boolean;
  reason: string;
}

const HABITS: Habit[] = [
  { id: "sleep",    name: "Sleep 8 Hours",  emoji: "😴", why: "Sleep helps your brain and body grow strong!", color: "from-indigo-500 to-purple-600" },
  { id: "exercise", name: "Exercise",        emoji: "🏃", why: "Moving your body keeps your heart healthy!", color: "from-orange-500 to-red-500" },
  { id: "eat",      name: "Eat Well",        emoji: "🥗", why: "Healthy food gives you energy to play!", color: "from-green-500 to-emerald-600" },
  { id: "teeth",    name: "Brush Teeth",     emoji: "🪥", why: "Brushing keeps your teeth shiny and strong!", color: "from-cyan-500 to-blue-600" },
  { id: "hands",    name: "Wash Hands",      emoji: "🧼", why: "Clean hands stop germs from making you sick!", color: "from-sky-400 to-indigo-500" },
  { id: "water",    name: "Drink Water",     emoji: "💧", why: "Water keeps every part of your body working!", color: "from-blue-400 to-teal-500" },
  { id: "read",     name: "Read Books",      emoji: "📚", why: "Reading makes your brain super smart!", color: "from-yellow-500 to-amber-600" },
  { id: "kind",     name: "Be Kind",         emoji: "❤️", why: "Kindness makes you and others feel happy!", color: "from-pink-500 to-rose-600" },
];

const SCENARIOS: Scenario[] = [
  { id: "s1",  text: "Eating yummy vegetables for dinner", emoji: "🥦", isGood: true,  reason: "Vegetables give your body vitamins!" },
  { id: "s2",  text: "Staying up all night playing",       emoji: "🌙", isGood: false, reason: "Your body needs sleep to grow and recharge!" },
  { id: "s3",  text: "Brushing teeth after breakfast",     emoji: "🦷", isGood: true,  reason: "Brushing removes sugar and germs from teeth!" },
  { id: "s4",  text: "Drinking soda all day",              emoji: "🥤", isGood: false, reason: "Water is much better for your body than soda!" },
  { id: "s5",  text: "Going for a walk in the park",       emoji: "🌳", isGood: true,  reason: "Walking is great exercise for your heart!" },
  { id: "s6",  text: "Skipping lunch because you're busy", emoji: "🍽️", isGood: false, reason: "Your body needs food for energy all day!" },
  { id: "s7",  text: "Washing hands before eating",        emoji: "🤲", isGood: true,  reason: "Clean hands keep germs away from your food!" },
  { id: "s8",  text: "Sharing books with a friend",        emoji: "📖", isGood: true,  reason: "Reading together is fun and kind!" },
  { id: "s9",  text: "Eating candy for every meal",        emoji: "🍬", isGood: false, reason: "Too much sugar is bad for your teeth and body!" },
  { id: "s10", text: "Drinking a big glass of water",      emoji: "💦", isGood: true,  reason: "Water keeps your body healthy and happy!" },
  { id: "s11", text: "Going to bed on time every night",   emoji: "🛏️", isGood: true,  reason: "Good sleep helps you learn and play better!" },
  { id: "s12", text: "Being mean to someone at school",    emoji: "😠", isGood: false, reason: "Kindness makes everyone feel good including you!" },
  { id: "s13", text: "Jumping and dancing for fun",        emoji: "💃", isGood: true,  reason: "Dancing is great exercise and super fun!" },
  { id: "s14", text: "Skipping hand washing after the bathroom", emoji: "🚽", isGood: false, reason: "Always wash hands to stop spreading germs!" },
  { id: "s15", text: "Saying please and thank you",        emoji: "😊", isGood: true,  reason: "Being polite is a great healthy habit!" },
  { id: "s16", text: "Eating fruit as a snack",            emoji: "🍎", isGood: true,  reason: "Fruit is a delicious healthy snack!" },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

function LearnHabits() {
  const [selected, setSelected] = useState<Habit | null>(null);
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">Tap a habit to learn more!</p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {HABITS.map((h) => (
          <motion.button key={h.id} onClick={() => setSelected(h)}
            className={`flex flex-col items-center gap-1 bg-gradient-to-br ${h.color} rounded-2xl p-4 shadow`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="text-4xl">{h.emoji}</span>
            <p className="text-white font-black text-xs text-center">{h.name}</p>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}>
            <motion.div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-3 mx-6 max-w-xs"
              initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}
              onClick={(e) => e.stopPropagation()}>
              <span className="text-7xl">{selected.emoji}</span>
              <p className="text-green-600 font-black text-xl">{selected.name}</p>
              <p className="text-gray-600 text-center text-sm">{selected.why}</p>
              <button onClick={() => setSelected(null)}
                className="bg-green-500 text-white font-bold px-6 py-2 rounded-full">Got it! ✓</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GoodBadQuiz({ onScore }: Props) {
  const [queue] = useState(() => shuffle(SCENARIOS));
  const [idx, setIdx] = useState(0);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const scenario = queue[idx % queue.length];

  function answer(isGood: boolean) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (isGood === scenario.isGood) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => { setFB("idle"); setIdx((i) => i + 1); }, 1200);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Is this a GOOD HABIT or BAD HABIT?</p>
      <motion.div key={idx} className="flex flex-col items-center bg-white/20 rounded-2xl px-8 py-6 gap-3 w-full max-w-sm"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-6xl">{scenario.emoji}</span>
        <p className="text-white font-black text-base text-center">{scenario.text}</p>
      </motion.div>
      <div className="flex gap-4">
        <motion.button onClick={() => answer(true)}
          className="flex flex-col items-center px-6 py-4 rounded-2xl font-black shadow text-white bg-green-500"
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
          <span className="text-4xl">👍</span>
          <span className="text-sm">GOOD HABIT</span>
        </motion.button>
        <motion.button onClick={() => answer(false)}
          className="flex flex-col items-center px-6 py-4 rounded-2xl font-black shadow text-white bg-red-500"
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
          <span className="text-4xl">👎</span>
          <span className="text-sm">BAD HABIT</span>
        </motion.button>
      </div>
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div className="flex flex-col items-center gap-1" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <p className={`font-black text-xl ${feedback === "correct" ? "text-yellow-200" : "text-red-200"}`}>
              {feedback === "correct" ? "🌟 You got it!" : "🤔 Not quite!"}
            </p>
            <p className="text-white/80 text-xs text-center max-w-xs">{scenario.reason}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

const TABS = ["Learn", "Quiz"] as const;
type Tab = typeof TABS[number];

export default function HabitsGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Learn");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-green-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Learn" ? "📚 Learn" : "🎯 Good or Bad?"}
          </button>
        ))}
      </div>
      {tab === "Learn" && <LearnHabits />}
      {tab === "Quiz"  && <GoodBadQuiz onScore={onScore} />}
    </div>
  );
}
