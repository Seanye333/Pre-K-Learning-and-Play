export interface Instrument {
  id: string;
  name: string;
  emoji: string;
  family: "strings" | "wind" | "percussion" | "keys";
  sound: string; // description of sound
  fact: string;
}

export const INSTRUMENTS: Instrument[] = [
  // Strings
  { id: "guitar",  name: "Guitar",   emoji: "🎸", family: "strings",    sound: "Strum!",  fact: "Guitars have 6 strings!" },
  { id: "violin",  name: "Violin",   emoji: "🎻", family: "strings",    sound: "Swish!",  fact: "You play violin with a bow." },
  // Wind
  { id: "trumpet", name: "Trumpet",  emoji: "🎺", family: "wind",       sound: "Toot!",   fact: "Trumpets are made of brass." },
  { id: "flute",   name: "Flute",    emoji: "🪈", family: "wind",       sound: "Tweet!",  fact: "You blow across the flute hole." },
  { id: "sax",     name: "Saxophone",emoji: "🎷", family: "wind",       sound: "Honk!",   fact: "Sax uses a reed to make sound." },
  // Percussion
  { id: "drums",   name: "Drums",    emoji: "🥁", family: "percussion", sound: "Boom!",   fact: "Drums are the heartbeat of music." },
  { id: "maracas", name: "Maracas",  emoji: "🪇", family: "percussion", sound: "Shake!",  fact: "Maracas are filled with seeds." },
  { id: "bell",    name: "Bell",     emoji: "🔔", family: "percussion", sound: "Ding!",   fact: "Bells ring when you hit them." },
  // Keys
  { id: "piano",   name: "Piano",    emoji: "🎹", family: "keys",       sound: "Plink!",  fact: "A piano has 88 keys!" },
  { id: "accordion",name:"Accordion",emoji: "🪗", family: "keys",       sound: "Squeeze!",fact: "You squeeze an accordion to play." },
];

export const FAMILIES: { id: Instrument["family"]; label: string; emoji: string; color: string }[] = [
  { id: "strings",    label: "Strings",    emoji: "🎻", color: "from-amber-400 to-orange-500"  },
  { id: "wind",       label: "Wind",       emoji: "🎺", color: "from-sky-400 to-blue-600"      },
  { id: "percussion", label: "Percussion", emoji: "🥁", color: "from-rose-400 to-red-600"      },
  { id: "keys",       label: "Keys",       emoji: "🎹", color: "from-violet-400 to-purple-600" },
];
