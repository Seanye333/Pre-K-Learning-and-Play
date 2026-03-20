export interface Helper {
  id: string;
  name: string;
  emoji: string;
  job: string;
  tool: string;
  toolEmoji: string;
  vehicle: string;
  vehicleEmoji: string;
  color: string;
}

export const HELPERS: Helper[] = [
  { id:"doctor",     name:"Doctor",       emoji:"👨‍⚕️", job:"Doctors help sick people feel better!",          tool:"Stethoscope", toolEmoji:"🩺", vehicle:"Ambulance", vehicleEmoji:"🚑", color:"bg-blue-200"   },
  { id:"firefighter",name:"Firefighter",  emoji:"👨‍🚒", job:"Firefighters put out fires and keep us safe!",    tool:"Fire Hose",   toolEmoji:"🪣", vehicle:"Fire Truck", vehicleEmoji:"🚒", color:"bg-red-200"    },
  { id:"police",     name:"Police Officer",emoji:"👮", job:"Police officers protect our neighborhood!",        tool:"Badge",       toolEmoji:"🔵", vehicle:"Police Car", vehicleEmoji:"🚓", color:"bg-indigo-200" },
  { id:"teacher",    name:"Teacher",      emoji:"👩‍🏫", job:"Teachers help us learn new things every day!",    tool:"Pencil",      toolEmoji:"✏️",  vehicle:"School Bus", vehicleEmoji:"🚌", color:"bg-yellow-200" },
  { id:"chef",       name:"Chef",         emoji:"👨‍🍳", job:"Chefs cook delicious food for everyone!",         tool:"Spatula",     toolEmoji:"🍳", vehicle:"Delivery Van",vehicleEmoji:"🚐",color:"bg-orange-200" },
  { id:"farmer",     name:"Farmer",       emoji:"👨‍🌾", job:"Farmers grow the food we eat!",                  tool:"Shovel",      toolEmoji:"🪛", vehicle:"Tractor",    vehicleEmoji:"🚜", color:"bg-lime-200"   },
  { id:"pilot",      name:"Pilot",        emoji:"👩‍✈️", job:"Pilots fly airplanes to faraway places!",         tool:"Headset",     toolEmoji:"🎧", vehicle:"Airplane",   vehicleEmoji:"✈️",  color:"bg-sky-200"    },
  { id:"builder",    name:"Builder",      emoji:"👷", job:"Builders construct houses and buildings!",         tool:"Hammer",      toolEmoji:"🔨", vehicle:"Crane",      vehicleEmoji:"🏗️",  color:"bg-amber-200"  },
  { id:"vet",        name:"Vet",          emoji:"👩‍⚕️", job:"Vets take care of sick and injured animals!",     tool:"Syringe",     toolEmoji:"💉", vehicle:"Van",        vehicleEmoji:"🚐", color:"bg-green-200"  },
  { id:"librarian",  name:"Librarian",    emoji:"📚", job:"Librarians help us find great books to read!",    tool:"Book",        toolEmoji:"📖", vehicle:"Bus",        vehicleEmoji:"🚌", color:"bg-purple-200" },
];
