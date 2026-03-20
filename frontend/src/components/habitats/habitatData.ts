export interface HabitatAnimal {
  id: string;
  name: string;
  emoji: string;
  habitat: "ocean" | "forest" | "desert" | "arctic" | "farm";
  fact: string;
}

export const HABITATS: { id: HabitatAnimal["habitat"]; name: string; emoji: string; description: string; color: string }[] = [
  { id: "ocean",  name: "Ocean",  emoji: "🌊", description: "Deep salty water",      color: "from-blue-500 to-cyan-700"   },
  { id: "forest", name: "Forest", emoji: "🌳", description: "Tall trees everywhere", color: "from-green-500 to-emerald-700" },
  { id: "desert", name: "Desert", emoji: "🏜️", description: "Hot, sandy and dry",    color: "from-yellow-500 to-amber-700" },
  { id: "arctic", name: "Arctic", emoji: "🧊", description: "Cold ice and snow",     color: "from-sky-300 to-blue-600"   },
  { id: "farm",   name: "Farm",   emoji: "🌾", description: "Fields and barns",      color: "from-lime-400 to-green-600"  },
];

export const HABITAT_ANIMALS: HabitatAnimal[] = [
  // Ocean
  { id: "dolphin", name: "Dolphin", emoji: "🐬", habitat: "ocean",  fact: "Dolphins are very smart!" },
  { id: "crab",    name: "Crab",    emoji: "🦀", habitat: "ocean",  fact: "Crabs walk sideways." },
  { id: "shark",   name: "Shark",   emoji: "🦈", habitat: "ocean",  fact: "Sharks have rows of teeth." },
  { id: "turtle",  name: "Turtle",  emoji: "🐢", habitat: "ocean",  fact: "Sea turtles swim thousands of miles." },
  // Forest
  { id: "bear",    name: "Bear",    emoji: "🐻", habitat: "forest", fact: "Bears hibernate in winter." },
  { id: "owl",     name: "Owl",     emoji: "🦉", habitat: "forest", fact: "Owls can turn their head 270°!" },
  { id: "fox",     name: "Fox",     emoji: "🦊", habitat: "forest", fact: "Foxes are clever hunters." },
  { id: "deer",    name: "Deer",    emoji: "🦌", habitat: "forest", fact: "Male deer have antlers." },
  // Desert
  { id: "camel",   name: "Camel",   emoji: "🐪", habitat: "desert", fact: "Camels store water in their humps." },
  { id: "scorpion",name: "Scorpion",emoji: "🦂", habitat: "desert", fact: "Scorpions glow in UV light!" },
  { id: "lizard",  name: "Lizard",  emoji: "🦎", habitat: "desert", fact: "Lizards love the hot sun." },
  // Arctic
  { id: "polar",   name: "Polar Bear",emoji: "🐻‍❄️",habitat: "arctic", fact: "Polar bears have black skin!" },
  { id: "penguin", name: "Penguin", emoji: "🐧", habitat: "arctic", fact: "Penguins are great swimmers." },
  { id: "seal",    name: "Seal",    emoji: "🦭", habitat: "arctic", fact: "Seals have thick blubber to stay warm." },
  // Farm
  { id: "cow",     name: "Cow",     emoji: "🐮", habitat: "farm",   fact: "Cows give us milk." },
  { id: "pig",     name: "Pig",     emoji: "🐷", habitat: "farm",   fact: "Pigs are actually very clean!" },
  { id: "horse",   name: "Horse",   emoji: "🐴", habitat: "farm",   fact: "Horses can sleep standing up!" },
  { id: "chicken", name: "Chicken", emoji: "🐔", habitat: "farm",   fact: "Chickens lay eggs every day." },
];
