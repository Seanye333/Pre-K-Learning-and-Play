"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BackButton() {
  return (
    <Link href="/" className="fixed bottom-6 left-6 z-50">
      <motion.button
        className="bg-white/90 backdrop-blur text-3xl rounded-2xl px-5 py-3 shadow-lg font-extrabold text-gray-700 flex items-center gap-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        🏠 <span className="text-xl">Home</span>
      </motion.button>
    </Link>
  );
}
