export interface StoryStep {
  emoji: string;
  caption: string;
}

export interface Story {
  title: string;
  emoji: string;
  steps: StoryStep[]; // correct order
}

export const STORIES: Story[] = [
  {
    title: "Growing a Flower",
    emoji: "🌻",
    steps: [
      { emoji: "🌱", caption: "Plant the seed" },
      { emoji: "💧", caption: "Water it every day" },
      { emoji: "☀️", caption: "Give it sunshine" },
      { emoji: "🌸", caption: "The flower blooms!" },
    ],
  },
  {
    title: "Morning Routine",
    emoji: "🌅",
    steps: [
      { emoji: "⏰", caption: "Wake up!" },
      { emoji: "🦷", caption: "Brush your teeth" },
      { emoji: "🍳", caption: "Eat breakfast" },
      { emoji: "🎒", caption: "Go to school" },
    ],
  },
  {
    title: "Baking Cookies",
    emoji: "🍪",
    steps: [
      { emoji: "🥣", caption: "Mix the dough" },
      { emoji: "🍪", caption: "Shape the cookies" },
      { emoji: "♨️",  caption: "Bake in the oven" },
      { emoji: "😋", caption: "Eat and enjoy!" },
    ],
  },
  {
    title: "Washing Hands",
    emoji: "🧼",
    steps: [
      { emoji: "🚿", caption: "Turn on the water" },
      { emoji: "🧼", caption: "Add soap" },
      { emoji: "👐", caption: "Rub hands together" },
      { emoji: "🖐️", caption: "Rinse and dry!" },
    ],
  },
  {
    title: "Making a Sandwich",
    emoji: "🥪",
    steps: [
      { emoji: "🍞", caption: "Get two slices of bread" },
      { emoji: "🧈", caption: "Spread butter or jam" },
      { emoji: "🧀", caption: "Add the filling" },
      { emoji: "🥪", caption: "Close and eat!" },
    ],
  },
  {
    title: "Going to Sleep",
    emoji: "😴",
    steps: [
      { emoji: "🛁", caption: "Take a bath" },
      { emoji: "👕", caption: "Put on pyjamas" },
      { emoji: "📖", caption: "Read a bedtime story" },
      { emoji: "😴", caption: "Fall asleep!" },
    ],
  },
  {
    title: "Building a Sandcastle",
    emoji: "🏰",
    steps: [
      { emoji: "🏖️", caption: "Go to the beach" },
      { emoji: "🪣", caption: "Fill the bucket with sand" },
      { emoji: "🏰", caption: "Tip the bucket over" },
      { emoji: "🚩", caption: "Put a flag on top!" },
    ],
  },
];
