"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface SkillChartProps {
  skill: string;
  scores: number[];
  average: number;
}

const SKILL_COLORS: Record<string, string> = {
  abc: "#f59e0b",
  math: "#22c55e",
  memory: "#a855f7",
  drawing: "#3b82f6",
};

export default function SkillChart({ skill, scores, average }: SkillChartProps) {
  const data = scores.map((s, i) => ({
    session: `#${i + 1}`,
    score: Math.round(s * 100),
  }));

  if (data.length === 0) {
    return (
      <div className="text-gray-400 text-sm italic text-center py-4">
        No sessions yet for {skill}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-700 capitalize">{skill}</h3>
        <span className="text-sm text-gray-500">
          Avg: {Math.round(average * 100)}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="session" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v) => [`${v}%`, "Score"]}
            labelFormatter={(l) => `Session ${l}`}
          />
          <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "60%", fontSize: 10, fill: "#ef4444" }} />
          <ReferenceLine y={85} stroke="#22c55e" strokeDasharray="4 2" label={{ value: "85%", fontSize: 10, fill: "#22c55e" }} />
          <Bar
            dataKey="score"
            fill={SKILL_COLORS[skill] ?? "#6b7280"}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
