"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PinGate from "@/components/ui/PinGate";
import SkillChart from "@/components/parent/SkillChart";
import SessionList from "@/components/parent/SessionList";
import RecommendCard from "@/components/parent/RecommendCard";
import { useProgress } from "@/hooks/useProgress";
import type { Skill } from "@/lib/types";

const SKILLS: Skill[] = ["abc", "math", "memory", "drawing"];

function Dashboard() {
  const { data, loading, error } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading progress data...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-sm">
          Could not connect to backend. Make sure the backend server is running at{" "}
          <code>localhost:8000</code>.
        </div>
      </div>
    );
  }

  const totalSessions = SKILLS.reduce(
    (sum, s) => sum + (data.skills[s]?.length ?? 0),
    0
  );

  const overallAvg =
    SKILLS.reduce((sum, s) => {
      const scores = data.skills[s] ?? [];
      if (scores.length === 0) return sum;
      return sum + scores.reduce((a, b) => a + b.score, 0) / scores.length;
    }, 0) / SKILLS.filter((s) => (data.skills[s]?.length ?? 0) > 0).length || 0;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Sessions", value: totalSessions, emoji: "🎮" },
          {
            label: "Overall Avg",
            value: `${Math.round(overallAvg * 100)}%`,
            emoji: "📊",
          },
          {
            label: "Games Played",
            value: SKILLS.filter((s) => (data.skills[s]?.length ?? 0) > 0).length,
            emoji: "🏆",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 text-center shadow-sm border"
          >
            <div className="text-3xl">{stat.emoji}</div>
            <div className="text-2xl font-black text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Skill Charts */}
      <div>
        <h2 className="text-lg font-black text-gray-700 mb-4">Progress Charts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SKILLS.map((skill) => (
            <div key={skill} className="bg-white rounded-2xl p-4 shadow-sm border">
              <SkillChart
                skill={skill}
                scores={(data.skills[skill] ?? []).map((e) => e.score)}
                average={
                  (data.skills[skill] ?? []).reduce((a, b) => a + b.score, 0) /
                  Math.max(1, (data.skills[skill] ?? []).length)
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* AI Tutor Recommendations */}
      <div>
        <h2 className="text-lg font-black text-gray-700 mb-4">
          AI Tutor Recommendations
        </h2>
        <div className="space-y-3">
          {SKILLS.map((skill) => (
            <RecommendCard key={skill} skill={skill} />
          ))}
        </div>
      </div>

      {/* Session History */}
      <div>
        <h2 className="text-lg font-black text-gray-700 mb-4">
          Recent Sessions
        </h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <SessionList skills={data.skills as Record<string, typeof data.skills[Skill]>} />
        </div>
      </div>
    </div>
  );
}

export default function ParentPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <PinGate onSuccess={() => setUnlocked(true)} />;
  }

  return (
    <main className="min-h-screen bg-gray-100 overflow-auto">
      {/* Top bar */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-black text-gray-800">
          📊 Parent Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-indigo-600 font-bold hover:underline"
          >
            ← Back to Games
          </Link>
          <motion.button
            onClick={() => setUnlocked(false)}
            className="text-sm text-gray-400 hover:text-gray-600"
            whileHover={{ scale: 1.05 }}
          >
            🔒 Lock
          </motion.button>
        </div>
      </div>

      <Dashboard />
    </main>
  );
}
