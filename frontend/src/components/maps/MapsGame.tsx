"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

const COLS = ["A", "B", "C", "D"];
const ROWS = ["1", "2", "3", "4"];
const EMOJIS = ["🐱", "🌟", "🏠", "🌸", "🚗", "🦋", "🍎", "🐸", "🌈", "🎈", "🐶", "🦁"];

function makeGrid() {
  const positions: string[] = [];
  for (const r of ROWS) for (const c of COLS) positions.push(`${c}${r}`);
  const picked = shuffle(positions).slice(0, 8);
  const emojiList = shuffle(EMOJIS).slice(0, 8);
  const map: Record<string, string> = {};
  picked.forEach((pos, i) => { map[pos] = emojiList[i]; });
  return map;
}

type Mode = "find" | "place";
type FB = "idle" | "correct" | "wrong";

export default function MapsGame({ onScore }: Props) {
  const [mode, setMode] = useState<Mode>("find");
  const [grid, setGrid] = useState<Record<string, string>>(makeGrid);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFB] = useState<FB>("idle");
  const [targets, setTargets] = useState<string[]>(() => {
    const g = makeGrid();
    return shuffle(Object.keys(g)).slice(0, 4);
  });

  const resetGame = useCallback((m: Mode) => {
    const g = makeGrid();
    setGrid(g);
    setMode(m);
    setRound(0);
    setFB("idle");
    if (m === "find") {
      setTargets(shuffle(Object.keys(g)).slice(0, 4));
    } else {
      const allPos: string[] = [];
      for (const r of ROWS) for (const c of COLS) allPos.push(`${c}${r}`);
      setTargets(shuffle(allPos).slice(0, 4));
    }
  }, []);

  const currentTarget = targets[round] ?? "";
  const targetEmoji = mode === "find" ? grid[currentTarget] : EMOJIS[round % EMOJIS.length];

  const handleCellClick = (cell: string) => {
    if (feedback !== "idle") return;
    const nt = total + 1;
    setTotal(nt);
    const isCorrect = cell === currentTarget;
    if (isCorrect) {
      const nc = correct + 1;
      setCorrect(nc);
      onScore(nc, nt);
      setFB("correct");
    } else {
      setFB("wrong");
    }
    setTimeout(() => {
      setFB("idle");
      if (round + 1 >= targets.length) {
        const g = makeGrid();
        setGrid(g);
        if (mode === "find") {
          setTargets(shuffle(Object.keys(g)).slice(0, 4));
        } else {
          const allPos: string[] = [];
          for (const r of ROWS) for (const c of COLS) allPos.push(`${c}${r}`);
          setTargets(shuffle(allPos).slice(0, 4));
        }
        setRound(0);
      } else {
        setRound((r) => r + 1);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-3 px-4 pb-4">
      {/* Mode tabs */}
      <div className="flex gap-3">
        {(["find", "place"] as Mode[]).map((m) => (
          <motion.button
            key={m}
            onClick={() => resetGame(m)}
            className={`px-5 py-2 rounded-xl font-extrabold text-sm
              ${mode === m ? "bg-white text-teal-700 shadow-lg" : "bg-white/30 text-white"}`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            {m === "find" ? "🔍 Find It" : "📍 Place It"}
          </motion.button>
        ))}
      </div>

      {/* Prompt */}
      <motion.div
        key={`${mode}-${round}`}
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/20 rounded-2xl px-6 py-3 text-center"
      >
        {mode === "find" ? (
          <p className="text-white font-black text-lg">
            Where is the <span className="text-3xl">{targetEmoji}</span>?
          </p>
        ) : (
          <p className="text-white font-black text-lg">
            Put <span className="text-3xl">{targetEmoji}</span> at{" "}
            <span className="bg-white text-teal-700 rounded-lg px-2 py-0.5 font-black">{currentTarget}</span>
          </p>
        )}
      </motion.div>

      {/* Score */}
      <p className="text-white/80 text-sm font-bold">
        Score: {correct} / {total} &nbsp;|&nbsp; Round {round + 1} / {targets.length}
      </p>

      {/* Grid */}
      <div className="select-none">
        {/* Column headers */}
        <div className="flex">
          <div className="w-8 h-8" />
          {COLS.map((c) => (
            <div key={c} className="w-14 h-8 flex items-center justify-center text-white font-black text-base">{c}</div>
          ))}
        </div>
        {ROWS.map((r) => (
          <div key={r} className="flex">
            <div className="w-8 h-14 flex items-center justify-center text-white font-black text-base">{r}</div>
            {COLS.map((c) => {
              const cell = `${c}${r}`;
              const emoji = grid[cell];
              const isTarget = cell === currentTarget;
              return (
                <motion.button
                  key={cell}
                  onClick={() => handleCellClick(cell)}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
                  className={`w-14 h-14 m-0.5 rounded-xl flex items-center justify-center text-2xl font-bold border-2 transition-colors
                    ${feedback === "correct" && isTarget ? "bg-yellow-300 border-yellow-400" :
                      feedback === "wrong" && isTarget ? "bg-red-300 border-red-400" :
                      "bg-white/25 border-white/40 hover:bg-white/40"}`}
                >
                  {mode === "find" ? (emoji ?? "") : ""}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            className={`text-2xl font-black ${feedback === "correct" ? "text-yellow-300" : "text-red-300"}`}
          >
            {feedback === "correct" ? "🌟 Great job!" : "❌ Try again!"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
