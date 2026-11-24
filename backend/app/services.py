import json
import os
import tempfile
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import get_settings
from .models import AuditLog, Conference, HistoryMilestone, Status, User


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


def publish_snapshot(db: Session) -> None:
    """Rewrites `<publish_dir>/content.json` so the public site can read static JSON (no API needed to view the site)."""
    directory = get_settings().publish_dir
    if not directory:
        return
    target = Path(directory)
    target.mkdir(parents=True, exist_ok=True)
    data = json.dumps(build_snapshot(db), ensure_ascii=False, indent=2)
    # write to a temp file first so a visitor never reads a half-written file
    fd, temp = tempfile.mkstemp(dir=target, suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as handle:
        handle.write(data)
    os.replace(temp, target / "content.json")
