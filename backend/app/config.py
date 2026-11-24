from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All settings come from environment variables or a `.env` file (see `.env.example`)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # SQLite for local work; PostgreSQL in production, e.g. postgresql+psycopg://user:pass@host/vck
    database_url: str = "sqlite:///./vck.db"
    # Signs login tokens. MUST be a long random value in production (the app refuses to start otherwise).
    secret_key: str = "dev-only-change-me-dev-only-change-me"
    environment: str = "development"
    token_minutes: int = 8 * 60
    # Origins allowed to call the API from a browser (the admin app and the public site).
    cors_origins: list[str] = ["http://localhost:4200", "http://localhost:4300"]
    # When set, every change to published content rewrites <publish_dir>/content.json for the public site.
    publish_dir: str | None = None


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if settings.environment == "production" and (settings.secret_key.startswith("dev-only-change-me") or len(settings.secret_key) < 32):
        raise RuntimeError("SECRET_KEY must be set to a random value of at least 32 characters in production.")
    return settings
