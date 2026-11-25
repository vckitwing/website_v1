"""Books and monthly publications (editions are PDFs turned into page pictures).

Anyone signed in can upload an edition (it starts as a draft); creating or changing a publication, publishing,
retrying and deleting are for editors and super admins. Readers only ever receive page pictures, never the PDF.
"""

import uuid
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select

from ..config import get_settings
from ..deps import DB, CurrentUser, Editor
from ..jobs import cover_key, process_edition, source_key
from ..models import Edition, Publication, Status
from ..pdfpages import PdfRejected, open_pdf
from ..schemas_publications import EditionOut, EditionUpdate, PublicationIn, PublicationOut, PublicationUpdate
from ..services import publish_snapshot, record
from ..storage import PRIVATE_PREFIX, get_storage

router = APIRouter()


def _edition_out(edition: Edition) -> EditionOut:
    ready = edition.state == "ready"
    return EditionOut(
        id=edition.id,
        publication_id=edition.publication_id,
        label=edition.label,
        volume=edition.volume,
        issue_number=edition.issue_number,
        year=edition.year,
        month=edition.month,
        status=edition.status,
        state=edition.state,
        processed_pages=edition.processed_pages,
        page_count=edition.page_count,
        page_width_px=edition.page_width_px,
        page_height_px=edition.page_height_px,
        watermark=edition.watermark,
        error=edition.error,
        cover_url=get_storage().url(cover_key(edition.key)) if ready else None,
        created_at=edition.created_at,
    )


def _out(db, publication: Publication) -> PublicationOut:
    editions = db.scalars(
        select(Edition).where(Edition.publication_id == publication.id).order_by(Edition.year.desc().nulls_last(), Edition.month.desc().nulls_last(), Edition.id.desc())
    ).all()
    return PublicationOut(
        id=publication.id,
        slug=publication.slug,
        kind=publication.kind,
        title_en=publication.title_en,
        title_ta=publication.title_ta,
        description_en=publication.description_en,
        description_ta=publication.description_ta,
        author_en=publication.author_en,
        author_ta=publication.author_ta,
        status=publication.status,
        editions=[_edition_out(e) for e in editions],
        updated_at=publication.updated_at,
    )


def _get_publication(db, publication_id: int) -> Publication:
    publication = db.get(Publication, publication_id)
    if publication is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
    return publication


def _get_edition(db, edition_id: int) -> Edition:
    edition = db.get(Edition, edition_id)
    if edition is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
    return edition


def _delete_files(edition_key: str) -> None:
    storage = get_storage()
    storage.delete_prefix(f"publications/{edition_key}")
    storage.delete_prefix(f"{PRIVATE_PREFIX}/publications/{edition_key}")


@router.get("", response_model=list[PublicationOut])
def list_publications(db: DB, user: CurrentUser):
    return [_out(db, p) for p in db.scalars(select(Publication).order_by(Publication.id)).all()]


@router.post("", response_model=PublicationOut, status_code=status.HTTP_201_CREATED)
def create_publication(payload: PublicationIn, db: DB, user: Editor):
    if db.scalar(select(Publication).where(Publication.slug == payload.slug)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Another publication already uses this web address name.")
    publication = Publication(**{**payload.model_dump(mode="json"), "created_by": user.id})
    db.add(publication)
    db.flush()
    record(db, user, "create", "publication", publication.id, f"Created publication “{publication.title_en}” ({publication.kind})")
    db.commit()
    publish_snapshot(db)
    return _out(db, publication)


@router.patch("/{publication_id}", response_model=PublicationOut)
def update_publication(publication_id: int, payload: PublicationUpdate, db: DB, user: Editor):
    publication = _get_publication(db, publication_id)
    changes = payload.model_dump(mode="json", exclude_unset=True)
    if "slug" in changes and changes["slug"] != publication.slug and db.scalar(select(Publication).where(Publication.slug == changes["slug"])):
        raise HTTPException(status.HTTP_409_CONFLICT, "Another publication already uses this web address name.")
    for key, value in changes.items():
        setattr(publication, key, value)
    record(db, user, "update", "publication", publication.id, f"Updated publication “{publication.title_en}”")
    db.commit()
    publish_snapshot(db)
    return _out(db, publication)


@router.delete("/{publication_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_publication(publication_id: int, db: DB, user: Editor):
    publication = _get_publication(db, publication_id)
    label = publication.title_en
    keys = [e.key for e in db.scalars(select(Edition).where(Edition.publication_id == publication.id)).all()]
    for edition in db.scalars(select(Edition).where(Edition.publication_id == publication.id)).all():
        db.delete(edition)
    db.delete(publication)
    record(db, user, "delete", "publication", publication_id, f"Deleted publication “{label}” and its {len(keys)} edition(s)")
    db.commit()
    for key in keys:
        _delete_files(key)
    publish_snapshot(db)


@router.post("/{publication_id}/editions", response_model=EditionOut, status_code=status.HTTP_201_CREATED)
def upload_edition(
    publication_id: int,
    background: BackgroundTasks,
    db: DB,
    user: CurrentUser,
    file: Annotated[UploadFile, File()],
    label: Annotated[str, Form()],
    volume: Annotated[int | None, Form(ge=1, le=9999)] = None,
    issue_number: Annotated[int | None, Form(ge=1, le=99999)] = None,
    year: Annotated[int | None, Form(ge=1900, le=2100)] = None,
    month: Annotated[int | None, Form(ge=1, le=12)] = None,
    watermark: Annotated[bool, Form()] = True,
):
    settings = get_settings()
    publication = _get_publication(db, publication_id)
    label = label.strip()
    if not label or len(label) > 120:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "Give the edition a short label, such as “Issue 100” or “First edition”.")
    data = file.file.read(settings.max_pdf_bytes + 1)
    if len(data) > settings.max_pdf_bytes:
        raise HTTPException(status.HTTP_413_CONTENT_TOO_LARGE, f"The file is larger than {settings.max_pdf_bytes // (1024 * 1024)} MB.")
    try:
        document = open_pdf(data, settings.max_pdf_pages)  # checks it really is a PDF and not too long
        pages = len(document)
        document.close()
    except PdfRejected as error:
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, str(error)) from None

    key = uuid.uuid4().hex
    storage = get_storage()
    try:
        storage.put(source_key(key), data, "application/pdf")  # private: never served
        edition = Edition(
            publication_id=publication.id,
            key=key,
            label=label,
            volume=volume,
            issue_number=issue_number,
            year=year,
            month=month,
            watermark=watermark,
            page_count=pages,
            state="processing",
            created_by=user.id,
        )
        db.add(edition)
        db.flush()
        record(db, user, "create", "edition", edition.id, f"Uploaded “{publication.title_en}” – {label} ({pages} pages)")
        db.commit()
    except Exception:
        db.rollback()
        _delete_files(key)
        raise
    background.add_task(process_edition, edition.id)
    return _edition_out(edition)


@router.patch("/editions/{edition_id}", response_model=EditionOut)
def update_edition(edition_id: int, payload: EditionUpdate, db: DB, user: Editor):
    edition = _get_edition(db, edition_id)
    changes = payload.model_dump(mode="json", exclude_unset=True)
    if changes.get("status") == Status.published.value and edition.state != "ready":
        raise HTTPException(status.HTTP_409_CONFLICT, "This edition is not ready yet, so it cannot be published.")
    for key, value in changes.items():
        setattr(edition, key, value)
    record(db, user, "update", "edition", edition.id, f"Updated edition “{edition.label}” ({edition.status})")
    db.commit()
    publish_snapshot(db)
    return _edition_out(edition)


@router.post("/editions/{edition_id}/retry", response_model=EditionOut)
def retry_edition(edition_id: int, background: BackgroundTasks, db: DB, user: Editor):
    edition = _get_edition(db, edition_id)
    if edition.state != "failed":
        raise HTTPException(status.HTTP_409_CONFLICT, "Only a failed edition can be retried.")
    edition.state = "processing"
    edition.error = None
    record(db, user, "update", "edition", edition.id, f"Retried processing of edition “{edition.label}”")
    db.commit()
    background.add_task(process_edition, edition.id)
    return _edition_out(edition)


@router.delete("/editions/{edition_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_edition(edition_id: int, db: DB, user: Editor):
    edition = _get_edition(db, edition_id)
    label, key = edition.label, edition.key
    db.delete(edition)
    record(db, user, "delete", "edition", edition_id, f"Deleted edition “{label}”")
    db.commit()
    _delete_files(key)
    publish_snapshot(db)
