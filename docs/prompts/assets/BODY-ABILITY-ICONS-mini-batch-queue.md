# Body Ability Icons — Mini-Batch Generation Queue

> **12 icons** for Body Abilities v1. Source: `src/game/bodyAbilities/bodyAbilityConfig.ts`  
> **Set manifest id:** `body-ability-icon-set-v1`  
> **Status:** prompt-ready / generation pending — **not in-app**, no UI wire in this sprint.

## Visual direction

- 1:1 RPG artifact / badge / token — **not** medical or fitness pictograms
- Dark fantasy + cozy, ember/gold accent, readable at **48–64px**
- Shared visual system across all 12 (see [`body-ability-icon-set-v1.md`](body-ability-icon-set-v1.md))

## Queue

| # | Asset id | Ability id | Title | Category | Prompt file | Target path | P | Notes |
|---|----------|------------|-------|----------|-------------|-------------|---|-------|
| 1 | `ability-tie_shoes_easier` | `tie_shoes_easier` | Легче завязать обувь | mobility | [`ability-tie_shoes_easier.md`](ability-tie_shoes_easier.md) | `public/game-assets/abilities/ability-mobility-shoes.webp` | P0 | Boots / laces |
| 2 | `ability-stand_from_floor` | `stand_from_floor` | Легче встать с пола | mobility | [`ability-stand_from_floor.md`](ability-stand_from_floor.md) | `public/game-assets/abilities/ability-mobility-floor.webp` | P0 | Rise from low surface |
| 3 | `ability-stairs_breath` | `stairs_breath` | Меньше одышки после лестницы | endurance | [`ability-stairs_breath.md`](ability-stairs_breath.md) | `public/game-assets/abilities/ability-endurance-stairs.webp` | P0 | Stairs + calm breath |
| 4 | `ability-long_route` | `long_route` | Проще пройти длинный маршрут | endurance | [`ability-long_route.md`](ability-long_route.md) | `public/game-assets/abilities/ability-endurance-route.webp` | P0 | Map / long path |
| 5 | `ability-stand_easier` | `stand_easier` | Проще стоять | mobility | [`ability-stand_easier.md`](ability-stand_easier.md) | `public/game-assets/abilities/ability-mobility-stand.webp` | P0 | Standing ease |
| 6 | `ability-car_easier` | `car_easier` | Проще ездить в машине | dailyLife | [`ability-car_easier.md`](ability-car_easier.md) | `public/game-assets/abilities/ability-daily-car.webp` | P0 | Car / daily travel |
| 7 | `ability-clothing_freer` | `clothing_freer` | Одежда сидит свободнее | clothing | [`ability-clothing_freer.md`](ability-clothing_freer.md) | `public/game-assets/abilities/ability-clothing-freer.webp` | P0 | Freer garment fit |
| 8 | `ability-household_easier` | `household_easier` | Проще заниматься бытом | dailyLife | [`ability-household_easier.md`](ability-household_easier.md) | `public/game-assets/abilities/ability-daily-household.webp` | P0 | Home / household |
| 9 | `ability-movement_confidence` | `movement_confidence` | Больше уверенности в движении | confidence | [`ability-movement_confidence.md`](ability-movement_confidence.md) | `public/game-assets/abilities/ability-confidence-movement.webp` | P0 | Steps + spark |
| 10 | `ability-recovery_awareness` | `recovery_awareness` | Мягче возвращаться после усталости | recovery | [`ability-recovery_awareness.md`](ability-recovery_awareness.md) | `public/game-assets/abilities/ability-recovery-awareness.webp` | P0 | Rest ember / chalice |
| 11 | `ability-journal_clarity` | `journal_clarity` | Яснее видеть свой день | confidence | [`ability-journal_clarity.md`](ability-journal_clarity.md) | `public/game-assets/abilities/ability-confidence-journal.webp` | P0 | Journal + quill |
| 12 | `ability-stairs_easier` | `stairs_easier` | Легче подниматься по лестнице | endurance | [`ability-stairs_easier.md`](ability-stairs_easier.md) | `public/game-assets/abilities/ability-endurance-stairs-up.webp` | P0 | Upward stairs |

## After generation

1. Place `.webp` files under `public/game-assets/abilities/`
2. Run `node scripts/build-asset-manifest.mjs` → `processed` / `files-on-disk`
3. **Separate sprint:** UI wire in `BodyAbilityV1Card` (emoji fallback remains until then)
4. Bump `GAME_ASSET_VERSION` only when in-app

## Excluded

- Cozy Campaign Variant
- New body abilities or unlock logic changes
- Batch 2 Visual QA scope
