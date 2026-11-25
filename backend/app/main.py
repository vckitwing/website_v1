from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI, HTTPException, Response
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import get_settings
from .db import SessionLocal, init_db
from .models import Conference, HistoryMilestone
from .jobs import mark_interrupted_as_failed
from .routers import auth, media, publications, users
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
from .storage import PUBLIC_FILES, PUBLIC_PREFIXES, get_storage


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    mark_interrupted_as_failed()
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
api.include_router(media.router, prefix="/media", tags=["media"])
api.include_router(publications.router, prefix="/publications", tags=["publications"])
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

# Local development only: serve the PUBLIC parts of the storage folder at /media, the way the public R2 bucket will be
# served in production: pictures, page images and content.json. Nothing else is reachable: not `_private/` (the source
# PDFs), and not the owner's own staging folders (such as Books/). Read-only; no directory listings.
if settings.environment != "production":
    _storage = get_storage()
    for _prefix in PUBLIC_PREFIXES:
        (_storage.root / _prefix).mkdir(parents=True, exist_ok=True)
        app.mount(f"/media/{_prefix}", StaticFiles(directory=_storage.root / _prefix), name=f"media-{_prefix}")

    @app.get("/media/{name}", include_in_schema=False)
    def media_file(name: str):
        if name not in PUBLIC_FILES or not (_storage.root / name).is_file():
            raise HTTPException(404)
        return FileResponse(_storage.root / name, headers={"Cache-Control": "no-cache"})
