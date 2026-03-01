"use client";

import { useState } from "react";
import { LETTERS, LETTER_WORDS } from "@/lib/constants";
import LetterCard from "./LetterCard";

interface AlphabetGridProps {
  onLetterClick: (letter: string) => void;
  exploredLetters: Set<string>;
}

export default function AlphabetGrid({
  onLetterClick,
  exploredLetters,
}: AlphabetGridProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (letter: string) => {
    setSelected(letter);
    onLetterClick(letter);
    setTimeout(() => setSelected(null), 1400);
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-2 p-2 overflow-auto">
      <p className="text-white font-extrabold text-xl mb-2">
        Tap a letter to hear its sound! 🔊
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {LETTERS.map((letter, i) => (
          <div key={letter} className="relative">
            {exploredLetters.has(letter) && (
              <span className="absolute -top-1 -right-1 z-10 text-xs">✅</span>
            )}
            <LetterCard
              letter={letter}
              index={i}
              isSelected={selected === letter}
              onClick={() => handleClick(letter)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
