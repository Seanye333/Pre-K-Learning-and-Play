"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NUMBER_PATHS } from "./numberPaths";

const CANVAS_W = 300;
const CANVAS_H = 320;
const SCALE_X = CANVAS_W / 200;
const SCALE_Y = CANVAS_H / 240;
const COMPLETE_THRESHOLD = 180;

interface Props {
  onScore: (correct: number, total: number) => void;
}

// ── Minimal SVG path parser (M, L, Q only) ──────────────────────────────────
function drawPath(ctx: CanvasRenderingContext2D, d: string) {
  const tokens = d.trim().split(/[\s,]+/);
  let i = 0;
  let cmd = "";
  ctx.beginPath();
  while (i < tokens.length) {
    if (isNaN(Number(tokens[i]))) { cmd = tokens[i++]; }
    if (cmd === "M") {
      const x = Number(tokens[i++]) * SCALE_X;
      const y = Number(tokens[i++]) * SCALE_Y;
      ctx.moveTo(x, y);
    } else if (cmd === "L") {
      const x = Number(tokens[i++]) * SCALE_X;
      const y = Number(tokens[i++]) * SCALE_Y;
      ctx.lineTo(x, y);
    } else if (cmd === "Q") {
      const cx = Number(tokens[i++]) * SCALE_X;
      const cy = Number(tokens[i++]) * SCALE_Y;
      const ex = Number(tokens[i++]) * SCALE_X;
      const ey = Number(tokens[i++]) * SCALE_Y;
      ctx.quadraticCurveTo(cx, cy, ex, ey);
    } else { i++; }
  }
}

function getStartPoint(d: string): { x: number; y: number } {
  const m = d.match(/M\s*([\d.]+)[\s,]+([\d.]+)/);
  if (!m) return { x: 0, y: 0 };
  return { x: Number(m[1]) * SCALE_X, y: Number(m[2]) * SCALE_Y };
}

export default function NumberTraceCanvas({ onScore }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const strokePixels = useRef(0);
  const [numIdx, setNumIdx] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(new Array(NUMBER_PATHS.length).fill(false));
  const [showCheck, setShowCheck] = useState(false);
  const [correct, setCorrect] = useState(0);

  const numData = NUMBER_PATHS[numIdx];

  // Draw guide on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Guide path(s) — dashed
    ctx.setLineDash([12, 8]);
    ctx.strokeStyle = "#c4b5fd";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    numData.paths.forEach((d) => {
      drawPath(ctx, d);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Start dot for first stroke
    const start = getStartPoint(numData.paths[0]);
    ctx.beginPath();
    ctx.arc(start.x, start.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#4ade80";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("1", start.x, start.y);

    strokePixels.current = 0;
  }, [numIdx, numData]);

  // Touch / mouse drawing
  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    drawingRef.current = true;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!drawingRef.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    strokePixels.current += 2;

    if (strokePixels.current >= COMPLETE_THRESHOLD && !completed[numIdx]) {
      markComplete();
    }
  }

  function endDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    drawingRef.current = false;
  }

  function markComplete() {
    const newCompleted = [...completed];
    newCompleted[numIdx] = true;
    setCompleted(newCompleted);
    const newCorrect = correct + 1;
    setCorrect(newCorrect);
    onScore(newCorrect, NUMBER_PATHS.length);
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 1000);
  }

  function goTo(i: number) {
    setNumIdx(i);
    setShowCheck(false);
  }

  return (
    <div className="flex flex-col items-center gap-3 p-3 w-full">
      {/* Number info */}
      <div className="flex items-center gap-3">
        <span className="text-6xl font-black text-white">{numData.num}</span>
        <div>
          <p className="text-white font-black text-xl">{numData.word}</p>
          <p className="text-white/70 text-sm">Trace the number!</p>
        </div>
        <span className="text-5xl">{numData.emoji}</span>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-2xl bg-white/20 touch-none"
          style={{ width: 240, height: 256 }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <AnimatePresence>
          {showCheck && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-2xl bg-green-400/30"
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            >
              <span className="text-7xl">✅</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Number picker */}
      <div className="flex gap-1 flex-wrap justify-center max-w-xs">
        {NUMBER_PATHS.map((n, i) => (
          <motion.button
            key={n.num}
            onClick={() => goTo(i)}
            className={`w-9 h-9 rounded-full font-black text-sm
              ${i === numIdx ? "bg-white text-purple-700 scale-125 shadow" : ""}
              ${completed[i] && i !== numIdx ? "bg-green-400 text-white" : ""}
              ${!completed[i] && i !== numIdx ? "bg-white/30 text-white" : ""}`}
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.88 }}
          >
            {n.num}
          </motion.button>
        ))}
      </div>

      <p className="text-white/60 text-xs">
        {completed.filter(Boolean).length} / {NUMBER_PATHS.length} traced
      </p>
    </div>
  );
}
