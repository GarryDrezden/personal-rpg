# Assets Gallery

## Зачем

Галерея — единый реестр игровых ассетов с **категориями**, **приоритетами**, **статусами** и **заметками**.

**Asset Registry 2.0** расширяет v1: отслеживание boss/base/ability/reward ассетов до генерации.

Cursor и ChatGPT читают manifest, чтобы понимать что есть, что нужно, и где используется.

## Файлы

| Файл | Назначение |
|------|------------|
| [`../assets/gallery.md`](../assets/gallery.md) | Краткое описание workflow |
| [`../assets/manifest.json`](../assets/manifest.json) | Машиночитаемый реестр v2 |
| [`13-art-backlog.md`](13-art-backlog.md) | Приоритеты P0–P3, backlog по спринтам |
| [`../prompts/assets/`](../prompts/assets/) | Шаблоны Nano Banana промптов |
| `public/game-assets/` | Фактические файлы на сайте |
| `src/game/assetPaths.ts` | Runtime paths + cache version |
| `src/game/assetManifest.ts` | Helpers: `getAssetById`, `getEntityAsset`, placeholders |
| `scripts/build-asset-manifest.mjs` | Регенерация manifest из конвенций |

## Manifest schema (v2)

Каждая запись:

| Поле | Описание |
|------|----------|
| `id` | Уникальный kebab-case id |
| `type` | hero-stage, season-mini-boss, camp-base-scene, … |
| `category` | hero, journeyChapters, seasonBosses, campBase, … |
| `title` | Человекочитаемое название |
| `status` | idea / needed / prompt-ready / generated / processed / in-app / needs-redesign / done |
| `priority` | P0 (MVP core) … P3 (later) |
| `path` | Путь в `public/` для in-app/done |
| `targetPath` | Целевой путь для needed ассетов |
| `usedIn` | Экраны / модули |
| `relatedEntityId` | Связь с bossConfig, bodyAbilityConfig, … |
| `promptStatus` | missing / planned / ready / **prompt-ready** |
| `fileStatus` | missing / **needed** / planned / ready |
| `manifestStatus` | registered |
| `notes` | Контекст, fallback, privacy |

## Категории

`hero`, `femaleHero`, `bodyStages`, `journeyChapters`, `companions`, `dailyMobs`, `seasonBosses`, `chapterBosses`, `actBosses`, `campBase`, `bodyAbilities`, `seasonRewards`, `plateauArtifacts`, `achievementBadges`, `onboardingArt`, `emptyStates`, `uiIcons`

## Статусы жизненного цикла

| Статус | Значение |
|--------|----------|
| `idea` | Идея, не в работе |
| `needed` | Нужен для кампании, placeholder в UI |
| `prompt-ready` | Промпт готов к генерации (`docs/prompts/assets/{id}.md`) — **файла ещё нет** |
| `generated` | Сырой вывод из генератора |
| `processed` | Обработан (crop, webp) |
| `in-app` | Файл в `public/`, используется или готов к wire |
| `needs-redesign` | Перегенерация |
| `done` | Утверждено, финал |

Legacy v1 статусы (`approved`, `draft`, …) сохранены в поле `legacyStatus` где уместно.

## Приоритеты

| Priority | Meaning |
|----------|---------|
| **P0** | MVP visual core — учесть, не потерять |
| **P1** | Campaign polish — season bosses, base scenes, rewards |
| **P2** | Chapter/act bosses, artifacts, badges |
| **P3** | Logo, themes, nice-to-have |

## Placeholder strategy

- Отсутствующий ассет → emoji / icon / glow / gradient (никогда broken image).
- `getAssetPathOrNull()` — только для `in-app` / `done`.
- Journey: gradient fallback уже в `JourneyChapterVignette`.
- Boss Campaign v1: emoji из config.

## Dark MVP Visual Priority Pack v1

Первый минимальный пакет ассетов для **Dark Campaign MVP** — 8 записей в manifest (`darkMvpVisualPriorityPackV1.assetIds`).

| P0 | P1 |
|----|-----|
| onboarding-core-awakening | plateau-artifact-pass-stone |
| empty-state-no-entries | season-01-reward-core-spark |
| body-ability-icon-set-v1 | season-boss-01-empty-day-lord |
| camp-base-stage-01-ember-camp | |
| camp-base-stage-02-shelter | |

**Prompt files:** `docs/prompts/assets/{asset-id}.md` — визуальные брифы для Nano Banana.

**`prompt-ready` ≠ generated:** статус значит, что промпт написан и manifest обновлён; изображение ещё не создано. UI продолжает использовать placeholders.

**После генерации:**

1. Положить файл по `targetPath` в `public/game-assets/`
2. Обновить manifest: `status` → `generated` → `processed` → `in-app`, `fileStatus` → `ready`, добавить `path`
3. `npm test` — path validation для in-app
4. Bump `GAME_ASSET_VERSION`
5. Отдельный спринт — wire в UI (не автоматически)

**Future Cozy Campaign** — не входит в этот пакет. См. [`13-art-backlog.md`](13-art-backlog.md) → Future Cozy Campaign Variant.

## Dark MVP Asset Generation Batch 1

Первый **дроп генерации** (4 ассета): onboarding + camp 1–2 + season 1 reward.

| Документ | Назначение |
|----------|------------|
| [`BATCH-01-nano-banana-queue.md`](../prompts/assets/BATCH-01-nano-banana-queue.md) | Очередь для Nano Banana: id, prompt, ratio, output path |
| `manifest.darkMvpAssetGenerationBatch1` | Машиночитаемый статус батча |

**Pipeline (Batch 1 — done):**

```
prompt-ready → Nano Banana → public/ → build-asset-manifest.mjs → in-app (BATCH_1_IN_APP)
```

**Batch 1 UI wire (2026-06):** 4/4 ассетов подключены через `ManifestArtScene` + `getManifestAssetUrl()`:

| id | UI |
|----|-----|
| `onboarding-core-awakening` | `/start` (`StartRoutePage`) |
| `camp-base-stage-01-ember-camp` | `/growth/camp`, `BaseStageRail` (stage ember) |
| `camp-base-stage-02-shelter` | `/growth/camp`, `BaseStageRail` (stage shelter) |
| `season-01-reward-core-spark` | `SeasonDashboardSummary` (сезон 1) |

`GAME_ASSET_VERSION` = **24**. Fallback: lucide glyph / gradient если `getManifestAssetUrl()` → null.

**Visual QA (2026-06):** Batch 1 connected and polished — onboarding art только шаг 0; camp thumbnails с dim locked; season reward full-width banner.

## Dark MVP Asset Generation Batch 2

Второй **дроп генерации** (3 ассета): empty state + plateau artifact + season 1 boss. **In-app** (2026-06).

| Документ | Назначение |
|----------|------------|
| [`BATCH-02-nano-banana-queue.md`](../prompts/assets/BATCH-02-nano-banana-queue.md) | Generation queue: id, prompt, ratio, output path |
| `scripts/optimize-batch2-webp.mjs` | Resize + webp recompress in place |
| `manifest.darkMvpAssetGenerationBatch2` | Машиночитаемый статус батча |

**Pipeline (Batch 2 — done):**

```
generate → optimize → public/ → build-asset-manifest.mjs → in-app (BATCH_2_IN_APP)
```

| id | UI | P |
|----|-----|---|
| `empty-state-no-entries` | `DashboardPathEmptyState`, `MeasurementsPage` | P0 |
| `plateau-artifact-pass-stone` | `PlateauDashboardSummary`, `PlateauTodayCard` | P1 |
| `season-boss-01-empty-day-lord` | `SeasonTodayCard`, `SeasonDashboardSummary`, `ChapterBossCard`, `GameCodexPage`, `JourneyBossMini`, `getBossPublicPath` | P1 |

**Optimization (2026-06):** ~2 MB sources → ~85 KB / ~45 KB / ~100 KB webp.

**Исключено:** `body-ability-icon-set-v1` — отдельный mini-batch. Cozy Campaign — не в scope.

## Body Ability Icons v1 — complete (12/12 in-app)

12 иконок Body Abilities v1 — **12/12 in-app** on skill board. Visual icon set v1 complete.

**Roadmap (2026-06):** catalog expanded to **36 entries** on skill board — only these 12 have art. Additional 24 future abilities use glyph placeholders (no manifest entries). Future icon batches: v2/v3.

| Документ | Назначение |
|----------|------------|
| [`BODY-ABILITY-ICONS-mini-batch-queue.md`](../prompts/assets/BODY-ABILITY-ICONS-mini-batch-queue.md) | Queue: 12 ability icons |
| `ability-{entityId}.md` | Per-ability Nano Banana prompts |
| `manifest.bodyAbilityIconsMiniBatch` | Batch metadata (`in-app`, 12/12, `v1Complete`) |

**All 12 in-app (display order):**

| # | Ability id | File |
|---|------------|------|
| 1 | `stand_easier` | `ability-mobility-stand.webp` |
| 2 | `tie_shoes_easier` | `ability-mobility-shoes.webp` |
| 3 | `stand_from_floor` | `ability-mobility-floor.webp` |
| 4 | `stairs_breath` | `ability-endurance-stairs.webp` |
| 5 | `long_route` | `ability-endurance-route.webp` |
| 6 | `car_easier` | `ability-daily-car.webp` |
| 7 | `clothing_freer` | `ability-clothing-freer.webp` |
| 8 | `household_easier` | `ability-daily-household.webp` |
| 9 | `movement_confidence` | `ability-confidence-movement.webp` |
| 10 | `recovery_awareness` | `ability-recovery-awareness.webp` |
| 11 | `journal_clarity` | `ability-confidence-journal.webp` |
| 12 | `stairs_easier` | `ability-endurance-stairs-up.webp` |

**Note:** Icon set v1 closes MVP visual coverage. Future Body Abilities expansions (24–36) are a separate roadmap item.

**Visual variety pass (2026-06):** `movement_confidence` and `stairs_breath` icons were redesigned to reduce duplicate route/stair motifs on the skill board. `long_route` keeps the long-path motif; `stairs_easier` keeps the stair-climb motif.

**Visual rule:** RPG artifacts / badges / tokens — **not** medical, hospital, or fitness pictograms.  
**Format:** 1:1, readable at **48–64px**, dark fantasy + cozy, ember/gold accent.

**UI:** `BodyAbilitySkillBoard`, `/growth/abilities` — active 12 use manifest art; future 24 use glyph placeholders; 3 progression rings; lucide glyph safety fallback for missing/future assets.

## Body Abilities — RPG skill board (2026-06)

`/growth/abilities` uses `BodyAbilitySkillBoard`:
- hero header («Прогресс — это не только вес»)
- 12 large medallion cards (128–160px art zone)
- states: locked / discovered / unlocked / recentlyUnlocked (derived; ≤21 days since unlock)
- manifest via `getBodyAbilityManifestAssetId()` + lucide glyph safety fallback
- **all 12 in-app:** full skill board manifest art v1

## Workflow

```
Backlog (13-art-backlog.md)
  → prompt (docs/prompts/assets/{id}.md)
  → generate (manual, Nano Banana)
  → public/game-assets/
  → manifest status in-app (Batch 1 wired) or processed (awaiting wire)
  → bump GAME_ASSET_VERSION
  → deploy
```

Регенерация skeleton manifest:

```bash
node scripts/build-asset-manifest.mjs
```

Валидация (tests): `src/game/assetManifest.test.ts`, `src/game/assetBatch1.test.ts`, `src/game/bodyAbilityAssetBatch.test.ts`

## Privacy

Не добавлять в manifest приватные фото или raw references пользователя.

См. [`09-privacy-plan.md`](09-privacy-plan.md).
