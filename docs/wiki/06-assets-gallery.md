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
| `promptStatus` | missing / planned / ready |
| `fileStatus` | missing / planned / ready |
| `manifestStatus` | registered |
| `notes` | Контекст, fallback, privacy |

## Категории

`hero`, `femaleHero`, `bodyStages`, `journeyChapters`, `companions`, `dailyMobs`, `seasonBosses`, `chapterBosses`, `actBosses`, `campBase`, `bodyAbilities`, `seasonRewards`, `plateauArtifacts`, `achievementBadges`, `onboardingArt`, `emptyStates`, `uiIcons`

## Статусы жизненного цикла

| Статус | Значение |
|--------|----------|
| `idea` | Идея, не в работе |
| `needed` | Нужен для кампании, placeholder в UI |
| `prompt-ready` | Промпт готов к генерации |
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

## Workflow

```
Backlog (13-art-backlog.md)
  → prompt (docs/prompts/assets/{id}.md)
  → generate (manual, Nano Banana)
  → public/game-assets/
  → manifest status in-app
  → bump GAME_ASSET_VERSION
  → deploy
```

Регенерация skeleton manifest:

```bash
node scripts/build-asset-manifest.mjs
```

Валидация (tests): `src/game/assetManifest.test.ts`

## Privacy

Не добавлять в manifest приватные фото или raw references пользователя.

См. [`09-privacy-plan.md`](09-privacy-plan.md).
