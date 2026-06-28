# Hero Male Stages — Image Prompts

## Export paths (theme variants)

```
public/game-assets/heroes/{male,female}/variants/dark-fantasy/stage-01.png … stage-20.png, death.png
public/game-assets/heroes/{male,female}/variants/light/stage-01.png … stage-20.png, death.png
```

Legacy approved PNGs remain at `heroes/{gender}/stage-XX.png` — used as fallback for dark theme until variant file exists.

Generate placeholders (dev):

```powershell
python local/tools/generate_hero_placeholders.py
```

## Export path (legacy root)

```
public/game-assets/heroes/male/stage-01.png … stage-20.png
public/game-assets/heroes/male/death.png
```

## Current status (2026-06-06)

| Stages | Status |
|--------|--------|
| 1–3 | approved (dark fantasy, in repo) |
| 4–18 | **missing** — UI falls back to anchors 1, 2, 19, 20 |
| 19–20 | approved |
| death | approved |

## Workflow

1. Read [`../../HERO_MALE_AVATAR_PROMPT.md`](../../HERO_MALE_AVATAR_PROMPT.md) — quick start + reference table
2. Full stage descriptions: [`../../HERO_STAGE_PROMPTS_V2.md`](../../HERO_STAGE_PROMPTS_V2.md) § Male stages
3. Attach references locally from `private-assets/` (not in repo)
4. Style refs in repo: `heroes/male/_reference/stage-20-approved.png`

## Clothing (dark fantasy line)

- Dark neutral: charcoal hoodie, deep brown, muted navy
- **Not:** bright pink shirt, yellow shorts (→ cozy variant)

## Anchor generation order

Recommended: **1 → 5 → 10 → 15 → 20**, then fill 2–4, 6–9, 11–14, 16–19.

## Post-process

```powershell
python local/tools/process_hero_png.py public/game-assets/heroes/male
```

## After save

1. Update [`../../assets/manifest.json`](../../assets/manifest.json)
2. Bump `GAME_ASSET_VERSION`
3. Update [`../../wiki/00-project-state.md`](../../wiki/00-project-state.md)

## Cozy candidate (separate line)

Bright generation → `heroes/male/variants/light/` — see manifest entry `male-stage-20-light-v1`.
