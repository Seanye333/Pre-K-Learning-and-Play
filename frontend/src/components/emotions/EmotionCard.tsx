"use client";

import { motion } from "framer-motion";

export interface Emotion {
  name: string;
  emoji: string;
  color: string;
  story: string; // short sentence prompting the feeling
}

export const EMOTIONS: Emotion[] = [
  {
    name: "Happy",
    emoji: "😊",
    color: "#fbbf24",
    story: "You got a big hug from Grandma!",
  },
  {
    name: "Sad",
    emoji: "😢",
    color: "#60a5fa",
    story: "Your ice cream fell on the floor.",
  },
  {
    name: "Angry",
    emoji: "😠",
    color: "#f87171",
    story: "Someone took your toy without asking.",
  },
  {
    name: "Surprised",
    emoji: "😲",
    color: "#a78bfa",
    story: "A dog jumped up and licked your face!",
  },
  {
    name: "Scared",
    emoji: "😨",
    color: "#6b7280",
    story: "You heard a very loud thunder.",
  },
  {
    name: "Excited",
    emoji: "🤩",
    color: "#f97316",
    story: "Tomorrow is your birthday party!",
  },
  {
    name: "Tired",
    emoji: "😴",
    color: "#94a3b8",
    story: "You played all day and need a nap.",
  },
  {
    name: "Silly",
    emoji: "🤪",
    color: "#34d399",
    story: "You made a funny face in the mirror!",
  },
];

interface EmotionCardProps {
  emotion: Emotion;
  size?: "small" | "large";
  showName?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export default function EmotionCard({
  emotion,
  size = "small",
  showName = true,
  selected = false,
  onClick,
}: EmotionCardProps) {
  const emojiSize = size === "large" ? "text-8xl" : "text-5xl";
  const padding = size === "large" ? "p-6" : "p-3";

  return (
    <motion.button
      onClick={onClick}
      className={`rounded-2xl ${padding} flex flex-col items-center gap-1 transition-all
        ${selected ? "ring-4 ring-white scale-110" : ""}`}
      style={{ backgroundColor: `${emotion.color}33` }}
      whileHover={onClick ? { scale: selected ? 1.1 : 1.08 } : {}}
      whileTap={onClick ? { scale: 0.9 } : {}}
      disabled={!onClick}
    >
      <span className={emojiSize}>{emotion.emoji}</span>
      {showName && (
        <span className="text-white font-extrabold text-sm">{emotion.name}</span>
      )}
    </motion.button>
  );
}
