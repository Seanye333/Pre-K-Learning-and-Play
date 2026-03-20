"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WordChoice { id: string; word: string; type: "subject" | "verb" | "object" }

const SUBJECTS: WordChoice[] = [
  { id: "s1", word: "The cat",      type: "subject" },
  { id: "s2", word: "The dog",      type: "subject" },
  { id: "s3", word: "A bird",       type: "subject" },
  { id: "s4", word: "The frog",     type: "subject" },
  { id: "s5", word: "My mom",       type: "subject" },
  { id: "s6", word: "The bunny",    type: "subject" },
];

const VERBS: WordChoice[] = [
  { id: "v1", word: "eats",    type: "verb" },
  { id: "v2", word: "sees",    type: "verb" },
  { id: "v3", word: "likes",   type: "verb" },
  { id: "v4", word: "jumps on",type: "verb" },
  { id: "v5", word: "hugs",    type: "verb" },
  { id: "v6", word: "chases",  type: "verb" },
];

const OBJECTS: WordChoice[] = [
  { id: "o1", word: "the fish",    type: "object" },
  { id: "o2", word: "a big ball",  type: "object" },
  { id: "o3", word: "the flower",  type: "object" },
  { id: "o4", word: "a red apple", type: "object" },
  { id: "o5", word: "the rainbow", type: "object" },
  { id: "o6", word: "her friend",  type: "object" },
];

// Subject emoji map
const SUBJECT_EMOJI: Record<string, string> = {
  s1: "🐱", s2: "🐶", s3: "🐦", s4: "🐸", s5: "👩", s6: "🐰",
};
const VERB_EMOJI: Record<string, string> = {
  v1: "😋", v2: "👀", v3: "❤️", v4: "🦘", v5: "🤗", v6: "🏃",
};
const OBJECT_EMOJI: Record<string, string> = {
  o1: "🐟", o2: "⚽", o3: "🌸", o4: "🍎", o5: "🌈", o6: "👫",
};

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

interface Props { onScore: (c: number, t: number) => void; }

// ── Build a Sentence ──────────────────────────────────────────────────────────
function BuildSentence({ onScore }: Props) {
  const [subject, setSubject] = useState<WordChoice | null>(null);
  const [verb, setVerb] = useState<WordChoice | null>(null);
  const [object, setObject] = useState<WordChoice | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const [subChoices]  = useState(() => shuffle(SUBJECTS).slice(0, 3));
  const [verbChoices] = useState(() => shuffle(VERBS).slice(0, 3));
  const [objChoices]  = useState(() => shuffle(OBJECTS).slice(0, 3));

  function submit() {
    if (!subject || !verb || !object) return;
    setSubmitted(true);
    const nt = total + 1; setTotal(nt);
    // Any complete sentence is correct!
    const nc = correct + 1; setCorrect(nc); onScore(nc, nt);
  }

  function reset() {
    setSubject(null); setVerb(null); setObject(null); setSubmitted(false);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">Build a sentence! Tap one from each box.</p>

      {/* Sentence display */}
      <div className="flex gap-2 items-center flex-wrap justify-center bg-white/10 rounded-2xl px-4 py-3 min-h-14 w-full max-w-sm">
        {subject  ? <span className="text-white font-black">{subject.word}</span>  : <span className="text-white/30 italic">who?</span>}
        {verb     ? <span className="text-white font-black">{verb.word}</span>     : <span className="text-white/30 italic">does what?</span>}
        {object   ? <span className="text-white font-black">{object.word}.</span>  : <span className="text-white/30 italic">what?</span>}
      </div>

      {/* Choice boxes */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
        {/* Subjects */}
        <div className="flex flex-col gap-1">
          <p className="text-yellow-200 font-black text-xs text-center">WHO</p>
          {subChoices.map((s) => (
            <motion.button key={s.id} onClick={() => !submitted && setSubject(s)}
              className={`rounded-xl py-2 px-2 text-xs font-bold text-white
                ${subject?.id === s.id ? "bg-yellow-400 text-yellow-900" : "bg-white/20"}`}
              whileTap={{ scale: 0.95 }}>
              {SUBJECT_EMOJI[s.id]} {s.word}
            </motion.button>
          ))}
        </div>
        {/* Verbs */}
        <div className="flex flex-col gap-1">
          <p className="text-green-200 font-black text-xs text-center">DOES</p>
          {verbChoices.map((v) => (
            <motion.button key={v.id} onClick={() => !submitted && setVerb(v)}
              className={`rounded-xl py-2 px-2 text-xs font-bold text-white
                ${verb?.id === v.id ? "bg-green-400 text-green-900" : "bg-white/20"}`}
              whileTap={{ scale: 0.95 }}>
              {VERB_EMOJI[v.id]} {v.word}
            </motion.button>
          ))}
        </div>
        {/* Objects */}
        <div className="flex flex-col gap-1">
          <p className="text-blue-200 font-black text-xs text-center">WHAT</p>
          {objChoices.map((o) => (
            <motion.button key={o.id} onClick={() => !submitted && setObject(o)}
              className={`rounded-xl py-2 px-2 text-xs font-bold text-white
                ${object?.id === o.id ? "bg-blue-400 text-blue-900" : "bg-white/20"}`}
              whileTap={{ scale: 0.95 }}>
              {OBJECT_EMOJI[o.id]} {o.word}
            </motion.button>
          ))}
        </div>
      </div>

      {!submitted && (
        <motion.button onClick={submit}
          disabled={!subject || !verb || !object}
          className={`px-8 py-3 rounded-2xl font-black text-lg shadow
            ${subject && verb && object ? "bg-white text-purple-700" : "bg-white/20 text-white/40"}`}
          whileHover={{ scale: subject && verb && object ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}>
          ✅ Say it!
        </motion.button>
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div className="flex flex-col items-center gap-2" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <p className="text-yellow-200 font-black text-xl">🌟 Great sentence!</p>
            <p className="text-white/80 text-sm text-center italic">
              "{subject?.word} {verb?.word} {object?.word}."
            </p>
            <button onClick={reset}
              className="bg-white text-purple-700 font-black px-6 py-2 rounded-full mt-2">
              Make Another! 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Sentences built: {correct}</p>
    </div>
  );
}

// ── Arrange the sentence ──────────────────────────────────────────────────────
function ArrangeSentence({ onScore }: Props) {
  const SENTENCES: { words: string[]; emoji: string }[] = [
    { words: ["The", "cat", "sits", "on", "the", "mat."],   emoji: "🐱" },
    { words: ["A", "dog", "runs", "in", "the", "park."],    emoji: "🐶" },
    { words: ["The", "bird", "can", "fly", "very", "high."],emoji: "🐦" },
    { words: ["My", "mom", "bakes", "a", "big", "cake."],   emoji: "🎂" },
    { words: ["The", "frog", "jumps", "into", "the", "pond."],emoji: "🐸" },
    { words: ["I", "love", "to", "read", "fun", "books."],  emoji: "📚" },
  ];

  const [idx, setIdx] = useState(0);
  const sentence = SENTENCES[idx % SENTENCES.length];
  const [pool, setPool] = useState(() => shuffle(sentence.words));
  const [built, setBuilt] = useState<string[]>([]);
  const [feedback, setFB] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  function tapWord(word: string, from: "pool" | "built") {
    if (feedback !== "idle") return;
    if (from === "pool") {
      setPool((p) => { const i = p.indexOf(word); return [...p.slice(0, i), ...p.slice(i + 1)]; });
      setBuilt((b) => [...b, word]);
    } else {
      setBuilt((b) => { const i = b.indexOf(word); return [...b.slice(0, i), ...b.slice(i + 1)]; });
      setPool((p) => [...p, word]);
    }
  }

  function check() {
    if (built.length < sentence.words.length) return;
    const nt = total + 1; setTotal(nt);
    if (built.join(" ") === sentence.words.join(" ")) {
      const nc = correct + 1; setCorrect(nc); onScore(nc, nt); setFB("correct");
    } else { setFB("wrong"); }
    setTimeout(() => {
      setFB("idle");
      const next = idx + 1;
      setIdx(next);
      const s = SENTENCES[next % SENTENCES.length];
      setPool(shuffle(s.words)); setBuilt([]);
    }, 1400);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <p className="text-white font-bold text-sm">Tap words to arrange the sentence!</p>
      <span className="text-5xl">{sentence.emoji}</span>

      {/* Built sentence */}
      <div className="flex gap-1 flex-wrap justify-center bg-white/10 rounded-2xl px-4 py-3 min-h-12 w-full max-w-sm">
        {built.length > 0
          ? built.map((w, i) => (
              <motion.button key={`built-${i}`} onClick={() => tapWord(w, "built")}
                className="bg-yellow-300 text-yellow-900 font-black px-2 py-1 rounded-lg text-sm"
                whileTap={{ scale: 0.9 }}>
                {w}
              </motion.button>
            ))
          : <span className="text-white/30 text-sm italic">tap words below...</span>}
      </div>

      {/* Word pool */}
      <div className="flex gap-2 flex-wrap justify-center">
        {pool.map((w, i) => (
          <motion.button key={`pool-${i}`} onClick={() => tapWord(w, "pool")}
            className="bg-white text-purple-700 font-black px-3 py-2 rounded-xl text-sm shadow"
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
            {w}
          </motion.button>
        ))}
      </div>

      <motion.button onClick={check}
        disabled={built.length < sentence.words.length}
        className={`px-8 py-3 rounded-2xl font-black shadow
          ${built.length >= sentence.words.length ? "bg-white text-purple-700" : "bg-white/20 text-white/40"}`}
        whileTap={{ scale: 0.95 }}>
        ✅ Check!
      </motion.button>

      <AnimatePresence>
        {feedback === "correct" && <motion.p className="text-yellow-200 font-black text-xl" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🌟 Perfect sentence!</motion.p>}
        {feedback === "wrong"   && <motion.p className="text-red-200 font-black text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Try again — move the words around!</motion.p>}
      </AnimatePresence>
      <p className="text-white/60 text-sm">Score: {correct}/{total}</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
const TABS = ["Build", "Arrange"] as const;
type Tab = typeof TABS[number];

export default function SentenceGame({ onScore }: Props) {
  const [tab, setTab] = useState<Tab>("Build");
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 justify-center pb-2 flex-wrap px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1 rounded-full font-bold text-sm transition-all
              ${tab === t ? "bg-white text-purple-700 shadow" : "bg-white/20 text-white"}`}>
            {t === "Build" ? "🏗️ Build" : "🔀 Arrange"}
          </button>
        ))}
      </div>
      {tab === "Build"   && <BuildSentence   onScore={onScore} />}
      {tab === "Arrange" && <ArrangeSentence onScore={onScore} />}
    </div>
  );
}
