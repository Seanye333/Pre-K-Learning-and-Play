export interface BodyPart {
  id: string;
  name: string;
  emoji: string;
  // position as % on the character SVG (200×400 viewBox)
  x: number;
  y: number;
  fun: string; // fun fact / what it does
}

export const BODY_PARTS: BodyPart[] = [
  { id: "head",     name: "Head",     emoji: "🧠", x: 50, y: 10,  fun: "Your brain lives inside your head!" },
  { id: "eyes",     name: "Eyes",     emoji: "👁️",  x: 50, y: 16,  fun: "Eyes help you see colors and shapes!" },
  { id: "ears",     name: "Ears",     emoji: "👂", x: 50, y: 20,  fun: "Ears help you hear sounds and music!" },
  { id: "nose",     name: "Nose",     emoji: "👃", x: 50, y: 22,  fun: "Your nose helps you smell yummy food!" },
  { id: "mouth",    name: "Mouth",    emoji: "👄", x: 50, y: 27,  fun: "Your mouth helps you talk and eat!" },
  { id: "shoulder", name: "Shoulder", emoji: "💪", x: 50, y: 38,  fun: "Shoulders let you lift your arms up!" },
  { id: "hand",     name: "Hands",    emoji: "🖐️",  x: 50, y: 58,  fun: "Hands help you draw, eat, and hug!" },
  { id: "tummy",    name: "Tummy",    emoji: "🫃", x: 50, y: 50,  fun: "Food goes to your tummy after you eat!" },
  { id: "knee",     name: "Knee",     emoji: "🦵", x: 50, y: 72,  fun: "Knees bend so you can run and jump!" },
  { id: "foot",     name: "Foot",     emoji: "🦶", x: 50, y: 88,  fun: "Feet carry you everywhere you go!" },
];

// Hotspot hit regions (cx, cy as % of display size, radius in %)
export const HOTSPOTS: Record<string, { cx: number; cy: number; r: number }> = {
  head:     { cx: 50, cy: 10, r: 8 },
  eyes:     { cx: 50, cy: 16, r: 5 },
  ears:     { cx: 50, cy: 20, r: 5 },
  nose:     { cx: 50, cy: 22, r: 4 },
  mouth:    { cx: 50, cy: 27, r: 5 },
  shoulder: { cx: 50, cy: 37, r: 7 },
  hand:     { cx: 50, cy: 58, r: 6 },
  tummy:    { cx: 50, cy: 50, r: 7 },
  knee:     { cx: 50, cy: 72, r: 6 },
  foot:     { cx: 50, cy: 88, r: 6 },
};
