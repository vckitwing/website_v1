import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import AuditLog, Conference, Edition, HistoryMilestone, Publication, Status, User
from .storage import get_storage

CONTENT_KEY = "content.json"


def record(db: Session, user: User, action: str, entity: str, entity_id: int | None, summary: str) -> None:
    db.add(AuditLog(user_id=user.id, user_email=user.email, action=action, entity=entity, entity_id=entity_id, summary=summary[:500]))


def build_snapshot(db: Session) -> dict:
    """The published content, in the same shape the website's own data files use (`{ en, ta }` pairs)."""
    published = Status.published.value
    conferences = db.scalars(
        select(Conference).where(Conference.status == published).order_by(Conference.year, Conference.position, Conference.id)
    ).all()
    milestones = db.scalars(
        select(HistoryMilestone).where(HistoryMilestone.status == published).order_by(HistoryMilestone.year, HistoryMilestone.position, HistoryMilestone.id)
    ).all()
    return {
        "publications": _publications(db),
        "conferences": [{"year": c.year, "name": {"en": c.name_en, "ta": c.name_ta}} for c in conferences],
        "history": [
            {
                "year": m.year,
                "title": {"en": m.title_en, "ta": m.title_ta},
                "description": {"en": m.description_en, "ta": m.description_ta},
                "source": {"url": m.source_url, "label": {"en": m.source_label_en or "", "ta": m.source_label_ta or ""}} if m.source_url else None,
            }
            for m in milestones
        ],
    }


def _publications(db: Session) -> list[dict]:
    """Published publications with their published, ready editions (newest first). Only picture addresses, never the PDF."""
    storage = get_storage()
    result = []
    for p in db.scalars(select(Publication).where(Publication.status == Status.published.value).order_by(Publication.id)).all():
        editions = db.scalars(
            select(Edition)
            .where(Edition.publication_id == p.id, Edition.status == Status.published.value, Edition.state == "ready")
            .order_by(Edition.year.desc().nulls_last(), Edition.month.desc().nulls_last(), Edition.id.desc())
        ).all()
        if not editions:
            continue
        result.append(
            {
                "slug": p.slug,
                "kind": p.kind,
                "title": {"en": p.title_en, "ta": p.title_ta},
                "description": {"en": p.description_en, "ta": p.description_ta},
                "author": {"en": p.author_en or "", "ta": p.author_ta or ""} if (p.author_en or p.author_ta) else None,
                "editions": [
                    {
                        "id": e.key,
                        "label": e.label,
                        "volume": e.volume,
                        "issue": e.issue_number,
                        "year": e.year,
                        "month": e.month,
                        "pages": e.page_count,
                        "width": e.page_width_px,
                        "height": e.page_height_px,
                        "cover": storage.url(f"publications/{e.key}/cover.webp"),
                        # page n is  pagesBase + "p" + n padded to 3 digits + ".webp"
                        "pagesBase": storage.url(f"publications/{e.key}/"),
                    }
                    for e in editions
                ],
            }
        )
    return result


def publish_snapshot(db: Session) -> None:
    """Writes the published content as `content.json` into object storage, where the public site reads it.

    (Locally that is Object_Storage_Data/content.json, served at /media/content.json; in production, the R2 media bucket.)
    """
    data = json.dumps(build_snapshot(db), ensure_ascii=False, indent=2).encode("utf-8")
    get_storage().put(CONTENT_KEY, data, "application/json")
