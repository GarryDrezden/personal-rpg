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

## Body Ability Icons v1 — complete (12/12 in-app)

> **Очередь:** [`BODY-ABILITY-ICONS-mini-batch-queue.md`](../prompts/assets/BODY-ABILITY-ICONS-mini-batch-queue.md)  
> **Источник:** `src/game/bodyAbilities/bodyAbilityConfig.ts` (36 roadmap entries; 12 with art)  
> **Статус:** **12/12 in-app** on skill board — visual icon set v1 complete. **24 future** entries — text/glyph only on skill board (no manifest, no art batch yet).

### Active v1 (12) — in-app icons

| Asset id | Ability id | Title | Category | Prompt | Target path | P | Status |
|----------|------------|-------|----------|--------|-------------|---|--------|
| `ability-stand_easier` | `stand_easier` | Проще стоять | mobility | [`ability-stand_easier.md`](../prompts/assets/ability-stand_easier.md) | `public/game-assets/abilities/ability-mobility-stand.webp` | P0 | **in-app** |
| `ability-tie_shoes_easier` | `tie_shoes_easier` | Легче завязать обувь | mobility | [`ability-tie_shoes_easier.md`](../prompts/assets/ability-tie_shoes_easier.md) | `public/game-assets/abilities/ability-mobility-shoes.webp` | P0 | **in-app** |
| `ability-stand_from_floor` | `stand_from_floor` | Легче встать с пола | mobility | [`ability-stand_from_floor.md`](../prompts/assets/ability-stand_from_floor.md) | `public/game-assets/abilities/ability-mobility-floor.webp` | P0 | **in-app** |
| `ability-stairs_breath` | `stairs_breath` | Меньше одышки после лестницы | endurance | [`ability-stairs_breath.md`](../prompts/assets/ability-stairs_breath.md) | `public/game-assets/abilities/ability-endurance-stairs.webp` | P0 | **in-app** (redesigned 2026-06: breath motif, not stairs) |
| `ability-long_route` | `long_route` | Проще пройти длинный маршрут | endurance | [`ability-long_route.md`](../prompts/assets/ability-long_route.md) | `public/game-assets/abilities/ability-endurance-route.webp` | P0 | **in-app** |
| `ability-car_easier` | `car_easier` | Проще ездить в машине | dailyLife | [`ability-car_easier.md`](../prompts/assets/ability-car_easier.md) | `public/game-assets/abilities/ability-daily-car.webp` | P0 | **in-app** |
| `ability-clothing_freer` | `clothing_freer` | Одежда сидит свободнее | clothing | [`ability-clothing_freer.md`](../prompts/assets/ability-clothing_freer.md) | `public/game-assets/abilities/ability-clothing-freer.webp` | P0 | **in-app** |
| `ability-household_easier` | `household_easier` | Проще заниматься бытом | dailyLife | [`ability-household_easier.md`](../prompts/assets/ability-household_easier.md) | `public/game-assets/abilities/ability-daily-household.webp` | P0 | **in-app** |
| `ability-movement_confidence` | `movement_confidence` | Больше уверенности в движении | confidence | [`ability-movement_confidence.md`](../prompts/assets/ability-movement_confidence.md) | `public/game-assets/abilities/ability-confidence-movement.webp` | P0 | **in-app** (redesigned 2026-06: confident step, not route) |
| `ability-recovery_awareness` | `recovery_awareness` | Мягче возвращаться после усталости | recovery | [`ability-recovery_awareness.md`](../prompts/assets/ability-recovery_awareness.md) | `public/game-assets/abilities/ability-recovery-awareness.webp` | P0 | **in-app** |
| `ability-journal_clarity` | `journal_clarity` | Яснее видеть свой день | confidence | [`ability-journal_clarity.md`](../prompts/assets/ability-journal_clarity.md) | `public/game-assets/abilities/ability-confidence-journal.webp` | P0 | **in-app** |
| `ability-stairs_easier` | `stairs_easier` | Легче подниматься по лестнице | endurance | [`ability-stairs_easier.md`](../prompts/assets/ability-stairs_easier.md) | `public/game-assets/abilities/ability-endurance-stairs-up.webp` | P0 | **in-app** |

**Set entry:** `body-ability-icon-set-v1` — cohesive RPG token system (not medical icons).

**Later (not in scope):** ability icon lightbox / full view.

### Future roadmap (24) — text/glyph placeholders only

> **Ring `stable_form` (12) + `new_mobility` (12)** — visible on skill board as quiet future cards. No manifest entries, no unlock, no art batch. Future: Body Ability Icons v2/v3.

| Ring | Count | Art status | Unlock |
|------|-------|------------|--------|
| `stable_form` | 12 | glyph placeholder | future only |
| `new_mobility` | 12 | glyph placeholder | future only |

### Body Abilities — RPG skill board UI (2026-06)

- `/growth/abilities` → `BodyAbilitySkillBoard` — **3 sections** by progression ring.
- Active 12: large medallion cards, manifest art v1, unlock CTA when hint active.
- Future 24: compact quiet cards, glyph only, «Дальняя способность. Проявится позже на маршруте.»
- Counters: «Открыто X из 12 активных / На маршруте / В дальнем пути: 24»
- Manifest ids wired via `getBodyAbilityManifestAssetId()`; **glyph safety fallback** for placeholders.
- **12/12 in-app:** active set only; future art = v2/v3 backlog.

---

## P0 — MVP Visual Core

> Важно учесть и не потерять. **Не значит «срочно генерировать».**

### Мужской герой (anchor stages)

| Название | Тип | Где используется | Связанная система | Статус | Приоритет | Промпт | Файл | Manifest | Комментарий |
|----------|-----|------------------|-------------------|--------|-----------|--------|------|----------|-------------|
| Male stage 01–20 | hero-stage | Dashboard, Codex, Journey | heroStages | **in-app** | P0 | ready | ready | registered | v2 set 2026-07-23: unique tee prints HP rave / Rick&Morty; long-hair arc |
| Journey chapter 1–9 | journey-chapter-bg | Journey Map v3 | journeyChapterVisuals | in-app | P0 | ready | ready | registered | `.webp` в `maps/chapters/` |
| Companions ×4 | companion | Onboarding, Codex | assetRegistry | in-app | P0 | ready | ready | registered | PNG approved |
| Body ability icons ×12 | body-ability-icon | Growth abilities | bodyAbilityConfig | in-app | P0 | ready | 12/12 ready | registered | Icon set v1 complete on skill board |
| Camp base stage 1 (ember) | camp-base-scene | Dashboard, /growth/camp | baseProgressionConfig | needed | P0 | ready | missing | registered | Prompt template ready |
| Season boss (current) | season-mini-boss | SeasonTodayCard | bossCampaign | **in-app** | P0 | ready | ready | registered | Full S01–S13 dedicated webp set (2026-07-22) |
| Onboarding core awakening | onboarding-hero | /start | Onboarding v1 | needed | P0 | ready | missing | registered | Text ritual OK without image |
| Empty states ×2 | empty-state | Dashboard, Growth | UI | needed | P0 | planned | missing | registered | Gradient + symbol |

**Prompt file:** см. [`_template-nano-banana-asset.md`](../prompts/assets/_template-nano-banana-asset.md)

---

## P1 — Campaign Visual Polish

### Season mini-bosses (13) ✅ in-app

| Название | Тип | Где используется | Связанная система | Статус | Приоритет | Промпт | Файл | Manifest |
|----------|-----|------------------|-------------------|--------|-----------|--------|------|----------|
| S01 … S13 (Владыка Пустого Дня → Тень Старого Года) | season-mini-boss | Today, Dashboard, Archive, Codex | bossConfig / manifestAssetUi | **in-app** | P1 | ready | ready | registered |

**Paths:** `public/game-assets/bosses/seasons/season-boss-NN-*.webp`  
**Prompts:** `docs/prompts/assets/season-boss-*.md`  
**Wire:** `getSeasonBossManifestAssetId(1..13)`, `getSeasonCampaignBossArtUrl`  
**Done:** 2026-07-22 — dedicated set complete (`GAME_ASSET_VERSION` 39).

### Camp / base scenes (8)

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| Тлеющий костёр → Цитадель формы | camp-base-scene | /growth/camp | baseProgressionConfig | needed | P1 | planned | missing | registered |

### Daily mobs (improve)

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| 8 daily mobs | mob | Today, Codex | dailyMobEngine | **in-app** | P1 | ready | ready | registered | Polish / .webp migration later |

### Season rewards (13) ✅ in-app

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| Искра ядра … Артефакт года (S01–S13) | season-reward | Dashboard / летопись | seasonConfig | **in-app** | P1 | ready | ready | registered |

**Paths:** `public/game-assets/rewards/season-NN-*.webp`  
**Wire:** `getSeasonRewardManifestAssetId(1..13)`  
**Done:** 2026-07-23 (`GAME_ASSET_VERSION` 40).

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

### Future Cozy / Village Home Recovery

**Не часть Dark MVP P0/P1.** Отдельная тема (не замена Dark Fantasy): дом в деревне, ремонт, сад, двор. Те же core mechanics; другой progress fantasy.

**Reserved Asset Registry path categories:**

| Path prefix | Назначение |
|-------------|------------|
| `cozy/house/exterior` | House exterior unlocks |
| `cozy/house/interior` | Interior unlocks |
| `cozy/garden` | Garden unlocks |
| `cozy/yard` | Yard unlocks |
| `cozy/companions` | Companion spots / pet items |
| `cozy/decor/seasonal` | Seasonal decor |
| `cozy/icons` | Small home/garden UI icons |
| `cozy/ui` | Cozy shell backgrounds / textures |

Runtime folders already exist under `public/game-assets/themes/cozy/` (avatars, companions, bosses, mobs, home, journey, ui) with SVG placeholders. **Never** fall back to Dark Fantasy files.

---

## Cozy Art Fill Plan (2026-08-10)

> Цель: заменить `CozyArtPlaceholder` / SVG на финальные webp **по слотам UI**, не генерируя «всё подряд».  
> Канон: village home recovery; cream/honey/sage; soft daylight; no battle-first.  
> Pipeline: prompt → generate → process webp → theme path → same-theme wire → bump `GAME_ASSET_VERSION`.  
> Аватары: только **5 visual anchors** (`01/05/10/15/20`), не 20 файлов.

### Уже есть (baseline)

| Слот | Статус |
|------|--------|
| Cozy male avatar anchors `01/05/10/15/20` | **in-app / approved** |
| Hero State overlays (SVG) | in-app |
| SVG placeholders (avatars/companions/bosses/mobs/home/journey) | in-app fallback |
| Cozy Botanical Print (CSS/SVG) | in-app decorative identity |
| Cozy Content Pack v1 (copy) | in-app, без raster |
| Female anchors / companions / home scenes / cozy campaign banners | **missing** → placeholder |

### Принципы заполнения

1. **Parity first:** закрывать те же UI-дыры, что DF уже закрыл (Dashboard Season/Camp banners, boss compact, empty states).
2. **No DF recolor:** отдельные композиции под дом/сад/уют; entity IDs могут совпадать, картинки — нет.
3. **Banner size lock:** Dashboard campaign plates используют общий `CampaignDashboardCardShell` + layout `reward-banner` / cozy `banner` — арт должен быть 16:9-friendly crop.
4. **Pets later:** спутники — opt-in в Settings; арт питомцев не блокирует C1–C3.
5. **Manifest:** не раздувать общий Dark `manifest.json` без schema для theme-scoped ids; сначала файлы в `themes/cozy/**`, wire через `themeAssetRegistry` / cozy resolvers.

### Batch C1 — Dashboard campaign parity (P0)

Заменяет пустые баннеры на Dashboard в Cozy (сейчас `CozyArtPlaceholder`).

| id (working) | UI | Path (target) | Формат | Status |
|--------------|-----|---------------|--------|--------|
| `cozy-season-reward-01-hearth-lantern` | `SeasonDashboardSummary` banner | `themes/cozy/artifacts/season-01-hearth-lantern.webp` | reward-banner | **in-app** (2026-08-10) |
| `cozy-home-room-stage-01` | `BaseDashboardSummary` banner (+ compact thumb) | `themes/cozy/home/interior/room-stage-01.webp` | reward-banner | **in-app** (2026-08-10) — канон укрытия = комната дома |
| `cozy-obstacle-01-empty-day` | season boss compact («Главная помеха») | `themes/cozy/bosses/season-obstacle-01-empty-day.webp` | boss-compact cutout | **in-app** (2026-08-10) — пылевой комок / бытовая грязь, не кресло |

**DoD:** обе плашки Кампании показывают webp одного размера; тексты остаются на общем shell. ✅

### Batch C2 — Avatar female anchors (P0)

| id | Path | Notes |
|----|------|-------|
| Cozy female `01/05/10/15/20` | `themes/cozy/avatars/female/stage-{NN}.webp` | Character Bible female; same 5-anchor rule; `validate:avatars` → approved |

### Batch C3 — Cozy Home scenes (P1)

| id | UI | Path |
|----|-----|------|
| `cozy-home-hero-exterior` | `/home` hero / Dashboard home card | `themes/cozy/home/exterior/home-hero.webp` |
| Zone keyframes (8 zones × selected levels) | `/home` zone cards | `themes/cozy/home/zones/{zone}-l{0\|3}.webp` start with L0+L3 only |
| Garden / yard establishing | Home garden/yard panels | `themes/cozy/home/garden/…`, `yard/…` |

Start with **hero exterior + 2–3 hero zones** (porch, kitchen, garden), not 8×4.

### Batch C4 — Companions cozy set (P2, after opt-in UX)

| id | Path |
|----|------|
| 4 companions cozy cutouts | `themes/cozy/companions/{id}.webp` |

Only when pets toggle stays useful; otherwise keep SVG placeholder.

### Batch C5 — Obstacles / weekly threats (P1–P2)

Cozy «помехи» = **бытовые монстры грязи и дел по дому** (пыль, беспорядок, грязная посуда, незакрытые дела), не DF-боссы и не пустая мебель.

Примеры направления: пылевой комок, лужа на полу, гора белья, липкий перекус-хаос — тёплый cozy-стиль, чуть озорные, не horror.

Paths under `themes/cozy/bosses/` and `themes/cozy/mobs/`. S01 empty-day → dust monster cutout (in-app).

### Batch C6 — Journey chapter vignettes (P2)

`themes/cozy/journey/chapters/chapter-NN.webp` ×9 — warm village-road metaphor; chapter placeholder until then.

### Batch C7 — Seasonal decor & UI polish (P3)

`themes/cozy/ui/textures/`, `decor/seasonal/` — paper/wood accents beyond CSS botanical print.

### Очередь генерации (рекомендуемый порядок)

1. C1 Dashboard banners (максимальный видимый эффект)  
2. C2 Female anchors  
3. C3 Home hero + 2–3 zones  
4. C5 Season obstacles S01–S03  
5. C4 Companions (если питомцы включены пользователями)  
6. C6 Journey  
7. C7 Decor  

### Prompt / QA notes

- Style: summer village home, soft sun, linen/wood/sage; **not** dark fantasy rim light.  
- Negative: horror, gore, sterile clinic, pure white UI mock, DF throne rooms.  
- Crop for `reward-banner` fixed heights (`5.25 / 7.5 / 10 rem`).  
- Checklist: extend [`docs/art/avatar-stage-qa-checklist.md`](../art/avatar-stage-qa-checklist.md) ideas to home/campaign (subject readable at mobile width).  
- Prompt pack: create `docs/prompts/assets/COZY-BATCH-C1-queue.md` when starting generation (mirror Dark Batch 1/2).

**Правило:** не смешивать с dark bosses, не делать simple recolor. Cat-avatar — optional backlog, не канон. См. [`07-decision-log.md`](07-decision-log.md), [`../brandbook/themes.md`](../brandbook/themes.md).

---

## P3 — Later / Nice to have

| Название | Тип | Статус | Комментарий |
|----------|-----|--------|-------------|
| Logo dark fantasy | logo | needed | Heraldic Huginn/Muninn |
| New Game+ art | — | idea | **Out of scope** — track only |
| Alternate themes | hero-variant | idea | **Cozy / Village Home Recovery** — parallel theme (house/garden), not post-dark. Path categories reserved in gallery. See brandbook themes. |
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
