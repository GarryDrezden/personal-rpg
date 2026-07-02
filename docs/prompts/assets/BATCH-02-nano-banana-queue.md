# Dark MVP — Generation Queue (Batch 2)

> **Статус:** awaiting generation — файлов в `public/` пока нет.
> После генерации: положить файлы по путям ниже → `node scripts/build-asset-manifest.mjs`.
> **Не ставить `in-app`** до отдельного UI wire спринта.

## Как использовать

1. Открыть **prompt file** для ассета (визуальный бриф).
2. Скопировать секции Style, Composition, Mood, Details, Negative prompt в выбранный генератор изображений.
3. Сгенерировать в указанном **ratio**.
4. Экспортировать **`.webp`** (или `.png` → конвертировать в `.webp`).
5. Сохранить по **output path** (создать папки при необходимости).
6. Запустить `node scripts/build-asset-manifest.mjs` — статус станет `processed` (webp) или `generated` (png).

---

## Queue (3 assets)

| # | Asset id | Priority | Prompt file | Format | Output path |
|---|----------|----------|-------------|--------|-------------|
| 1 | `empty-state-no-entries` | P0 | [`empty-state-no-entries.md`](empty-state-no-entries.md) | 16:9 webp | `public/game-assets/empty-states/no-entries.webp` |
| 2 | `plateau-artifact-pass-stone` | P1 | [`plateau-artifact-pass-stone.md`](plateau-artifact-pass-stone.md) | 1:1 webp | `public/game-assets/artifacts/plateau-pass-stone.webp` |
| 3 | `season-boss-01-empty-day-lord` | P1 | [`season-boss-01-empty-day-lord.md`](season-boss-01-empty-day-lord.md) | 16:9 webp | `public/game-assets/bosses/seasons/season-boss-01-empty-day-lord.webp` |

---

## Per-asset notes

### 1. empty-state-no-entries

- **Категория:** emptyStates
- **Где будет:** Dashboard empty lists, Measurements, Today history
- **Фокус:** уютный уголок, пустой дневник, слабый огонёк — «первые записи появятся здесь»
- **Notes:** без стыда и наказания; master ~1600×900

### 2. plateau-artifact-pass-stone

- **Категория:** plateauArtifacts
- **Где будет:** `PlateauDashboardSummary`, achievement plateau_route_guardian
- **Фокус:** камень устойчивости на перевале, тёплая трещина света внутри
- **Notes:** не сломанный камень; master 512×512, transparent OK

### 3. season-boss-01-empty-day-lord

- **Категория:** seasonBosses
- **Где будет:** `SeasonTodayCard`, `SeasonDashboardSummary`, boss portrait
- **Фокус:** сущность пустого дня; искры маршрута дают трещины по пустоте
- **Notes:** внушительный, не horror; master ~1600×900

---

## Manifest lifecycle (Batch 2)

| Этап | status | fileStatus | path в manifest |
|------|--------|------------|-----------------|
| Сейчас | `prompt-ready` | `needed` | `null` |
| Файл на диске | `processed` | `ready` | `targetPath` |
| UI подключён (later) | `in-app` | `ready` | `targetPath` |

## Исключено из Batch 2

- **`body-ability-icon-set-v1`** — отдельный mini-batch (12 иконок)
- **Cozy Campaign Variant** — future P2/P3, не смешивать с dark line
- **Boss Campaign v2** — out of scope

## После Batch 1

Batch 1 (4 assets) — **in-app**. Batch 2 — следующий дроп Priority Pack v1.
