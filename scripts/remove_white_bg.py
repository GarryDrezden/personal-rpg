#!/usr/bin/env python3
"""Remove white / checkerboard fake-transparency backgrounds from PNG assets."""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image


def is_background(r: int, g: int, b: int, a: int, *, min_avg: float, max_chroma: int) -> bool:
    if a < 8:
        return True
    mx, mn = max(r, g, b), min(r, g, b)
    avg = (r + g + b) / 3.0
    return avg >= min_avg and (mx - mn) <= max_chroma


def remove_background(
    img: Image.Image,
    *,
    min_avg: float = 175.0,
    max_chroma: int = 28,
    feather: bool = True,
) -> Image.Image:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()

    visited = bytearray(w * h)
    queue: deque[tuple[int, int]] = deque()

    def idx(x: int, y: int) -> int:
        return y * w + x

    def try_seed(x: int, y: int) -> None:
        i = idx(x, y)
        if visited[i]:
            return
        r, g, b, a = pixels[x, y]
        if is_background(r, g, b, a, min_avg=min_avg, max_chroma=max_chroma):
            visited[i] = 1
            queue.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    while queue:
        x, y = queue.popleft()
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)

        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h:
                i = idx(nx, ny)
                if not visited[i]:
                    nr, ng, nb, na = pixels[nx, ny]
                    if is_background(nr, ng, nb, na, min_avg=min_avg, max_chroma=max_chroma):
                        visited[i] = 1
                        queue.append((nx, ny))

    if feather:
        # Remove near-white fringe and soften light halos at transparency edges.
        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                if a == 0:
                    continue
                mx, mn = max(r, g, b), min(r, g, b)
                chroma = mx - mn
                avg = (r + g + b) / 3.0
                if chroma <= 12 and avg >= 246:
                    pixels[x, y] = (r, g, b, 0)
                    continue
                if avg < 210 or chroma > 35:
                    continue
                touches_clear = False
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if 0 <= nx < w and 0 <= ny < h and pixels[nx, ny][3] == 0:
                        touches_clear = True
                        break
                if touches_clear:
                    fade = max(0, min(255, int((255 - avg) * 4)))
                    pixels[x, y] = (r, g, b, fade)

    return rgba


def process_file(path: Path, *, min_avg: float, max_chroma: int, dry_run: bool) -> None:
    if dry_run:
        print(f"[dry-run] {path}")
        return
    with Image.open(path) as img:
        out = remove_background(img, min_avg=min_avg, max_chroma=max_chroma)
        out.save(path, format="PNG", optimize=True)
        print(f"OK {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "root",
        nargs="?",
        default="public/game-assets",
        help="Folder to scan recursively for PNG files",
    )
    parser.add_argument("--min-avg", type=float, default=175.0, help="Min average RGB for background")
    parser.add_argument("--max-chroma", type=int, default=28, help="Max RGB spread for neutral bg")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    root = Path(args.root)
    if not root.is_absolute():
        root = Path(__file__).resolve().parents[1] / root

    files = sorted(root.rglob("*.png"))
    if not files:
        raise SystemExit(f"No PNG files under {root}")

    print(f"Processing {len(files)} PNG files in {root}")
    for path in files:
        process_file(path, min_avg=args.min_avg, max_chroma=args.max_chroma, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
