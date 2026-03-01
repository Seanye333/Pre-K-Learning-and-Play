"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, MIX_RECIPES } from "./colorData";
import type { ColorInfo } from "./colorData";

interface ColorMixerProps {
  onScore: (correct: number, total: number) => void;
}

export default function ColorMixer({ onScore }: ColorMixerProps) {
  const [slotA, setSlotA] = useState<ColorInfo | null>(null);
  const [slotB, setSlotB] = useState<ColorInfo | null>(null);
  const [result, setResult] = useState<{ name: string; hex: string; emoji: string } | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "mixed" | "nomatch">("idle");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const primaryColors = COLORS.filter((c) => c.isPrimary || ["White","Black"].includes(c.name));

  const handleColorClick = (color: ColorInfo) => {
    if (feedback === "mixed") return;
    if (!slotA) {
      setSlotA(color);
    } else if (!slotB) {
      if (color.name === slotA.name) return;
      setSlotB(color);
      // auto-mix
      mix(slotA, color);
    }
  };

  const mix = (a: ColorInfo, b: ColorInfo) => {
    const recipe = MIX_RECIPES.find(
      (r) =>
        (r.a === a.name && r.b === b.name) ||
        (r.a === b.name && r.b === a.name)
    );
    const newTotal = total + 1;
    setTotal(newTotal);

    if (recipe) {
      const resultColor = COLORS.find((c) => c.name === recipe.result);
      setResult({
        name: recipe.result,
        hex: resultColor?.hex ?? "#888",
        emoji: recipe.emoji,
      });
      setFeedback("mixed");
      setCorrect((c) => {
        const nc = c + 1;
        onScore(nc, newTotal);
        return nc;
      });
    } else {
      setResult(null);
      setFeedback("nomatch");
    }
    setTimeout(reset, 2500);
  };

  const reset = () => {
    setSlotA(null);
    setSlotB(null);
    setResult(null);
    setFeedback("idle");
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4 w-full">
      <p className="text-white font-extrabold text-xl">
        Mix two colors to make a new one! 🎨
      </p>

      {/* Mixing slots */}
      <div className="flex items-center gap-4">
        {/* Slot A */}
        <motion.div
          className="w-24 h-24 rounded-3xl border-4 border-white/60 flex items-center justify-center text-5xl shadow-lg"
          style={{ backgroundColor: slotA ? slotA.hex : "rgba(255,255,255,0.15)" }}
          animate={slotA ? { scale: [1, 1.08, 1] } : {}}
        >
          {slotA ? slotA.emoji : "?"}
        </motion.div>

        <span className="text-5xl font-black text-white">+</span>

        {/* Slot B */}
        <motion.div
          className="w-24 h-24 rounded-3xl border-4 border-white/60 flex items-center justify-center text-5xl shadow-lg"
          style={{ backgroundColor: slotB ? slotB.hex : "rgba(255,255,255,0.15)" }}
          animate={slotB ? { scale: [1, 1.08, 1] } : {}}
        >
          {slotB ? slotB.emoji : "?"}
        </motion.div>

        <span className="text-5xl font-black text-white">=</span>

        {/* Result */}
        <motion.div
          className="w-24 h-24 rounded-3xl border-4 border-white/60 flex flex-col items-center justify-center shadow-lg"
          style={{
            backgroundColor: result
              ? result.hex
              : feedback === "nomatch"
              ? "rgba(239,68,68,0.4)"
              : "rgba(255,255,255,0.15)",
          }}
          animate={result ? { scale: [0.5, 1.1, 1] } : {}}
        >
          {result ? (
            <>
              <span className="text-4xl">{result.emoji}</span>
              <span className="text-white font-black text-xs mt-1">{result.name}</span>
            </>
          ) : feedback === "nomatch" ? (
            <span className="text-3xl">❌</span>
          ) : (
            <span className="text-4xl">🎯</span>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {feedback === "mixed" && result && (
          <motion.p
            className="text-2xl font-black text-yellow-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ opacity: 0 }}
          >
            🌟 {slotA?.name} + {slotB?.name} = {result.name}!
          </motion.p>
        )}
        {feedback === "nomatch" && (
          <motion.p
            className="text-xl font-black text-red-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Those don&apos;t mix into a new color — try again!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Color picker */}
      <p className="text-white/70 font-bold text-sm">
        {!slotA ? "Pick your FIRST color 👇" : !slotB ? "Pick your SECOND color 👇" : "Mixing..."}
      </p>
      <div className="flex flex-wrap gap-3 justify-center max-w-xs">
        {primaryColors.map((c) => (
          <motion.button
            key={c.name}
            onClick={() => handleColorClick(c)}
            disabled={feedback === "mixed" || (slotA?.name === c.name && !slotB)}
            className="flex flex-col items-center gap-1"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
          >
            <div
              className={`w-14 h-14 rounded-2xl shadow-md border-4
                ${slotA?.name === c.name || slotB?.name === c.name ? "border-white" : "border-transparent"}`}
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-white text-xs font-bold">{c.name}</span>
          </motion.button>
        ))}
      </div>

      <button
        onClick={reset}
        className="text-white/60 text-sm underline"
      >
        🔄 Reset
      </button>

      <p className="text-white/70 text-sm">Mixed: {correct}/{total}</p>
    </div>
  );
}
