# Companions

## Roster

| ID | Name (RU) | Species | Asset |
|----|-----------|---------|-------|
| `golden_chinchilla_cat` | Золотая британская | Cat | `companions/golden-chinchilla-cat.png` |
| `alabai` | Алабай | Dog | `companions/alabai.png` |
| `raven` | Ворон | Bird | `companions/raven.png` |
| `fox_cub` | Лисёнок | Fox | `companions/fox-cub.png` |

## Visual style

- Stylized realistic 3D, same family as hero
- Transparent background
- Readable at card size (~128–256px)
- Warm, loyal, not cartoonish

## Roles (design intent)

| Companion | Role in narrative |
|-----------|-------------------|
| Cat | Уют, мягкость, домашняя опора |
| Alabai | Сила, защита, устойчивость |
| Raven | Наблюдение, мудрость, связь с логотипом (Huginn/Muninn) |
| Fox cub | Любопытство, лёгкость, игривый импульс |

## Future

- Paired scenes: hero + companion (premium / codex cinematic)
- Companion reactions on recovery days
- Journey map nodes with companion hints

## Prompts

[`../prompts/image-generation/companions.md`](../prompts/image-generation/companions.md)

## Code

- Paths: `getCompanionPublicPath()` in `src/game/assetPaths.ts`
- Legacy fallback: `/images/pets/*.png`
