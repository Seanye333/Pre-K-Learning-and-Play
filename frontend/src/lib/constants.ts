import type { WordItem } from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const DEFAULT_PIN = "1234";

export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Letter → emoji/word associations for phonics
export const LETTER_WORDS: Record<string, { word: string; emoji: string }> = {
  A: { word: "Apple", emoji: "🍎" },
  B: { word: "Ball", emoji: "⚽" },
  C: { word: "Cat", emoji: "🐱" },
  D: { word: "Dog", emoji: "🐶" },
  E: { word: "Elephant", emoji: "🐘" },
  F: { word: "Fish", emoji: "🐟" },
  G: { word: "Grapes", emoji: "🍇" },
  H: { word: "Hat", emoji: "🎩" },
  I: { word: "Ice cream", emoji: "🍦" },
  J: { word: "Jellyfish", emoji: "🪼" },
  K: { word: "Kite", emoji: "🪁" },
  L: { word: "Lion", emoji: "🦁" },
  M: { word: "Moon", emoji: "🌙" },
  N: { word: "Nest", emoji: "🪺" },
  O: { word: "Orange", emoji: "🍊" },
  P: { word: "Pig", emoji: "🐷" },
  Q: { word: "Queen", emoji: "👑" },
  R: { word: "Rainbow", emoji: "🌈" },
  S: { word: "Sun", emoji: "☀️" },
  T: { word: "Tree", emoji: "🌳" },
  U: { word: "Umbrella", emoji: "☂️" },
  V: { word: "Violin", emoji: "🎻" },
  W: { word: "Whale", emoji: "🐋" },
  X: { word: "Xylophone", emoji: "🎹" },
  Y: { word: "Yarn", emoji: "🧶" },
  Z: { word: "Zebra", emoji: "🦓" },
};

export const THREE_LETTER_WORDS: WordItem[] = [
  { word: "cat", image: "/images/animals/cat.png" },
  { word: "dog", image: "/images/animals/dog.png" },
  { word: "pig", image: "/images/animals/pig.png" },
  { word: "hen", image: "/images/animals/hen.png" },
  { word: "fox", image: "/images/animals/fox.png" },
  { word: "cow", image: "/images/animals/cow.png" },
  { word: "ant", image: "/images/animals/ant.png" },
  { word: "bee", image: "/images/animals/bee.png" },
];

// Animals used in memory match (10 animals → 5 or 6 pairs)
export const ANIMALS = [
  { name: "dog", emoji: "🐶" },
  { name: "cat", emoji: "🐱" },
  { name: "bird", emoji: "🐦" },
  { name: "fish", emoji: "🐟" },
  { name: "frog", emoji: "🐸" },
  { name: "bear", emoji: "🐻" },
  { name: "lion", emoji: "🦁" },
  { name: "duck", emoji: "🦆" },
  { name: "cow", emoji: "🐮" },
  { name: "pig", emoji: "🐷" },
];

export const MEMORY_PAIRS_EASY = 6;  // 3x4 grid
export const MEMORY_PAIRS_HARD = 8;  // 4x4 grid

// Letter tile color palette (cycles across rows)
export const LETTER_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-green-400",
  "bg-teal-400",
  "bg-blue-400",
];

export const GAME_CARDS = [
  {
    id: "abc",
    label: "ABC Adventure",
    emoji: "🔤",
    color: "from-yellow-400 to-orange-500",
    href: "/abc",
    description: "Letters, sounds & words",
  },
  {
    id: "math",
    label: "Math Playground",
    emoji: "🔢",
    color: "from-green-400 to-teal-500",
    href: "/math",
    description: "Counting & adding",
  },
  {
    id: "memory",
    label: "Memory Match",
    emoji: "🃏",
    color: "from-purple-400 to-pink-500",
    href: "/memory",
    description: "Find the pairs",
  },
  {
    id: "drawing",
    label: "Drawing Studio",
    emoji: "🎨",
    color: "from-blue-400 to-cyan-500",
    href: "/drawing",
    description: "Draw & create",
  },
  {
    id: "shapes",
    label: "Shape Explorer",
    emoji: "🔷",
    color: "from-pink-400 to-rose-600",
    href: "/shapes",
    description: "Circles, stars & more",
  },
  {
    id: "rhymes",
    label: "Rhyme Time",
    emoji: "🎵",
    color: "from-violet-400 to-indigo-600",
    href: "/rhymes",
    description: "Words that sound alike",
  },
  {
    id: "emotions",
    label: "Emotion Match",
    emoji: "😊",
    color: "from-amber-400 to-orange-600",
    href: "/emotions",
    description: "Learn about feelings",
  },
  {
    id: "wordbuilder",
    label: "Word Builder",
    emoji: "🏗️",
    color: "from-emerald-400 to-green-700",
    href: "/wordbuilder",
    description: "Build words letter by letter",
  },
  {
    id: "colors",
    label: "Color Mixer",
    emoji: "🎨",
    color: "from-rose-500 to-pink-700",
    href: "/colors",
    description: "Mix colors & explore",
  },
  {
    id: "animals",
    label: "Animal World",
    emoji: "🐾",
    color: "from-lime-400 to-green-700",
    href: "/animals",
    description: "Sounds, homes & babies",
  },
  {
    id: "story",
    label: "Story Sequence",
    emoji: "📖",
    color: "from-sky-400 to-indigo-700",
    href: "/story",
    description: "Put the story in order",
  },
  {
    id: "trace",
    label: "Letter Trace",
    emoji: "✏️",
    color: "from-fuchsia-400 to-purple-700",
    href: "/trace",
    description: "Trace letters to learn writing",
  },
  {
    id: "fruits",
    label: "Fruits & Veggies",
    emoji: "🍎",
    color: "from-lime-400 to-green-700",
    href: "/fruits",
    description: "Sort fruits and vegetables",
  },
  {
    id: "opposites",
    label: "Opposites",
    emoji: "↔️",
    color: "from-violet-500 to-purple-800",
    href: "/opposites",
    description: "Big vs small, hot vs cold",
  },
  {
    id: "spotdiff",
    label: "Spot the Difference",
    emoji: "🔍",
    color: "from-orange-400 to-rose-700",
    href: "/spotdiff",
    description: "Find what changed!",
  },
  {
    id: "numbertrace",
    label: "Number Trace",
    emoji: "🔢",
    color: "from-purple-500 to-indigo-800",
    href: "/numbertrace",
    description: "Trace numbers 1 to 10",
  },
  {
    id: "sightwords",
    label: "Sight Words",
    emoji: "📖",
    color: "from-blue-500 to-indigo-800",
    href: "/sightwords",
    description: "Read common words",
  },
  {
    id: "bodyparts",
    label: "Body Parts",
    emoji: "🫀",
    color: "from-pink-400 to-rose-700",
    href: "/bodyparts",
    description: "Head, hands, knees & toes",
  },
  {
    id: "daysmonths",
    label: "Days & Months",
    emoji: "📅",
    color: "from-sky-400 to-blue-700",
    href: "/daysmonths",
    description: "Days of the week & months",
  },
  {
    id: "subtraction",
    label: "Subtraction",
    emoji: "➖",
    color: "from-red-400 to-rose-700",
    href: "/subtraction",
    description: "Take away and find what's left",
  },
  {
    id: "vehicles",
    label: "Vehicles",
    emoji: "🚗",
    color: "from-cyan-400 to-blue-700",
    href: "/vehicles",
    description: "Land, sea and air transport",
  },
  {
    id: "clock",
    label: "Telling Time",
    emoji: "🕐",
    color: "from-slate-500 to-indigo-800",
    href: "/clock",
    description: "O'clock and half past",
  },
  {
    id: "shadow",
    label: "Shadow Match",
    emoji: "🌑",
    color: "from-gray-700 to-gray-900",
    href: "/shadow",
    description: "Match the silhouette!",
  },
  {
    id: "phonics",
    label: "Phonics",
    emoji: "🔤",
    color: "from-yellow-500 to-orange-700",
    href: "/phonics",
    description: "Find the starting sound!",
  },
  {
    id: "sizeorder",
    label: "Size Ordering",
    emoji: "📏",
    color: "from-teal-400 to-cyan-700",
    href: "/sizeorder",
    description: "Small, medium, big!",
  },
  {
    id: "helpers",
    label: "Community Helpers",
    emoji: "👮",
    color: "from-blue-400 to-indigo-700",
    href: "/helpers",
    description: "Doctors, firefighters & more",
  },
  {
    id: "foodgroups",
    label: "Food Groups",
    emoji: "🥗",
    color: "from-green-400 to-emerald-700",
    href: "/foodgroups",
    description: "Eat a rainbow of foods!",
  },
  {
    id: "sinkorflout",
    label: "Sink or Float",
    emoji: "🌊",
    color: "from-sky-400 to-blue-700",
    href: "/sinkorflout",
    description: "What sinks? What floats?",
  },
  {
    id: "skipcounting",
    label: "Skip Counting",
    emoji: "🔢",
    color: "from-violet-400 to-purple-700",
    href: "/skipcounting",
    description: "Count by 2s, 5s and 10s!",
  },
  {
    id: "wordfamilies",
    label: "Word Families",
    emoji: "👨‍👩‍👧",
    color: "from-purple-500 to-indigo-700",
    href: "/wordfamilies",
    description: "Words that rhyme together",
  },
  {
    id: "music",
    label: "Musical Instruments",
    emoji: "🎵",
    color: "from-purple-600 to-pink-700",
    href: "/music",
    description: "Learn instrument families!",
  },
  {
    id: "nature",
    label: "Nature Explorer",
    emoji: "🌿",
    color: "from-green-500 to-teal-700",
    href: "/nature",
    description: "Living vs non-living things",
  },
  {
    id: "directions",
    label: "Directions",
    emoji: "🧭",
    color: "from-indigo-500 to-blue-800",
    href: "/directions",
    description: "Left, right, up & down!",
  },
  {
    id: "weather",
    label: "Weather Explorer",
    emoji: "🌤️",
    color: "from-sky-400 to-blue-700",
    href: "/weather",
    description: "Sunny, rainy, snowy & more!",
  },
  {
    id: "patterns",
    label: "Patterns",
    emoji: "🔄",
    color: "from-pink-500 to-purple-700",
    href: "/patterns",
    description: "What comes next?",
  },
  {
    id: "money",
    label: "Money & Coins",
    emoji: "🪙",
    color: "from-yellow-500 to-green-700",
    href: "/money",
    description: "Pennies, nickels, dimes & quarters!",
  },
  {
    id: "habitats",
    label: "Animal Habitats",
    emoji: "🌍",
    color: "from-green-600 to-blue-800",
    href: "/habitats",
    description: "Where do animals live?",
  },
  {
    id: "fractions",
    label: "Fractions",
    emoji: "🍕",
    color: "from-orange-400 to-red-700",
    href: "/fractions",
    description: "Whole, half and quarter!",
  },
  {
    id: "abcorder",
    label: "ABC Order",
    emoji: "🔤",
    color: "from-orange-400 to-amber-700",
    href: "/abcorder",
    description: "Put letters in order!",
  },
  {
    id: "safety",
    label: "Safety Rules",
    emoji: "🦺",
    color: "from-red-500 to-rose-800",
    href: "/safety",
    description: "Stay safe everywhere!",
  },
  {
    id: "measurement",
    label: "Measurement",
    emoji: "📏",
    color: "from-teal-500 to-cyan-800",
    href: "/measurement",
    description: "Tall, short, heavy, light!",
  },
  {
    id: "space",
    label: "Space Explorer",
    emoji: "🚀",
    color: "from-indigo-800 to-black",
    href: "/space",
    description: "Planets and the solar system!",
  },
  {
    id: "sentences",
    label: "Sentences",
    emoji: "💬",
    color: "from-purple-500 to-violet-800",
    href: "/sentences",
    description: "Build and arrange sentences!",
  },
] as const;

export const DRAW_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#a855f7", // purple
  "#ec4899", // pink
  "#ffffff", // white
  "#000000", // black
  "#92400e", // brown
  "#6b7280", // gray
];

export const BRUSH_SIZES = [
  { label: "Small", size: 4 },
  { label: "Medium", size: 12 },
  { label: "Large", size: 28 },
];
