"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DEFAULT_PIN } from "@/lib/constants";

interface PinGateProps {
  onSuccess: () => void;
}

export default function PinGate({ onSuccess }: PinGateProps) {
  const [digits, setDigits] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [shake, setShake] = useState(false);

  const handleDigit = (d: string) => {
    if (locked || digits.length >= 4) return;
    const next = digits + d;
    setDigits(next);

    if (next.length === 4) {
      if (next === DEFAULT_PIN) {
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setShake(true);
        setTimeout(() => setShake(false), 600);
        if (newAttempts >= 3) {
          setLocked(true);
          setTimeout(() => {
            setLocked(false);
            setAttempts(0);
            setDigits("");
          }, 10000);
        } else {
          setTimeout(() => setDigits(""), 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (locked) return;
    setDigits((d) => d.slice(0, -1));
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-gray-700 to-gray-900 flex flex-col items-center justify-center gap-8">
      <h2 className="text-3xl font-black text-white">Parent Dashboard 🔒</h2>
      <p className="text-white/70">Enter PIN to continue</p>

      {/* Dot indicators */}
      <motion.div
        className="flex gap-4"
        animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full border-2 transition-colors
              ${i < digits.length ? "bg-yellow-400 border-yellow-400" : "bg-transparent border-white/60"}`}
          />
        ))}
      </motion.div>

      {locked ? (
        <div className="text-center px-8">
          <p className="text-2xl font-bold text-red-400">🚫 Too many tries</p>
          <p className="text-white/70 mt-2">Ask a grown-up to help!</p>
          <p className="text-white/50 text-sm mt-1">Try again in 10 seconds...</p>
        </div>
      ) : (
        /* Number keypad */
        <div className="grid grid-cols-3 gap-3">
          {["1","2","3","4","5","6","7","8","9"].map((d) => (
            <motion.button
              key={d}
              onClick={() => handleDigit(d)}
              className="w-20 h-20 rounded-2xl bg-white/20 text-white text-3xl font-black shadow-lg hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.88 }}
            >
              {d}
            </motion.button>
          ))}
          {/* Row 4: backspace, 0, enter */}
          <motion.button
            onClick={handleBackspace}
            className="w-20 h-20 rounded-2xl bg-white/10 text-white text-2xl font-black shadow-lg hover:bg-white/20"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
          >
            ⌫
          </motion.button>
          <motion.button
            onClick={() => handleDigit("0")}
            className="w-20 h-20 rounded-2xl bg-white/20 text-white text-3xl font-black shadow-lg hover:bg-white/30"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
          >
            0
          </motion.button>
          <motion.button
            onClick={() => digits.length === 4 && handleDigit("")}
            className="w-20 h-20 rounded-2xl bg-white/10 text-white text-2xl font-black shadow-lg"
            disabled
          >
            ✓
          </motion.button>
        </div>
      )}
    </div>
  );
}
