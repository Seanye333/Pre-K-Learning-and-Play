export interface AnimalInfo {
  name: string;
  emoji: string;
  sound: string;      // the sound they make
  soundVerb: string;  // "barks", "meows", etc.
  home: string;       // "farm", "ocean", "jungle", "forest", "sky"
  homeEmoji: string;
  baby: string;       // baby name
  babyEmoji: string;
}

export const ANIMALS_DATA: AnimalInfo[] = [
  { name: "Dog",      emoji: "🐶", sound: "Woof!",    soundVerb: "barks",   home: "Home",   homeEmoji: "🏠", baby: "Puppy",   babyEmoji: "🐶" },
  { name: "Cat",      emoji: "🐱", sound: "Meow!",    soundVerb: "meows",   home: "Home",   homeEmoji: "🏠", baby: "Kitten",  babyEmoji: "🐱" },
  { name: "Cow",      emoji: "🐮", sound: "Moo!",     soundVerb: "moos",    home: "Farm",   homeEmoji: "🏡", baby: "Calf",    babyEmoji: "🐄" },
  { name: "Pig",      emoji: "🐷", sound: "Oink!",    soundVerb: "oinks",   home: "Farm",   homeEmoji: "🏡", baby: "Piglet",  babyEmoji: "🐽" },
  { name: "Duck",     emoji: "🦆", sound: "Quack!",   soundVerb: "quacks",  home: "Pond",   homeEmoji: "🏊", baby: "Duckling",babyEmoji: "🐤" },
  { name: "Frog",     emoji: "🐸", sound: "Ribbit!",  soundVerb: "croaks",  home: "Pond",   homeEmoji: "🏊", baby: "Tadpole", babyEmoji: "🪱" },
  { name: "Lion",     emoji: "🦁", sound: "Roar!",    soundVerb: "roars",   home: "Safari", homeEmoji: "🌍", baby: "Cub",     babyEmoji: "🐱" },
  { name: "Elephant", emoji: "🐘", sound: "Trumpet!", soundVerb: "trumpets",home: "Safari", homeEmoji: "🌍", baby: "Calf",    babyEmoji: "🐘" },
  { name: "Bird",     emoji: "🐦", sound: "Tweet!",   soundVerb: "chirps",  home: "Sky",    homeEmoji: "🌤️", baby: "Chick",   babyEmoji: "🐣" },
  { name: "Fish",     emoji: "🐟", sound: "Blub!",    soundVerb: "blubs",   home: "Ocean",  homeEmoji: "🌊", baby: "Fry",     babyEmoji: "🐟" },
  { name: "Bear",     emoji: "🐻", sound: "Growl!",   soundVerb: "growls",  home: "Forest", homeEmoji: "🌲", baby: "Cub",     babyEmoji: "🐻" },
  { name: "Sheep",    emoji: "🐑", sound: "Baa!",     soundVerb: "baas",    home: "Farm",   homeEmoji: "🏡", baby: "Lamb",    babyEmoji: "🐑" },
];
