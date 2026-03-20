export type FoodGroup = "grains" | "dairy" | "protein" | "fruits" | "veggies";

export interface FoodItem {
  id: string; name: string; emoji: string; group: FoodGroup;
}

export const GROUP_META: Record<FoodGroup, { label: string; emoji: string; color: string; desc: string }> = {
  grains:  { label:"Grains",      emoji:"🌾", color:"from-yellow-400 to-amber-500",  desc:"Bread, rice, pasta — gives us energy!" },
  dairy:   { label:"Dairy",       emoji:"🥛", color:"from-blue-300 to-cyan-500",     desc:"Milk, cheese, yogurt — builds strong bones!" },
  protein: { label:"Protein",     emoji:"🥩", color:"from-red-400 to-rose-600",      desc:"Meat, eggs, beans — builds our muscles!" },
  fruits:  { label:"Fruits",      emoji:"🍎", color:"from-pink-400 to-red-500",      desc:"Sweet and juicy — full of vitamins!" },
  veggies: { label:"Vegetables",  emoji:"🥦", color:"from-green-400 to-emerald-600", desc:"Colorful and healthy — keeps us strong!" },
};

export const FOODS: FoodItem[] = [
  { id:"bread",   name:"Bread",     emoji:"🍞", group:"grains"  },
  { id:"rice",    name:"Rice",      emoji:"🍚", group:"grains"  },
  { id:"pasta",   name:"Pasta",     emoji:"🍝", group:"grains"  },
  { id:"cereal",  name:"Cereal",    emoji:"🥣", group:"grains"  },
  { id:"milk",    name:"Milk",      emoji:"🥛", group:"dairy"   },
  { id:"cheese",  name:"Cheese",    emoji:"🧀", group:"dairy"   },
  { id:"yogurt",  name:"Yogurt",    emoji:"🍦", group:"dairy"   },
  { id:"icecream",name:"Ice Cream", emoji:"🍨", group:"dairy"   },
  { id:"chicken", name:"Chicken",   emoji:"🍗", group:"protein" },
  { id:"egg",     name:"Egg",       emoji:"🥚", group:"protein" },
  { id:"fish",    name:"Fish",      emoji:"🐟", group:"protein" },
  { id:"beans",   name:"Beans",     emoji:"🫘", group:"protein" },
  { id:"apple",   name:"Apple",     emoji:"🍎", group:"fruits"  },
  { id:"banana",  name:"Banana",    emoji:"🍌", group:"fruits"  },
  { id:"grapes",  name:"Grapes",    emoji:"🍇", group:"fruits"  },
  { id:"orange",  name:"Orange",    emoji:"🍊", group:"fruits"  },
  { id:"carrot",  name:"Carrot",    emoji:"🥕", group:"veggies" },
  { id:"broccoli",name:"Broccoli",  emoji:"🥦", group:"veggies" },
  { id:"corn",    name:"Corn",      emoji:"🌽", group:"veggies" },
  { id:"tomato",  name:"Tomato",    emoji:"🍅", group:"veggies" },
];
