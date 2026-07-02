# Dark MVP — Nano Banana Generation Queue (Batch 1)

> **Статус:** awaiting generation — файлов в `public/` пока нет.
> После генерации: положить файлы по путям ниже → `node scripts/build-asset-manifest.mjs`.
> **Не ставить `in-app`** до отдельного UI wire спринта.

## Как использовать

1. Открыть **prompt file** для ассета (визуальный бриф).
2. Скопировать секции Style, Composition, Mood, Details, Negative prompt в Nano Banana.
3. Сгенерировать в указанном **ratio**.
4. Экспортировать **`.webp`** (или `.png` → конвертировать в `.webp`).
5. Сохранить по **output path** (создать папки при необходимости).
6. Запустить `node scripts/build-asset-manifest.mjs` — статус станет `processed` (webp) или `generated` (png).

---

## Queue (4 assets)

| # | Asset id | Priority | Prompt file | Format | Output path |
|---|----------|----------|-------------|--------|-------------|
| 1 | `onboarding-core-awakening` | P0 | [`onboarding-core-awakening.md`](onboarding-core-awakening.md) | 16:9 webp | `public/game-assets/onboarding/core-awakening.webp` |
| 2 | `camp-base-stage-01-ember-camp` | P0 | [`camp-base-stage-01-ember-camp.md`](camp-base-stage-01-ember-camp.md) | 16:9 webp | `public/game-assets/base/base-stage-01-ember-camp.webp` |
| 3 | `camp-base-stage-02-shelter` | P0 | [`camp-base-stage-02-shelter.md`](camp-base-stage-02-shelter.md) | 16:9 webp | `public/game-assets/base/base-stage-02-trail-shelter.webp` |
| 4 | `season-01-reward-core-spark` | P1 | [`season-01-reward-core-spark.md`](season-01-reward-core-spark.md) | 1:1 webp, transparent OK | `public/game-assets/rewards/season-01-core-spark.webp` |

---

## Per-asset notes (Nano Banana)

### 1. onboarding-core-awakening

- **Категория:** onboardingArt
- **Где будет:** `/start`, OnboardingGate, StartRoutePage
- **Фокус:** руины + ядро света, маршрут начался; герой не обязателен крупно
- **Notes:** dark fantasy + cozy, не horror; master ~1600×900

### 2. camp-base-stage-01-ember-camp

- **Категория:** campBase
- **Где будет:** BaseDashboardSummary, `/growth/camp`
- **Фокус:** маленький тлеющий костёр, место возвращения; не city builder
- **Notes:** ember + night blue; master ~1600×900

### 3. camp-base-stage-02-shelter

- **Категория:** campBase
- **Где будет:** BaseDashboardSummary, `/growth/camp`
- **Фокус:** костёр крупнее, простое укрытие (ткань/ветки), ранний путь
- **Notes:** визуальная связь со stage 1; master ~1600×900

### 4. season-01-reward-core-spark

- **Категория:** seasonRewards
- **Где будет:** SeasonDashboardSummary, seasonConfig reward
- **Фокус:** маленькая «Искра ядра», ember в оправе; трофей сезона 1
- **Notes:** читаемо на 64px; master 512×512, transparent background preferred

---

## Manifest lifecycle (Batch 1)

| Этап | status | fileStatus | path в manifest |
|------|--------|------------|-----------------|
| ~~Сейчас~~ Batch 1 done | `processed` | `ready` | `targetPath` |
| UI подключён (next) | `in-app` | `ready` | `targetPath` |

## Исключено из Batch 1

- Cozy Campaign Variant (future P2/P3)
- Batch 2 assets (`empty-state-no-entries`, `plateau-artifact-pass-stone`, `season-boss-01-empty-day-lord`) — см. [`BATCH-02-nano-banana-queue.md`](BATCH-02-nano-banana-queue.md)
- `body-ability-icon-set-v1` — отдельный mini-batch (не Batch 2)
