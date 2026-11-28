from datetime import datetime
from typing import Annotated, Literal

from pydantic import BaseModel, Field, StringConstraints

from .models import Status
from .schemas import Text

Slug = Annotated[str, StringConstraints(pattern=r"^[a-z0-9]+(-[a-z0-9]+)*$", max_length=60)]


class PublicationIn(BaseModel):
    slug: Slug
    kind: Literal["book", "monthly"]
    title_en: Text = Field(max_length=200)
    title_ta: Text = Field(max_length=200)
    description_en: Text = Field(max_length=2000)
    description_ta: Text = Field(max_length=2000)
    author_en: str | None = Field(default=None, max_length=200)
    author_ta: str | None = Field(default=None, max_length=200)
    status: Status = Status.draft


class PublicationUpdate(BaseModel):
    slug: Slug | None = None
    title_en: Text | None = Field(default=None, max_length=200)
    title_ta: Text | None = Field(default=None, max_length=200)
    description_en: Text | None = Field(default=None, max_length=2000)
    description_ta: Text | None = Field(default=None, max_length=2000)
    author_en: str | None = Field(default=None, max_length=200)
    author_ta: str | None = Field(default=None, max_length=200)
    status: Status | None = None


class EditionUpdate(BaseModel):
    label: Text | None = Field(default=None, max_length=120)
    volume: int | None = Field(default=None, ge=1, le=9999)
    issue_number: int | None = Field(default=None, ge=1, le=99999)
    year: int | None = Field(default=None, ge=1900, le=2100)
    month: int | None = Field(default=None, ge=1, le=12)
    status: Status | None = None


class EditionOut(BaseModel):
    id: int
    publication_id: int
    label: str
    volume: int | None
    issue_number: int | None
    year: int | None
    month: int | None
    status: Status
    state: Literal["processing", "ready", "failed"]
    processed_pages: int
    page_count: int
    page_width_px: int
    page_height_px: int
    watermark: bool
    error: str | None
    cover_url: str | None  # only once the edition is ready
    created_at: datetime


class PublicationOut(BaseModel):
    id: int
    slug: str
    kind: Literal["book", "monthly"]
    title_en: str
    title_ta: str
    description_en: str
    description_ta: str
    author_en: str | None
    author_ta: str | None
    status: Status
    editions: list[EditionOut]
    updated_at: datetime
