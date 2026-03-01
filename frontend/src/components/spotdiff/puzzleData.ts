export interface SceneElement {
  id: string;
  emoji: string;
  x: number; // 0–100 percentage
  y: number;
  size: "text-2xl" | "text-3xl" | "text-4xl" | "text-5xl";
}

export interface Puzzle {
  id: string;
  title: string;
  bg: string; // Tailwind gradient classes
  left: SceneElement[];   // original scene
  right: SceneElement[];  // modified scene (has differences)
  differences: string[];  // element ids that are CHANGED in right scene
}

export const PUZZLES: Puzzle[] = [
  {
    id: "farm",
    title: "Farm Scene",
    bg: "from-green-300 to-lime-500",
    left: [
      { id: "sun",   emoji: "☀️", x: 75, y: 8,  size: "text-4xl" },
      { id: "cloud1",emoji: "☁️", x: 20, y: 10, size: "text-3xl" },
      { id: "barn",  emoji: "🏠", x: 50, y: 45, size: "text-5xl" },
      { id: "cow",   emoji: "🐄", x: 15, y: 60, size: "text-4xl" },
      { id: "pig",   emoji: "🐷", x: 70, y: 62, size: "text-3xl" },
      { id: "tree",  emoji: "🌳", x: 82, y: 30, size: "text-4xl" },
      { id: "flower",emoji: "🌸", x: 35, y: 72, size: "text-2xl" },
      { id: "bird",  emoji: "🐦", x: 60, y: 15, size: "text-2xl" },
    ],
    right: [
      { id: "sun",   emoji: "🌙", x: 75, y: 8,  size: "text-4xl" }, // ☀️→🌙
      { id: "cloud1",emoji: "☁️", x: 20, y: 10, size: "text-3xl" },
      { id: "barn",  emoji: "🏠", x: 50, y: 45, size: "text-5xl" },
      { id: "cow",   emoji: "🐄", x: 15, y: 60, size: "text-4xl" },
      { id: "pig",   emoji: "🐸", x: 70, y: 62, size: "text-3xl" }, // 🐷→🐸
      { id: "tree",  emoji: "🌵", x: 82, y: 30, size: "text-4xl" }, // 🌳→🌵
      { id: "flower",emoji: "🌸", x: 35, y: 72, size: "text-2xl" },
      { id: "bird",  emoji: "🐦", x: 60, y: 15, size: "text-2xl" },
    ],
    differences: ["sun", "pig", "tree"],
  },
  {
    id: "ocean",
    title: "Ocean Scene",
    bg: "from-blue-300 to-cyan-600",
    left: [
      { id: "sun",    emoji: "☀️", x: 80, y: 8,  size: "text-4xl" },
      { id: "boat",   emoji: "⛵", x: 50, y: 20, size: "text-4xl" },
      { id: "fish1",  emoji: "🐟", x: 20, y: 55, size: "text-3xl" },
      { id: "fish2",  emoji: "🐠", x: 65, y: 60, size: "text-3xl" },
      { id: "octopus",emoji: "🐙", x: 40, y: 70, size: "text-4xl" },
      { id: "star",   emoji: "⭐", x: 75, y: 75, size: "text-3xl" },
      { id: "crab",   emoji: "🦀", x: 15, y: 78, size: "text-3xl" },
      { id: "cloud",  emoji: "☁️", x: 25, y: 12, size: "text-3xl" },
    ],
    right: [
      { id: "sun",    emoji: "☀️", x: 80, y: 8,  size: "text-4xl" },
      { id: "boat",   emoji: "🚢", x: 50, y: 20, size: "text-4xl" }, // ⛵→🚢
      { id: "fish1",  emoji: "🐟", x: 20, y: 55, size: "text-3xl" },
      { id: "fish2",  emoji: "🦈", x: 65, y: 60, size: "text-3xl" }, // 🐠→🦈
      { id: "octopus",emoji: "🐙", x: 40, y: 70, size: "text-4xl" },
      { id: "star",   emoji: "🌟", x: 75, y: 75, size: "text-3xl" }, // ⭐→🌟
      { id: "crab",   emoji: "🦀", x: 15, y: 78, size: "text-3xl" },
      { id: "cloud",  emoji: "☁️", x: 25, y: 12, size: "text-3xl" },
    ],
    differences: ["boat", "fish2", "star"],
  },
  {
    id: "space",
    title: "Space Scene",
    bg: "from-indigo-900 to-purple-900",
    left: [
      { id: "rocket",  emoji: "🚀", x: 50, y: 20, size: "text-5xl" },
      { id: "planet1", emoji: "🪐", x: 15, y: 50, size: "text-4xl" },
      { id: "moon",    emoji: "🌙", x: 75, y: 15, size: "text-4xl" },
      { id: "alien",   emoji: "👽", x: 80, y: 60, size: "text-3xl" },
      { id: "star1",   emoji: "⭐", x: 30, y: 25, size: "text-2xl" },
      { id: "star2",   emoji: "⭐", x: 60, y: 70, size: "text-2xl" },
      { id: "comet",   emoji: "☄️", x: 20, y: 75, size: "text-3xl" },
      { id: "ufo",     emoji: "🛸", x: 40, y: 55, size: "text-3xl" },
    ],
    right: [
      { id: "rocket",  emoji: "🚀", x: 50, y: 20, size: "text-5xl" },
      { id: "planet1", emoji: "🌍", x: 15, y: 50, size: "text-4xl" }, // 🪐→🌍
      { id: "moon",    emoji: "☀️", x: 75, y: 15, size: "text-4xl" }, // 🌙→☀️
      { id: "alien",   emoji: "👽", x: 80, y: 60, size: "text-3xl" },
      { id: "star1",   emoji: "⭐", x: 30, y: 25, size: "text-2xl" },
      { id: "star2",   emoji: "💫", x: 60, y: 70, size: "text-2xl" }, // ⭐→💫
      { id: "comet",   emoji: "☄️", x: 20, y: 75, size: "text-3xl" },
      { id: "ufo",     emoji: "🛸", x: 40, y: 55, size: "text-3xl" },
    ],
    differences: ["planet1", "moon", "star2"],
  },
  {
    id: "jungle",
    title: "Jungle Scene",
    bg: "from-green-600 to-emerald-800",
    left: [
      { id: "monkey",  emoji: "🐒", x: 50, y: 15, size: "text-4xl" },
      { id: "tiger",   emoji: "🐯", x: 20, y: 55, size: "text-4xl" },
      { id: "parrot",  emoji: "🦜", x: 75, y: 30, size: "text-3xl" },
      { id: "snake",   emoji: "🐍", x: 40, y: 70, size: "text-3xl" },
      { id: "tree1",   emoji: "🌴", x: 15, y: 25, size: "text-5xl" },
      { id: "tree2",   emoji: "🌴", x: 80, y: 60, size: "text-4xl" },
      { id: "flower",  emoji: "🌺", x: 60, y: 75, size: "text-3xl" },
      { id: "rain",    emoji: "🌧️", x: 50, y: 5,  size: "text-3xl" },
    ],
    right: [
      { id: "monkey",  emoji: "🦍", x: 50, y: 15, size: "text-4xl" }, // 🐒→🦍
      { id: "tiger",   emoji: "🐯", x: 20, y: 55, size: "text-4xl" },
      { id: "parrot",  emoji: "🦚", x: 75, y: 30, size: "text-3xl" }, // 🦜→🦚
      { id: "snake",   emoji: "🐍", x: 40, y: 70, size: "text-3xl" },
      { id: "tree1",   emoji: "🌴", x: 15, y: 25, size: "text-5xl" },
      { id: "tree2",   emoji: "🌳", x: 80, y: 60, size: "text-4xl" }, // 🌴→🌳
      { id: "flower",  emoji: "🌺", x: 60, y: 75, size: "text-3xl" },
      { id: "rain",    emoji: "☀️", x: 50, y: 5,  size: "text-3xl" }, // 🌧️→☀️
    ],
    differences: ["monkey", "parrot", "tree2", "rain"],
  },
  {
    id: "playground",
    title: "Playground",
    bg: "from-sky-400 to-blue-600",
    left: [
      { id: "slide",  emoji: "🛝", x: 20, y: 40, size: "text-5xl" },
      { id: "swing",  emoji: "🎡", x: 65, y: 35, size: "text-4xl" },
      { id: "ball",   emoji: "⚽", x: 40, y: 70, size: "text-3xl" },
      { id: "sun",    emoji: "☀️", x: 80, y: 10, size: "text-4xl" },
      { id: "cloud",  emoji: "☁️", x: 30, y: 12, size: "text-3xl" },
      { id: "dog",    emoji: "🐕", x: 70, y: 68, size: "text-3xl" },
      { id: "tree",   emoji: "🌳", x: 85, y: 50, size: "text-4xl" },
      { id: "kite",   emoji: "🪁", x: 50, y: 18, size: "text-3xl" },
    ],
    right: [
      { id: "slide",  emoji: "🛝", x: 20, y: 40, size: "text-5xl" },
      { id: "swing",  emoji: "🎠", x: 65, y: 35, size: "text-4xl" }, // 🎡→🎠
      { id: "ball",   emoji: "🏀", x: 40, y: 70, size: "text-3xl" }, // ⚽→🏀
      { id: "sun",    emoji: "☀️", x: 80, y: 10, size: "text-4xl" },
      { id: "cloud",  emoji: "🌩️", x: 30, y: 12, size: "text-3xl" }, // ☁️→🌩️
      { id: "dog",    emoji: "🐕", x: 70, y: 68, size: "text-3xl" },
      { id: "tree",   emoji: "🌳", x: 85, y: 50, size: "text-4xl" },
      { id: "kite",   emoji: "🪁", x: 50, y: 18, size: "text-3xl" },
    ],
    differences: ["swing", "ball", "cloud"],
  },
];
