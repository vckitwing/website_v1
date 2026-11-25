"""Turns a PDF into the page pictures readers see. The PDF itself is never given to readers."""

import io

import pypdfium2 as pdfium
from PIL import Image, ImageDraw, ImageFont

MAX_PICTURE_HEIGHT = 6000  # guards against absurdly tall pages


class PdfRejected(Exception):
    """The upload is not an acceptable PDF. The message is safe to show to the user."""


def open_pdf(data: bytes, max_pages: int) -> pdfium.PdfDocument:
    if b"%PDF-" not in data[:1024]:
        raise PdfRejected("This file is not a PDF.")
    try:
        document = pdfium.PdfDocument(data)
    except pdfium.PdfiumError:
        raise PdfRejected("This PDF could not be opened. It may be damaged or password-protected.") from None
    count = len(document)
    if count < 1:
        document.close()
        raise PdfRejected("This PDF has no pages.")
    if count > max_pages:
        document.close()
        raise PdfRejected(f"This PDF has {count} pages; the most allowed is {max_pages}.")
    return document


def render_page(document: pdfium.PdfDocument, index: int, width: int) -> Image.Image:
    page = document[index]
    try:
        page_width, page_height = page.get_size()
        if page_width <= 0 or page_height <= 0:
            raise PdfRejected(f"Page {index + 1} has no size.")
        scale = min(width / page_width, MAX_PICTURE_HEIGHT / page_height)
        return page.render(scale=scale).to_pil().convert("RGB")
    finally:
        page.close()


def apply_watermark(image: Image.Image, text: str) -> Image.Image:
    """Draws the text faintly, diagonally and repeated across the page. Subtle enough to read through, hard to crop out."""
    width, height = image.size
    font = ImageFont.load_default(size=max(16, width // 24))
    diagonal = int((width**2 + height**2) ** 0.5) + 10
    layer = Image.new("RGBA", (diagonal, diagonal), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    text_width, text_height = right - left, bottom - top
    step_x, step_y = text_width + width // 5, text_height + height // 6
    for row, y in enumerate(range(0, diagonal, step_y)):
        for x in range(-(text_width // 2) * (row % 2), diagonal, step_x):
            draw.text((x, y), text, font=font, fill=(110, 110, 110, 44))
    layer = layer.rotate(28, resample=Image.Resampling.BICUBIC)
    offset = ((diagonal - width) // 2, (diagonal - height) // 2)
    layer = layer.crop((offset[0], offset[1], offset[0] + width, offset[1] + height))
    return Image.alpha_composite(image.convert("RGBA"), layer).convert("RGB")


def to_webp(image: Image.Image, quality: int = 80) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, format="WEBP", quality=quality, method=4)
    return buffer.getvalue()
