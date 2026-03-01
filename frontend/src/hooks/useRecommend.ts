"use client";

import { useEffect, useState } from "react";

import { apiPost } from "@/lib/api";
import type { RecommendResult, Skill } from "@/lib/types";

export function useRecommend(skill: Skill) {
  const [recommendation, setRecommendation] = useState<RecommendResult | null>(
    null
  );

  useEffect(() => {
    apiPost<RecommendResult>("/recommend", { skill })
      .then(setRecommendation)
      .catch(() => null);
  }, [skill]);

  return { recommendation };
}
