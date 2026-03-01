from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from prek.ai.tutor import TutorEngine
from prek.api.schemas import RecommendRequest, RecommendResponse
from prek.core.database import get_db
from prek.core.models import SkillScore

router = APIRouter(tags=["recommend"])

engine = TutorEngine()


@router.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest, db: Session = Depends(get_db)):
    rows = (
        db.query(SkillScore)
        .filter(SkillScore.skill == req.skill)
        .order_by(SkillScore.recorded_at.desc())
        .limit(10)
        .all()
    )
    scores = [r.score for r in rows]
    result = engine.recommend(req.skill, scores)
    return RecommendResponse(**result)
