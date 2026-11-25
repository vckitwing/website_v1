from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# <repo>/Object_Storage_Data: the local stand-in for the Cloudflare R2 "media" bucket (git-ignored).
DEFAULT_STORAGE_DIR = Path(__file__).resolve().parent.parent.parent / "Object_Storage_Data"


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

    # Object storage. Locally: a folder on disk, served by the API under /media.
    # (Production will use Cloudflare R2 and the public address of the media bucket.)
    storage_dir: str | None = None
    # Public address that stored files (photos, content.json) are reached at.
    media_base_url: str = "http://localhost:8000/media"
    # Uploads: largest accepted file and largest accepted picture (width x height).
    max_upload_bytes: int = 10 * 1024 * 1024
    max_image_pixels: int = 60_000_000
    # Publications (books, magazine issues): the PDF is turned into page pictures; the PDF itself is never served.
    max_pdf_bytes: int = 80 * 1024 * 1024
    max_pdf_pages: int = 800
    page_width_px: int = 1100  # width of the page pictures readers see
    cover_width_px: int = 600
    watermark_text: str = "Viduthalai Chiruthaigal Katchi"  # drawn faintly across every page picture

    @property
    def storage_path(self) -> Path:
        return Path(self.storage_dir) if self.storage_dir else DEFAULT_STORAGE_DIR


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if settings.environment == "production" and (settings.secret_key.startswith("dev-only-change-me") or len(settings.secret_key) < 32):
        raise RuntimeError("SECRET_KEY must be set to a random value of at least 32 characters in production.")
    return settings
