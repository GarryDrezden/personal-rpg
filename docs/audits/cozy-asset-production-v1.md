# Cozy Visual Asset Production Pack v1

Date: 2026-08-20

## Recovery

Previous Cursor chat was lost. Repo after recovery had:

- Prompt templates in `art-source/cozy/prompts/` (untracked)
- PNG refs copied from existing C3 L3 zone plates
- No L0/L1 files, no Journey Cozy chapters, no environmental obstacle set
- Runtime: 8 L3 zone webp + home-hero + dashboard banner
- Creature cutouts: `bosses/lord_of_empty_day.webp`, `mobs/night_call.webp` (rejected for this pack)
- `docs/audits/cozy-asset-production-v1.md` did not exist
- Claim of “~24 generated Home images” was **not** on disk

## Decisions

- Keep existing Home L3 plates. Generate L0/L1 only. Skip L2 when geometry would drift; runtime falls back L2 → L1.
- Main/daily obstacles are household metaphors, not kawaii creatures. IDs unchanged.
- No Cozy → Dark Fantasy fallback.
- Approved Cozy avatars untouched.
- Gameplay / economy unchanged.

## Status after this pass

| Family | Status |
|--------|--------|
| Home L0/L1 | 16/16 installed |
| Home L3 | 8/8 kept |
| Home L2 | skipped (fallback to L1) |
| Journey 1–9 | 9/9 |
| Main obstacles | 8/8 environmental |
| Daily obstacles | 8/8 environmental |
| Companions | 4/4 (Alabai is usable draft; breed still drifts toward retriever) |
| Seasons | 8/8 vignettes |
| Empty states | not generated (P6 after core) |

`GAME_ASSET_VERSION` = 67.
