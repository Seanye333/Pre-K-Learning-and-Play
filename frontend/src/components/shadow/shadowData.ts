export interface ShadowItem {
  id: string;
  name: string;
  emoji: string;
  category: "animals" | "food" | "objects" | "vehicles";
}

export const SHADOW_ITEMS: ShadowItem[] = [
  // Animals
  { id: "elephant", name: "Elephant",   emoji: "🐘", category: "animals"  },
  { id: "giraffe",  name: "Giraffe",    emoji: "🦒", category: "animals"  },
  { id: "penguin",  name: "Penguin",    emoji: "🐧", category: "animals"  },
  { id: "crab",     name: "Crab",       emoji: "🦀", category: "animals"  },
  { id: "butterfly",name: "Butterfly",  emoji: "🦋", category: "animals"  },
  { id: "turtle",   name: "Turtle",     emoji: "🐢", category: "animals"  },
  // Food
  { id: "pizza",    name: "Pizza",      emoji: "🍕", category: "food"     },
  { id: "banana",   name: "Banana",     emoji: "🍌", category: "food"     },
  { id: "icecream", name: "Ice Cream",  emoji: "🍦", category: "food"     },
  { id: "strawberry",name:"Strawberry", emoji: "🍓", category: "food"     },
  // Objects
  { id: "star",     name: "Star",       emoji: "⭐", category: "objects"  },
  { id: "heart",    name: "Heart",      emoji: "❤️",  category: "objects"  },
  { id: "umbrella", name: "Umbrella",   emoji: "☂️",  category: "objects"  },
  { id: "diamond",  name: "Diamond",    emoji: "💎", category: "objects"  },
  // Vehicles
  { id: "rocket",   name: "Rocket",     emoji: "🚀", category: "vehicles" },
  { id: "helicopter",name:"Helicopter", emoji: "🚁", category: "vehicles" },
];
