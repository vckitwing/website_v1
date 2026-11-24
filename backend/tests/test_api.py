import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["PUBLISH_DIR"] = "./test_published"

import json  # noqa: E402
from pathlib import Path  # noqa: E402

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.db import Base, SessionLocal, _engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Role, User  # noqa: E402
from app.security import hash_password, login_throttle  # noqa: E402

PASSWORD = "Str0ngPassword1"


@pytest.fixture()
def client():
    Base.metadata.drop_all(_engine)
    Base.metadata.create_all(_engine)
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
    snapshot = json.loads((Path("test_published") / "content.json").read_text(encoding="utf-8"))
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
