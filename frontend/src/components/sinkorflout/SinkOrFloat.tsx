"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OBJECTS = [
  { id:"rock",     name:"Rock",       emoji:"🪨", sinks:true,  fact:"Rocks are heavy and dense — they sink!" },
  { id:"boat",     name:"Toy Boat",   emoji:"🛶", sinks:false, fact:"Boats are shaped to float on water!" },
  { id:"apple",    name:"Apple",      emoji:"🍎", sinks:false, fact:"Apples have air pockets inside — they float!" },
  { id:"coin",     name:"Coin",       emoji:"🪙", sinks:true,  fact:"Metal coins are dense — they sink!" },
  { id:"feather",  name:"Feather",    emoji:"🪶", sinks:false, fact:"Feathers are super light — they float!" },
  { id:"ball",     name:"Ball",       emoji:"⚽", sinks:false, fact:"Balls have air inside — they float!" },
  { id:"anchor",   name:"Anchor",     emoji:"⚓", sinks:true,  fact:"Anchors are made to sink and hold ships!" },
  { id:"leaf",     name:"Leaf",       emoji:"🍃", sinks:false, fact:"Dry leaves are light and float!" },
  { id:"hammer",   name:"Hammer",     emoji:"🔨", sinks:true,  fact:"Heavy tools made of metal sink!" },
  { id:"orange",   name:"Orange",     emoji:"🍊", sinks:false, fact:"Oranges float because of their thick skin!" },
  { id:"key",      name:"Key",        emoji:"🗝️",  sinks:true,  fact:"Keys are small but made of heavy metal!" },
  { id:"balloon",  name:"Balloon",    emoji:"🎈", sinks:false, fact:"Balloons are full of air — they float!" },
  { id:"paperclip",name:"Paper Clip", emoji:"📎", sinks:true,  fact:"Paper clips are metal — they sink!" },
  { id:"duck",     name:"Rubber Duck",emoji:"🦆", sinks:false, fact:"Rubber ducks are hollow — they float!" },
  { id:"brick",    name:"Brick",      emoji:"🧱", sinks:true,  fact:"Bricks are very heavy — they sink!" },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

export default function SinkOrFloat({ onScore }: Props) {
  const [queue]   = useState(() => shuffle(OBJECTS));
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState<"idle"|"sinking"|"floating">("idle");
  const [chosen, setChosen] = useState<boolean|null>(null);
  const [correct, setCorrect] = useState(0);
  const [total,   setTotal]   = useState(0);

  const item = queue[idx % queue.length];

  function predict(willSink: boolean) {
    if (result !== "idle") return;
    setChosen(willSink);
    setResult(item.sinks ? "sinking" : "floating");
    const nt = total + 1; setTotal(nt);
    if (willSink === item.sinks) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt);
    }
    setTimeout(() => { setResult("idle"); setChosen(null); setIdx((i) => i + 1); }, 2000);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-bold text-sm">Will it <span className="text-blue-200 font-black">sink</span> or <span className="text-yellow-200 font-black">float</span>?</p>

      {/* Object */}
      <motion.div key={item.id} className="relative flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>

        {/* Water container */}
        <div className="relative w-48 h-36 rounded-2xl bg-blue-400/60 border-2 border-blue-300 overflow-hidden">
          {/* Water surface */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-blue-500/60" />

          {/* Item animation */}
          <AnimatePresence>
            {result === "idle" && (
              <motion.span key="idle" className="absolute text-6xl" style={{ left:"50%", top:"10%", transform:"translateX(-50%)" }}>{item.emoji}</motion.span>
            )}
            {result === "sinking" && (
              <motion.span key="sink" className="absolute text-6xl"
                initial={{ top:"10%", left:"50%", x:"-50%" }}
                animate={{ top:"60%"  }}
                transition={{ duration:1.2, ease:"easeIn" }}
                style={{ position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
                {item.emoji}
              </motion.span>
            )}
            {result === "floating" && (
              <motion.span key="float" className="absolute text-6xl"
                initial={{ top:"10%", left:"50%", x:"-50%" }}
                animate={{ top:"22%" }}
                transition={{ duration:0.8, ease:"easeOut" }}
                style={{ position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
                {item.emoji}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <p className="text-white font-black text-2xl mt-2">{item.name}</p>
      </motion.div>

      {/* Buttons */}
      {result === "idle" && (
        <div className="flex gap-5">
          <motion.button onClick={() => predict(true)}
            className="flex flex-col items-center gap-1 bg-blue-700/70 text-white font-black px-7 py-4 rounded-2xl shadow"
            whileHover={{ scale:1.07 }} whileTap={{ scale:0.9 }}>
            <span className="text-4xl">⬇️</span><span>Sink</span>
          </motion.button>
          <motion.button onClick={() => predict(false)}
            className="flex flex-col items-center gap-1 bg-yellow-400/80 text-white font-black px-7 py-4 rounded-2xl shadow"
            whileHover={{ scale:1.07 }} whileTap={{ scale:0.9 }}>
            <span className="text-4xl">⬆️</span><span>Float</span>
          </motion.button>
        </div>
      )}

      {/* Fact reveal */}
      <AnimatePresence>
        {result !== "idle" && (
          <motion.div
            className={`rounded-2xl px-5 py-3 text-center max-w-xs ${chosen === item.sinks ? "bg-green-400/80" : "bg-red-400/70"}`}
            initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}>
            <p className="text-white font-black text-base">{chosen === item.sinks ? "🌟 You got it!" : "Not quite!"}</p>
            <p className="text-white/90 text-sm mt-1">{item.fact}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}
