"""
Lift the subject out of the illustrated portrait.

    python3 -I scripts/make-cutout.py [source.png]

Three stages:
  1. grow in from the frame edge through anything flat and close in colour to
     where it came from. That clears the gradient but stops at the knit of the
     sweater and at the thin decorative strokes.
  2. inside what survives, drop whatever is flat, light and colourless. Every
     part of the person is warm or dark; the decorative disc, the dot grids and
     the hairline arcs are not.
  3. put back anything the subject fully encloses, so the white t-shirt and the
     flat highlights on the face return.

Writes public/assets/dhruv.png. A source that already has transparency
is simply cropped and copied.
"""
import sys
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
DST = ROOT / "public/assets/dhruv.png"
src = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "public/assets/dhruv-hero.png"

raw = Image.open(src)
if raw.mode == "RGBA" and np.asarray(raw)[:, :, 3].min() < 250:
    out = raw.crop(raw.getbbox())
    out.save(DST)
    print(f"already transparent -> {out.size}")
    raise SystemExit

im = raw.convert("RGB")
w, h = im.size
px = np.asarray(im).astype(np.int16)

grey = im.convert("L")
blur = grey.filter(ImageFilter.GaussianBlur(2.2))
rough = np.abs(np.asarray(grey).astype(np.int16) - np.asarray(blur).astype(np.int16))
rough = np.asarray(
    Image.fromarray(rough.astype(np.uint8)).filter(ImageFilter.MaxFilter(5))
).astype(np.int16)
flat = rough <= 5

# ---- 1. flood in from the edge -----------------------------------------
bg = np.zeros((h, w), bool)
q = deque()
for x in range(w):
    for y in (0, 1):
        if flat[y, x]:
            bg[y, x] = True; q.append((x, y))
for y in range(h):
    for x in (0, 1, w - 2, w - 1):
        if flat[y, x]:
            bg[y, x] = True; q.append((x, y))
while q:
    x, y = q.popleft()
    here = px[y, x]
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not bg[ny, nx] and flat[ny, nx]:
            if int(np.abs(px[ny, nx] - here).max()) <= 12:
                bg[ny, nx] = True; q.append((nx, ny))
print(f"edge flood cleared {bg.mean() * 100:.0f}%")

# ---- 2. the decoration the flood could not reach ------------------------
hsv = np.asarray(im.convert("HSV")).astype(np.int16)
colourless = flat & (hsv[:, :, 1] < 56) & (hsv[:, :, 2] > 92)
bg |= colourless
print(f"plus colourless shapes -> {bg.mean() * 100:.0f}%")

# ---- 3. restore only the SMALL pockets the subject encloses -------------
# His t-shirt and the flat highlights are small islands and must come back.
# The decorative disc is also enclosed, by its own hairline ring, but it is
# large, so size is what separates the two.
seen = np.zeros((h, w), bool)
restored = 0
LIMIT = int(w * h * 0.012)

for sy in range(h):
    for sx in range(w):
        if not bg[sy, sx] or seen[sy, sx]:
            continue
        cells, touches = [], False
        seen[sy, sx] = True
        stack = [(sx, sy)]
        while stack:
            x, y = stack.pop()
            cells.append((x, y))
            if x in (0, w - 1) or y in (0, h - 1):
                touches = True
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and bg[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    stack.append((nx, ny))
        if not touches and len(cells) < LIMIT:
            for x, y in cells:
                bg[y, x] = False
            restored += 1

print(f"restored {restored} enclosed pocket(s) -> {bg.mean() * 100:.0f}%")

alpha = np.where(bg, 0, 255).astype(np.uint8)
mask = Image.fromarray(alpha, "L")
mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
mask = mask.filter(ImageFilter.GaussianBlur(0.8))

out = im.copy(); out.putalpha(mask)
out = out.crop(out.getbbox())
out.save(DST)
print(f"saved {out.size} -> {DST}")

cw, ch = out.size
check = Image.fromarray(np.full((ch, cw, 3), 10, np.uint8))
check.paste(out, (0, 0), out)
check.resize((cw // 2, ch // 2)).save("/private/tmp/claude-501/-Users-sripathidhruvreddy-Desktop-Portfolio/2063852a-b8f8-40cc-91c7-2e8413c998f4/scratchpad/cutout-check.png")
