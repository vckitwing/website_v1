"""Picture uploads.

Anyone signed in can upload (a contributor's picture is harmless until an editor uses it in published content).
Editing a picture's text and deleting it are for editors and super admins.
"""

import uuid
from pathlib import PurePath
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select

from ..config import get_settings
from ..deps import DB, CurrentUser, Editor
from ..images import ImageRejected, process_image
from ..models import MediaAsset
from ..schemas import MediaOut, MediaUpdate, MediaVariant
from ..services import record
from ..storage import get_storage

router = APIRouter()


def _prefix(asset_key: str) -> str:
    return f"images/{asset_key}"


def to_out(asset: MediaAsset) -> MediaOut:
    storage = get_storage()
    widths = sorted(int(w) for w in asset.widths.split(","))
    return MediaOut(
        id=asset.id,
        filename=asset.filename,
        width=asset.width,
        height=asset.height,
        alt_en=asset.alt_en,
        alt_ta=asset.alt_ta,
        caption_en=asset.caption_en,
        caption_ta=asset.caption_ta,
        variants=[MediaVariant(width=w, url=storage.url(f"{_prefix(asset.key)}/{w}.webp")) for w in widths],
        created_at=asset.created_at,
    )


def _required(value: str, label: str) -> str:
    value = value.strip()
    if not value:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, f"{label} is required (describe the picture for screen readers).")
    if len(value) > 300:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, f"{label} is too long (300 characters at most).")
    return value


@router.get("", response_model=list[MediaOut])
def list_media(db: DB, user: CurrentUser):
    return [to_out(a) for a in db.scalars(select(MediaAsset).order_by(MediaAsset.id.desc())).all()]


@router.post("", response_model=MediaOut, status_code=status.HTTP_201_CREATED)
def upload(
    db: DB,
    user: CurrentUser,
    file: Annotated[UploadFile, File()],
    alt_en: Annotated[str, Form()],
    alt_ta: Annotated[str, Form()],
    caption_en: Annotated[str | None, Form()] = None,
    caption_ta: Annotated[str | None, Form()] = None,
):
    settings = get_settings()
    alt_en, alt_ta = _required(alt_en, "Description (English)"), _required(alt_ta, "Description (தமிழ்)")
    data = file.file.read(settings.max_upload_bytes + 1)
    if len(data) > settings.max_upload_bytes:
        raise HTTPException(status.HTTP_413_CONTENT_TOO_LARGE, f"The file is larger than {settings.max_upload_bytes // (1024 * 1024)} MB.")
    try:
        processed = process_image(data, settings.max_image_pixels)
    except ImageRejected as error:
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, str(error)) from None

    storage = get_storage()
    key = uuid.uuid4().hex
    try:
        for width, webp in processed.variants.items():
            storage.put(f"{_prefix(key)}/{width}.webp", webp, "image/webp")
        asset = MediaAsset(
            key=key,
            filename=PurePath(file.filename or "picture").name[:255] or "picture",
            width=processed.width,
            height=processed.height,
            widths=",".join(str(w) for w in sorted(processed.variants)),
            alt_en=alt_en,
            alt_ta=alt_ta,
            caption_en=(caption_en or "").strip() or None,
            caption_ta=(caption_ta or "").strip() or None,
            created_by=user.id,
        )
        db.add(asset)
        db.flush()
        record(db, user, "create", "media", asset.id, f"Uploaded picture “{asset.filename}” ({asset.width}x{asset.height})")
        db.commit()
    except Exception:
        db.rollback()
        storage.delete_prefix(_prefix(key))  # do not leave files nobody knows about
        raise
    return to_out(asset)


@router.patch("/{media_id}", response_model=MediaOut)
def update_media(media_id: int, payload: MediaUpdate, db: DB, user: Editor):
    asset = db.get(MediaAsset, media_id)
    if asset is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(asset, field, (value.strip() or None) if field.startswith("caption") and isinstance(value, str) else value)
    record(db, user, "update", "media", asset.id, f"Updated picture “{asset.filename}”")
    db.commit()
    return to_out(asset)


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(media_id: int, db: DB, user: Editor):
    asset = db.get(MediaAsset, media_id)
    if asset is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
    label = asset.filename
    key = asset.key
    db.delete(asset)
    record(db, user, "delete", "media", media_id, f"Deleted picture “{label}”")
    db.commit()
    get_storage().delete_prefix(_prefix(key))
