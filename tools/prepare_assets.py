#!/usr/bin/env python3
"""
Prepare the visual assets for the BO2 surveillance-room recreation.

Input  : assets/reference/bo2-reference.png  (the reference screenshot supplied by the client)
Output : assets/images/room-plate.webp       (retouched 16:10-ish plate, menu text removed)
         assets/textures/grain-1..2.png      (transparent analog grain tiles)
         assets/textures/scratches.png       (faint dust / scratches overlay)

The only photographic source is the client's own reference image. Everything else is
generated procedurally by this script. Run with:  python tools/prepare_assets.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "assets" / "reference" / "bo2-reference.png"
IMAGES = ROOT / "assets" / "images"
TEXTURES = ROOT / "assets" / "textures"
IMAGES.mkdir(parents=True, exist_ok=True)
TEXTURES.mkdir(parents=True, exist_ok=True)

# --------------------------------------------------------------------------------------
# 1. Retouch the big left CRT: remove the baked-in menu text with a diffusion inpaint.
#    The screen itself, its glass glow and its reflections are preserved.
# --------------------------------------------------------------------------------------
src = Image.open(REF).convert("RGB")
w, h = src.size
arr = np.asarray(src).astype(np.float64)
gray = arr.mean(axis=2)

# Menu typography lives inside this box (measured on the reference).  The whole inner
# block is rebuilt from the pixels that surround it, so that not even a ghost of the
# baked letters (or their bloom) can show through the live text later.
x0, x1, y0, y1 = 58, 448, 126, 508
pad = 90
px0, px1 = max(0, x0 - pad), min(w, x1 + pad)
py0, py1 = max(0, y0 - pad), min(h, y1 + pad)
sub = arr[py0:py1, px0:px1].copy()
mask = np.zeros(sub.shape[:2], dtype=bool)
mask[y0 - py0:y1 - py0, x0 - px0:x1 - px0] = True
print("inpaint mask pixels:", int(mask.sum()))

# Initial fill: per-column linear interpolation between the surviving pixels above and
# below the block.
for cx in range(sub.shape[1]):
    col_mask = mask[:, cx]
    if not col_mask.any():
        continue
    idx = np.arange(sub.shape[0])
    known = ~col_mask
    if not known.any():
        continue
    for ch in range(3):
        sub[col_mask, cx, ch] = np.interp(idx[col_mask], idx[known], sub[known, cx, ch])

# Diffusion (Jacobi) inside the mask so the fill follows the screen gradient smoothly.
for _ in range(700):
    up = np.roll(sub, 1, axis=0)
    dn = np.roll(sub, -1, axis=0)
    lf = np.roll(sub, 1, axis=1)
    rt = np.roll(sub, -1, axis=1)
    avg = (up + dn + lf + rt) / 4.0
    sub[mask] = avg[mask]

# Feather the seam so the patch melts into the CRT glass.
feather = np.asarray(
    Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10))
).astype(np.float64)[..., None] / 255.0
original = arr[py0:py1, px0:px1].copy()
arr[py0:py1, px0:px1] = sub * feather + original * (1.0 - feather)

plate_native = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

# Keep native aspect ratio, upscale to the delivery width then a touch of sharpening.
plate_w = 1920
plate_h = round(h * plate_w / w)
plate = plate_native.resize((plate_w, plate_h), Image.LANCZOS)
plate = plate.filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=3))
plate.save(IMAGES / "room-plate.webp", quality=92, method=6)
print("plate:", plate.size)

# --------------------------------------------------------------------------------------
# 2. Procedural analog grain tiles (two layers animated by CSS).
# --------------------------------------------------------------------------------------
rng = np.random.default_rng(2012)
for i in range(2):
    n = rng.normal(0.5, 0.22, (256, 256))
    n = np.clip(n, 0, 1)
    rgb = (n * 255).astype(np.uint8)
    alpha = np.where(n > 0.5, 46, 26).astype(np.uint8)
    tile = np.dstack([rgb, rgb, rgb, alpha])
    Image.fromarray(tile, "RGBA").save(TEXTURES / f"grain-{i + 1}.png", optimize=True)
print("grain tiles: 2")

# --------------------------------------------------------------------------------------
# 3. Faint dust / hairline scratches overlay.
# --------------------------------------------------------------------------------------
dust = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
px = dust.load()
rng = np.random.default_rng(7)
for _ in range(90):
    x, y = rng.integers(0, 512, 2)
    a = int(rng.integers(10, 46))
    for dx in range(int(rng.integers(0, 4)) + 1):
        for dy in range(int(rng.integers(0, 4)) + 1):
            if 0 <= x + dx < 512 and 0 <= y + dy < 512:
                px[x + dx, y + dy] = (235, 238, 230, a)
for _ in range(16):
    x = int(rng.integers(0, 512))
    y = int(rng.integers(0, 512))
    length = int(rng.integers(18, 90))
    a = int(rng.integers(8, 26))
    for t in range(length):
        yy = y + t
        if 0 <= yy < 512:
            px[x, yy] = (245, 248, 240, a)
dust = dust.filter(ImageFilter.GaussianBlur(0.45))
dust.save(TEXTURES / "scratches.png", optimize=True)
print("scratches: ok")
