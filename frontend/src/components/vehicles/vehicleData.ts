export type Zone = "land" | "sea" | "air";

export interface Vehicle {
  id: string;
  name: string;
  emoji: string;
  zone: Zone;
  sound: string;   // onomatopoeia / description
  fact: string;
}

export const VEHICLES: Vehicle[] = [
  // Land
  { id: "car",        name: "Car",         emoji: "🚗",  zone: "land", sound: "Vroom!",   fact: "Cars drive on roads to take families places!" },
  { id: "bus",        name: "Bus",         emoji: "🚌",  zone: "land", sound: "Beep!",    fact: "A bus can carry lots of people at once!" },
  { id: "train",      name: "Train",       emoji: "🚂",  zone: "land", sound: "Choo choo!", fact: "Trains ride on special metal tracks!" },
  { id: "truck",      name: "Truck",       emoji: "🚛",  zone: "land", sound: "Honk!",    fact: "Trucks carry heavy things long distances!" },
  { id: "bicycle",    name: "Bicycle",     emoji: "🚲",  zone: "land", sound: "Ding!",    fact: "Bicycles have two wheels and pedals!" },
  { id: "ambulance",  name: "Ambulance",   emoji: "🚑",  zone: "land", sound: "Wee-woo!", fact: "Ambulances help sick people get to hospital fast!" },
  // Sea
  { id: "boat",       name: "Sailboat",    emoji: "⛵",  zone: "sea",  sound: "Splash!",  fact: "Sailboats use the wind to move across the water!" },
  { id: "ship",       name: "Ship",        emoji: "🚢",  zone: "sea",  sound: "Toot!",    fact: "Big ships can carry thousands of containers!" },
  { id: "submarine",  name: "Submarine",   emoji: "🤿",  zone: "sea",  sound: "Whoosh!",  fact: "Submarines travel deep under the ocean!" },
  { id: "ferry",      name: "Ferry",       emoji: "⛴️",   zone: "sea",  sound: "Honk!",   fact: "Ferries carry cars and people across the water!" },
  // Air
  { id: "plane",      name: "Airplane",    emoji: "✈️",   zone: "air",  sound: "Whoosh!",  fact: "Airplanes fly high in the sky very fast!" },
  { id: "helicopter", name: "Helicopter",  emoji: "🚁",  zone: "air",  sound: "Whirr!",   fact: "Helicopters can hover in one spot in the air!" },
  { id: "hotair",     name: "Hot Air Balloon", emoji: "🎈", zone: "air", sound: "Whoosh!", fact: "Hot air balloons float up when hot air fills them!" },
  { id: "rocket",     name: "Rocket",      emoji: "🚀",  zone: "air",  sound: "Blast off!", fact: "Rockets fly all the way up to space!" },
];

export const ZONE_META: Record<Zone, { label: string; emoji: string; color: string }> = {
  land: { label: "Land",  emoji: "🛣️",  color: "from-green-500 to-lime-700"  },
  sea:  { label: "Sea",   emoji: "🌊",  color: "from-blue-400 to-cyan-700"   },
  air:  { label: "Air",   emoji: "☁️",  color: "from-sky-300 to-indigo-600"  },
};
