from datetime import datetime

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from prek.core.database import Base


class GameSession(Base):
    __tablename__ = "game_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    skill: Mapped[str] = mapped_column(String, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    duration_s: Mapped[int | None] = mapped_column(Integer, nullable=True)
    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    difficulty: Mapped[str] = mapped_column(String, default="easy")
    metadata_: Mapped[dict] = mapped_column(JSON, default=dict)

    skill_scores: Mapped[list["SkillScore"]] = relationship(
        "SkillScore", back_populates="session"
    )


class SkillScore(Base):
    __tablename__ = "skill_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    skill: Mapped[str] = mapped_column(String, nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    session_id: Mapped[int] = mapped_column(Integer, ForeignKey("game_sessions.id"))

    session: Mapped["GameSession"] = relationship(
        "GameSession", back_populates="skill_scores"
    )
