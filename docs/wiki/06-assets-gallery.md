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

`GAME_ASSET_VERSION` = **20**. Fallback: emoji/gradient если `getManifestAssetUrl()` → null.

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

Валидация (tests): `src/game/assetManifest.test.ts`, `src/game/assetBatch1.test.ts`

## Privacy

Не добавлять в manifest приватные фото или raw references пользователя.

См. [`09-privacy-plan.md`](09-privacy-plan.md).
