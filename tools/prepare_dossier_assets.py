"""Prepare the archive assets: keyed folder, Panthéon seal, Valoris mark.

Usage:
    python tools/prepare_dossier_assets.py

Sources are supplied by the client and are not redistributed here; only the
processed assets used by the page are written to assets/images/.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "assets" / "images"

FOLDER_SOURCE = Path(
    r"C:\Users\kamer\AppData\Local\Temp\freebuff-desktop-pastes\paste-1792239949208-22780.png"
)
PANTHEON_SOURCE = Path(
    r"C:\Users\kamer\Desktop\Projet RP\Le Panthéon\public\brand\favicon.png"
)
VALORIS_SOURCE = Path(r"C:\Users\kamer\Desktop\Projet RP\Valoris\Site\public\logo.png")


def keyed_folder(source: Path) -> Image.Image:
    """Remove the pure-black studio background and upscale the paper folder."""
    rgb = np.asarray(Image.open(source).convert("RGB")).astype(np.float64)
    luminance = rgb @ np.array([0.2126, 0.7152, 0.0722])

    # Black backdrop -> transparent, feathered over a few levels so the cut-out
    # keeps the soft photographic edge instead of a hard posterised contour.
    alpha = np.clip((luminance - 4.0) / 12.0, 0.0, 1.0)
    safe = np.maximum(alpha, 0.04)[..., None]
    unpremultiplied = np.clip(rgb / safe, 0, 255)

    rgba = np.dstack([unpremultiplied, alpha * 255.0]).astype(np.uint8)
    cut = Image.fromarray(rgba, "RGBA")

    # 2x so the folder stays crisp when laid out at ~500 px on the desk.
    cut = cut.resize((cut.width * 2, cut.height * 2), Image.LANCZOS)
    r, g, b, a = cut.split()
    paper = Image.merge("RGB", (r, g, b)).filter(
        ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2)
    )
    cut = Image.merge("RGBA", (*paper.split(), a))

    bbox = cut.getchannel("A").getbbox()
    if bbox:
        pad = 10
        cut = cut.crop(
            (
                max(0, bbox[0] - pad),
                max(0, bbox[1] - pad),
                min(cut.width, bbox[2] + pad),
                min(cut.height, bbox[3] + pad),
            )
        )
    return cut


def seal(source: Path) -> Image.Image:
    badge = Image.open(source).convert("RGBA")
    badge = badge.resize((512, 512), Image.LANCZOS)
    r, g, b, a = badge.split()
    rgb = Image.merge("RGB", (r, g, b)).filter(
        ImageFilter.UnsharpMask(radius=1.5, percent=80, threshold=2)
    )
    return Image.merge("RGBA", (*rgb.split(), a))


def marked_logo(source: Path) -> Image.Image:
    """Crop the black margin around the Valoris lock-up, keep its black plate."""
    logo = Image.open(source).convert("RGB")
    array = np.asarray(logo).astype(np.float64).mean(axis=2)
    mask = array > 8
    ys, xs = np.where(mask)
    pad = 18
    box = (
        max(0, int(xs.min()) - pad),
        max(0, int(ys.min()) - pad),
        min(logo.width, int(xs.max()) + pad),
        min(logo.height, int(ys.max()) + pad),
    )
    logo = logo.crop(box)
    width = 760
    logo = logo.resize(
        (width, round(logo.height * width / logo.width)), Image.LANCZOS
    )
    return logo.filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=2))


def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)

    folder = keyed_folder(FOLDER_SOURCE)
    folder.save(IMAGES / "dossier-folder.webp", quality=92, method=6)
    print("folder:", folder.size)

    badge = seal(PANTHEON_SOURCE)
    badge.save(IMAGES / "pantheon-seal.png", optimize=True)
    print("pantheon seal:", badge.size)

    valoris = marked_logo(VALORIS_SOURCE)
    valoris.save(IMAGES / "valoris-logo.webp", quality=93, method=6)
    print("valoris:", valoris.size)


if __name__ == "__main__":
    main()
