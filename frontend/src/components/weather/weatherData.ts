export interface WeatherType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  clothes: string[];
  clothesEmoji: string[];
}

export const WEATHER_TYPES: WeatherType[] = [
  { id: "sunny",   name: "Sunny",   emoji: "☀️",  description: "Bright and warm outside!", clothes: ["t-shirt", "shorts", "sunglasses"], clothesEmoji: ["👕","🩳","🕶️"] },
  { id: "cloudy",  name: "Cloudy",  emoji: "☁️",  description: "No sunshine today.",        clothes: ["light jacket", "pants"],          clothesEmoji: ["🧥","👖"] },
  { id: "rainy",   name: "Rainy",   emoji: "🌧️",  description: "Drops of water fall down!", clothes: ["raincoat", "boots", "umbrella"],  clothesEmoji: ["🧥","🥾","☂️"] },
  { id: "snowy",   name: "Snowy",   emoji: "❄️",  description: "Cold white flakes fall!",   clothes: ["coat", "boots", "gloves", "hat"], clothesEmoji: ["🧥","🥾","🧤","🎩"] },
  { id: "windy",   name: "Windy",   emoji: "💨",  description: "The air blows fast!",       clothes: ["jacket", "hat"],                  clothesEmoji: ["🧥","🎩"] },
  { id: "stormy",  name: "Stormy",  emoji: "⛈️",  description: "Thunder and lightning!",    clothes: ["stay inside", "umbrella"],        clothesEmoji: ["🏠","☂️"] },
  { id: "foggy",   name: "Foggy",   emoji: "🌫️",  description: "Hard to see far away.",     clothes: ["light jacket"],                   clothesEmoji: ["🧥"] },
  { id: "rainbow", name: "Rainbow", emoji: "🌈",  description: "Colors in the sky after rain!", clothes: ["t-shirt", "boots"],            clothesEmoji: ["👕","🥾"] },
];

export const SEASONS: { id: string; name: string; emoji: string; months: string; weather: string[]; color: string }[] = [
  { id: "spring", name: "Spring", emoji: "🌸", months: "Mar · Apr · May",  weather: ["rainy", "cloudy", "sunny"],        color: "from-pink-300 to-rose-500" },
  { id: "summer", name: "Summer", emoji: "🌻", months: "Jun · Jul · Aug",  weather: ["sunny", "windy"],                  color: "from-yellow-400 to-orange-500" },
  { id: "autumn", name: "Autumn", emoji: "🍂", months: "Sep · Oct · Nov",  weather: ["cloudy", "windy", "rainy"],        color: "from-orange-400 to-amber-700" },
  { id: "winter", name: "Winter", emoji: "⛄", months: "Dec · Jan · Feb",  weather: ["snowy", "foggy", "cloudy"],        color: "from-sky-300 to-blue-600" },
];
