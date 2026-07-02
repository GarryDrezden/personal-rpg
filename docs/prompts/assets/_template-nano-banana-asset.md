# Nano Banana — Asset Prompt Template

> Copy this file to `docs/prompts/assets/{asset-id}.md` and fill in for a specific asset.
> Visual direction only — not a technical spec.

## Asset

| Field | Value |
|-------|--------|
| **Asset ID** | `{asset-id}` |
| **Title** | {human title} |
| **Category** | {category} |
| **Priority** | P0 / P1 / P2 / P3 |
| **Target path** | `public/game-assets/...` |

## Scene & mood

Describe one clear moment. What should the player *feel*?

- Dark fantasy + cozy — premium mobile RPG, not horror, not anime, not flat vector.
- Motivational resistance, not disgust or gore.
- Soft cinematic light, readable silhouette, game-ready framing.

## Subject

- **Who / what:** (hero stage, boss, camp scene, icon subject…)
- **Pose / action:** (static hero portrait, boss looming, camp at dusk…)
- **Emotion:** (return, relief, quiet strength — not fitness-model aggression)

## Composition

- **Framing:** portrait / vignette / wide scene / square icon
- **Background:** simple, depth of field, no clutter
- **Focal point:** where the eye lands first

## Style anchors

- Stylized realistic 3D game art
- Dark fantasy palette with warm accent (gold/ember)
- Premium mobile RPG UI companion art
- **Avoid:** horror, gore, anime eyes, corporate illustration, bodybuilder stage 20

## Negative prompt

horror, gore, blood, anime style, flat vector, stock photo, text watermark, logo, blurry face, extra limbs, fitness model, bodybuilder

## Output notes

- Preferred runtime: `.webp`
- Naming: `lowercase-kebab-case` per manifest conventions
- After approval: update `docs/assets/manifest.json` status → `in-app`, bump `GAME_ASSET_VERSION`
