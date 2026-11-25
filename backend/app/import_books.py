"""Brings the PDFs in the storage folder's `Books/` directory into the website, the same way an upload in the admin does.

    python -m app.cli import-books              import (as drafts)
    python -m app.cli import-books --publish    import and publish

    Books/amaipai_thiralvom/*.pdf   the book "Amaipai Thiralvom"
    Books/thamizhman/*.pdf          issues of the monthly "Namathu Thamizhman"; name a file like
                                    2026-11_issue101.pdf to give the issue its month, year and number

A file that is already there (same label, or the very same file) is skipped, so it is safe to run again after adding
new issues, even if you have renamed an issue in the admin.
"""

import re
import uuid
from pathlib import Path

from sqlalchemy import select

from .db import SessionLocal, init_db
from .jobs import process_edition, source_key
from .models import Edition, Publication, Status
from .pdfpages import PdfRejected, open_pdf
from .config import get_settings
from .services import publish_snapshot
from .storage import get_storage

MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

# What each folder holds. The texts are starting points: edit them in the admin.
SHELF = {
    "amaipai_thiralvom": {
        "slug": "amaipai-thiralvom",
        "kind": "book",
        "title_en": "Amaippai Thiralvom",
        "title_ta": "அமைப்பாய்த் திரள்வோம்",
        "description_en": "Ideology and practice.",
        "description_ta": "கருத்தியலும் நடைமுறையும்.",
        "author_en": "Thol. Thirumavalavan",
        "author_ta": "தொல். திருமாவளவன்",
    },
    "thamizhman": {
        "slug": "namathu-thamizhman",
        "kind": "monthly",
        "title_en": "Namathu Thamizhman",
        "title_ta": "நமது தமிழ்மண்",
        "description_en": "The monthly magazine of Viduthalai Chiruthaigal Katchi.",
        "description_ta": "விடுதலைச் சிறுத்தைகள் கட்சியின் மாத இதழ்.",
        "author_en": None,
        "author_ta": None,
    },
}


def describe_file(stem: str, kind: str) -> dict:
    """Label, year, month and issue number, read from the file name where it says them."""
    if kind == "book":
        return {"label": "First edition", "year": None, "month": None, "issue_number": None}
    date = re.search(r"(?<!\d)(19\d\d|20\d\d)[-_ ](0[1-9]|1[0-2])(?!\d)", stem)
    number = re.search(r"issue[-_ ]?(\d+)", stem, re.IGNORECASE)
    year, month = (int(date.group(1)), int(date.group(2))) if date else (None, None)
    issue = int(number.group(1)) if number else None
    if issue:
        label = f"Issue {issue}"
    elif month:
        label = f"{MONTHS[month - 1]} {year}"
    else:
        label = stem[:120]
    return {"label": label, "year": year, "month": month, "issue_number": issue}


def _same_file(storage, edition_key: str, data: bytes) -> bool:
    key = source_key(edition_key)
    return storage.exists(key) and storage.read(key) == data


def import_books(publish: bool = False, books_dir: Path | None = None) -> list[str]:
    """Returns one line of text per file saying what happened."""
    init_db()
    settings = get_settings()
    storage = get_storage()
    root = books_dir or storage.root / "Books"
    report: list[str] = []
    with SessionLocal() as db:
        for folder, details in SHELF.items():
            files = sorted((root / folder).glob("*.pdf")) if (root / folder).is_dir() else []
            if not files:
                report.append(f"{folder}: no PDF found")
                continue
            publication = db.scalar(select(Publication).where(Publication.slug == details["slug"]))
            if publication is None:
                publication = Publication(**details, status=Status.draft.value)
                db.add(publication)
                db.commit()
            for pdf in files:
                info = describe_file(pdf.stem, publication.kind)
                data = pdf.read_bytes()
                # already imported if the label matches, or (after someone renamed the issue) if it is the very same file
                known = db.scalars(select(Edition).where(Edition.publication_id == publication.id)).all()
                existing = next((e for e in known if e.label == info["label"] or _same_file(storage, e.key, data)), None)
                if existing is None:
                    try:
                        document = open_pdf(data, settings.max_pdf_pages)
                        pages = len(document)
                        document.close()
                    except PdfRejected as error:
                        report.append(f"{folder}/{pdf.name}: skipped, {error}")
                        continue
                    key = uuid.uuid4().hex
                    storage.put(source_key(key), data, "application/pdf")
                    existing = Edition(publication_id=publication.id, key=key, page_count=pages, state="processing", **info)
                    db.add(existing)
                    db.commit()
                    print(f"  making page pictures for {folder}/{pdf.name} ({pages} pages)...", flush=True)
                    process_edition(existing.id)
                elif existing.state == "failed":
                    existing.state = "processing"
                    db.commit()
                    process_edition(existing.id)
                db.refresh(existing)
                if publish and existing.state == "ready":
                    existing.status = Status.published.value
                    publication.status = Status.published.value
                    db.commit()
                report.append(f"{folder}/{pdf.name}: “{existing.label}” {existing.state}, {existing.status}, {existing.page_count} pages")
        publish_snapshot(db)
    return report
