// SVG paths for numbers 1–10, drawn in a 200×240 viewBox
// Each path uses M (move), L (line), Q (quadratic bezier), A (arc)
export interface NumberPath {
  num: number;
  paths: string[];   // multiple strokes for some numbers (e.g. 4 has 2 strokes)
  label: string;
  word: string;      // number word
  emoji: string;     // visual quantity hint
}

export const NUMBER_PATHS: NumberPath[] = [
  {
    num: 1,
    paths: ["M 100 40 L 100 200"],
    label: "1", word: "One", emoji: "1️⃣",
  },
  {
    num: 2,
    paths: ["M 60 70 Q 100 30 140 70 Q 170 100 100 140 L 60 200 L 140 200"],
    label: "2", word: "Two", emoji: "2️⃣",
  },
  {
    num: 3,
    paths: ["M 65 55 Q 140 20 140 90 Q 140 130 100 130 Q 140 130 140 170 Q 140 220 65 200"],
    label: "3", word: "Three", emoji: "3️⃣",
  },
  {
    num: 4,
    paths: [
      "M 120 40 L 60 140 L 150 140",
      "M 120 40 L 120 200",
    ],
    label: "4", word: "Four", emoji: "4️⃣",
  },
  {
    num: 5,
    paths: ["M 140 45 L 65 45 L 65 110 Q 140 90 140 160 Q 140 210 65 205"],
    label: "5", word: "Five", emoji: "5️⃣",
  },
  {
    num: 6,
    paths: ["M 130 50 Q 50 60 55 130 Q 55 210 120 210 Q 185 210 185 155 Q 185 100 120 100 Q 60 100 58 155"],
    label: "6", word: "Six", emoji: "6️⃣",
  },
  {
    num: 7,
    paths: ["M 55 50 L 145 50 L 90 200"],
    label: "7", word: "Seven", emoji: "7️⃣",
  },
  {
    num: 8,
    paths: ["M 100 130 Q 50 90 70 55 Q 100 20 130 55 Q 150 90 100 130 Q 50 165 70 200 Q 100 230 130 200 Q 150 165 100 130"],
    label: "8", word: "Eight", emoji: "8️⃣",
  },
  {
    num: 9,
    paths: ["M 100 100 Q 165 100 165 60 Q 165 20 100 20 Q 35 20 35 60 Q 35 100 100 100 Q 145 100 145 160 Q 145 210 80 205"],
    label: "9", word: "Nine", emoji: "9️⃣",
  },
  {
    num: 10,
    paths: [
      "M 55 40 L 55 200",
      "M 120 120 Q 120 40 160 40 Q 200 40 200 120 Q 200 200 160 200 Q 120 200 120 120",
    ],
    label: "10", word: "Ten", emoji: "🔟",
  },
];

export const TRACE_NUMBERS = NUMBER_PATHS.map((n) => n.num);
