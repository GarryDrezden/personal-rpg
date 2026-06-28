# Hero Female Stages — Image Prompts

## Export path

```
public/game-assets/heroes/female/stage-01.png … stage-20.png
public/game-assets/heroes/female/death.png
```

## Current status (2026-06-06)

**Full set 1–20 + death** — in repo, treat as **approved** baseline.

## Source prompts

Full descriptions: [`../../HERO_STAGE_PROMPTS_V2.md`](../../HERO_STAGE_PROMPTS_V2.md) § Female stages.

Universal style block — same file, §1.

## Transformation rules

Same as male:

- One person across 20 stages
- Fat loss progression, not bodybuilder arc
- Stage 10 still noticeably larger than stage 20
- Preserve face, hair, clothing style, pose, scale

## Clothing

Dark fantasy main line: dark neutral outfit consistent across stages.

Future cozy variants: `heroes/female/variants/light/` (folder reserved).

## Post-process

```powershell
python local/tools/process_hero_png.py public/game-assets/heroes/female/stage-01.png
```

## Consistency audit

When updating male line, compare female stages for:

- scale / framing
- pose angle
- clothing silhouette progression
- lighting style

## Manifest

All female stages should have `approved` entries in [`../../assets/manifest.json`](../../assets/manifest.json).
