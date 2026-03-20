export interface SightWord {
  word: string;
  sentence: string;   // simple sentence using the word
  emoji: string;      // visual clue for the sentence
}

// Dolch pre-primer + primer sight words appropriate for age 5
export const SIGHT_WORDS: SightWord[] = [
  { word: "the",  sentence: "The cat sat.",          emoji: "🐱" },
  { word: "and",  sentence: "A dog and a cat.",      emoji: "🐶🐱" },
  { word: "a",    sentence: "A red apple.",           emoji: "🍎" },
  { word: "is",   sentence: "The sun is hot.",        emoji: "☀️" },
  { word: "it",   sentence: "It is a big fish.",      emoji: "🐟" },
  { word: "in",   sentence: "A frog in the pond.",    emoji: "🐸" },
  { word: "my",   sentence: "My dog is funny.",       emoji: "🐶" },
  { word: "I",    sentence: "I like cake.",           emoji: "🎂" },
  { word: "see",  sentence: "I see a bird.",          emoji: "🐦" },
  { word: "we",   sentence: "We play outside.",       emoji: "🛝" },
  { word: "can",  sentence: "I can run fast.",        emoji: "🏃" },
  { word: "run",  sentence: "Dogs can run fast.",     emoji: "🐕" },
  { word: "like", sentence: "I like ice cream.",      emoji: "🍦" },
  { word: "big",  sentence: "The elephant is big.",   emoji: "🐘" },
  { word: "go",   sentence: "Go to the park.",        emoji: "🌳" },
  { word: "up",   sentence: "Look up at the sky.",    emoji: "🌤️" },
  { word: "not",  sentence: "It is not cold.",        emoji: "🌞" },
  { word: "said", sentence: "She said hello.",        emoji: "👋" },
  { word: "for",  sentence: "A gift for you.",        emoji: "🎁" },
  { word: "play", sentence: "Let us play outside.",   emoji: "⛹️" },
];

export const LEVELS = {
  easy:   SIGHT_WORDS.slice(0, 7),
  medium: SIGHT_WORDS.slice(7, 14),
  hard:   SIGHT_WORDS.slice(14),
};
