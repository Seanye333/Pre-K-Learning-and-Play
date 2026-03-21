"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

interface Word { word: string; emoji: string; }

const WORDS: Word[] = [
  { word: "cat", emoji: "🐱" }, { word: "dog", emoji: "🐶" }, { word: "pig", emoji: "🐷" },
  { word: "hen", emoji: "🐔" }, { word: "bug", emoji: "🐛" }, { word: "cup", emoji: "🥤" },
  { word: "hat", emoji: "🎩" }, { word: "bed", emoji: "🛏️" }, { word: "fox", emoji: "🦊" },
  { word: "sun", emoji: "☀️" }, { word: "bat", emoji: "🦇" }, { word: "net", emoji: "🥅" },
  { word: "jug", emoji: "🫙" }, { word: "fit", emoji: "💪" }, { word: "cod", emoji: "🐟" },
  { word: "map", emoji: "🗺️" }, { word: "led", emoji: "💡" }, { word: "hut", emoji: "🛖" },
  { word: "zip", emoji: "🤐" }, { word: "got", emoji: "🎁" },
];

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function LetterBoxes({ word, bounce }: { word: string; bounce: boolean }) {
  return (
    <div className="flex gap-2 justify-center">
      {word.split("").map((ch, i) => {
        const isVowel = VOWELS.has(ch);
        return (
          <motion.div key={i}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg
              ${isVowel ? "bg-red-500" : "bg-blue-500"}`}
            animate={bounce ? { y: [0, -18, 0, -10, 0] } : {}}
            transition={{ delay: i * 0.12, duration: 0.5 }}>
            {ch.toUpperCase()}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function CVCGame({ onScore }: Props) {
  const [tab, setTab] = useState<"learn" | "build" | "quiz">("learn");

  // Learn state
  const [learnIdx, setLearnIdx] = useState(0);
  const [bounce, setBounce] = useState(false);

  // Build state
  const [buildIdx, setBuildIdx] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [bankLetters, setBankLetters] = useState<string[]>(() => makeBank(0));
  const [buildFb, setBuildFb] = useState<"idle" | "correct" | "wrong">("idle");

  // Quiz state
  const [qIdx, setQIdx] = useState(0);
  const [qChoices, setQChoices] = useState<string[]>(() => makeQChoices(0));
  const [qFb, setQFb] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  function makeBank(idx: number): string[] {
    const w = WORDS[idx].word;
    const extras = shuffle("abcdefghijklmnoprstuw".split("").filter((c) => !w.includes(c))).slice(0, 3);
    return shuffle([...w.split(""), ...extras]);
  }

  function makeQChoices(answerIdx: number): string[] {
    const answer = WORDS[answerIdx].word;
    const others = shuffle(WORDS.filter((_, i) => i !== answerIdx)).slice(0, 3).map((w) => w.word);
    return shuffle([answer, ...others]);
  }

  function tapLetter(letter: string, bankIdx: number) {
    if (placed.length >= 3) return;
    setPlaced((p) => [...p, letter]);
    setBankLetters((b) => b.filter((_, i) => i !== bankIdx));
  }

  function removePlaced(i: number) {
    const removed = placed[i];
    setPlaced((p) => p.filter((_, pi) => pi !== i));
    setBankLetters((b) => [...b, removed]);
  }

  function submitBuild() {
    if (placed.length < 3 || buildFb !== "idle") return;
    const isCorrect = placed.join("") === WORDS[buildIdx].word;
    setBuildFb(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setBuildFb("idle");
      const next = (buildIdx + 1) % WORDS.length;
      setBuildIdx(next);
      setPlaced([]);
      setBankLetters(makeBank(next));
    }, 1100);
  }

  const pickQuiz = useCallback((word: string) => {
    if (qFb !== "idle") return;
    const isCorrect = word === WORDS[qIdx].word;
    const nc = correct + (isCorrect ? 1 : 0);
    const nt = total + 1;
    setCorrect(nc); setTotal(nt);
    onScore(nc, nt);
    setQFb(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setQFb("idle");
      const next = (qIdx + 1) % WORDS.length;
      setQIdx(next);
      setQChoices(makeQChoices(next));
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qFb, qIdx, correct, total, onScore]);

  const learnWord = WORDS[learnIdx];
  const buildWord = WORDS[buildIdx];
  const qWord = WORDS[qIdx];

  return (
    <div className="flex flex-col items-center gap-3 p-4 w-full">
      {/* Tabs */}
      <div className="flex gap-2">
        {(["learn", "build", "quiz"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-emerald-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "learn" ? "📚 Learn" : t === "build" ? "🔨 Build" : "🎯 Quiz"}
          </button>
        ))}
      </div>

      {/* LEARN */}
      {tab === "learn" && (
        <AnimatePresence mode="wait">
          <motion.div key={learnIdx}
            className="flex flex-col items-center gap-4 bg-white/20 rounded-3xl p-6 w-full max-w-sm"
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
            <motion.button
              onClick={() => { setBounce(true); setTimeout(() => setBounce(false), 700); }}
              className="text-8xl" whileTap={{ scale: 0.85 }}>
              {learnWord.emoji}
            </motion.button>
            <LetterBoxes word={learnWord.word} bounce={bounce} />
            <p className="text-white/70 text-sm">Tap the picture to hear it!</p>
            <div className="flex gap-4 items-center mt-1">
              <motion.button onClick={() => { setLearnIdx((i) => (i - 1 + WORDS.length) % WORDS.length); setBounce(false); }}
                className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>← Back</motion.button>
              <span className="text-white/70 text-sm">{learnIdx + 1} / {WORDS.length}</span>
              <motion.button onClick={() => { setLearnIdx((i) => (i + 1) % WORDS.length); setBounce(false); }}
                className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>Next →</motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* BUILD */}
      {tab === "build" && (
        <AnimatePresence mode="wait">
          <motion.div key={buildIdx}
            className="flex flex-col items-center gap-4 bg-white/20 rounded-3xl p-5 w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <p className="text-white font-bold text-lg">Spell the word! 🔤</p>
            <span className="text-7xl">{buildWord.emoji}</span>
            {/* Blank slots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div key={i}
                  onClick={() => placed[i] && removePlaced(i)}
                  className={`w-14 h-14 rounded-2xl border-4 flex items-center justify-center text-3xl font-black cursor-pointer
                    ${placed[i]
                      ? buildFb === "correct" ? "bg-green-400 border-green-600 text-white"
                        : buildFb === "wrong" ? "bg-red-400 border-red-600 text-white"
                        : "bg-white/90 border-white text-emerald-700"
                      : "bg-white/20 border-white/40 text-transparent"}`}
                  whileTap={{ scale: 0.9 }}>
                  {placed[i]?.toUpperCase() || ""}
                </motion.div>
              ))}
            </div>
            {/* Letter bank */}
            <div className="flex gap-2 flex-wrap justify-center">
              {bankLetters.map((letter, i) => (
                <motion.button key={`${letter}-${i}`}
                  onClick={() => tapLetter(letter, i)}
                  className="w-12 h-12 bg-white rounded-xl font-black text-2xl text-emerald-700 shadow"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}>
                  {letter.toUpperCase()}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={submitBuild}
              disabled={placed.length < 3}
              className={`px-8 py-3 rounded-2xl font-black text-xl shadow transition-all
                ${placed.length === 3 ? "bg-yellow-400 text-yellow-900" : "bg-white/20 text-white/40"}`}
              whileHover={{ scale: placed.length === 3 ? 1.05 : 1 }}
              whileTap={{ scale: placed.length === 3 ? 0.93 : 1 }}>
              Check! ✅
            </motion.button>
            {buildFb !== "idle" && (
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }}
                className={`text-2xl font-black ${buildFb === "correct" ? "text-green-300" : "text-red-300"}`}>
                {buildFb === "correct" ? "🌟 Correct!" : `❌ It's "${buildWord.word.toUpperCase()}"`}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* QUIZ */}
      {tab === "quiz" && (
        <AnimatePresence mode="wait">
          <motion.div key={qIdx}
            className="flex flex-col items-center gap-4 w-full max-w-sm"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            <p className="text-white font-bold text-lg">What word is this? 🤔</p>
            <span className="text-8xl">{qWord.emoji}</span>
            <div className="grid grid-cols-2 gap-3 w-full">
              {qChoices.map((word) => {
                const isAnswer = word === qWord.word;
                let cls = "bg-white/90 text-emerald-800 font-black text-xl rounded-2xl py-4 w-full shadow";
                if (qFb === "correct" && isAnswer) cls = "bg-green-400 text-white font-black text-xl rounded-2xl py-4 w-full shadow";
                if (qFb === "wrong" && isAnswer) cls = "bg-red-400 text-white font-black text-xl rounded-2xl py-4 w-full shadow";
                return (
                  <motion.button key={word} onClick={() => pickQuiz(word)} className={cls}
                    whileHover={{ scale: qFb === "idle" ? 1.04 : 1 }} whileTap={{ scale: qFb === "idle" ? 0.92 : 1 }}>
                    {word.toUpperCase()}
                  </motion.button>
                );
              })}
            </div>
            <p className="text-white/70 text-sm">Score: {correct} / {total}</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
