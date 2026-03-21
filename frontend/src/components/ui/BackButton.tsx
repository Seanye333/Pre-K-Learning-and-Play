"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BackButton() {
  return (
    <Link href="/" className="fixed bottom-6 left-6 z-50">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        <motion.button
          className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 text-3xl rounded-2xl px-5 py-3 shadow-lg font-extrabold text-white drop-shadow flex items-center gap-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          🏠 <span className="text-xl">Home</span>
        </motion.button>
      </motion.div>
    </Link>
  );
}
