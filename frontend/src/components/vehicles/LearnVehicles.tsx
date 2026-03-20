"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VEHICLES, ZONE_META, type Zone } from "./vehicleData";

export default function LearnVehicles() {
  const [zone, setZone] = useState<Zone>("land");
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = VEHICLES.filter((v) => v.zone === zone);
  const vehicle  = VEHICLES.find((v) => v.id === selected);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Zone tabs */}
      <div className="flex gap-2">
        {(Object.entries(ZONE_META) as [Zone, typeof ZONE_META[Zone]][]).map(([z, meta]) => (
          <button key={z} onClick={() => { setZone(z); setSelected(null); }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm
              ${zone === z ? "bg-white text-gray-800 shadow" : "bg-white/20 text-white"}`}>
            <span>{meta.emoji}</span>{meta.label}
          </button>
        ))}
      </div>

      {/* Vehicle grid */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map((v) => (
          <motion.button key={v.id} onClick={() => setSelected(v.id === selected ? null : v.id)}
            className={`flex flex-col items-center gap-1 px-3 py-3 rounded-2xl font-bold text-xs
              ${selected === v.id ? "bg-white text-gray-800 ring-2 ring-yellow-300 shadow-lg" : "bg-white/20 text-white"}`}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
            <span className="text-4xl">{v.emoji}</span>
            <span>{v.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Info card */}
      <AnimatePresence>
        {vehicle && (
          <motion.div key={vehicle.id}
            className="bg-white/20 rounded-2xl px-5 py-4 text-center max-w-xs"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
            <span className="text-5xl">{vehicle.emoji}</span>
            <p className="text-white font-black text-xl mt-1">{vehicle.name}</p>
            <p className="text-yellow-200 font-bold text-lg">"{vehicle.sound}"</p>
            <p className="text-white/80 text-sm mt-1">{vehicle.fact}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
