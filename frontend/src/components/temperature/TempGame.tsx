"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Temp = "hot" | "warm" | "cold";

const ITEMS: { id: string; emoji: string; name: string; temp: Temp }[] = [
  { id: "fire",    emoji: "🔥", name: "Fire",            temp: "hot"  },
  { id: "sun",     emoji: "☀️", name: "Sun",             temp: "hot"  },
  { id: "soup",    emoji: "🍲", name: "Hot Soup",        temp: "hot"  },
  { id: "coffee",  emoji: "☕", name: "Hot Coffee",      temp: "hot"  },
  { id: "volcano", emoji: "🌋", name: "Volcano",         temp: "hot"  },
  { id: "pizza",   emoji: "🍕", name: "Fresh Pizza",     temp: "hot"  },
  { id: "candle",  emoji: "🕯️", name: "Candle",          temp: "hot"  },
  { id: "thermo",  emoji: "🌡️", name: "Hot Day",         temp: "hot"  },
  { id: "ice",     emoji: "🧊", name: "Ice",             temp: "cold" },
  { id: "snow",    emoji: "❄️", name: "Snow",            temp: "cold" },
  { id: "icecream",emoji: "🍦", name: "Ice Cream",       temp: "cold" },
  { id: "colddrk", emoji: "🥤", name: "Cold Drink",      temp: "cold" },
  { id: "snowflk", emoji: "🌨️", name: "Snowstorm",       temp: "cold" },
  { id: "penguin", emoji: "🐧", name: "Penguin",         temp: "cold" },
  { id: "mtn",     emoji: "🏔️", name: "Snowy Mountain",  temp: "cold" },
  { id: "freeze",  emoji: "🥶", name: "Freezing Face",   temp: "cold" },
  { id: "bath",    emoji: "🛁", name: "Warm Bath",       temp: "warm" },
  { id: "sweater", emoji: "🧥", name: "Cozy Sweater",    temp: "warm" },
  { id: "tea",     emoji: "🍵", name: "Warm Tea",        temp: "warm" },
  { id: "mildday", emoji: "🌤️", name: "Mild Day",        temp: "warm" },
];

const HOT_PAIRS  = [
  ["fire", "ice"], ["soup", "icecream"], ["volcano", "snow"],
  ["pizza", "colddrk"], ["coffee", "penguin"], ["sun", "mtn"],
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

const TAB_COLORS: Record<string, string> = {
  learn:  "bg-orange-400 text-white",
  sort:   "bg-pink-400 text-white",
  hotter: "bg-red-500 text-white",
};

interface Props { onScore: (c: number, t: number) => void; }

export default function TempGame({ onScore }: Props) {
  const [tab, setTab] = useState<"learn" | "sort" | "hotter">("learn");

  // LEARN state
  const [learnCat, setLearnCat] = useState<Temp>("hot");

  // SORT state
  const [sortQueue]   = useState(() => shuffle(ITEMS));
  const [sortIdx, setSortIdx]   = useState(0);
  const [sortFB, setSortFB]     = useState<"idle" | "correct" | "wrong">("idle");
  const [sortCorrect, setSortCorrect] = useState(0);
  const [sortTotal, setSortTotal]     = useState(0);

  // HOTTER state
  const [hotPairs]    = useState(() => shuffle(HOT_PAIRS));
  const [hotIdx, setHotIdx]     = useState(0);
  const [hotFB, setHotFB]       = useState<"idle" | "correct" | "wrong">("idle");
  const [hotCorrect, setHotCorrect] = useState(0);
  const [hotTotal, setHotTotal]     = useState(0);
  const [hotChosen, setHotChosen]   = useState<string | null>(null);

  // Sort answer
  function sortAnswer(choice: Temp) {
    if (sortFB !== "idle") return;
    const item = sortQueue[sortIdx % sortQueue.length];
    const nt = sortTotal + 1; setSortTotal(nt);
    if (choice === item.temp) {
      const nc = sortCorrect + 1; setSortCorrect(nc); onScore(nc, nt);
      setSortFB("correct");
    } else {
      setSortFB("wrong");
    }
    setTimeout(() => { setSortFB("idle"); setSortIdx((i) => i + 1); }, 1300);
  }

  // Hotter answer
  function hotAnswer(chosen: string) {
    if (hotFB !== "idle") return;
    const [hId, cId] = hotPairs[hotIdx % hotPairs.length];
    const hotItem = ITEMS.find((x) => x.id === hId)!;
    const coldItem = ITEMS.find((x) => x.id === cId)!;
    setHotChosen(chosen);
    const nt = hotTotal + 1; setHotTotal(nt);
    const correct = (chosen === hotItem.id && hotItem.temp === "hot") ||
                    (chosen === coldItem.id && coldItem.temp === "hot");
    if (correct) {
      const nc = hotCorrect + 1; setHotCorrect(nc); onScore(nc, nt);
      setHotFB("correct");
    } else {
      setHotFB("wrong");
    }
    setTimeout(() => { setHotFB("idle"); setHotChosen(null); setHotIdx((i) => i + 1); }, 1300);
  }

  const catItems: Record<Temp, typeof ITEMS> = {
    hot:  ITEMS.filter((i) => i.temp === "hot"),
    warm: ITEMS.filter((i) => i.temp === "warm"),
    cold: ITEMS.filter((i) => i.temp === "cold"),
  };

  const CAT_STYLE: Record<Temp, string> = {
    hot:  "from-orange-400 to-red-500",
    warm: "from-yellow-300 to-orange-400",
    cold: "from-blue-300 to-cyan-500",
  };

  const sortItem = sortQueue[sortIdx % sortQueue.length];
  const pair = hotPairs[hotIdx % hotPairs.length];
  const itemA = ITEMS.find((x) => x.id === pair[0])!;
  const itemB = ITEMS.find((x) => x.id === pair[1])!;

  return (
    <div className="flex flex-col items-center gap-3 p-4 w-full">
      {/* Tabs */}
      <div className="flex gap-2">
        {(["learn", "sort", "hotter"] as const).map((t) => (
          <motion.button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-black text-sm capitalize shadow ${tab === t ? TAB_COLORS[t] : "bg-white/20 text-white"}`}
            whileTap={{ scale: 0.9 }}>
            {t === "learn" ? "📚 Learn" : t === "sort" ? "🌡️ Sort" : "🔥 Hotter?"}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* LEARN TAB */}
        {tab === "learn" && (
          <motion.div key="learn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 w-full">
            <div className="flex gap-2">
              {(["hot", "warm", "cold"] as Temp[]).map((c) => (
                <motion.button key={c} onClick={() => setLearnCat(c)}
                  className={`px-4 py-2 rounded-xl font-black text-sm capitalize shadow ${learnCat === c ? `bg-gradient-to-r ${CAT_STYLE[c]} text-white` : "bg-white/20 text-white"}`}
                  whileTap={{ scale: 0.9 }}>
                  {c === "hot" ? "🔥 Hot" : c === "warm" ? "🌤️ Warm" : "❄️ Cold"}
                </motion.button>
              ))}
            </div>
            {/* Thermometer */}
            <div className="flex items-end gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-28 rounded-full bg-white/20 relative overflow-hidden border-2 border-white/40">
                  <motion.div className={`absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t ${CAT_STYLE[learnCat]}`}
                    animate={{ height: learnCat === "hot" ? "90%" : learnCat === "warm" ? "55%" : "20%" }}
                    transition={{ duration: 0.5 }} />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-orange-500 border-2 border-white/40 -mt-1" />
              </div>
              <div className="flex flex-wrap gap-2 max-w-xs justify-center">
                {catItems[learnCat].map((it) => (
                  <div key={it.id} className="flex flex-col items-center bg-white/20 rounded-xl p-2 w-16">
                    <span className="text-3xl">{it.emoji}</span>
                    <span className="text-white text-xs font-bold text-center leading-tight">{it.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SORT TAB */}
        {tab === "sort" && (
          <motion.div key="sort" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 w-full">
            <p className="text-white font-bold">Is it Hot, Warm, or Cold?</p>
            <AnimatePresence mode="wait">
              <motion.div key={sortItem.id}
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
                className="flex flex-col items-center bg-white/20 rounded-3xl px-10 py-5 shadow-lg">
                <span className="text-8xl">{sortItem.emoji}</span>
                <p className="text-white font-black text-xl mt-1">{sortItem.name}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-3">
              {(["hot","warm","cold"] as Temp[]).map((ch) => (
                <motion.button key={ch} onClick={() => sortAnswer(ch)} disabled={sortFB !== "idle"}
                  className={`flex flex-col items-center px-5 py-3 rounded-2xl font-black shadow text-white disabled:opacity-50 ${ch === "hot" ? "bg-red-500" : ch === "warm" ? "bg-yellow-400" : "bg-blue-400"}`}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}>
                  <span className="text-2xl">{ch === "hot" ? "🔥" : ch === "warm" ? "🌤️" : "❄️"}</span>
                  <span className="text-sm capitalize">{ch}</span>
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {sortFB !== "idle" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className={`rounded-2xl px-6 py-3 font-black text-white text-lg ${sortFB === "correct" ? "bg-green-400/90" : "bg-red-400/80"}`}>
                  {sortFB === "correct" ? "🌟 Yes!" : `It is ${sortItem.temp.toUpperCase()}! ${sortItem.emoji}`}
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-white/60 text-sm">Score: {sortCorrect}/{sortTotal}</p>
          </motion.div>
        )}

        {/* HOTTER TAB */}
        {tab === "hotter" && (
          <motion.div key="hotter" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 w-full">
            <p className="text-white font-bold text-lg">Which is <span className="text-yellow-200 font-black">hotter</span>?</p>
            <div className="flex gap-4 justify-center">
              {[itemA, itemB].map((it) => (
                <motion.button key={it.id} onClick={() => hotAnswer(it.id)} disabled={hotFB !== "idle"}
                  className={`flex flex-col items-center bg-white/20 rounded-3xl px-7 py-5 shadow-lg disabled:opacity-50
                    ${hotChosen === it.id && hotFB === "correct" ? "ring-4 ring-green-300" : ""}
                    ${hotChosen === it.id && hotFB === "wrong"   ? "ring-4 ring-red-300"   : ""}`}
                  whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.88 }}>
                  <span className="text-7xl">{it.emoji}</span>
                  <p className="text-white font-black text-base mt-1">{it.name}</p>
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {hotFB !== "idle" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className={`rounded-2xl px-6 py-3 font-black text-white text-lg ${hotFB === "correct" ? "bg-green-400/90" : "bg-red-400/80"}`}>
                  {hotFB === "correct" ? "🌟 That's hotter!" : `🔥 ${itemA.name} is hotter!`}
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-white/60 text-sm">Score: {hotCorrect}/{hotTotal}</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
