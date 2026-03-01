"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import { apiPost } from "@/lib/api";
import type {
  Difficulty,
  EndSessionResponse,
  Skill,
  StartSessionResponse,
} from "@/lib/types";

interface SessionContextValue {
  sessionId: number | null;
  skill: Skill | null;
  startSession: (skill: Skill, difficulty?: Difficulty) => Promise<void>;
  endSession: (score: number, metadata?: Record<string, unknown>) => Promise<void>;
}

const SessionContext = createContext<SessionContextValue>({
  sessionId: null,
  skill: null,
  startSession: async () => {},
  endSession: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const sessionIdRef = useRef<number | null>(null);

  const startSession = useCallback(
    async (newSkill: Skill, difficulty: Difficulty = "easy") => {
      try {
        const res = await apiPost<StartSessionResponse>("/sessions/start", {
          skill: newSkill,
          difficulty,
        });
        setSessionId(res.session_id);
        sessionIdRef.current = res.session_id;
        setSkill(newSkill);
      } catch {
        // Silently fail — games work offline too
      }
    },
    []
  );

  const endSession = useCallback(
    async (score: number, metadata: Record<string, unknown> = {}) => {
      const id = sessionIdRef.current;
      if (!id) return;
      try {
        await apiPost<EndSessionResponse>("/sessions/end", {
          session_id: id,
          score,
          metadata,
        });
      } catch {
        // Silently fail
      } finally {
        setSessionId(null);
        sessionIdRef.current = null;
        setSkill(null);
      }
    },
    []
  );

  return (
    <SessionContext.Provider value={{ sessionId, skill, startSession, endSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
