# Nano Banana — Boss Asset Prompt Template

> For season mini-bosses, chapter bosses, act bosses.
> Copy to `docs/prompts/assets/season-boss-01.md` (or matching asset id).

## Asset

| Field | Value |
|-------|--------|
| **Asset ID** | `season-boss-01` |
| **Boss layer** | season mini-boss / chapter boss / act boss |
| **Related entity** | `season_mini_01` |
| **Title** | Владыка Пустого Дня |
| **Target path** | `public/game-assets/bosses/seasons/season-boss-01-empty-day-lord.webp` |

## Narrative role

Bosses are **images of resistance** — habits and patterns that hold the route back.
Not monsters to slaughter. Not shame symbols.

- **What it represents:** days that disappear without a mark
- **How it weakens:** one saved day, one honest minimal step
- **Tone:** ominous but not disgusting; player should feel «I can crack this»

## Visual concept

- **Silhouette:** tall, hollow, dissolving edges — empty space where presence should be
- **Motif:** erased footprints, blank calendar pages, dim lantern without flame
- **Environment:** ruins at twilight, soft fog, no jump-scare faces
- **Color:** cool blues and ash; single warm crack of light (hope)

## Composition

- Square or 4:5 portrait for card UI
- Boss readable at small size (Today season line, dashboard summary)
- Strong outer glow / rim light for dark UI backgrounds

## Style

- Stylized realistic 3D game art
- Dark fantasy + cozy premium mobile RPG
- **Not:** horror creature, zombie, screaming face, anime villain

## Negative prompt

horror, gore, insect, slime, screaming, anime, chibi, flat icon, text, watermark, photorealistic celebrity

## Campaign copy hook (for review)

«Даже один сохранённый день оставляет трещину.»

## After generation

1. Place file at target path
2. Update manifest: `status: in-app`, `fileStatus: ready`
3. Bump `GAME_ASSET_VERSION` in `src/game/assetPaths.ts`
4. Optional: wire portrait in season card (separate UI task)
