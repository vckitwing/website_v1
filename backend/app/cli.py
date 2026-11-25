"""Command-line tasks.

    python -m app.cli seed                       load the website's current History and Conferences (only into empty tables)
    python -m app.cli create-admin EMAIL NAME    create a super admin (asks for the password)
    python -m app.cli import-books [--publish]   bring the PDFs in Object_Storage_Data/Books into the website
"""

import getpass
import json
import sys
from pathlib import Path

from sqlalchemy import func, select

from .db import SessionLocal, init_db
from .import_books import import_books
from .models import Conference, HistoryMilestone, Role, Status, User
from .security import hash_password, password_problem
from .services import publish_snapshot

SEED_DIR = Path(__file__).resolve().parent.parent / "seed"


def seed() -> None:
    init_db()
    with SessionLocal() as db:
        if not db.scalar(select(func.count()).select_from(Conference)):
            for index, item in enumerate(json.loads((SEED_DIR / "conferences.json").read_text(encoding="utf-8"))):
                db.add(Conference(year=item["year"], name_en=item["name"]["en"], name_ta=item["name"]["ta"], position=index, status=Status.published.value))
            print("Loaded conferences.")
        else:
            print("Conferences already present, left alone.")
        if not db.scalar(select(func.count()).select_from(HistoryMilestone)):
            for index, item in enumerate(json.loads((SEED_DIR / "history.json").read_text(encoding="utf-8"))):
                source = item.get("source")
                db.add(
                    HistoryMilestone(
                        year=item["year"],
                        title_en=item["title"]["en"],
                        title_ta=item["title"]["ta"],
                        description_en=item["description"]["en"],
                        description_ta=item["description"]["ta"],
                        source_url=source["url"] if source else None,
                        source_label_en=source["label"]["en"] if source else None,
                        source_label_ta=source["label"]["ta"] if source else None,
                        position=index,
                        status=Status.published.value,
                    )
                )
            print("Loaded history.")
        else:
            print("History already present, left alone.")
        db.commit()
        publish_snapshot(db)


def create_admin(email: str, name: str) -> None:
    init_db()
    password = getpass.getpass("Password: ")
    problem = password_problem(password)
    if problem:
        sys.exit(problem)
    if password != getpass.getpass("Repeat password: "):
        sys.exit("The passwords do not match.")
    with SessionLocal() as db:
        if db.scalar(select(User).where(User.email == email.lower())):
            sys.exit("A user with this email already exists.")
        db.add(User(email=email.lower(), name=name, password_hash=hash_password(password), role=Role.super_admin.value))
        db.commit()
    print(f"Created super admin {email}.")


if __name__ == "__main__":
    args = sys.argv[1:]
    if args[:1] == ["seed"]:
        seed()
    elif args[:1] == ["import-books"]:
        for line in import_books(publish="--publish" in args):
            print(line)
    elif args[:1] == ["create-admin"] and len(args) == 3:
        create_admin(args[1], args[2])
    else:
        sys.exit(__doc__)
