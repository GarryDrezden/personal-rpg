# Image Generation — README

## Models

| Tool | Use case |
|------|----------|
| **Nano Banana** | Hero stages, quick iterations |
| **Leonardo** | Companions, mobs, bosses |
| **ChatGPT Images** | Concept exploration, logo drafts |

Указывай модель в `manifest.json` → field `source`.

## Where to store prompts

```
docs/prompts/image-generation/
  hero-male-stages.md
  hero-female-stages.md
  companions.md
  …
```

Legacy full library: [`../../HERO_STAGE_PROMPTS_V2.md`](../../HERO_STAGE_PROMPTS_V2.md)

## Workflow

1. **Generate** with universal style block (see `HERO_STAGE_PROMPTS_V2.md`)
2. **Review** — dark fantasy vs cozy theme
3. **Post-process:** `python local/tools/process_hero_png.py <file>`
4. **Save** to `public/game-assets/` (correct path)
5. **Manifest** — add entry with status `candidate` or `approved`
6. **Bump** `GAME_ASSET_VERSION` in `src/game/assetPaths.ts`
7. **Deploy** — push to main (GitHub Actions)

## Marking good results

| Action | Manifest |
|--------|----------|
| Good draft | `status: candidate` |
| Approved for prod | `status: approved` + file in `public/game-assets/` |
| Wrong theme/style | `status: rejected` + notes |
| Superseded | `status: archived` |

## Theme assignment

- Dark neutral clothes → `theme: darkFantasy`
- Bright casual (pink shirt, yellow shorts) → `theme: cozy`, **not** main hero line

## Privacy

- Private reference photos → `private-assets/` only (gitignored)
- Never commit raw body/face photos
- Repo gets stylized game art output only

## Per-category prompts

- [Hero male](hero-male-stages.md)
- [Hero female](hero-female-stages.md)
- [Companions](companions.md)
- [Mobs](mobs.md)
- [Bosses](bosses.md)
- [Artifacts](artifacts.md)
- [Logos](logos.md)
