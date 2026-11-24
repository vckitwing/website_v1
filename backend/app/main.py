from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .db import SessionLocal, init_db
from .models import Conference, HistoryMilestone
from .routers import auth, users
from .routers.content import make_content_router
from .schemas import (
    ConferenceIn,
    ConferenceOut,
    ConferenceUpdate,
    MilestoneIn,
    MilestoneOut,
    MilestoneUpdate,
)
from .services import build_snapshot


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


settings = get_settings()
# The interactive docs stay off in production.
app = FastAPI(
    title="VCK website API",
    lifespan=lifespan,
    docs_url=None if settings.environment == "production" else "/docs",
    redoc_url=None,
    openapi_url=None if settings.environment == "production" else "/openapi.json",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

api = APIRouter(prefix="/api")
api.include_router(auth.router, prefix="/auth", tags=["auth"])
api.include_router(users.router, prefix="/users", tags=["users"])
api.include_router(
    make_content_router(
        entity="conference",
        model=Conference,
        create_schema=ConferenceIn,
        update_schema=ConferenceUpdate,
        out_schema=ConferenceOut,
        order_by=[Conference.year, Conference.position, Conference.id],
        describe=lambda c: f"conference {c.year} “{c.name_en}”",
    ),
    prefix="/conferences",
    tags=["conferences"],
)
api.include_router(
    make_content_router(
        entity="history",
        model=HistoryMilestone,
        create_schema=MilestoneIn,
        update_schema=MilestoneUpdate,
        out_schema=MilestoneOut,
        order_by=[HistoryMilestone.year, HistoryMilestone.position, HistoryMilestone.id],
        describe=lambda m: f"history {m.year} “{m.title_en}”",
    ),
    prefix="/history",
    tags=["history"],
)


@api.get("/public/content", tags=["public"])
def public_content(response: Response):
    """Everything published, for the public website. No sign-in needed."""
    response.headers["Cache-Control"] = "public, max-age=60"
    with SessionLocal() as db:
        return build_snapshot(db)


@api.get("/health", tags=["public"])
def health():
    return {"status": "ok"}


app.include_router(api)
