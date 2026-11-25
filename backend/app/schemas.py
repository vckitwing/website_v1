from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, StringConstraints, field_validator

from .models import Role, Status

Text = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    name: str
    role: Role
    is_active: bool
    last_login: datetime | None


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class UserCreate(BaseModel):
    email: EmailStr
    name: Text = Field(max_length=120)
    password: str
    role: Role = Role.contributor


class UserUpdate(BaseModel):
    name: Text | None = Field(default=None, max_length=120)
    role: Role | None = None
    is_active: bool | None = None
    password: str | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


# ---- Conferences ----------------------------------------------------------------------------------------------------
class ConferenceIn(BaseModel):
    year: int = Field(ge=1982, le=2100)
    name_en: Text = Field(max_length=300)
    name_ta: Text = Field(max_length=300)
    position: int = 0
    status: Status = Status.draft


class ConferenceUpdate(BaseModel):
    year: int | None = Field(default=None, ge=1982, le=2100)
    name_en: Text | None = Field(default=None, max_length=300)
    name_ta: Text | None = Field(default=None, max_length=300)
    position: int | None = None
    status: Status | None = None


class ConferenceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    year: int
    name_en: str
    name_ta: str
    position: int
    status: Status
    updated_at: datetime


# ---- History --------------------------------------------------------------------------------------------------------
def _check_year(value: str | None) -> str | None:
    if value is not None and not (value.isdigit() and len(value) == 4 and 1982 <= int(value) <= 2100):
        raise ValueError("Year must be four digits, from 1982.")
    return value


def _check_url(value: str | None) -> str | None:
    if value and not value.startswith(("https://", "http://")):
        raise ValueError("The source link must start with https:// or http://")
    return value or None


class MilestoneIn(BaseModel):
    year: str
    title_en: Text = Field(max_length=200)
    title_ta: Text = Field(max_length=200)
    description_en: Text = Field(max_length=2000)
    description_ta: Text = Field(max_length=2000)
    source_url: str | None = Field(default=None, max_length=500)
    source_label_en: str | None = Field(default=None, max_length=200)
    source_label_ta: str | None = Field(default=None, max_length=200)
    position: int = 0
    status: Status = Status.draft

    _year = field_validator("year")(_check_year)
    _url = field_validator("source_url")(_check_url)


class MilestoneUpdate(BaseModel):
    year: str | None = None
    title_en: Text | None = Field(default=None, max_length=200)
    title_ta: Text | None = Field(default=None, max_length=200)
    description_en: Text | None = Field(default=None, max_length=2000)
    description_ta: Text | None = Field(default=None, max_length=2000)
    source_url: str | None = Field(default=None, max_length=500)
    source_label_en: str | None = Field(default=None, max_length=200)
    source_label_ta: str | None = Field(default=None, max_length=200)
    position: int | None = None
    status: Status | None = None

    _year = field_validator("year")(_check_year)
    _url = field_validator("source_url")(_check_url)


class MilestoneOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    year: str
    title_en: str
    title_ta: str
    description_en: str
    description_ta: str
    source_url: str | None
    source_label_en: str | None
    source_label_ta: str | None
    position: int
    status: Status
    updated_at: datetime


class AuditOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    at: datetime
    user_email: str
    action: str
    entity: str
    entity_id: int | None
    summary: str


# ---- Media (uploaded pictures) ---------------------------------------------------------------------------------------
class MediaVariant(BaseModel):
    width: int
    url: str


class MediaOut(BaseModel):
    id: int
    filename: str
    width: int
    height: int
    alt_en: str
    alt_ta: str
    caption_en: str | None
    caption_ta: str | None
    variants: list[MediaVariant]  # smallest first
    created_at: datetime


class MediaUpdate(BaseModel):
    alt_en: Text | None = Field(default=None, max_length=300)
    alt_ta: Text | None = Field(default=None, max_length=300)
    caption_en: str | None = Field(default=None, max_length=500)
    caption_ta: str | None = Field(default=None, max_length=500)
