from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from prek.api.routes import dashboard, progress, recommend, sessions
from prek.core.config import settings
from prek.core.database import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()   # ensure DB tables exist on every cold start
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="Pre-K Learning API", version="1.0.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(sessions.router)
    app.include_router(progress.router)
    app.include_router(dashboard.router)
    app.include_router(recommend.router)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()
