"""Turns an uploaded picture into the web-sized WebP copies the site serves."""

import io
from dataclasses import dataclass

from PIL import Image, ImageOps, UnidentifiedImageError

# Widths of the copies we keep. A copy is never made larger than the original picture.
VARIANT_WIDTHS = (400, 800, 1600)
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}


class ImageRejected(Exception):
    """The upload is not an acceptable picture. The message is safe to show to the user."""


@dataclass
class ProcessedImage:
    width: int  # of the original, after rotating it upright
    height: int
    variants: dict[int, bytes]  # width -> WebP bytes


def process_image(data: bytes, max_pixels: int) -> ProcessedImage:
    Image.MAX_IMAGE_PIXELS = max_pixels  # Pillow then refuses decompression bombs
    try:
        with Image.open(io.BytesIO(data)) as probe:
            if probe.format not in ALLOWED_FORMATS:
                raise ImageRejected("Only JPEG, PNG and WebP pictures are accepted.")
            if probe.width * probe.height > max_pixels:
                raise ImageRejected("This picture is too large (more than %d megapixels)." % (max_pixels // 1_000_000))
            probe.verify()
        with Image.open(io.BytesIO(data)) as source:
            image = ImageOps.exif_transpose(source)  # honour the camera's rotation; re-encoding also drops EXIF (GPS etc.)
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
    except ImageRejected:
        raise
    except (UnidentifiedImageError, Image.DecompressionBombError, OSError, SyntaxError, ValueError):
        raise ImageRejected("This file is not a valid picture.") from None

    width, height = image.size
    widths = [w for w in VARIANT_WIDTHS if w < width] + [min(width, VARIANT_WIDTHS[-1])]
    variants: dict[int, bytes] = {}
    for target in sorted(set(widths)):
        copy = image if target == width else image.resize((target, max(1, round(height * target / width))), Image.Resampling.LANCZOS)
        buffer = io.BytesIO()
        copy.save(buffer, format="WEBP", quality=82, method=4)
        variants[target] = buffer.getvalue()
    return ProcessedImage(width=width, height=height, variants=variants)
