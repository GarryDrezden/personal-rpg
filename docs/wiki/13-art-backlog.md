# Art Backlog

> **Asset Registry 2.0** — приоритеты визуальных ассетов без генерации в этом спринте.
> Машиночитаемый реестр: [`../assets/manifest.json`](../assets/manifest.json).
> Промпты: [`../prompts/assets/`](../prompts/assets/).

## Как читать таблицу

| Поле | Значение |
|------|----------|
| **Статус** | `idea` → `needed` → `prompt-ready` → `generated` → `processed` → `in-app` → `done` |
| **Промпт** | `missing` / `planned` / `ready` |
| **Файл** | `missing` / `planned` / `ready` |
| **Manifest** | `registered` когда запись есть в manifest.json |
| **Prompt file** | `docs/prompts/assets/{asset-id}.md` |

## Naming convention

```
public/game-assets/{folder}/{entity-type}-{index}-{semantic-name}.webp
```

Примеры:

- `public/game-assets/bosses/seasons/season-boss-01-empty-day-lord.webp`
- `public/game-assets/bosses/chapters/chapter-boss-01-ruins-warden.webp`
- `public/game-assets/base/base-stage-01-ember-camp.webp`
- `public/game-assets/abilities/ability-mobility-shoes.webp`
- `public/game-assets/rewards/season-01-core-spark.webp`

Правила: lowercase, kebab-case, `.webp` preferred, тяжёлые исходники не в `public/`.

## Placeholder strategy

1. **Каждый отсутствующий ассет** — безопасный fallback (emoji / icon / glow / gradient card).
2. **Никогда** не подставлять несуществующий `src` в `<img>` — `getAssetPathOrNull()` в `src/game/assetManifest.ts`.
3. **Journey chapters** — CSS gradient если `.webp` недоступен (уже в prod).
4. **Boss Campaign v1** — emoji из `bossConfig` до появления арта.
5. **Body Abilities / Camp** — emoji из config до иконок/сцен.

---

## Dark MVP Visual Priority Pack v1

> Первый минимальный пакет для **генерации** Dark MVP. Статус `prompt-ready` = промпт готов, **файла ещё нет**. Не смешивать с Future Cozy Campaign.

| id | Название | Категория | P | Где используется | Статус | Prompt file | Expected path | Комментарий |
|----|----------|-----------|---|------------------|--------|-------------|---------------|-------------|
| `onboarding-core-awakening` | Пробуждение ядра | onboardingArt | P0 | `/start`, OnboardingGate | processed | [`onboarding-core-awakening.md`](../prompts/assets/onboarding-core-awakening.md) | `public/game-assets/onboarding/core-awakening.webp` | Старт кампании, ядро в руинах |
| `empty-state-no-entries` | Нет записей | emptyStates | P0 | Dashboard, Measurements | prompt-ready | [`empty-state-no-entries.md`](../prompts/assets/empty-state-no-entries.md) | `public/game-assets/empty-states/no-entries.webp` | Без стыда — «первые следы» |
| `body-ability-icon-set-v1` | Иконки способностей ×12 | bodyAbilities | P0 | `/growth/abilities` | prompt-ready | [`body-ability-icon-set-v1.md`](../prompts/assets/body-ability-icon-set-v1.md) | `public/game-assets/abilities/ability-*.webp` | RPG tokens, not medical |
| `camp-base-stage-01-ember-camp` | Тлеющий костёр | campBase | P0 | BaseDashboardSummary, `/growth/camp` | processed | [`camp-base-stage-01-ember-camp.md`](../prompts/assets/camp-base-stage-01-ember-camp.md) | `public/game-assets/base/base-stage-01-ember-camp.webp` | Место возвращения |
| `camp-base-stage-02-shelter` | Укрытие | campBase | P0 | BaseDashboardSummary, `/growth/camp` | processed | [`camp-base-stage-02-shelter.md`](../prompts/assets/camp-base-stage-02-shelter.md) | `public/game-assets/base/base-stage-02-trail-shelter.webp` | Ранний путь, надёжнее огонь |
| `plateau-artifact-pass-stone` | Камень перевала | plateauArtifacts | P1 | PlateauDashboardSummary | prompt-ready | [`plateau-artifact-pass-stone.md`](../prompts/assets/plateau-artifact-pass-stone.md) | `public/game-assets/artifacts/plateau-pass-stone.webp` | Удержание, не провал |
| `season-01-reward-core-spark` | Искра ядра | seasonRewards | P1 | SeasonDashboardSummary | processed | [`season-01-reward-core-spark.md`](../prompts/assets/season-01-reward-core-spark.md) | `public/game-assets/rewards/season-01-core-spark.webp` | Награда сезона 1 |
| `season-boss-01-empty-day-lord` | Владыка Пустого Дня | seasonBosses | P1 | SeasonTodayCard | prompt-ready | [`season-boss-01-empty-day-lord.md`](../prompts/assets/season-boss-01-empty-day-lord.md) | `public/game-assets/bosses/seasons/season-boss-01-empty-day-lord.webp` | Сопротивление пустому дню |

**Workflow после генерации:** `generated` → `processed` (webp) → `in-app` (файл в `public/`) → bump `GAME_ASSET_VERSION` → optional UI wire.

### Dark MVP Asset Generation Batch 1 (active)

> **Очередь:** [`BATCH-01-nano-banana-queue.md`](../prompts/assets/BATCH-01-nano-banana-queue.md)
**Batch 1 Visual QA (2026-06):** все 4 in-app; лёгкий polish layout/crop/copy. Визуальные долги: onboarding — acceptable v1 (watch crop on 375px); camp stages — acceptable v1; season spark — acceptable v1 (icon row, не «получено»).

| id | P | Prompt | Path | Status | UI |
|----|---|--------|------|--------|-----|
| `onboarding-core-awakening` | P0 | [prompt](../prompts/assets/onboarding-core-awakening.md) | `onboarding/core-awakening.webp` | in-app | `/start` |
| `camp-base-stage-01-ember-camp` | P0 | [prompt](../prompts/assets/camp-base-stage-01-ember-camp.md) | `base/base-stage-01-ember-camp.webp` | in-app | `/growth/camp`, `BaseStageRail` |
| `camp-base-stage-02-shelter` | P0 | [prompt](../prompts/assets/camp-base-stage-02-shelter.md) | `base/base-stage-02-trail-shelter.webp` | in-app | `/growth/camp`, `BaseStageRail` |
| `season-01-reward-core-spark` | P1 | [prompt](../prompts/assets/season-01-reward-core-spark.md) | `rewards/season-01-core-spark.webp` | in-app | `SeasonDashboardSummary` (сезон 1) |

**Не в Batch 1:** empty-state, plateau artifact, season boss 1 — **Batch 2** (см. ниже). Body ability icons — отдельный mini-batch.

### Dark MVP Batch 2 — prepared

> **Очередь:** [`BATCH-02-nano-banana-queue.md`](../prompts/assets/BATCH-02-nano-banana-queue.md)
> **Статус:** `prompt-ready` / `fileStatus: needed` — generation pending. UI wire — отдельный спринт.

| id | targetPath | priority | status | prompt file | intended UI |
|----|------------|----------|--------|-------------|-------------|
| `empty-state-no-entries` | `public/game-assets/empty-states/no-entries.webp` | P0 | **in-app** | [`empty-state-no-entries.md`](../prompts/assets/empty-state-no-entries.md) | Dashboard path empty, Measurements chart empty |
| `plateau-artifact-pass-stone` | `public/game-assets/artifacts/plateau-pass-stone.webp` | P1 | **in-app** | [`plateau-artifact-pass-stone.md`](../prompts/assets/plateau-artifact-pass-stone.md) | `PlateauDashboardSummary`, `PlateauTodayCard` |
| `season-boss-01-empty-day-lord` | `public/game-assets/bosses/seasons/season-boss-01-empty-day-lord.webp` | P1 | **in-app** | [`season-boss-01-empty-day-lord.md`](../prompts/assets/season-boss-01-empty-day-lord.md) | `SeasonTodayCard`, `SeasonDashboardSummary`, `ChapterBossCard`, `GameCodexPage`, `JourneyBossMini`, `getBossPublicPath` |

**Не в Batch 2:** `body-ability-icon-set-v1` (12 иконок) — отдельный mini-batch.

### Dark MVP Batch 2 — in-app (2026-06)

> **Очередь:** [`BATCH-02-nano-banana-queue.md`](../prompts/assets/BATCH-02-nano-banana-queue.md)
> **Optimization:** `node scripts/optimize-batch2-webp.mjs` — resize + webp recompress (~85–100 KB banners, ~45 KB artifact).

| id | UI | Status |
|----|-----|--------|
| `empty-state-no-entries` | `DashboardPathEmptyState`, `MeasurementsPage` empty chart | in-app |
| `plateau-artifact-pass-stone` | `PlateauDashboardSummary`, `PlateauTodayCard` | in-app |
| `season-boss-01-empty-day-lord` | `SeasonTodayCard`, `SeasonDashboardSummary`, `ChapterBossCard`, `GameCodexPage`, `JourneyBossMini`, `getBossPublicPath` | in-app |

**Superseded:** `boss-lord-of-empty-day` (legacy PNG removed) → `season-boss-01-empty-day-lord`.

**Later (not in scope):** Boss art lightbox / full view in Codex.

**Visual QA:** отдельный спринт после wire.

---

## Body Ability Icons Mini-Batch — partial in-app (4/12)

> **Очередь:** [`BODY-ABILITY-ICONS-mini-batch-queue.md`](../prompts/assets/BODY-ABILITY-ICONS-mini-batch-queue.md)  
> **Источник:** `src/game/bodyAbilities/bodyAbilityConfig.ts` (12 abilities)  
> **Статус:** group 1 **in-app** on skill board; remaining 8 **prompt-ready** / emoji fallback.

| Asset id | Ability id | Title | Category | Prompt | Target path | P | Status |
|----------|------------|-------|----------|--------|-------------|---|--------|
| `ability-tie_shoes_easier` | `tie_shoes_easier` | Легче завязать обувь | mobility | [`ability-tie_shoes_easier.md`](../prompts/assets/ability-tie_shoes_easier.md) | `public/game-assets/abilities/ability-mobility-shoes.webp` | P0 | **in-app** |
| `ability-stand_from_floor` | `stand_from_floor` | Легче встать с пола | mobility | [`ability-stand_from_floor.md`](../prompts/assets/ability-stand_from_floor.md) | `public/game-assets/abilities/ability-mobility-floor.webp` | P0 | **in-app** |
| `ability-stairs_breath` | `stairs_breath` | Меньше одышки после лестницы | endurance | [`ability-stairs_breath.md`](../prompts/assets/ability-stairs_breath.md) | `public/game-assets/abilities/ability-endurance-stairs.webp` | P0 | **in-app** |
| `ability-long_route` | `long_route` | Проще пройти длинный маршрут | endurance | [`ability-long_route.md`](../prompts/assets/ability-long_route.md) | `public/game-assets/abilities/ability-endurance-route.webp` | P0 | **in-app** |
| `ability-stand_easier` | `stand_easier` | Проще стоять | mobility | [`ability-stand_easier.md`](../prompts/assets/ability-stand_easier.md) | `public/game-assets/abilities/ability-mobility-stand.webp` | P0 | prompt-ready |
| `ability-car_easier` | `car_easier` | Проще ездить в машине | dailyLife | [`ability-car_easier.md`](../prompts/assets/ability-car_easier.md) | `public/game-assets/abilities/ability-daily-car.webp` | P0 | prompt-ready |
| `ability-clothing_freer` | `clothing_freer` | Одежда сидит свободнее | clothing | [`ability-clothing_freer.md`](../prompts/assets/ability-clothing_freer.md) | `public/game-assets/abilities/ability-clothing-freer.webp` | P0 | prompt-ready |
| `ability-household_easier` | `household_easier` | Проще заниматься бытом | dailyLife | [`ability-household_easier.md`](../prompts/assets/ability-household_easier.md) | `public/game-assets/abilities/ability-daily-household.webp` | P0 | prompt-ready |
| `ability-movement_confidence` | `movement_confidence` | Больше уверенности в движении | confidence | [`ability-movement_confidence.md`](../prompts/assets/ability-movement_confidence.md) | `public/game-assets/abilities/ability-confidence-movement.webp` | P0 | prompt-ready |
| `ability-recovery_awareness` | `recovery_awareness` | Мягче возвращаться после усталости | recovery | [`ability-recovery_awareness.md`](../prompts/assets/ability-recovery_awareness.md) | `public/game-assets/abilities/ability-recovery-awareness.webp` | P0 | prompt-ready |
| `ability-journal_clarity` | `journal_clarity` | Яснее видеть свой день | confidence | [`ability-journal_clarity.md`](../prompts/assets/ability-journal_clarity.md) | `public/game-assets/abilities/ability-confidence-journal.webp` | P0 | prompt-ready |
| `ability-stairs_easier` | `stairs_easier` | Легче подниматься по лестнице | endurance | [`ability-stairs_easier.md`](../prompts/assets/ability-stairs_easier.md) | `public/game-assets/abilities/ability-endurance-stairs-up.webp` | P0 | prompt-ready |

**Set entry:** `body-ability-icon-set-v1` — cohesive RPG token system (not medical icons).

**Later (not in scope):** ability icon lightbox / full view.

### Body Abilities — RPG skill board UI (2026-06)

- `/growth/abilities` → `BodyAbilitySkillBoard` (large medallion cards, hero + footer).
- Manifest ids wired via `getBodyAbilityManifestAssetId()`; **emoji fallback** when `.webp` absent or not in-app.
- **Group 1 (4/12) in-app:** `tie_shoes_easier`, `stand_from_floor`, `stairs_breath`, `long_route`.
- Remaining 8: prompt-ready / emoji fallback.
- **Polish (2026-06):** larger medallions (128–164px), lighter overlay on in-app art, counters «Открыто / На маршруте / Осталось проявиться», supportive state copy, featured row label.
- **Polish (2026-06, pass 2):** RPG-style lucide glyph fallback (no emoji); CTA only on discovered/hintActive cards.

---

## P0 — MVP Visual Core

> Важно учесть и не потерять. **Не значит «срочно генерировать».**

### Мужской герой (anchor stages)

| Название | Тип | Где используется | Связанная система | Статус | Приоритет | Промпт | Файл | Manifest | Комментарий |
|----------|-----|------------------|-------------------|--------|-----------|--------|------|----------|-------------|
| Male stage 01–03, 19–20 | hero-stage | Dashboard, Codex, Journey | heroStages | in-app | P0 | ready | ready | registered | Anchor PNG в `public/` |
| Male stages 04–18 (variant) | hero-stage | assetPaths fallback | heroStages | in-app | P0 | ready | ready | registered | `variants/dark-fantasy/` |
| Journey chapter 1–9 | journey-chapter-bg | Journey Map v3 | journeyChapterVisuals | in-app | P0 | ready | ready | registered | `.webp` в `maps/chapters/` |
| Companions ×4 | companion | Onboarding, Codex | assetRegistry | in-app | P0 | ready | ready | registered | PNG approved |
| Body ability icons ×12 | body-ability-icon | Growth abilities | bodyAbilityConfig | partial-in-app | P0 | prompt-ready | 4/12 ready | registered | Group 1 in-app; 8 emoji fallback |
| Camp base stage 1 (ember) | camp-base-scene | Dashboard, /growth/camp | baseProgressionConfig | needed | P0 | ready | missing | registered | Prompt template ready |
| Season boss (current) | season-mini-boss | SeasonTodayCard | bossCampaign v1 | needed | P0 | ready* | missing | registered | Emoji until art; *S01–02 prompts first |
| Onboarding core awakening | onboarding-hero | /start | Onboarding v1 | needed | P0 | ready | missing | registered | Text ritual OK without image |
| Empty states ×2 | empty-state | Dashboard, Growth | UI | needed | P0 | planned | missing | registered | Gradient + symbol |

**Prompt file:** см. [`_template-nano-banana-asset.md`](../prompts/assets/_template-nano-banana-asset.md)

---

## P1 — Campaign Visual Polish

### Season mini-bosses (13)

| Название | Тип | Где используется | Связанная система | Статус | Приоритет | Промпт | Файл | Manifest |
|----------|-----|------------------|-------------------|--------|-----------|--------|------|----------|
| Владыка Пустого Дня … Тень Старого Года | season-mini-boss | Season cards | bossConfig SEASON_MINI_BOSSES | needed | P1 | planned | missing | registered |

**Prompt file:** [`_template-boss.md`](../prompts/assets/_template-boss.md) → `docs/prompts/assets/season-boss-NN.md`

### Camp / base scenes (8)

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| Тлеющий костёр → Цитадель формы | camp-base-scene | /growth/camp | baseProgressionConfig | needed | P1 | planned | missing | registered |

### Daily mobs (improve)

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| 8 daily mobs | mob | Today, Codex | dailyMobEngine | **in-app** | P1 | ready | ready | registered | Polish / .webp migration later |

### Season rewards (13)

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| Искра ядра … Артефакт года | season-reward | Season summary | seasonConfig | needed | P1 | planned | missing | registered |

### Plateau artifact

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| Страж перевала | plateau-artifact | Plateau card | plateauEngine | needed | P1 | planned | missing | registered |

### Improved companions / onboarding

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| Companion polish | companion | Codex | assetRegistry | in-app | P1 | ready | ready | registered | Optional .webp refresh |
| Onboarding illustrations | onboarding-art | /start | Onboarding | needed | P1 | ready | missing | registered |

---

## P2 — Future Expansion

| Название | Тип | Где | Система | Статус | P | Комментарий |
|----------|-----|-----|---------|--------|---|-------------|
| Chapter bosses ×9 | chapter-boss | Journey detail | bossConfig CHAPTER_BOSSES | needed | P2 | Emoji in v1 |
| Act bosses ×3 | act-boss | future act UI | bossConfig ACT_BOSSES | needed | P2 | Not in UI v1 |
| Codex artifact set (15) | artifact-set | Codex | assetRegistry | needed | P2 | Paths in code |
| Achievement badge set | achievement-badge | Growth | achievements.ts | needed | P2 | iconKey per achievement |
| Female hero full polish | hero-stage | Dashboard | female 1–20 in-app | in-app | P2 | Already in repo; P2 for theme parity |

### Future Cozy Campaign Variant

**Не часть Dark MVP P0/P1.** Отдельная добрая/мягкая эмоциональная оболочка **тех же** core mechanics (день, сезон, abilities, plateau, camp).

| Будущие ассеты | Описание |
|----------------|----------|
| Cozy cat avatar stages | Большой милый кот → легче, подвижнее, увереннее (20 стадий) |
| Cozy obstacles / шкодники | Вместо dark bosses — игривые блокеры, сонные духи |
| Cozy camp / home | Отдельные сцены лагеря, не recolor dark base |
| Cozy rewards | Отдельный flavor наград сезонов |
| Cozy season copy | Параллельный каталог, не перевод dark имён |

**Правило:** не смешивать с dark bosses, не делать simple recolor. См. [`07-decision-log.md`](07-decision-log.md).

---

## P3 — Later / Nice to have

| Название | Тип | Статус | Комментарий |
|----------|-----|--------|-------------|
| Logo dark fantasy | logo | needed | Heraldic Huginn/Muninn |
| New Game+ art | — | idea | **Out of scope** — track only |
| Alternate themes | hero-variant | idea | **Cozy Campaign** — parallel content track (cat hero, cozy obstacles), not post-dark stage. See decision log. |
| Advanced animations | — | idea | Hero stage transitions |
| Seasonal recap illustrations | season-recap | idea | No recap screen in v1 |
| Male hero stages 4–18 root PNG | hero-stage | partial | Variants cover runtime |

---

## Workflow

```
Backlog (this file) → prompt file → generate (manual) → public/game-assets/
→ manifest status in-app → bump GAME_ASSET_VERSION → optional UI wire
```

## Связанные документы

- [`06-assets-gallery.md`](06-assets-gallery.md) — галерея и manifest schema
- [`04-brandbook.md`](04-brandbook.md) — визуальное направление
- [`05-ai-prompts.md`](05-ai-prompts.md) — общий workflow промптов
