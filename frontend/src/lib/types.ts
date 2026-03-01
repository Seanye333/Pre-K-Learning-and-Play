export type Skill = "abc" | "math" | "memory" | "drawing";
export type Difficulty = "easy" | "medium" | "hard";

export interface StartSessionResponse {
  session_id: number;
}

export interface EndSessionResponse {
  status: string;
  duration_s: number | null;
}

export interface SkillEntry {
  score: number;
  date: string;
}

export interface ProgressData {
  skills: Record<Skill, SkillEntry[]>;
}

export interface DashboardData {
  total_play_time_minutes: number;
  sessions_today: number;
  skill_averages: Record<Skill, number>;
  trend: Record<Skill, number[]>;
  last_activity: string;
}

export interface RecommendResult {
  action: "easier" | "harder" | "same";
  next_activity: string;
  current_avg: number;
}

export interface WordItem {
  word: string;
  image: string;
}
