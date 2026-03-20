export interface NatureItem {
  id: string;
  name: string;
  emoji: string;
  living: boolean;
  category: "animal" | "plant" | "rock" | "water" | "manmade";
  fact: string;
}

export const NATURE_ITEMS: NatureItem[] = [
  // Living - animals
  { id: "butterfly", name: "Butterfly", emoji: "🦋", living: true,  category: "animal",  fact: "Butterflies taste with their feet!" },
  { id: "frog",      name: "Frog",      emoji: "🐸", living: true,  category: "animal",  fact: "Frogs breathe through their skin." },
  { id: "bee",       name: "Bee",       emoji: "🐝", living: true,  category: "animal",  fact: "Bees make honey for food." },
  { id: "bird",      name: "Bird",      emoji: "🐦", living: true,  category: "animal",  fact: "Birds have hollow bones to fly." },
  { id: "snail",     name: "Snail",     emoji: "🐌", living: true,  category: "animal",  fact: "A snail carries its home on its back." },
  { id: "worm",      name: "Worm",      emoji: "🪱", living: true,  category: "animal",  fact: "Worms help plants grow in soil." },
  // Living - plants
  { id: "flower",    name: "Flower",    emoji: "🌸", living: true,  category: "plant",   fact: "Flowers make seeds to grow new plants." },
  { id: "tree",      name: "Tree",      emoji: "🌳", living: true,  category: "plant",   fact: "Trees give us oxygen to breathe." },
  { id: "mushroom",  name: "Mushroom",  emoji: "🍄", living: true,  category: "plant",   fact: "Mushrooms are actually fungi!" },
  { id: "cactus",    name: "Cactus",    emoji: "🌵", living: true,  category: "plant",   fact: "Cacti store water in their stems." },
  // Non-living
  { id: "rock",      name: "Rock",      emoji: "🪨", living: false, category: "rock",    fact: "Rocks are made of minerals." },
  { id: "cloud",     name: "Cloud",     emoji: "☁️",  living: false, category: "water",   fact: "Clouds are made of tiny water drops." },
  { id: "raindrop",  name: "Rain",      emoji: "🌧️",  living: false, category: "water",   fact: "Rain fills rivers and lakes." },
  { id: "sun",       name: "Sun",       emoji: "☀️",  living: false, category: "rock",    fact: "The Sun is a giant ball of fire." },
  { id: "car",       name: "Car",       emoji: "🚗", living: false, category: "manmade", fact: "Cars were invented about 150 years ago." },
  { id: "book",      name: "Book",      emoji: "📚", living: false, category: "manmade", fact: "Books are made from trees!" },
];
