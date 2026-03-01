"use client";

import type { SkillEntry } from "@/lib/types";

interface SessionListProps {
  skills: Record<string, SkillEntry[]>;
}

const SKILL_EMOJIS: Record<string, string> = {
  abc: "🔤",
  math: "🔢",
  memory: "🃏",
  drawing: "🎨",
};

export default function SessionList({ skills }: SessionListProps) {
  // Flatten and sort all sessions by date desc
  const rows = Object.entries(skills)
    .flatMap(([skill, entries]) =>
      entries.map((e) => ({ skill, ...e }))
    )
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .slice(0, 20);

  if (rows.length === 0) {
    return (
      <p className="text-gray-400 text-sm italic">No sessions recorded yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-2 pr-4">Date</th>
            <th className="py-2 pr-4">Game</th>
            <th className="py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
            >
              <td className="py-2 pr-4 text-gray-500">{row.date}</td>
              <td className="py-2 pr-4 font-medium capitalize">
                {SKILL_EMOJIS[row.skill]} {row.skill}
              </td>
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${Math.round(row.score * 100)}%` }}
                    />
                  </div>
                  <span className="text-gray-700">
                    {Math.round(row.score * 100)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
