"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  label?: string;
}

export default function ProgressBar({
  value,
  color = "bg-yellow-400",
  label,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <p className="text-sm font-bold text-white/80 mb-1">{label}</p>
      )}
      <div className="w-full bg-white/30 rounded-full h-5 overflow-hidden">
        <motion.div
          className={`${color} h-5 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
