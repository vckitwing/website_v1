"""Books and monthly issues: PDF in, page pictures out, and the PDF itself never reachable."""

import io
import json
from pathlib import Path

from PIL import Image

from app.db import SessionLocal
from app.models import Edition

from .test_api import TEST_STORAGE, auth, client, picture  # noqa: F401  (client is a fixture)

PUBLICATION = {
    "slug": "test-book",
    "kind": "book",
    "title_en": "Test Book",
    "title_ta": "சோதனை நூல்",
    "description_en": "A book for tests.",
    "description_ta": "சோதனைக்கான நூல்.",
}


def make_pdf(pages=3, size=(600, 800)) -> bytes:
    """A real, image-only PDF with `pages` coloured pages."""
    images = [Image.new("RGB", size, ((40 * i) % 255, 90, 160)) for i in range(pages)]
    buffer = io.BytesIO()
    images[0].save(buffer, format="PDF", save_all=True, append_images=images[1:])
    return buffer.getvalue()


def new_publication(client, headers, **extra):
    r = client.post("/api/publications", json={**PUBLICATION, **extra}, headers=headers)
    assert r.status_code == 201, r.text
    return r.json()


def upload_edition(client, headers, publication_id, data, label="Issue 1", **fields):
    return client.post(
        f"/api/publications/{publication_id}/editions",
        headers=headers,
        files={"file": ("book.pdf", data, "application/pdf")},
        data={"label": label, **fields},
    )


def edition_key(edition) -> str:
    return edition["cover_url"].split("/publications/")[1].split("/")[0]


def test_publication_permissions_and_validation(client):
    ed, co = auth(client, "ed@x.org"), auth(client, "co@x.org")
    assert client.get("/api/publications").status_code == 401
    assert client.post("/api/publications", json=PUBLICATION, headers=co).status_code == 403
    new_publication(client, ed)
    assert client.post("/api/publications", json=PUBLICATION, headers=ed).status_code == 409  # same slug
    assert client.post("/api/publications", json={**PUBLICATION, "slug": "Bad Slug!"}, headers=ed).status_code == 422
    assert client.post("/api/publications", json={**PUBLICATION, "slug": "other", "title_ta": " "}, headers=ed).status_code == 422
    assert client.post("/api/publications", json={**PUBLICATION, "slug": "other", "kind": "newspaper"}, headers=ed).status_code == 422


def test_pdf_becomes_page_pictures_and_source_stays_private(client):
    ed, co = auth(client, "ed@x.org"), auth(client, "co@x.org")
    publication = new_publication(client, ed)
    r = upload_edition(client, co, publication["id"], make_pdf(7), year="2026", month="11", issue_number="1")  # a contributor may upload
    assert r.status_code == 201, r.text
    listed = client.get("/api/publications", headers=ed).json()[0]["editions"][0]
    assert listed["state"] == "ready" and listed["processed_pages"] == 7 and listed["page_count"] == 7
    assert listed["status"] == "draft" and listed["page_width_px"] == 1100 and listed["page_height_px"] == 1467
    key = edition_key(listed)
    folder = Path(TEST_STORAGE) / "publications" / key
    assert sorted(p.name for p in folder.iterdir()) == ["cover.webp"] + [f"p{n:03d}.webp" for n in range(1, 8)]
    assert (Path(TEST_STORAGE) / "_private" / "publications" / key / "source.pdf").read_bytes().startswith(b"%PDF")
    page = client.get(f"/media/publications/{key}/p003.webp")
    assert page.status_code == 200 and page.headers["content-type"] == "image/webp"
    with Image.open(io.BytesIO(page.content)) as picture_:
        assert picture_.size == (1100, 1467)
    with Image.open(folder / "cover.webp") as cover:
        assert cover.width == 600


def test_watermark_changes_the_page_and_can_be_switched_off(client):
    ed = auth(client, "ed@x.org")
    publication = new_publication(client, ed)
    plain = upload_edition(client, ed, publication["id"], make_pdf(1), label="plain", watermark="false").json()
    marked = upload_edition(client, ed, publication["id"], make_pdf(1), label="marked", watermark="true").json()
    listed = {e["label"]: e for e in client.get("/api/publications", headers=ed).json()[0]["editions"]}
    a = (Path(TEST_STORAGE) / "publications" / edition_key(listed["plain"]) / "p001.webp").read_bytes()
    b = (Path(TEST_STORAGE) / "publications" / edition_key(listed["marked"]) / "p001.webp").read_bytes()
    assert a != b and plain["watermark"] is False and marked["watermark"] is True


def test_private_and_staging_files_are_never_served(client):
    ed = auth(client, "ed@x.org")
    publication = new_publication(client, ed)
    upload_edition(client, ed, publication["id"], make_pdf(2))
    key = edition_key(client.get("/api/publications", headers=ed).json()[0]["editions"][0])
    staging = Path(TEST_STORAGE) / "Books" / "secret"
    staging.mkdir(parents=True, exist_ok=True)
    (staging / "draft.pdf").write_bytes(make_pdf(1))
    for url in [
        f"/media/_private/publications/{key}/source.pdf",
        f"/media/publications/{key}/source.pdf",
        "/media/Books/secret/draft.pdf",
        "/media/books/secret/draft.pdf",
        "/media/images/../_private/anything",
        "/media/..%2f_private%2fsomething",
        "/media/_private",
    ]:
        assert client.get(url).status_code in (404, 400), url
    assert client.get("/media/content.json").status_code == 200  # the one public file is reachable


def test_bad_pdf_uploads_are_refused(client, monkeypatch):
    from app.config import get_settings

    ed = auth(client, "ed@x.org")
    pid = new_publication(client, ed)["id"]
    assert upload_edition(client, ed, pid, b"just some text").status_code == 415
    assert upload_edition(client, ed, pid, picture(100, 100, "PNG")).status_code == 415  # a picture renamed .pdf
    assert upload_edition(client, ed, pid, b"%PDF-1.4\nthis is not really a pdf").status_code == 415
    monkeypatch.setattr(get_settings(), "max_pdf_pages", 3)
    assert upload_edition(client, ed, pid, make_pdf(5)).status_code == 415
    monkeypatch.setattr(get_settings(), "max_pdf_pages", 800)
    monkeypatch.setattr(get_settings(), "max_pdf_bytes", 1000)
    assert upload_edition(client, ed, pid, make_pdf(3)).status_code == 413
    monkeypatch.setattr(get_settings(), "max_pdf_bytes", 80 * 1024 * 1024)
    assert upload_edition(client, ed, pid, make_pdf(1), label="  ").status_code == 422
    assert upload_edition(client, ed, pid, make_pdf(1), month="13").status_code == 422
    assert upload_edition(client, ed, 9999, make_pdf(1)).status_code == 404
    assert client.get("/api/publications", headers=ed).json()[0]["editions"] == []
    stored = Path(TEST_STORAGE)
    assert not (stored / "publications").exists() or not list((stored / "publications").iterdir())
    assert not (stored / "_private").exists() or not list((stored / "_private").rglob("*.pdf"))


def test_publishing_rules_and_public_content(client):
    ed, co = auth(client, "ed@x.org"), auth(client, "co@x.org")
    publication = new_publication(client, ed, kind="monthly", slug="magazine")
    upload_edition(client, co, publication["id"], make_pdf(4), label="Issue 2", year="2026", month="11", issue_number="2")
    upload_edition(client, co, publication["id"], make_pdf(3), label="Issue 1", year="2026", month="10", issue_number="1")
    editions = {e["label"]: e for e in client.get("/api/publications", headers=ed).json()[0]["editions"]}
    assert list(editions) == ["Issue 2", "Issue 1"]  # newest first
    assert client.get("/api/public/content").json()["publications"] == []  # nothing public while everything is a draft
    assert client.patch(f"/api/publications/editions/{editions['Issue 2']['id']}", json={"status": "published"}, headers=co).status_code == 403
    assert client.patch(f"/api/publications/{publication['id']}", json={"status": "published"}, headers=co).status_code == 403
    client.patch(f"/api/publications/{publication['id']}", json={"status": "published"}, headers=ed)
    assert client.get("/api/public/content").json()["publications"] == []  # published, but no published edition yet
    client.patch(f"/api/publications/editions/{editions['Issue 2']['id']}", json={"status": "published"}, headers=ed)
    client.patch(f"/api/publications/editions/{editions['Issue 1']['id']}", json={"status": "published"}, headers=ed)
    public = client.get("/api/public/content").json()["publications"]
    assert len(public) == 1 and public[0]["slug"] == "magazine" and public[0]["kind"] == "monthly"
    assert public[0]["title"] == {"en": "Test Book", "ta": "சோதனை நூல்"}
    assert [e["label"] for e in public[0]["editions"]] == ["Issue 2", "Issue 1"]
    first = public[0]["editions"][0]
    assert first["pages"] == 4 and first["year"] == 2026 and first["month"] == 11 and first["width"] == 1100
    assert first["cover"].endswith("/cover.webp") and first["pagesBase"].endswith(f"/publications/{first['id']}/")
    assert "source" not in json.dumps(public) and ".pdf" not in json.dumps(public)  # the PDF is never advertised
    assert client.get(first["pagesBase"].replace("http://localhost:8000", "") + "p001.webp").status_code == 200
    stored = json.loads((Path(TEST_STORAGE) / "content.json").read_text(encoding="utf-8"))
    assert stored["publications"] == public  # the static file matches
    client.patch(f"/api/publications/editions/{editions['Issue 2']['id']}", json={"status": "draft"}, headers=ed)
    assert [e["label"] for e in client.get("/api/public/content").json()["publications"][0]["editions"]] == ["Issue 1"]


def test_cannot_publish_an_edition_that_is_not_ready(client):
    ed = auth(client, "ed@x.org")
    publication = new_publication(client, ed)
    upload_edition(client, ed, publication["id"], make_pdf(1))
    with SessionLocal() as db:
        edition = db.query(Edition).first()
        edition.state = "processing"
        db.commit()
        edition_id = edition.id
    assert client.patch(f"/api/publications/editions/{edition_id}", json={"status": "published"}, headers=ed).status_code == 409


def test_failed_edition_can_be_retried_and_keeps_finished_pages(client):
    ed, co = auth(client, "ed@x.org"), auth(client, "co@x.org")
    publication = new_publication(client, ed)
    upload_edition(client, ed, publication["id"], make_pdf(6))
    edition = client.get("/api/publications", headers=ed).json()[0]["editions"][0]
    folder = Path(TEST_STORAGE) / "publications" / edition_key(edition)
    for name in ("p004.webp", "p005.webp", "p006.webp", "cover.webp"):  # simulate a crash half-way
        (folder / name).unlink()
    kept = (folder / "p001.webp").stat().st_mtime_ns
    with SessionLocal() as db:
        row = db.get(Edition, edition["id"])
        row.state, row.processed_pages, row.error = "failed", 3, "Interrupted"
        db.commit()
    assert client.post(f"/api/publications/editions/{edition['id']}/retry", headers=co).status_code == 403
    assert client.post(f"/api/publications/editions/{edition['id']}/retry", headers=ed).status_code == 200
    after = client.get("/api/publications", headers=ed).json()[0]["editions"][0]
    assert after["state"] == "ready" and after["processed_pages"] == 6 and after["error"] is None
    assert len(list(folder.iterdir())) == 7  # six pages and the cover are back
    assert (folder / "p001.webp").stat().st_mtime_ns == kept  # finished pages were not redone
    assert client.post(f"/api/publications/editions/{edition['id']}/retry", headers=ed).status_code == 409


def test_interrupted_work_is_marked_failed_on_start(client):
    from app.jobs import mark_interrupted_as_failed

    ed = auth(client, "ed@x.org")
    publication = new_publication(client, ed)
    upload_edition(client, ed, publication["id"], make_pdf(1))
    with SessionLocal() as db:
        db.query(Edition).update({"state": "processing"})
        db.commit()
    mark_interrupted_as_failed()
    edition = client.get("/api/publications", headers=ed).json()[0]["editions"][0]
    assert edition["state"] == "failed" and "Retry" in edition["error"]


def test_deleting_removes_files_and_public_listing(client):
    ed, co = auth(client, "ed@x.org"), auth(client, "co@x.org")
    publication = new_publication(client, ed)
    upload_edition(client, ed, publication["id"], make_pdf(2), label="A")
    upload_edition(client, ed, publication["id"], make_pdf(2), label="B")
    editions = client.get("/api/publications", headers=ed).json()[0]["editions"]
    keys = [edition_key(e) for e in editions]
    assert client.delete(f"/api/publications/editions/{editions[0]['id']}", headers=co).status_code == 403
    assert client.delete(f"/api/publications/editions/{editions[0]['id']}", headers=ed).status_code == 204
    assert not (Path(TEST_STORAGE) / "publications" / keys[0]).exists()
    assert not (Path(TEST_STORAGE) / "_private" / "publications" / keys[0]).exists()
    assert (Path(TEST_STORAGE) / "publications" / keys[1]).exists()
    assert client.delete(f"/api/publications/{publication['id']}", headers=ed).status_code == 204
    assert not (Path(TEST_STORAGE) / "publications" / keys[1]).exists()
    assert client.get("/api/publications", headers=ed).json() == []


def test_many_writers_of_one_file_all_succeed(client):
    """Two jobs finishing together both refresh content.json; on Windows this used to fail with 'access denied'."""
    from concurrent.futures import ThreadPoolExecutor

    from app.storage import get_storage

    storage = get_storage()
    payloads = [json.dumps({"n": i}).encode() for i in range(60)]
    with ThreadPoolExecutor(16) as pool:
        list(pool.map(lambda data: storage.put("concurrent.json", data, "application/json"), payloads))
    assert json.loads(storage.read("concurrent.json"))["n"] in range(60)  # whole and valid, never half-written
    assert not list(Path(TEST_STORAGE).glob("*.tmp"))  # no temp files left behind
    storage.delete("concurrent.json")


def test_failing_to_refresh_content_json_does_not_fail_the_edition(client, monkeypatch):
    import app.jobs

    def boom(db):
        raise OSError("the storage hiccuped")

    monkeypatch.setattr(app.jobs, "publish_snapshot", boom)
    ed = auth(client, "ed@x.org")
    publication = new_publication(client, ed)
    upload_edition(client, ed, publication["id"], make_pdf(2))
    edition = client.get("/api/publications", headers=ed).json()[0]["editions"][0]
    assert edition["state"] == "ready" and edition["processed_pages"] == 2 and edition["error"] is None


def test_import_books_from_the_storage_folder(client):
    from app.import_books import describe_file, import_books

    assert describe_file("2026-11_issue101", "monthly") == {"label": "Issue 101", "year": 2026, "month": 11, "issue_number": 101}
    assert describe_file("2026-03", "monthly")["label"] == "March 2026"
    assert describe_file("anything", "monthly") == {"label": "anything", "year": None, "month": None, "issue_number": None}

    books = Path(TEST_STORAGE) / "Books"
    for folder, name, pages in [("amaipai_thiralvom", "book.pdf", 2), ("thamizhman", "2026-10_issue1.pdf", 3), ("thamizhman", "2026-11_issue2.pdf", 4)]:
        (books / folder).mkdir(parents=True, exist_ok=True)
        (books / folder / name).write_bytes(make_pdf(pages))
    (books / "thamizhman" / "broken.pdf").write_bytes(b"not a pdf at all")

    report = import_books(publish=True)
    assert any("skipped" in line for line in report)
    public = {p["slug"]: p for p in client.get("/api/public/content").json()["publications"]}
    assert set(public) == {"amaipai-thiralvom", "namathu-thamizhman"}
    assert [e["label"] for e in public["namathu-thamizhman"]["editions"]] == ["Issue 2", "Issue 1"]
    assert public["amaipai-thiralvom"]["editions"][0]["pages"] == 2

    again = import_books(publish=True)  # safe to run again: nothing is duplicated
    after = {p["slug"]: p for p in client.get("/api/public/content").json()["publications"]}
    assert len(after["namathu-thamizhman"]["editions"]) == 2 and len(after["amaipai-thiralvom"]["editions"]) == 1
    assert len([line for line in again if "ready" in line]) == 3


def test_import_does_not_duplicate_a_renamed_issue(client):
    from app.import_books import import_books

    folder = Path(TEST_STORAGE) / "Books" / "thamizhman"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "sample.pdf").write_bytes(make_pdf(3))
    import_books(publish=True)
    ed = auth(client, "ed@x.org")
    edition = client.get("/api/publications", headers=ed).json()[0]["editions"][0]
    client.patch(f"/api/publications/editions/{edition['id']}", json={"label": "Issue 100", "year": 2015, "month": 2}, headers=ed)
    import_books(publish=True)
    editions = client.get("/api/publications", headers=ed).json()[0]["editions"]
    assert [e["label"] for e in editions] == ["Issue 100"]
