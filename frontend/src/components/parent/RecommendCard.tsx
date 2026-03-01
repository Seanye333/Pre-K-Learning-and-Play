"use client";

import { useRecommend } from "@/hooks/useRecommend";
import type { Skill } from "@/lib/types";

interface RecommendCardProps {
  skill: Skill;
}

const ACTION_STYLES = {
  easier: {
    bg: "bg-yellow-50 border-yellow-300",
    badge: "bg-yellow-100 text-yellow-700",
    icon: "⬇️",
  },
  same: {
    bg: "bg-blue-50 border-blue-300",
    badge: "bg-blue-100 text-blue-700",
    icon: "➡️",
  },
  harder: {
    bg: "bg-green-50 border-green-300",
    badge: "bg-green-100 text-green-700",
    icon: "⬆️",
  },
};

const SKILL_LABELS: Record<Skill, string> = {
  abc: "🔤 ABC Adventure",
  math: "🔢 Math Playground",
  memory: "🃏 Memory Match",
  drawing: "🎨 Drawing Studio",
};

export default function RecommendCard({ skill }: RecommendCardProps) {
  const { recommendation } = useRecommend(skill);

  if (!recommendation) {
    return (
      <div className="border rounded-xl p-4 text-gray-400 text-sm italic">
        {SKILL_LABELS[skill]} — loading recommendation...
      </div>
    );
  }

  const style = ACTION_STYLES[recommendation.action];

  return (
    <div className={`border rounded-xl p-4 ${style.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-gray-700">{SKILL_LABELS[skill]}</span>
        <span className={`text-xs px-2 py-1 rounded-full font-bold ${style.badge}`}>
          {style.icon} {recommendation.action}
        </span>
      </div>
      <p className="text-sm text-gray-600">{recommendation.next_activity}</p>
      <p className="text-xs text-gray-400 mt-1">
        Recent avg: {Math.round(recommendation.current_avg * 100)}%
      </p>
    </div>
  );
}
