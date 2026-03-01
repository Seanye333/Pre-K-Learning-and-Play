from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from prek.api.schemas import (
    EndSessionRequest,
    EndSessionResponse,
    StartSessionRequest,
    StartSessionResponse,
)
from prek.core.database import get_db
from prek.core.models import GameSession, SkillScore

router = APIRouter(tags=["sessions"])


@router.post("/sessions/start", response_model=StartSessionResponse)
def start_session(req: StartSessionRequest, db: Session = Depends(get_db)):
    session = GameSession(skill=req.skill, difficulty=req.difficulty)
    db.add(session)
    db.commit()
    db.refresh(session)
    return StartSessionResponse(session_id=session.id)


@router.post("/sessions/end", response_model=EndSessionResponse)
def end_session(req: EndSessionRequest, db: Session = Depends(get_db)):
    session = (
        db.query(GameSession).filter(GameSession.id == req.session_id).first()
    )
    if not session:
        return EndSessionResponse(status="not_found", duration_s=None)

    now = datetime.utcnow()
    session.ended_at = now
    session.score = req.score
    session.metadata_ = req.metadata
    if session.started_at:
        session.duration_s = int((now - session.started_at).total_seconds())

    skill_score = SkillScore(
        skill=session.skill,
        score=req.score,
        session_id=session.id,
    )
    db.add(skill_score)
    db.commit()

    return EndSessionResponse(status="ok", duration_s=session.duration_s)
