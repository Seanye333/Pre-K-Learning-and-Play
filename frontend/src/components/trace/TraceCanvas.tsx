"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LETTER_PATHS, TRACE_LETTERS } from "./letterPaths";
import { LETTER_WORDS } from "@/lib/constants";

interface TraceCanvasProps {
  onComplete: (letter: string) => void;
}

const CANVAS_W = 300;
const CANVAS_H = 320;
const VIEWBOX_W = 200;
const VIEWBOX_H = 240;
const SCALE_X = CANVAS_W / VIEWBOX_W;
const SCALE_Y = CANVAS_H / VIEWBOX_H;

function scalePoint(x: number, y: number) {
  return { x: x * SCALE_X, y: y * SCALE_Y };
}

export default function TraceCanvas({ onComplete }: TraceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const strokePixels = useRef(0);
  const [letterIdx, setLetterIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);

  const currentLetter = TRACE_LETTERS[letterIdx % TRACE_LETTERS.length];
  const info = LETTER_PATHS[currentLetter];
  const wordInfo = LETTER_WORDS[currentLetter];

  // Draw guide whenever letter changes
  useEffect(() => {
    drawGuide();
    strokePixels.current = 0;
    setShowSuccess(false);
  }, [letterIdx]);

  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#fff9f0";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    if (!info) return;

    // Draw guide paths (dashed, light)
    ctx.save();
    ctx.setLineDash([10, 6]);
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const pathStr of info.paths) {
      drawSvgPath(ctx, pathStr);
    }
    ctx.restore();

    // Draw start dots
    for (const dot of info.startDots) {
      const { x, y } = scalePoint(dot.x, dot.y);
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#4ade80";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(dot.label), x, y);
    }
  };

  // Very simplified SVG path parser (supports M, L, Q only)
  const drawSvgPath = (ctx: CanvasRenderingContext2D, pathStr: string) => {
    const tokens = pathStr.trim().split(/(?=[MLQmlq])/).filter(Boolean);
    ctx.beginPath();
    for (const token of tokens) {
      const cmd = token[0];
      const nums = token.slice(1).trim().split(/[\s,]+/).map(Number);
      if (cmd === "M") {
        const p = scalePoint(nums[0], nums[1]);
        ctx.moveTo(p.x, p.y);
      } else if (cmd === "L") {
        for (let i = 0; i < nums.length; i += 2) {
          const p = scalePoint(nums[i], nums[i + 1]);
          ctx.lineTo(p.x, p.y);
        }
      } else if (cmd === "Q") {
        for (let i = 0; i < nums.length; i += 4) {
          const cp = scalePoint(nums[i], nums[i + 1]);
          const ep = scalePoint(nums[i + 2], nums[i + 3]);
          ctx.quadraticCurveTo(cp.x, cp.y, ep.x, ep.y);
        }
      }
    }
    ctx.stroke();
  };

  const getPos = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastPos: { x: number; y: number } | null = null;

    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      drawing.current = true;
      lastPos = getPos(e);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!drawing.current || !lastPos) return;
      const pos = getPos(e);
      ctx.lineWidth = 16;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#6366f1";
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      strokePixels.current += Math.hypot(pos.x - lastPos.x, pos.y - lastPos.y);
      lastPos = pos;

      // Consider it "traced" after drawing 200+ pixels worth
      if (strokePixels.current > 200 && !showSuccess) {
        setShowSuccess(true);
        setCompleted((prev) => new Set(prev).add(currentLetter));
        onComplete(currentLetter);
      }
    };

    const onUp = () => { drawing.current = false; lastPos = null; };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onUp);

    return () => {
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onUp);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onUp);
    };
  }, [currentLetter, showSuccess]);

  const goNext = () => {
    setLetterIdx((i) => i + 1);
  };

  const goClear = () => {
    strokePixels.current = 0;
    setShowSuccess(false);
    drawGuide();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Letter + word hint */}
      <div className="flex items-center gap-4">
        <span className="text-7xl font-black text-white drop-shadow">{currentLetter}</span>
        {wordInfo && (
          <div className="flex flex-col items-center">
            <span className="text-5xl">{wordInfo.emoji}</span>
            <span className="text-white font-bold text-sm">{wordInfo.word}</span>
          </div>
        )}
      </div>

      <p className="text-white/80 font-bold text-sm">
        Trace the letter with your finger! Follow the green dot. 👆
      </p>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-2xl shadow-xl border-4 border-white/40"
          style={{ touchAction: "none", cursor: "crosshair", maxWidth: "100%" }}
        />
        {showSuccess && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-green-400/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-6xl">⭐</span>
          </motion.div>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 flex-wrap justify-center max-w-xs">
        {TRACE_LETTERS.map((l) => (
          <div
            key={l}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
              ${completed.has(l) ? "bg-green-400 text-white" : "bg-white/30 text-white/60"}`}
          >
            {l}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <motion.button
          onClick={goClear}
          className="bg-white/30 text-white font-bold px-4 py-2 rounded-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
        >
          🗑️ Clear
        </motion.button>
        <motion.button
          onClick={goNext}
          className={`font-bold px-4 py-2 rounded-xl
            ${showSuccess ? "bg-green-400 text-white" : "bg-white/30 text-white"}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
        >
          {showSuccess ? "Next Letter ➡️" : "Skip ➡️"}
        </motion.button>
      </div>

      <p className="text-white/60 text-sm">
        Traced: {completed.size} / {TRACE_LETTERS.length} letters
      </p>
    </div>
  );
}
