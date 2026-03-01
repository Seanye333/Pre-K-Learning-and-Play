"use client";

import { useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StarBurst from "@/components/ui/StarBurst";
import TraceCanvas from "@/components/trace/TraceCanvas";
import { useSession } from "@/hooks/useSession";

export default function TracePage() {
  const [showBurst, setShowBurst] = useState(false);
  const { endSession } = useSession("trace" as never);
  const tracedRef = useRef(new Set<string>());

  const handleComplete = (letter: string) => {
    tracedRef.current.add(letter);
    setShowBurst(true);
    endSession(1.0, { letter, traced: tracedRef.current.size });
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-fuchsia-400 to-purple-700 flex flex-col overflow-hidden game-area">
      <div className="flex items-center justify-center pt-4 pb-2 px-4">
        <h1 className="text-3xl font-black text-white drop-shadow">
          ✏️ Letter Trace
        </h1>
      </div>

      <div className="flex-1 overflow-auto flex items-start justify-center">
        <TraceCanvas onComplete={handleComplete} />
      </div>

      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      <BackButton />
    </main>
  );
}
