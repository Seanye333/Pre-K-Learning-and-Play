"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import FoodSort from "@/components/foodgroups/FoodSort";
import { FOODS, GROUP_META, type FoodGroup } from "@/components/foodgroups/foodData";
import { useSession } from "@/hooks/useSession";

const TABS = ["Learn", "Sort"] as const;
type Tab = (typeof TABS)[number];

export default function FoodGroupsPage() {
  const [tab, setTab] = useState<Tab>("Learn");
  const [showBurst, setShowBurst] = useState(false);
  useSession("abc" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-emerald-400 to-green-800 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">🍽️ Food Groups</h1>
      </div>
      <div className="flex gap-2 justify-center pb-2 px-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-1 rounded-full font-bold text-sm ${tab===t?"bg-white text-green-700 shadow":"bg-white/20 text-white"}`}>
            {t === "Learn" ? "📚 Learn" : "🗂️ Sort"}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {tab === "Learn" && (
          <div className="flex flex-col items-center gap-3 p-4">
            {(Object.entries(GROUP_META) as [FoodGroup, typeof GROUP_META[FoodGroup]][]).map(([g, m]) => (
              <div key={g} className={`w-full max-w-xs rounded-2xl p-3 bg-gradient-to-r ${m.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{m.emoji}</span>
                  <div>
                    <p className="text-white font-black text-lg">{m.label}</p>
                    <p className="text-white/80 text-xs">{m.desc}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {FOODS.filter(f=>f.group===g).map(f=>(
                    <span key={f.id} className="bg-white/30 text-white font-bold rounded-lg px-2 py-1 text-sm">
                      {f.emoji} {f.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "Sort" && (
          <FoodSort onScore={(c,t) => { scoreRef.current={correct:c,total:t}; if(c>0&&c%5===0) setShowBurst(true); }} />
        )}
      </div>
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
