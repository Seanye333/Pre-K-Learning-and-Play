// SVG-style path descriptions for guiding letter tracing
// Each entry: the display letter, an SVG path for the guide overlay (viewBox 0 0 200 240)
// and numbered start dots for stroke order

export interface LetterPath {
  letter: string;
  paths: string[];          // SVG path d= strings (guide lines)
  startDots: { x: number; y: number; label: number }[];
  arrowHints: { x: number; y: number; rotate: number }[];
}

// Simplified uppercase letters as guide paths (viewBox 0 0 200 240)
export const LETTER_PATHS: Record<string, LetterPath> = {
  A: {
    letter: "A",
    paths: ["M100,20 L30,220", "M100,20 L170,220", "M55,140 L145,140"],
    startDots: [{ x: 100, y: 20, label: 1 }],
    arrowHints: [{ x: 100, y: 20, rotate: 225 }],
  },
  B: {
    letter: "B",
    paths: ["M40,20 L40,220", "M40,20 Q140,20 140,70 Q140,120 40,120", "M40,120 Q150,120 150,170 Q150,220 40,220"],
    startDots: [{ x: 40, y: 20, label: 1 }],
    arrowHints: [{ x: 40, y: 20, rotate: 180 }],
  },
  C: {
    letter: "C",
    paths: ["M160,60 Q100,10 40,80 Q10,130 40,190 Q80,240 160,200"],
    startDots: [{ x: 160, y: 60, label: 1 }],
    arrowHints: [{ x: 160, y: 60, rotate: 135 }],
  },
  D: {
    letter: "D",
    paths: ["M40,20 L40,220", "M40,20 Q180,20 180,120 Q180,220 40,220"],
    startDots: [{ x: 40, y: 20, label: 1 }],
    arrowHints: [{ x: 40, y: 20, rotate: 180 }],
  },
  E: {
    letter: "E",
    paths: ["M150,20 L40,20 L40,220 L150,220", "M40,120 L130,120"],
    startDots: [{ x: 150, y: 20, label: 1 }, { x: 40, y: 120, label: 2 }],
    arrowHints: [{ x: 150, y: 20, rotate: 0 }],
  },
  O: {
    letter: "O",
    paths: ["M100,20 Q170,20 170,120 Q170,220 100,220 Q30,220 30,120 Q30,20 100,20"],
    startDots: [{ x: 100, y: 20, label: 1 }],
    arrowHints: [{ x: 100, y: 20, rotate: 90 }],
  },
  S: {
    letter: "S",
    paths: ["M160,50 Q100,10 50,60 Q20,100 100,120 Q170,140 150,190 Q120,230 50,210"],
    startDots: [{ x: 160, y: 50, label: 1 }],
    arrowHints: [{ x: 160, y: 50, rotate: 135 }],
  },
  T: {
    letter: "T",
    paths: ["M20,20 L180,20", "M100,20 L100,220"],
    startDots: [{ x: 20, y: 20, label: 1 }, { x: 100, y: 20, label: 2 }],
    arrowHints: [{ x: 20, y: 20, rotate: 270 }],
  },
  I: {
    letter: "I",
    paths: ["M100,20 L100,220", "M60,20 L140,20", "M60,220 L140,220"],
    startDots: [{ x: 100, y: 20, label: 1 }],
    arrowHints: [{ x: 100, y: 20, rotate: 180 }],
  },
  L: {
    letter: "L",
    paths: ["M60,20 L60,220 L170,220"],
    startDots: [{ x: 60, y: 20, label: 1 }],
    arrowHints: [{ x: 60, y: 20, rotate: 180 }],
  },
  U: {
    letter: "U",
    paths: ["M40,20 L40,170 Q40,220 100,220 Q160,220 160,170 L160,20"],
    startDots: [{ x: 40, y: 20, label: 1 }],
    arrowHints: [{ x: 40, y: 20, rotate: 180 }],
  },
  X: {
    letter: "X",
    paths: ["M30,20 L170,220", "M170,20 L30,220"],
    startDots: [{ x: 30, y: 20, label: 1 }, { x: 170, y: 20, label: 2 }],
    arrowHints: [{ x: 30, y: 20, rotate: 225 }],
  },
};

// Letters to practice in order of difficulty
export const TRACE_LETTERS = ["I", "L", "T", "O", "U", "C", "E", "D", "A", "B", "S", "X"];
