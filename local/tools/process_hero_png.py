"""Remove black studio background and crop hero stage PNGs."""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image

THRESHOLD = 42
PAD = 12


def is_background_pixel(r: int, g: int, b: int, a: int) -> bool:
    if a < 12:
        return True
    mx, mn = max(r, g, b), min(r, g, b)
    if mx <= THRESHOLD:
        return True
    # Белая кайма / checkerboard light squares
    if mn >= 228:
        return True
    # Серые клетки checkerboard и светлый студийный фон
    if mx - mn <= 28 and mx >= 115:
        return True
    return False


def polish_hero_png(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    px = img.load()
    w, h = img.size
    visited = [[False] * w for _ in range(h)]

    def bg(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        return is_background_pixel(r, g, b, a)

    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
            continue
        if not bg(x, y):
            continue
        visited[y][x] = True
        px[x, y] = (0, 0, 0, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    nw, nh = img.size
    out = Image.new("RGBA", (nw + PAD * 2, nh + PAD * 2), (0, 0, 0, 0))
    out.paste(img, (PAD, PAD), img)
    out.save(path, "PNG")
    print(f"OK {path.name} -> {out.size}")


def main() -> None:
    if len(sys.argv) > 1:
        arg = Path(sys.argv[1])
        paths = [arg] if arg.is_file() else sorted(arg.glob("stage-*.png"))
    else:
        male_dir = (
            Path(__file__).resolve().parents[2] / "public" / "game-assets" / "heroes" / "male"
        )
        paths = sorted(male_dir.glob("stage-*.png"))
    for path in paths:
        polish_hero_png(path)


if __name__ == "__main__":
    main()
