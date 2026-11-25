"""Sets up the LOCAL PostgreSQL for this project and writes backend/.env.

Run from the backend folder, in your own terminal (it asks for the postgres password; nothing is sent anywhere):

    .venv/Scripts/python scripts/setup_local_db.py            (Linux/macOS: .venv/bin/python)

It creates a dedicated database user `vck` (with a random password) and an empty database `vck` owned by that user,
then writes backend/.env with the connection string and a fresh SECRET_KEY. It refuses to overwrite an existing .env
unless you pass --force. Only for local development: do not use it on a server.
"""

import argparse
import getpass
import secrets
import sys
from pathlib import Path

import psycopg
from psycopg import sql

BACKEND = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND / ".env"
ENV_EXAMPLE = BACKEND / ".env.example"
APP_NAME = "vck"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--host", default="localhost")
    parser.add_argument("--port", type=int, default=5432)
    parser.add_argument("--admin-user", default="postgres", help="the PostgreSQL superuser chosen during installation")
    parser.add_argument("--force", action="store_true", help="overwrite an existing backend/.env")
    args = parser.parse_args()

    if ENV_FILE.exists() and not args.force:
        sys.exit(f"{ENV_FILE} already exists. Delete it or pass --force.")

    admin_password = getpass.getpass(f"Password of PostgreSQL user '{args.admin_user}' (set during installation): ")
    app_password = secrets.token_urlsafe(18)  # letters, digits, - and _ only, so it is safe inside a URL

    try:
        connection = psycopg.connect(host=args.host, port=args.port, user=args.admin_user, password=admin_password, dbname="postgres", autocommit=True)
    except psycopg.OperationalError as error:
        sys.exit(f"Could not connect to PostgreSQL on {args.host}:{args.port} as '{args.admin_user}':\n{error}")

    with connection:
        role_exists = connection.execute("SELECT 1 FROM pg_roles WHERE rolname = %s", (APP_NAME,)).fetchone()
        statement = "ALTER ROLE {} WITH LOGIN PASSWORD {}" if role_exists else "CREATE ROLE {} WITH LOGIN PASSWORD {}"
        connection.execute(sql.SQL(statement).format(sql.Identifier(APP_NAME), sql.Literal(app_password)))
        print(("Updated" if role_exists else "Created") + f" database user '{APP_NAME}'.")
        if connection.execute("SELECT 1 FROM pg_database WHERE datname = %s", (APP_NAME,)).fetchone():
            print(f"Database '{APP_NAME}' already exists, left as it is.")
        else:
            connection.execute(sql.SQL("CREATE DATABASE {} OWNER {}").format(sql.Identifier(APP_NAME), sql.Identifier(APP_NAME)))
            print(f"Created database '{APP_NAME}'.")

    template = ENV_EXAMPLE.read_text(encoding="utf-8")
    lines = []
    for line in template.splitlines():
        if line.startswith("SECRET_KEY="):
            line = f"SECRET_KEY={secrets.token_urlsafe(48)}"
        elif line.startswith("DATABASE_URL="):
            line = f"DATABASE_URL=postgresql+psycopg://{APP_NAME}:{app_password}@{args.host}:{args.port}/{APP_NAME}"
        lines.append(line)
    ENV_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {ENV_FILE} (not committed to git).")
    print("Next: .venv/Scripts/python -m app.cli seed   then   .venv/Scripts/python -m app.cli create-admin you@example.org \"Your Name\"")


if __name__ == "__main__":
    main()
