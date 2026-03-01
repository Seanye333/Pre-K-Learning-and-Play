from pydantic import BaseModel


# ── Session endpoints ────────────────────────────────────────────────────────

class StartSessionRequest(BaseModel):
    skill: str
    difficulty: str = "easy"


class StartSessionResponse(BaseModel):
    session_id: int


class EndSessionRequest(BaseModel):
    session_id: int
    score: float
    metadata: dict = {}


class EndSessionResponse(BaseModel):
    status: str
    duration_s: int | None


# ── Progress endpoint ────────────────────────────────────────────────────────

class SkillEntry(BaseModel):
    score: float
    date: str


class ProgressResponse(BaseModel):
    skills: dict[str, list[SkillEntry]]


# ── Dashboard endpoint ───────────────────────────────────────────────────────

class DashboardResponse(BaseModel):
    total_play_time_minutes: float
    sessions_today: int
    skill_averages: dict[str, float]
    trend: dict[str, list[float]]
    last_activity: str


# ── Recommend endpoint ───────────────────────────────────────────────────────

class RecommendRequest(BaseModel):
    skill: str


class RecommendResponse(BaseModel):
    action: str
    next_activity: str
    current_avg: float
