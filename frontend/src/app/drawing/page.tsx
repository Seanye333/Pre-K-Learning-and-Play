"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import DrawingCanvas from "@/components/drawing/DrawingCanvas";
import ColorPalette from "@/components/drawing/ColorPalette";
import BrushSizer from "@/components/drawing/BrushSizer";
import { useSession } from "@/hooks/useSession";
import { DRAW_COLORS } from "@/lib/constants";

export default function DrawingPage() {
  const [color, setColor] = useState(DRAW_COLORS[0]);
  const [brushSize, setBrushSize] = useState(12);
  const [clearTrigger, setClearTrigger] = useState(0);
  const { endSession } = useSession("drawing");

  const handleClear = () => {
    setClearTrigger((n) => n + 1);
  };

  const handleFinish = () => {
    endSession(1.0, { action: "finished" });
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-blue-400 to-cyan-600 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          🎨 Drawing Studio
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden px-4 pb-4 gap-4">
        {/* Left sidebar */}
        <div className="flex flex-col items-center bg-white/20 rounded-2xl p-2 gap-2 min-w-[80px]">
          <ColorPalette selected={color} onChange={setColor} />
          <div className="w-full h-px bg-white/40 my-1" />
          <BrushSizer selected={brushSize} onChange={setBrushSize} />
          <div className="w-full h-px bg-white/40 my-1" />
          <motion.button
            onClick={handleClear}
            className="bg-red-400 text-white font-bold px-3 py-2 rounded-xl text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
          >
            🗑️ Clear
          </motion.button>
          <motion.button
            onClick={handleFinish}
            className="bg-green-400 text-white font-bold px-3 py-2 rounded-xl text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
          >
            ✅ Done
          </motion.button>
        </div>

        {/* Canvas area */}
        <div className="flex-1 flex items-start justify-center pt-2">
          <DrawingCanvas
            color={color}
            brushSize={brushSize}
            onClear={handleClear}
            clearTrigger={clearTrigger}
          />
        </div>
      </div>

      <BackButton />
    </main>
  );
}
