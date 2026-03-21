"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StarBurstProps {
  show: boolean;
  onDone?: () => void;
}

const MESSAGES = [
  "Amazing! ⭐",
  "You're a Star! 🌟",
  "Brilliant! 🎉",
  "Great Job! 🌈",
  "Wow! 🦄",
  "Super! 🎊",
  "Fantastic! 💫",
  "Keep going! 🔥",
];

export default function StarBurst({ show, onDone }: StarBurstProps) {
  const [msg, setMsg] = useState(MESSAGES[0]);

  useEffect(() => {
    if (!show) return;

    setMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

    import("canvas-confetti").then((mod) => {
      mod.default({
        particleCount: 140,
        spread: 360,
        origin: { x: 0.5, y: 0.4 },
        colors: ["#fbbf24", "#f97316", "#ec4899", "#8b5cf6", "#22c55e", "#3b82f6", "#ffffff"],
      });
    });

    const timer = setTimeout(() => onDone?.(), 2200);
    return () => clearTimeout(timer);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Radial glow */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1.5, opacity: [0, 0.2, 0] }}
            transition={{ duration: 1.5 }}
          >
            <div className="w-64 h-64 rounded-full bg-white" />
          </motion.div>

          <div className="text-center relative z-10">
            {/* Triple star cluster */}
            <div className="flex items-end justify-center gap-2 mb-2">
              {["🌟", "⭐", "🌟"].map((e, i) => (
                <motion.span
                  key={i}
                  className="text-5xl"
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: i * 0.12, type: "spring", stiffness: 400 }}
                >
                  {e}
                </motion.span>
              ))}
            </div>

            <motion.p
              className="text-5xl font-extrabold text-yellow-200 drop-shadow-lg"
              initial={{ y: 20, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            >
              {msg}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
