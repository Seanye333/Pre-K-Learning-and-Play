from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from prek.api.schemas import DashboardResponse
from prek.core.database import get_db
from prek.core.models import GameSession, SkillScore

router = APIRouter(tags=["dashboard"])

SKILLS = ["abc", "math", "memory", "drawing", "shapes", "rhymes", "emotions", "wordbuilder", "colors", "animals", "story", "trace", "fruits", "opposites", "spotdiff"]


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    # Total play time
    total_seconds = (
        db.query(func.sum(GameSession.duration_s))
        .filter(GameSession.duration_s.isnot(None))
        .scalar()
        or 0
    )
    total_minutes = round(total_seconds / 60, 1)

    # Sessions today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    sessions_today = (
        db.query(func.count(GameSession.id))
        .filter(GameSession.started_at >= today_start)
        .scalar()
        or 0
    )

    # Per-skill averages (all time)
    skill_averages: dict[str, float] = {}
    for skill in SKILLS:
        avg = (
            db.query(func.avg(SkillScore.score))
            .filter(SkillScore.skill == skill)
            .scalar()
        )
        skill_averages[skill] = round(avg, 3) if avg is not None else 0.0

    # Last 7 sessions per skill (for trend charts)
    trend: dict[str, list[float]] = {}
    for skill in SKILLS:
        rows = (
            db.query(SkillScore.score)
            .filter(SkillScore.skill == skill)
            .order_by(SkillScore.recorded_at.desc())
            .limit(7)
            .all()
        )
        trend[skill] = [round(r.score, 3) for r in reversed(rows)]

    # Last activity
    last_session = (
        db.query(GameSession)
        .filter(GameSession.ended_at.isnot(None))
        .order_by(GameSession.ended_at.desc())
        .first()
    )
    last_activity = last_session.skill if last_session else "none"

    return DashboardResponse(
        total_play_time_minutes=total_minutes,
        sessions_today=sessions_today,
        skill_averages=skill_averages,
        trend=trend,
        last_activity=last_activity,
    )
