"""Generate hero PNG placeholders for theme variants (light / dark-fantasy).

Skips:
- existing variant files
- dark-fantasy stages when legacy root PNG already exists (do not duplicate art)
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2] / "public" / "game-assets" / "heroes"
GENDERS = ("male", "female")
VARIANTS = ("light", "dark-fantasy")
STAGES = range(1, 21)
SIZE = (512, 768)


def legacy_stage_path(gender: str, stage: int) -> Path:
    return ROOT / gender / f"stage-{stage:02d}.png"


def legacy_death_path(gender: str) -> Path:
    return ROOT / gender / "death.png"


def variant_path(gender: str, variant: str, stage: int) -> Path:
    return ROOT / gender / "variants" / variant / f"stage-{stage:02d}.png"


def variant_death_path(gender: str, variant: str) -> Path:
    return ROOT / gender / "variants" / variant / "death.png"


def should_skip_stage(gender: str, variant: str, stage: int, out: Path) -> bool:
    if out.exists():
        return True
    if variant == "dark-fantasy" and legacy_stage_path(gender, stage).exists():
        return True
    return False


def should_skip_death(gender: str, variant: str, out: Path) -> bool:
    if out.exists():
        return True
    if variant == "dark-fantasy" and legacy_death_path(gender).exists():
        return True
    return False


def pick_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for name in ("arial.ttf", "segoeui.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def render_placeholder(label: str, variant: str) -> Image.Image:
    is_light = variant == "light"
    bg = (245, 236, 220, 255) if is_light else (28, 32, 44, 255)
    fg = (90, 70, 50, 255) if is_light else (200, 210, 230, 255)
    accent = (180, 140, 80, 255) if is_light else (120, 100, 180, 255)

    img = Image.new("RGBA", SIZE, bg)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((24, 24, SIZE[0] - 24, SIZE[1] - 24), radius=24, outline=accent, width=4)

    title_font = pick_font(28)
    sub_font = pick_font(20)
    draw.text((SIZE[0] // 2, SIZE[1] // 2 - 40), "PLACEHOLDER", fill=fg, font=title_font, anchor="mm")
    draw.text((SIZE[0] // 2, SIZE[1] // 2 + 8), label, fill=accent, font=sub_font, anchor="mm")
    draw.text(
        (SIZE[0] // 2, SIZE[1] - 48),
        "replace with generated PNG",
        fill=fg,
        font=sub_font,
        anchor="mm",
    )
    return img


def main() -> None:
    created = 0
    skipped = 0

    for gender in GENDERS:
        for variant in VARIANTS:
            for stage in STAGES:
                out = variant_path(gender, variant, stage)
                if should_skip_stage(gender, variant, stage, out):
                    skipped += 1
                    continue
                out.parent.mkdir(parents=True, exist_ok=True)
                tag = "L" if variant == "light" else "D"
                label = f"{gender[0].upper()}-{stage:02d}-{tag}"
                render_placeholder(label, variant).save(out, optimize=True)
                created += 1

            death_out = variant_death_path(gender, variant)
            if should_skip_death(gender, variant, death_out):
                skipped += 1
            else:
                death_out.parent.mkdir(parents=True, exist_ok=True)
                tag = "L" if variant == "light" else "D"
                render_placeholder(f"{gender[0].upper()}-DEATH-{tag}", variant).save(death_out, optimize=True)
                created += 1

    print(f"Created {created} placeholders, skipped {skipped}.")


if __name__ == "__main__":
    main()
