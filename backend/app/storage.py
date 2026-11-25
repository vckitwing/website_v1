"""Object storage: where uploaded files and the published `content.json` live.

Today there is one implementation, `LocalStorage` (a folder on disk). Production will add an R2 implementation with the
same methods, chosen by a setting, so nothing else in the API has to change.
"""

import os
import shutil
import tempfile
import threading
import time
from functools import lru_cache
from pathlib import Path
from typing import Protocol

from .config import get_settings


# What the web may fetch from the storage folder in development (production serves the public R2 bucket instead).
# Everything else, notably `_private/` (source PDFs) and the owner's own staging folders, is never served.
PUBLIC_PREFIXES = ("images", "publications")
PUBLIC_FILES = ("content.json",)
PRIVATE_PREFIX = "_private"


class Storage(Protocol):
    def put(self, key: str, data: bytes, content_type: str) -> None: ...
    def read(self, key: str) -> bytes: ...
    def delete(self, key: str) -> None: ...
    def delete_prefix(self, prefix: str) -> None: ...
    def exists(self, key: str) -> bool: ...
    def url(self, key: str) -> str: ...


class LocalStorage:
    """Keys are slash-separated paths below `root`, like `images/<id>/800.webp`. Keys that would leave `root` are refused."""

    def __init__(self, root: Path, base_url: str) -> None:
        self.root = root.resolve()
        self.base_url = base_url.rstrip("/")
        self._locks: dict[Path, threading.Lock] = {}
        self._locks_guard = threading.Lock()
        self.root.mkdir(parents=True, exist_ok=True)

    def _path(self, key: str) -> Path:
        path = (self.root / key).resolve()
        if path == self.root or self.root not in path.parents:
            raise ValueError(f"Invalid storage key: {key!r}")
        return path

    def put(self, key: str, data: bytes, content_type: str) -> None:
        path = self._path(key)
        path.parent.mkdir(parents=True, exist_ok=True)
        # Writers of the SAME file queue up (two jobs finishing together both refresh content.json).
        with self._lock_for(path):
            # write to a temp file first so a reader never sees a half-written file
            fd, temp = tempfile.mkstemp(dir=path.parent, suffix=".tmp")
            try:
                with os.fdopen(fd, "wb") as handle:
                    handle.write(data)
                self._replace(temp, path)
            except BaseException:
                Path(temp).unlink(missing_ok=True)
                raise

    @staticmethod
    def _replace(temp: str, path: Path) -> None:
        """Atomic replace. On Windows it fails while someone is reading the file; a short retry rides that out."""
        for attempt in range(12):
            try:
                os.replace(temp, path)
                return
            except PermissionError:
                if attempt == 11:
                    raise
                time.sleep(0.03 * (attempt + 1))

    def _lock_for(self, path: Path) -> threading.Lock:
        with self._locks_guard:
            return self._locks.setdefault(path, threading.Lock())

    def read(self, key: str) -> bytes:
        return self._path(key).read_bytes()

    def delete(self, key: str) -> None:
        self._path(key).unlink(missing_ok=True)

    def delete_prefix(self, prefix: str) -> None:
        path = self._path(prefix)
        if path.is_dir():
            shutil.rmtree(path)

    def exists(self, key: str) -> bool:
        return self._path(key).is_file()

    def url(self, key: str) -> str:
        return f"{self.base_url}/{key}"


@lru_cache
def get_storage() -> LocalStorage:
    settings = get_settings()
    return LocalStorage(settings.storage_path, settings.media_base_url)
