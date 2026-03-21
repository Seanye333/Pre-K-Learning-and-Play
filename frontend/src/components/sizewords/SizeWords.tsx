"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

interface SizeConcept {
  id: string;
  wordA: string;
  wordB: string;
  emojiA: string;
  emojiB: string;
  sentence: string;
  questionA: string; // "Tap the BIG animal!"
  questionB: string; // "Tap the SMALL animal!"
}

const CONCEPTS: SizeConcept[] = [
  {
    id: "bigsmall", wordA: "BIG", wordB: "SMALL",
    emojiA: "🐘", emojiB: "🐭",
    sentence: "An elephant is BIG. A mouse is SMALL.",
    questionA: "Tap the BIG animal! 🐘", questionB: "Tap the SMALL animal! 🐭",
  },
  {
    id: "tallshort", wordA: "TALL", wordB: "SHORT",
    emojiA: "🦒", emojiB: "🐢",
    sentence: "A giraffe is TALL. A turtle is SHORT.",
    questionA: "Tap the TALL animal! 🦒", questionB: "Tap the SHORT animal! 🐢",
  },
  {
    id: "longshort", wordA: "LONG", wordB: "SHORT",
    emojiA: "🐍", emojiB: "🐛",
    sentence: "A snake is LONG. A caterpillar is SHORT.",
    questionA: "Tap the LONG animal! 🐍", questionB: "Tap the SHORT bug! 🐛",
  },
  {
    id: "heavylight", wordA: "HEAVY", wordB: "LIGHT",
    emojiA: "🦛", emojiB: "🦋",
    sentence: "A hippo is HEAVY. A butterfly is LIGHT.",
    questionA: "Tap the HEAVY animal! 🦛", questionB: "Tap the LIGHT animal! 🦋",
  },
  {
    id: "widenarrow", wordA: "WIDE", wordB: "NARROW",
    emojiA: "🚌", emojiB: "🚲",
    sentence: "A bus is WIDE. A bike is NARROW.",
    questionA: "Tap the WIDE thing! 🚌", questionB: "Tap the NARROW thing! 🚲",
  },
  {
    id: "fullempty", wordA: "FULL", wordB: "EMPTY",
    emojiA: "🧺", emojiB: "🪣",
    sentence: "A basket is FULL. A bucket is EMPTY.",
    questionA: "Tap the FULL thing! 🧺", questionB: "Tap the EMPTY thing! 🪣",
  },
];

// Flat list of all individual size words for the Match tab
const ALL_WORDS: { word: string; conceptId: string; side: "A" | "B" }[] = CONCEPTS.flatMap((c) => [
  { word: c.wordA, conceptId: c.id, side: "A" },
  { word: c.wordB, conceptId: c.id, side: "B" },
]);

export default function SizeWords({ onScore }: Props) {
  const [tab, setTab] = useState<"learn" | "compare" | "match">("learn");
  const [learnIdx, setLearnIdx] = useState(0);

  // Compare: show 2 emojis, tap correct one per question
  const [cmpIdx, setCmpIdx] = useState(0);
  const [askA, setAskA] = useState(true); // ask for side A or side B
  const [cmpFb, setCmpFb] = useState<"idle" | "correct" | "wrong">("idle");
  const [cmpPicked, setCmpPicked] = useState<"A" | "B" | null>(null);

  // Match: show one emoji + 4 word choices
  const [matchList] = useState(() => shuffle([...ALL_WORDS]));
  const [matchQIdx, setMatchQIdx] = useState(0);
  const [matchChoices, setMatchChoices] = useState<string[]>(() => makeMatchChoices(0, matchList));
  const [matchFb, setMatchFb] = useState<"idle" | "correct" | "wrong">("idle");

  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  function makeMatchChoices(answerIdx: number, list: typeof ALL_WORDS): string[] {
    const answer = list[answerIdx].word;
    const others = shuffle(ALL_WORDS.filter((w) => w.word !== answer)).slice(0, 3).map((w) => w.word);
    return shuffle([answer, ...others]);
  }

  const pickCompare = useCallback((side: "A" | "B") => {
    if (cmpFb !== "idle") return;
    const isCorrect = askA ? side === "A" : side === "B";
    const nc = correct + (isCorrect ? 1 : 0);
    const nt = total + 1;
    setCorrect(nc); setTotal(nt);
    onScore(nc, nt);
    setCmpPicked(side);
    setCmpFb(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setCmpFb("idle");
      setCmpPicked(null);
      if (askA) {
        setAskA(false);
      } else {
        setAskA(true);
        setCmpIdx((i) => (i + 1) % CONCEPTS.length);
      }
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmpFb, askA, correct, total, onScore]);

  const pickMatch = useCallback((word: string) => {
    if (matchFb !== "idle") return;
    const isCorrect = word === matchList[matchQIdx].word;
    const nc = correct + (isCorrect ? 1 : 0);
    const nt = total + 1;
    setCorrect(nc); setTotal(nt);
    onScore(nc, nt);
    setMatchFb(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setMatchFb("idle");
      const next = (matchQIdx + 1) % matchList.length;
      setMatchQIdx(next);
      setMatchChoices(makeMatchChoices(next, matchList));
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchFb, matchQIdx, correct, total, onScore, matchList]);

  const learnC = CONCEPTS[learnIdx];
  const cmpC = CONCEPTS[cmpIdx];
  const mq = matchList[matchQIdx];
  const mqConcept = CONCEPTS.find((c) => c.id === mq.conceptId)!;
  const mqEmoji = mq.side === "A" ? mqConcept.emojiA : mqConcept.emojiB;

  function emojiStyle(side: "A"): React.CSSProperties {
    // Make side A (big/tall/long etc) look bigger
    return side === "A" ? { fontSize: "72px" } : { fontSize: "44px" };
  }

  return (
    <div className="flex flex-col items-center gap-3 p-4 w-full">
      {/* Tabs */}
      <div className="flex gap-2">
        {(["learn", "compare", "match"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-amber-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "learn" ? "📚 Learn" : t === "compare" ? "🔍 Compare" : "🎯 Match"}
          </button>
        ))}
      </div>

      {/* LEARN */}
      {tab === "learn" && (
        <AnimatePresence mode="wait">
          <motion.div key={learnIdx}
            className="flex flex-col items-center gap-4 bg-white/20 rounded-3xl p-6 w-full max-w-sm"
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
            <div className="flex gap-8 items-end">
              <div className="flex flex-col items-center gap-1">
                <span style={emojiStyle("A")}>{learnC.emojiA}</span>
                <span className="bg-white/90 text-amber-700 font-black px-3 py-1 rounded-xl text-sm">{learnC.wordA}</span>
              </div>
              <span className="text-3xl text-white font-black pb-4">vs</span>
              <div className="flex flex-col items-center gap-1">
                <span style={{ fontSize: "44px" }}>{learnC.emojiB}</span>
                <span className="bg-white/90 text-amber-700 font-black px-3 py-1 rounded-xl text-sm">{learnC.wordB}</span>
              </div>
            </div>
            <p className="text-white/90 text-base font-semibold text-center">{learnC.sentence}</p>
            <div className="flex gap-4 items-center mt-1">
              <motion.button onClick={() => setLearnIdx((i) => (i - 1 + CONCEPTS.length) % CONCEPTS.length)}
                className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>← Back</motion.button>
              <span className="text-white/70 text-sm">{learnIdx + 1} / {CONCEPTS.length}</span>
              <motion.button onClick={() => setLearnIdx((i) => (i + 1) % CONCEPTS.length)}
                className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>Next →</motion.button>
            </div>
            <div className="flex gap-1 flex-wrap justify-center">
              {CONCEPTS.map((_, i) => (
                <div key={i} onClick={() => setLearnIdx(i)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${i === learnIdx ? "bg-white scale-125" : "bg-white/30"}`} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* COMPARE */}
      {tab === "compare" && (
        <AnimatePresence mode="wait">
          <motion.div key={`${cmpIdx}-${askA ? "A" : "B"}`}
            className="flex flex-col items-center gap-4 w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <p className="text-white font-black text-xl text-center">
              {askA ? cmpC.questionA : cmpC.questionB}
            </p>
            <div className="flex gap-6 items-end justify-center w-full">
              {(["A", "B"] as const).map((side) => {
                const emoji = side === "A" ? cmpC.emojiA : cmpC.emojiB;
                const isCorrectSide = askA ? side === "A" : side === "B";
                let cls = "flex flex-col items-center gap-2 bg-white/20 rounded-2xl p-4 cursor-pointer border-4 border-transparent transition-all";
                if (cmpFb !== "idle" && cmpPicked === side) {
                  cls = cls.replace("border-transparent", isCorrectSide ? "border-green-400 bg-green-400/30" : "border-red-400 bg-red-400/30");
                }
                return (
                  <motion.div key={side} className={cls} onClick={() => pickCompare(side)}
                    whileHover={{ scale: cmpFb === "idle" ? 1.06 : 1 }} whileTap={{ scale: cmpFb === "idle" ? 0.92 : 1 }}>
                    <span style={side === "A" ? emojiStyle("A") : { fontSize: "44px" }}>{emoji}</span>
                    <span className="bg-white/90 text-amber-700 font-black px-3 py-1 rounded-xl text-sm">
                      {side === "A" ? cmpC.wordA : cmpC.wordB}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            {cmpFb !== "idle" && (
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }}
                className={`text-2xl font-black ${cmpFb === "correct" ? "text-green-300" : "text-red-300"}`}>
                {cmpFb === "correct" ? "🌟 Yes!" : "❌ Try again!"}
              </motion.p>
            )}
            <p className="text-white/70 text-sm">Score: {correct} / {total}</p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* MATCH */}
      {tab === "match" && (
        <AnimatePresence mode="wait">
          <motion.div key={matchQIdx}
            className="flex flex-col items-center gap-4 w-full max-w-sm"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            <p className="text-white font-bold text-lg">What size word fits? 🤔</p>
            <span style={{ fontSize: "80px" }}>{mqEmoji}</span>
            <div className="grid grid-cols-2 gap-3 w-full">
              {matchChoices.map((word) => {
                const isAnswer = word === mq.word;
                let cls = "font-black text-lg rounded-2xl py-4 w-full shadow transition-all";
                if (matchFb === "correct" && isAnswer) cls += " bg-green-400 text-white";
                else if (matchFb === "wrong" && isAnswer) cls += " bg-red-400 text-white";
                else cls += " bg-white/90 text-amber-700";
                return (
                  <motion.button key={word} onClick={() => pickMatch(word)} className={cls}
                    whileHover={{ scale: matchFb === "idle" ? 1.04 : 1 }} whileTap={{ scale: matchFb === "idle" ? 0.92 : 1 }}>
                    {word}
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
