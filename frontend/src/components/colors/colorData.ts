export interface ColorInfo {
  name: string;
  hex: string;
  emoji: string;
  objects: string[]; // objects that are this color
  isPrimary?: boolean;
}

export const COLORS: ColorInfo[] = [
  { name: "Red",    hex: "#ef4444", emoji: "🔴", isPrimary: true,  objects: ["Apple 🍎", "Fire truck 🚒", "Strawberry 🍓"] },
  { name: "Yellow", hex: "#eab308", emoji: "🟡", isPrimary: true,  objects: ["Banana 🍌", "Sun ☀️", "Lemon 🍋"] },
  { name: "Blue",   hex: "#3b82f6", emoji: "🔵", isPrimary: true,  objects: ["Sky 🌤️", "Ocean 🌊", "Blueberry 🫐"] },
  { name: "Orange", hex: "#f97316", emoji: "🟠", isPrimary: false, objects: ["Orange 🍊", "Carrot 🥕", "Pumpkin 🎃"] },
  { name: "Green",  hex: "#22c55e", emoji: "🟢", isPrimary: false, objects: ["Frog 🐸", "Leaf 🍃", "Broccoli 🥦"] },
  { name: "Purple", hex: "#a855f7", emoji: "🟣", isPrimary: false, objects: ["Grapes 🍇", "Eggplant 🍆", "Lavender 💜"] },
  { name: "Pink",   hex: "#ec4899", emoji: "🩷", isPrimary: false, objects: ["Flamingo 🦩", "Flower 🌸", "Pig 🐷"] },
  { name: "Brown",  hex: "#92400e", emoji: "🟤", isPrimary: false, objects: ["Bear 🐻", "Chocolate 🍫", "Tree trunk 🌳"] },
  { name: "White",  hex: "#f1f5f9", emoji: "⬜", isPrimary: false, objects: ["Cloud ☁️", "Snow ❄️", "Polar bear 🐻‍❄️"] },
  { name: "Black",  hex: "#1e293b", emoji: "⬛", isPrimary: false, objects: ["Night 🌙", "Penguin 🐧", "Crow 🐦‍⬛"] },
];

export interface MixRecipe {
  a: string; // color name
  b: string;
  result: string;
  emoji: string;
}

export const MIX_RECIPES: MixRecipe[] = [
  { a: "Red",    b: "Yellow", result: "Orange", emoji: "🟠" },
  { a: "Red",    b: "Blue",   result: "Purple", emoji: "🟣" },
  { a: "Yellow", b: "Blue",   result: "Green",  emoji: "🟢" },
  { a: "Red",    b: "White",  result: "Pink",   emoji: "🩷" },
  { a: "Red",    b: "Black",  result: "Brown",  emoji: "🟤" },
];
