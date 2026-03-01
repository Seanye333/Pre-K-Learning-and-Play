export interface OppositePair {
  id: string;
  wordA: string;
  emojiA: string;
  wordB: string;
  emojiB: string;
  colorA: string; // tailwind bg
  colorB: string;
}

export const PAIRS: OppositePair[] = [
  { id: "big-small",     wordA: "Big",    emojiA: "🐘", wordB: "Small",  emojiB: "🐭", colorA: "bg-blue-400",   colorB: "bg-blue-200" },
  { id: "hot-cold",      wordA: "Hot",    emojiA: "🔥", wordB: "Cold",   emojiB: "🧊", colorA: "bg-red-400",    colorB: "bg-cyan-300" },
  { id: "happy-sad",     wordA: "Happy",  emojiA: "😊", wordB: "Sad",    emojiB: "😢", colorA: "bg-yellow-300", colorB: "bg-indigo-300" },
  { id: "fast-slow",     wordA: "Fast",   emojiA: "🚀", wordB: "Slow",   emojiB: "🐌", colorA: "bg-orange-400", colorB: "bg-green-300" },
  { id: "up-down",       wordA: "Up",     emojiA: "⬆️", wordB: "Down",   emojiB: "⬇️", colorA: "bg-sky-400",    colorB: "bg-purple-300" },
  { id: "day-night",     wordA: "Day",    emojiA: "☀️", wordB: "Night",  emojiB: "🌙", colorA: "bg-yellow-200", colorB: "bg-indigo-600" },
  { id: "open-closed",   wordA: "Open",   emojiA: "🚪", wordB: "Closed", emojiB: "🔒", colorA: "bg-lime-300",   colorB: "bg-stone-400" },
  { id: "wet-dry",       wordA: "Wet",    emojiA: "💧", wordB: "Dry",    emojiB: "🏜️", colorA: "bg-blue-300",   colorB: "bg-amber-300" },
  { id: "loud-quiet",    wordA: "Loud",   emojiA: "📣", wordB: "Quiet",  emojiB: "🤫", colorA: "bg-red-300",    colorB: "bg-teal-300" },
  { id: "full-empty",    wordA: "Full",   emojiA: "🪣", wordB: "Empty",  emojiB: "🫙", colorA: "bg-green-400",  colorB: "bg-gray-300" },
  { id: "tall-short",    wordA: "Tall",   emojiA: "🦒", wordB: "Short",  emojiB: "🐧", colorA: "bg-orange-300", colorB: "bg-pink-300" },
  { id: "clean-dirty",   wordA: "Clean",  emojiA: "✨", wordB: "Dirty",  emojiB: "🪱", colorA: "bg-white",      colorB: "bg-stone-500" },
];
