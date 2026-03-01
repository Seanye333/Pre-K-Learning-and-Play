export interface FruitItem {
  id: string;
  name: string;
  emoji: string;
  type: "fruit" | "veggie";
  color: string; // tailwind bg color for card
}

export const ITEMS: FruitItem[] = [
  // Fruits
  { id: "apple",      name: "Apple",      emoji: "🍎", type: "fruit",  color: "bg-red-200" },
  { id: "banana",     name: "Banana",     emoji: "🍌", type: "fruit",  color: "bg-yellow-200" },
  { id: "strawberry", name: "Strawberry", emoji: "🍓", type: "fruit",  color: "bg-pink-200" },
  { id: "grape",      name: "Grape",      emoji: "🍇", type: "fruit",  color: "bg-purple-200" },
  { id: "watermelon", name: "Watermelon", emoji: "🍉", type: "fruit",  color: "bg-green-200" },
  { id: "orange",     name: "Orange",     emoji: "🍊", type: "fruit",  color: "bg-orange-200" },
  { id: "lemon",      name: "Lemon",      emoji: "🍋", type: "fruit",  color: "bg-yellow-100" },
  { id: "cherry",     name: "Cherry",     emoji: "🍒", type: "fruit",  color: "bg-red-100" },
  { id: "pear",       name: "Pear",       emoji: "🍐", type: "fruit",  color: "bg-lime-200" },
  { id: "pineapple",  name: "Pineapple",  emoji: "🍍", type: "fruit",  color: "bg-yellow-300" },
  // Veggies
  { id: "carrot",     name: "Carrot",     emoji: "🥕", type: "veggie", color: "bg-orange-100" },
  { id: "broccoli",   name: "Broccoli",   emoji: "🥦", type: "veggie", color: "bg-green-300" },
  { id: "corn",       name: "Corn",       emoji: "🌽", type: "veggie", color: "bg-yellow-200" },
  { id: "tomato",     name: "Tomato",     emoji: "🍅", type: "veggie", color: "bg-red-200" },
  { id: "cucumber",   name: "Cucumber",   emoji: "🥒", type: "veggie", color: "bg-green-200" },
  { id: "eggplant",   name: "Eggplant",   emoji: "🍆", type: "veggie", color: "bg-purple-300" },
  { id: "potato",     name: "Potato",     emoji: "🥔", type: "veggie", color: "bg-amber-200" },
  { id: "onion",      name: "Onion",      emoji: "🧅", type: "veggie", color: "bg-yellow-100" },
];

export const FRUITS  = ITEMS.filter((i) => i.type === "fruit");
export const VEGGIES = ITEMS.filter((i) => i.type === "veggie");

// Compare pairs: [bigger, smaller]
export const COMPARE_PAIRS: [FruitItem, FruitItem][] = [
  [ITEMS.find((i) => i.id === "watermelon")!, ITEMS.find((i) => i.id === "cherry")!],
  [ITEMS.find((i) => i.id === "pineapple")!,  ITEMS.find((i) => i.id === "grape")!],
  [ITEMS.find((i) => i.id === "corn")!,        ITEMS.find((i) => i.id === "lemon")!],
  [ITEMS.find((i) => i.id === "orange")!,      ITEMS.find((i) => i.id === "strawberry")!],
  [ITEMS.find((i) => i.id === "broccoli")!,    ITEMS.find((i) => i.id === "carrot")!],
  [ITEMS.find((i) => i.id === "banana")!,      ITEMS.find((i) => i.id === "cherry")!],
];
