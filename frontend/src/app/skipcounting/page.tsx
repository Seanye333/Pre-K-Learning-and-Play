"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import SkipCount from "@/components/skipcounting/SkipCount";
import { useSession } from "@/hooks/useSession";

export default function SkipCountingPage() {
  const [showBurst, setShowBurst] = useState(false);
  useSession("math" as never);
  const scoreRef = useRef({ correct: 0, total: 0 });

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-violet-500 to-purple-900 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">🔢 Skip Counting</h1>
      </div>
      <div className="flex-1 overflow-auto">
        <SkipCount onScore={(c,t)=>{ scoreRef.current={correct:c,total:t}; if(c>0&&c%3===0) setShowBurst(true); }} />
      </div>
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
