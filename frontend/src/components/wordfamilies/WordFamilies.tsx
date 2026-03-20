"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAMILIES = [
  { rime:"-at", words:[{w:"cat",e:"🐱"},{w:"bat",e:"🦇"},{w:"hat",e:"🎩"},{w:"mat",e:"🧹"},{w:"rat",e:"🐭"},{w:"sat",e:"🪑"}] },
  { rime:"-an", words:[{w:"can",e:"🥫"},{w:"fan",e:"🌬️"},{w:"man",e:"🧑"},{w:"pan",e:"🍳"},{w:"ran",e:"🏃"},{w:"van",e:"🚐"}] },
  { rime:"-og", words:[{w:"dog",e:"🐶"},{w:"fog",e:"🌫️"},{w:"frog",e:"🐸"},{w:"hog",e:"🐷"},{w:"log",e:"🪵"},{w:"jog",e:"🏃"}] },
  { rime:"-it", words:[{w:"bit",e:"🪙"},{w:"fit",e:"💪"},{w:"hit",e:"👊"},{w:"kit",e:"🧰"},{w:"sit",e:"💺"},{w:"pit",e:"🕳️"}] },
  { rime:"-en", words:[{w:"den",e:"🦁"},{w:"hen",e:"🐔"},{w:"men",e:"👨‍👨"},{w:"pen",e:"🖊️"},{w:"ten",e:"🔟"},{w:"yen",e:"💴"}] },
  { rime:"-op", words:[{w:"cop",e:"👮"},{w:"hop",e:"🐇"},{w:"mop",e:"🧹"},{w:"pop",e:"🎈"},{w:"shop",e:"🛒"},{w:"top",e:"🎵"}] },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

export default function WordFamilies({ onScore }: Props) {
  const [fIdx, setFIdx]   = useState(0);
  const [mode, setMode]   = useState<"learn"|"build">("learn");
  const family = FAMILIES[fIdx];

  // Build mode
  const [bIdx, setBIdx]   = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total,   setTotal]   = useState(0);
  const [feedback, setFB] = useState<"idle"|"correct"|"wrong">("idle");

  const target   = family.words[bIdx % family.words.length];
  const onset    = target.w.replace(family.rime.slice(1), ""); // first letter(s)
  const wrongOns = shuffle("bcdfghjklmnprstw".split("").filter((l) => l !== onset[0])).slice(0, 3);
  const [choices] = useState(() => shuffle([onset, ...wrongOns]));

  function switchFamily(i: number) {
    setFIdx(i); setBIdx(0); setFB("idle");
  }

  function tapLetter(letter: string) {
    if (feedback !== "idle") return;
    const nt = total + 1; setTotal(nt);
    if (letter === onset[0]) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => {
      setFB("idle");
      setBIdx((i) => i + 1);
    }, 1100);
  }

  if (mode === "learn") {
    return (
      <div className="flex flex-col items-center gap-4 p-4 w-full">
        <button onClick={() => setMode("build")} className="bg-white/30 text-white font-bold px-4 py-1 rounded-full text-sm">🎯 Build Words</button>
        <p className="text-white font-bold text-sm">All words in the <span className="text-yellow-300 font-black">{family.rime}</span> family!</p>

        {/* Family tabs */}
        <div className="flex gap-1 flex-wrap justify-center">
          {FAMILIES.map((f, i) => (
            <button key={f.rime} onClick={() => switchFamily(i)}
              className={`px-3 py-1 rounded-full font-black text-sm ${fIdx===i?"bg-white text-purple-700":"bg-white/20 text-white"}`}>
              {f.rime}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {family.words.map(({ w, e }) => (
            <motion.div key={w}
              className="flex flex-col items-center bg-white/20 rounded-2xl py-3 px-4"
              initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <span className="text-4xl">{e}</span>
              <p className="text-white font-black text-xl mt-1">
                <span className="text-yellow-300">{w[0]}</span>
                <span>{family.rime.slice(1)}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <div className="flex gap-2">
        <button onClick={() => setMode("learn")} className="bg-white/30 text-white font-bold px-3 py-1 rounded-full text-xs">📚 Learn</button>
        {FAMILIES.map((f, i) => (
          <button key={f.rime} onClick={() => switchFamily(i)}
            className={`px-3 py-1 rounded-full font-black text-xs ${fIdx===i?"bg-white text-purple-700":"bg-white/20 text-white"}`}>
            {f.rime}
          </button>
        ))}
      </div>

      <p className="text-white font-bold text-sm">Pick the starting letter!</p>

      {/* Word display */}
      <motion.div key={target.w}
        className="flex flex-col items-center bg-white/20 rounded-2xl px-10 py-5"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-7xl">{target.e}</span>
        <p className="text-white font-black text-4xl mt-2">
          <span className={feedback === "correct" ? "text-green-300" : "text-white/30"}>_</span>
          {family.rime.slice(1)}
        </p>
      </motion.div>

      {/* Letter choices */}
      <div className="flex gap-3">
        {choices.map((l) => (
          <motion.button key={l} onClick={() => tapLetter(l)}
            className={`w-14 h-14 rounded-2xl font-black text-3xl shadow
              ${feedback !== "idle" && l === onset[0] ? "bg-green-400 text-white" : ""}
              ${feedback === "wrong" && l !== onset[0] ? "bg-red-300/40 text-white/50" : ""}
              ${feedback === "idle" ? "bg-white text-purple-700" : ""}`}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}>{l}</motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-2xl" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}>🌟 {target.w}!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg"    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>Try again!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
