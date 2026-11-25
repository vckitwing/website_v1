import os
import shutil
import tempfile

# The tests drop and recreate every table, so they must NEVER point at the real database.
# Default: a throwaway SQLite file. To test on PostgreSQL set TEST_DATABASE_URL to a separate database (e.g. .../vck_test).
os.environ["DATABASE_URL"] = os.environ.get("TEST_DATABASE_URL", "sqlite:///./test.db")
# Files go to a throwaway folder, never to the real Object_Storage_Data.
TEST_STORAGE = tempfile.mkdtemp(prefix="vck-test-storage-")
os.environ["STORAGE_DIR"] = TEST_STORAGE

import io  # noqa: E402
import json  # noqa: E402
from pathlib import Path  # noqa: E402

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.db import Base, SessionLocal, _engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Role, User  # noqa: E402
from app.security import hash_password, login_throttle  # noqa: E402
from PIL import Image  # noqa: E402

PASSWORD = "Str0ngPassword1"


@pytest.fixture()
def client():
    Base.metadata.drop_all(_engine)
    Base.metadata.create_all(_engine)
    for folder in ("images", "publications", "_private", "Books"):  # every test starts with empty storage
        shutil.rmtree(Path(TEST_STORAGE) / folder, ignore_errors=True)
    login_throttle._failures.clear()
    with SessionLocal() as db:
        for email, role in [("root@x.org", Role.super_admin), ("ed@x.org", Role.editor), ("co@x.org", Role.contributor)]:
            db.add(User(email=email, name=email, password_hash=hash_password(PASSWORD), role=role.value))
        db.commit()
    with TestClient(app) as c:
        yield c


def auth(client, email):
    r = client.post("/api/auth/login", json={"email": email, "password": PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


CONFERENCE = {"year": 2030, "name_en": "Test Conference", "name_ta": "சோதனை மாநாடு"}


def test_login_rejects_bad_password_and_throttles(client):
    for _ in range(5):
        assert client.post("/api/auth/login", json={"email": "ed@x.org", "password": "wrong"}).status_code == 401
    assert client.post("/api/auth/login", json={"email": "ed@x.org", "password": PASSWORD}).status_code == 429


def test_requires_sign_in(client):
    assert client.get("/api/conferences").status_code == 401
    assert client.post("/api/conferences", json=CONFERENCE).status_code == 401


def test_public_content_has_only_published(client):
    ed = auth(client, "ed@x.org")
    client.post("/api/conferences", json={**CONFERENCE, "status": "published"}, headers=ed)
    client.post("/api/conferences", json={**CONFERENCE, "name_en": "Draft one"}, headers=ed)
    data = client.get("/api/public/content").json()
    assert [c["name"]["en"] for c in data["conferences"]] == ["Test Conference"]
    assert data["conferences"][0]["name"]["ta"] == "சோதனை மாநாடு"
    snapshot = json.loads((Path(TEST_STORAGE) / "content.json").read_text(encoding="utf-8"))
    assert snapshot == data


def test_contributor_can_draft_but_not_publish(client):
    co = auth(client, "co@x.org")
    assert client.post("/api/conferences", json={**CONFERENCE, "status": "published"}, headers=co).status_code == 403
    created = client.post("/api/conferences", json=CONFERENCE, headers=co)
    assert created.status_code == 201 and created.json()["status"] == "draft"
    item_id = created.json()["id"]
    assert client.patch(f"/api/conferences/{item_id}", json={"status": "published"}, headers=co).status_code == 403
    assert client.patch(f"/api/conferences/{item_id}", json={"name_en": "Edited"}, headers=co).status_code == 200


def test_contributor_cannot_touch_published(client):
    ed, co = auth(client, "ed@x.org"), auth(client, "co@x.org")
    item_id = client.post("/api/conferences", json={**CONFERENCE, "status": "published"}, headers=ed).json()["id"]
    assert client.patch(f"/api/conferences/{item_id}", json={"name_en": "Hijack"}, headers=co).status_code == 403
    assert client.delete(f"/api/conferences/{item_id}", headers=co).status_code == 403
    assert client.delete(f"/api/conferences/{item_id}", headers=ed).status_code == 204


def test_editor_publishes_contributors_draft(client):
    ed, co = auth(client, "ed@x.org"), auth(client, "co@x.org")
    item_id = client.post("/api/conferences", json=CONFERENCE, headers=co).json()["id"]
    assert client.patch(f"/api/conferences/{item_id}", json={"status": "published"}, headers=ed).status_code == 200
    assert len(client.get("/api/public/content").json()["conferences"]) == 1


def test_both_languages_required_and_validated(client):
    ed = auth(client, "ed@x.org")
    assert client.post("/api/conferences", json={"year": 2030, "name_en": "Only English"}, headers=ed).status_code == 422
    assert client.post("/api/conferences", json={**CONFERENCE, "name_ta": "   "}, headers=ed).status_code == 422
    assert client.post("/api/conferences", json={**CONFERENCE, "year": 1900}, headers=ed).status_code == 422
    milestone = {"year": "2030", "title_en": "T", "title_ta": "த", "description_en": "D", "description_ta": "வி"}
    assert client.post("/api/history", json={**milestone, "source_url": "javascript:alert(1)"}, headers=ed).status_code == 422
    assert client.post("/api/history", json={**milestone, "year": "30"}, headers=ed).status_code == 422
    assert client.post("/api/history", json=milestone, headers=ed).status_code == 201


def test_only_super_admin_manages_users(client):
    ed, root = auth(client, "ed@x.org"), auth(client, "root@x.org")
    new = {"email": "new@x.org", "name": "New", "password": PASSWORD, "role": "editor"}
    assert client.post("/api/users", json=new, headers=ed).status_code == 403
    assert client.get("/api/users", headers=ed).status_code == 403
    assert client.post("/api/users", json=new, headers=root).status_code == 201
    assert client.post("/api/users", json={**new, "password": "weak"}, headers=root).status_code in (409, 422)


def test_last_super_admin_is_protected(client):
    root = auth(client, "root@x.org")
    users = client.get("/api/users", headers=root).json()
    root_id = next(u["id"] for u in users if u["email"] == "root@x.org")
    assert client.patch(f"/api/users/{root_id}", json={"role": "editor"}, headers=root).status_code == 409
    assert client.patch(f"/api/users/{root_id}", json={"is_active": False}, headers=root).status_code == 409


def test_deactivated_user_is_locked_out(client):
    root, ed = auth(client, "root@x.org"), auth(client, "ed@x.org")
    ed_id = next(u["id"] for u in client.get("/api/users", headers=root).json() if u["email"] == "ed@x.org")
    client.patch(f"/api/users/{ed_id}", json={"is_active": False}, headers=root)
    assert client.get("/api/conferences", headers=ed).status_code == 401


def test_audit_log_records_changes(client):
    ed, root = auth(client, "ed@x.org"), auth(client, "root@x.org")
    client.post("/api/conferences", json=CONFERENCE, headers=ed)
    log = client.get("/api/users/audit/log", headers=root).json()
    assert log[0]["user_email"] == "ed@x.org" and log[0]["action"] == "create"
    assert client.get("/api/users/audit/log", headers=ed).status_code == 403


# ---- Media -----------------------------------------------------------------------------------------------------------
def picture(width=1200, height=800, fmt="PNG", color=(200, 30, 60)) -> bytes:
    buffer = io.BytesIO()
    Image.new("RGB", (width, height), color).save(buffer, format=fmt)
    return buffer.getvalue()


def upload(client, headers, data, name="photo.png", content_type="image/png", **fields):
    form = {"alt_en": "A red square", "alt_ta": "சிவப்பு சதுரம்", **fields}
    return client.post("/api/media", headers=headers, files={"file": (name, data, content_type)}, data=form)


def test_upload_makes_web_sized_copies(client):
    co = auth(client, "co@x.org")  # a contributor may upload
    r = upload(client, co, picture(1200, 800))
    assert r.status_code == 201, r.text
    body = r.json()
    assert [v["width"] for v in body["variants"]] == [400, 800, 1200]  # never larger than the original
    for variant in body["variants"]:
        assert client.get(variant["url"].replace("http://localhost:8000", "")).status_code == 200  # served at /media/...
    key_dirs = list((Path(TEST_STORAGE) / "images").iterdir())
    assert len(key_dirs) == 1 and sorted(p.name for p in key_dirs[0].iterdir()) == ["1200.webp", "400.webp", "800.webp"]
    with Image.open(key_dirs[0] / "800.webp") as copy:
        assert copy.format == "WEBP" and copy.size == (800, 533)


def test_small_picture_is_not_enlarged(client):
    ed = auth(client, "ed@x.org")
    r = upload(client, ed, picture(300, 200))
    assert [v["width"] for v in r.json()["variants"]] == [300]


def test_upload_rejects_bad_files(client):
    ed = auth(client, "ed@x.org")
    assert upload(client, ed, b"this is not a picture", name="x.jpg", content_type="image/jpeg").status_code == 415
    assert upload(client, ed, b"<svg xmlns='http://www.w3.org/2000/svg'><script>alert(1)</script></svg>", name="x.svg", content_type="image/svg+xml").status_code == 415
    assert upload(client, ed, picture(fmt="GIF"), name="x.gif", content_type="image/gif").status_code == 415
    assert upload(client, ed, picture(fmt="BMP"), name="x.bmp", content_type="image/bmp").status_code == 415
    assert upload(client, ed, picture(), alt_ta="   ").status_code == 422  # both descriptions are required
    assert client.post("/api/media", headers=ed, data={"alt_en": "a", "alt_ta": "b"}).status_code == 422  # no file
    assert not (Path(TEST_STORAGE) / "images").exists() or not list((Path(TEST_STORAGE) / "images").iterdir())


def test_upload_size_limits(client, monkeypatch):
    from app.config import get_settings

    ed = auth(client, "ed@x.org")
    monkeypatch.setattr(get_settings(), "max_upload_bytes", 2000)
    assert upload(client, ed, picture(800, 800)).status_code == 413
    monkeypatch.setattr(get_settings(), "max_upload_bytes", 10 * 1024 * 1024)
    monkeypatch.setattr(get_settings(), "max_image_pixels", 10_000)
    assert upload(client, ed, picture(800, 800)).status_code == 415  # too many pixels


def test_media_needs_sign_in_and_permissions(client):
    assert client.get("/api/media").status_code == 401
    assert client.post("/api/media", files={"file": ("a.png", picture(), "image/png")}, data={"alt_en": "a", "alt_ta": "b"}).status_code == 401
    co, ed = auth(client, "co@x.org"), auth(client, "ed@x.org")
    asset = upload(client, co, picture()).json()
    assert client.patch(f"/api/media/{asset['id']}", json={"alt_en": "x"}, headers=co).status_code == 403
    assert client.delete(f"/api/media/{asset['id']}", headers=co).status_code == 403
    assert client.patch(f"/api/media/{asset['id']}", json={"caption_en": " A caption ", "alt_ta": "புதிய"}, headers=ed).json()["caption_en"] == "A caption"
    assert client.delete(f"/api/media/{asset['id']}", headers=ed).status_code == 204
    assert client.get("/api/media", headers=ed).json() == []
    assert not list((Path(TEST_STORAGE) / "images").iterdir())  # the files are gone too


def test_storage_refuses_keys_outside_its_folder():
    from app.storage import get_storage

    storage = get_storage()
    for bad in ["../outside.txt", "images/../../outside.txt", "/etc/passwd", "", "."]:
        with pytest.raises(ValueError):
            storage.put(bad, b"x", "text/plain")
