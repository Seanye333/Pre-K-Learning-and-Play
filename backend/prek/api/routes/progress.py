from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from prek.api.schemas import ProgressResponse, SkillEntry
from prek.core.database import get_db
from prek.core.models import SkillScore

router = APIRouter(tags=["progress"])

SKILLS = ["abc", "math", "memory", "drawing", "shapes", "rhymes", "emotions", "wordbuilder", "colors", "animals", "story", "trace", "fruits", "opposites", "spotdiff", "numbertrace", "sightwords", "bodyparts", "daysmonths", "subtraction", "vehicles", "clock", "shadow", "phonics", "sizeorder", "helpers", "foodgroups", "sinkorflout", "skipcounting", "wordfamilies", "music", "nature", "directions", "weather", "patterns", "money", "habitats", "fractions", "abcorder", "safety", "measurement", "space", "sentences"]


@router.get("/progress", response_model=ProgressResponse)
def get_progress(db: Session = Depends(get_db)):
    result: dict[str, list[SkillEntry]] = {}

    for skill in SKILLS:
        rows = (
            db.query(SkillScore)
            .filter(SkillScore.skill == skill)
            .order_by(SkillScore.recorded_at.desc())
            .limit(30)
            .all()
        )
        result[skill] = [
            SkillEntry(
                score=round(r.score, 3),
                date=r.recorded_at.strftime("%Y-%m-%d %H:%M"),
            )
            for r in reversed(rows)
        ]

    return ProgressResponse(skills=result)
