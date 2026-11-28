from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


def now() -> datetime:
    return datetime.now(timezone.utc)


class Role(StrEnum):
    super_admin = "super_admin"  # everything, including managing users
    editor = "editor"            # create / edit / delete / publish content
    contributor = "contributor"  # create and edit drafts only; an editor publishes


class Status(StrEnum):
    draft = "draft"
    published = "published"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(254), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default=Role.contributor.value)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    last_login: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class _Content:
    """Columns every managed content item shares."""

    status: Mapped[str] = mapped_column(String(10), default=Status.draft.value, index=True)
    position: Mapped[int] = mapped_column(Integer, default=0)  # tie-break inside one year
    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    updated_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now)


class Conference(_Content, Base):
    __tablename__ = "conferences"

    id: Mapped[int] = mapped_column(primary_key=True)
    year: Mapped[int] = mapped_column(Integer, index=True)
    name_en: Mapped[str] = mapped_column(String(300))
    name_ta: Mapped[str] = mapped_column(String(300))


class HistoryMilestone(_Content, Base):
    __tablename__ = "history_milestones"

    id: Mapped[int] = mapped_column(primary_key=True)
    year: Mapped[str] = mapped_column(String(4), index=True)
    title_en: Mapped[str] = mapped_column(String(200))
    title_ta: Mapped[str] = mapped_column(String(200))
    description_en: Mapped[str] = mapped_column(Text)
    description_ta: Mapped[str] = mapped_column(Text)
    source_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    source_label_en: Mapped[str | None] = mapped_column(String(200), nullable=True)
    source_label_ta: Mapped[str | None] = mapped_column(String(200), nullable=True)


class MediaAsset(Base):
    """An uploaded picture. The files themselves live in object storage under images/<key>/<width>.webp."""

    __tablename__ = "media_assets"

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    filename: Mapped[str] = mapped_column(String(255))  # the name it was uploaded with (display only)
    width: Mapped[int] = mapped_column(Integer)
    height: Mapped[int] = mapped_column(Integer)
    widths: Mapped[str] = mapped_column(String(40))  # the copies that exist, e.g. "400,800,1600"
    alt_en: Mapped[str] = mapped_column(String(300))
    alt_ta: Mapped[str] = mapped_column(String(300))
    caption_en: Mapped[str | None] = mapped_column(String(500), nullable=True)
    caption_ta: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, index=True)


class Publication(Base):
    """A book (one edition) or a monthly publication (one edition per issue). Shown to readers as page pictures only."""

    __tablename__ = "publications"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(60), unique=True, index=True)
    kind: Mapped[str] = mapped_column(String(10))  # "book" | "monthly"
    title_en: Mapped[str] = mapped_column(String(200))
    title_ta: Mapped[str] = mapped_column(String(200))
    description_en: Mapped[str] = mapped_column(Text)
    description_ta: Mapped[str] = mapped_column(Text)
    author_en: Mapped[str | None] = mapped_column(String(200), nullable=True)
    author_ta: Mapped[str | None] = mapped_column(String(200), nullable=True)
    status: Mapped[str] = mapped_column(String(10), default=Status.draft.value, index=True)
    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now)


class Edition(Base):
    """One PDF of a publication, processed into page pictures at publications/<key>/pNNN.webp."""

    __tablename__ = "editions"

    id: Mapped[int] = mapped_column(primary_key=True)
    publication_id: Mapped[int] = mapped_column(ForeignKey("publications.id", ondelete="CASCADE"), index=True)
    key: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    label: Mapped[str] = mapped_column(String(120))  # e.g. "Issue 100" or "First edition"
    volume: Mapped[int | None] = mapped_column(Integer, nullable=True)
    issue_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    month: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(10), default=Status.draft.value, index=True)
    state: Mapped[str] = mapped_column(String(12), default="processing")  # processing | ready | failed
    processed_pages: Mapped[int] = mapped_column(Integer, default=0)
    page_count: Mapped[int] = mapped_column(Integer, default=0)
    page_width_px: Mapped[int] = mapped_column(Integer, default=0)
    page_height_px: Mapped[int] = mapped_column(Integer, default=0)
    watermark: Mapped[bool] = mapped_column(Boolean, default=True)
    error: Mapped[str | None] = mapped_column(String(300), nullable=True)
    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now)


class AuditLog(Base):
    """Who changed what, and when. Rows are only ever added."""

    __tablename__ = "audit_log"

    id: Mapped[int] = mapped_column(primary_key=True)
    at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    user_email: Mapped[str] = mapped_column(String(254))
    action: Mapped[str] = mapped_column(String(30))
    entity: Mapped[str] = mapped_column(String(30))
    entity_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    summary: Mapped[str] = mapped_column(String(500))
