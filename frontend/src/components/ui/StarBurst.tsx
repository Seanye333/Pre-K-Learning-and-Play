"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StarBurstProps {
  show: boolean;
  onDone?: () => void;
}

export default function StarBurst({ show, onDone }: StarBurstProps) {
  useEffect(() => {
    if (!show) return;

    let confetti: (opts: object) => void;
    import("canvas-confetti").then((mod) => {
      confetti = mod.default;
      confetti({
        particleCount: 120,
        spread: 360,
        origin: { x: 0.5, y: 0.4 },
        colors: ["#fbbf24", "#f97316", "#ec4899", "#8b5cf6", "#22c55e", "#3b82f6"],
      });
    });

    const timer = setTimeout(() => {
      onDone?.();
    }, 2200);

    return () => clearTimeout(timer);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.3 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center">
            <motion.div
              className="text-8xl"
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6 }}
            >
              ⭐
            </motion.div>
            <motion.p
              className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg mt-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Amazing!
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
