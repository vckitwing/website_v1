"""Background work: turning an uploaded PDF into page pictures.

It runs in the API process after the upload request has been answered. The admin shows the progress
(`processed_pages` of `page_count`). If the server stops half-way, the edition is marked failed on the next start
and **Retry** continues where it stopped (pages already made are kept).
"""

import logging

from sqlalchemy import update

from .config import get_settings
from .db import SessionLocal
from .models import Edition
from .pdfpages import PdfRejected, apply_watermark, open_pdf, render_page, to_webp
from .services import publish_snapshot
from .storage import PRIVATE_PREFIX, get_storage

log = logging.getLogger("vck.jobs")


def source_key(edition_key: str) -> str:
    return f"{PRIVATE_PREFIX}/publications/{edition_key}/source.pdf"


def page_key(edition_key: str, number: int) -> str:
    return f"publications/{edition_key}/p{number:03d}.webp"


def cover_key(edition_key: str) -> str:
    return f"publications/{edition_key}/cover.webp"


def process_edition(edition_id: int) -> None:
    settings = get_settings()
    storage = get_storage()
    document = None
    with SessionLocal() as db:
        edition = db.get(Edition, edition_id)
        if edition is None:
            return
        try:
            document = open_pdf(storage.read(source_key(edition.key)), settings.max_pdf_pages)
            total = len(document)
            edition.page_count = total
            edition.state = "processing"
            edition.error = None
            edition.processed_pages = 0
            db.commit()
            for index in range(total):
                key = page_key(edition.key, index + 1)
                if not storage.exists(key):  # a retry keeps the pages that were already made
                    picture = render_page(document, index, settings.page_width_px)
                    if index == 0:
                        edition.page_width_px, edition.page_height_px = picture.size
                    if edition.watermark:
                        picture = apply_watermark(picture, settings.watermark_text)
                    storage.put(key, to_webp(picture), "image/webp")
                edition.processed_pages = index + 1
                if (index + 1) % 5 == 0 or index + 1 == total:
                    db.commit()
            if not edition.page_width_px:  # resumed after the first page was already stored
                first = render_page(document, 0, settings.page_width_px)
                edition.page_width_px, edition.page_height_px = first.size
            storage.put(cover_key(edition.key), to_webp(render_page(document, 0, settings.cover_width_px)), "image/webp")
            edition.state = "ready"
            db.commit()
            try:
                publish_snapshot(db)
            except Exception:  # the pictures are done; a hiccup refreshing content.json must not fail the edition
                log.exception("Edition %s is ready but content.json could not be refreshed", edition_id)
        except PdfRejected as error:
            db.rollback()
            _fail(db, edition_id, str(error))
        except Exception:
            log.exception("Processing edition %s failed", edition_id)
            db.rollback()
            _fail(db, edition_id, "Processing failed. Press Retry; if it keeps failing the PDF may be damaged.")
        finally:
            if document is not None:
                document.close()


def _fail(db, edition_id: int, message: str) -> None:
    edition = db.get(Edition, edition_id)
    if edition is not None:
        edition.state = "failed"
        edition.error = message[:300]
        db.commit()


def mark_interrupted_as_failed() -> None:
    """At start-up: anything still marked processing was cut off by a restart. (Run one API worker while this is so.)"""
    with SessionLocal() as db:
        db.execute(
            update(Edition).where(Edition.state == "processing").values(state="failed", error="Interrupted by a restart. Press Retry to continue.")
        )
        db.commit()
