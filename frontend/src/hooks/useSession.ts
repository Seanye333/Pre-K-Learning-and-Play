"use client";

import { useEffect } from "react";

import { useSessionContext } from "@/context/SessionContext";
import type { Difficulty, Skill } from "@/lib/types";

export function useSession(skill: Skill, difficulty: Difficulty = "easy") {
  const { startSession, endSession, sessionId } = useSessionContext();

  useEffect(() => {
    startSession(skill, difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sessionId, endSession };
}
