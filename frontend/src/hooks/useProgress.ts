"use client";

import { useEffect, useState } from "react";

import { apiGet } from "@/lib/api";
import type { ProgressData } from "@/lib/types";

export function useProgress() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<ProgressData>("/progress")
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
