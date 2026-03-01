"use client";

import { motion } from "framer-motion";

export interface ShapeInfo {
  name: string;
  sides: number;
  emoji: string;
  color: string;
  svgPath: string; // inline SVG viewBox="0 0 100 100"
}

export const SHAPES: ShapeInfo[] = [
  {
    name: "Circle",
    sides: 0,
    emoji: "⭕",
    color: "#ef4444",
    svgPath: '<circle cx="50" cy="50" r="45"/>',
  },
  {
    name: "Square",
    sides: 4,
    emoji: "🟥",
    color: "#f97316",
    svgPath: '<rect x="5" y="5" width="90" height="90"/>',
  },
  {
    name: "Triangle",
    sides: 3,
    emoji: "🔺",
    color: "#eab308",
    svgPath: '<polygon points="50,5 95,95 5,95"/>',
  },
  {
    name: "Rectangle",
    sides: 4,
    emoji: "▬",
    color: "#22c55e",
    svgPath: '<rect x="5" y="20" width="90" height="60"/>',
  },
  {
    name: "Star",
    sides: 5,
    emoji: "⭐",
    color: "#a855f7",
    svgPath:
      '<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"/>',
  },
  {
    name: "Heart",
    sides: 0,
    emoji: "❤️",
    color: "#ec4899",
    svgPath:
      '<path d="M50 85 C10 55, 5 20, 25 12 C35 8, 45 15, 50 25 C55 15, 65 8, 75 12 C95 20, 90 55, 50 85Z"/>',
  },
  {
    name: "Diamond",
    sides: 4,
    emoji: "💎",
    color: "#06b6d4",
    svgPath: '<polygon points="50,5 95,50 50,95 5,50"/>',
  },
  {
    name: "Oval",
    sides: 0,
    emoji: "🥚",
    color: "#84cc16",
    svgPath: '<ellipse cx="50" cy="50" rx="45" ry="30"/>',
  },
];

interface ShapeDisplayProps {
  shape: ShapeInfo;
  size?: number;
  animated?: boolean;
  outline?: boolean;
}

export default function ShapeDisplay({
  shape,
  size = 100,
  animated = false,
  outline = false,
}: ShapeDisplayProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      animate={animated ? { scale: [1, 1.08, 1] } : {}}
      transition={animated ? { repeat: Infinity, duration: 2 } : {}}
      dangerouslySetInnerHTML={{
        __html: shape.svgPath.replace(
          /\/>/g,
          ` fill="${outline ? "none" : shape.color}" stroke="${shape.color}" stroke-width="4" stroke-linejoin="round"/>`
        ),
      }}
    />
  );
}
