# Game Systems

> Единый справочник игровых механик. Код: `src/utils/*Engine.ts`, константы: `src/constants/`.

## Tone rules (все системы)

- **Не использовать:** «провал», «сорвался», «наказание», «ты плохой»
- **Heavy day** не обнуляет человека — recovery предлагает помощь
- **Nutrition** может быть disabled / simple / precise — если выключено, не штрафует Freedom/Momentum
- **Вес** — один из сигналов прогресса, не единственный KPI

---

## Daily quests

**Engine:** `questEngine.ts`  
**UI:** Today, Dashboard compact

| Категория | Примеры |
|-----------|---------|
| Основные | Калории, шаги, алкоголь |
| Средние | Зарядка, дневник, зал |
| Бонусные | Готовка, ремонт, цветы, хобби |

Лимиты из week goals или defaults. Сохранение дня — явное действие.

---

## XP and levels

**Engine:** `questEngine.ts`, level thresholds в constants

XP за квесты, недельные бонусы, победу над боссом. Уровни: 500 → 1200 → 2200 → 3500…

---

## Coins

**Engine:** `coinEngine.ts`, `momentumCoinEngine.ts`

Валюта для магазина наград. Начисление за хорошие дни, недели, recovery minimal day.

---

## Skills

**Engine:** `skillEngine.ts`  
**UI:** `/growth/skills`

6 навыков: Тело, Контроль, Ясность, Быт, Зелень, Радость. Только встроенные привычки прокачивают навыки.

---

## Achievements

**Engine:** `achievementEngine.ts`  
**UI:** `/growth/achievements`

Категории: вес, замеры, калории, шаги, алкоголь, тренировки, дневник, комбо, боссы, recovery, XP. Редкость: bronze → legendary.

---

## Recovery and minimal day

**Engine:** `recoveryEngine.ts`

После тяжёлого дня: карточка восстановления, упрощённые квесты, монеты без давления. Не блокирует прогресс навсегда.

---

## Resource & Rest v1

**Engine:** `resourceEngine.ts`  
**UI:** `RestDayCard` на `/today`, `DashboardResourceCompact` на Dashboard  
**Constants:** `resourceRest.ts`

Отдых — не пауза в прогрессе, а способ не сломать маршрут.

| Поле `DailyEntry` | Значения |
|-------------------|----------|
| `sleepQuality` | `poor` \| `ok` \| `good` (legacy 1–5 нормализуется) |
| `cognitiveBreaks` | `none` \| `small` \| `good` \| `deep` |
| `energyLevel` | `1`–`5` (существующее поле) |

**Resource score:** `getDailyResource(entry)` → `score`, `level` (`low`/`medium`/`high`), `reasons`, `suggestion`. Без жёстких штрафов.

**Momentum:** мягкие бонусы за хороший сон (+3/+1) и перерывы (+1–3); плохой сон максимум −1.

**XP:** `calcResourceRestBonusPoints` в `calcDailyPoints` — сон +10, хороший сон +15, перерывы +5/+15/+25.

**Recovery integration:** низкий ресурс → NextBestAction предлагает minimal day; recovery/minimal + отметки сна/перерыва = позитивный copy.

**Journey (главы 5–7):** `rest_marker_days`, `rest_recovery_days`, `cognitive_break_days`.

**Mobs:** Туман Усталости / Серая Тягость / Пожиратель Ресурса — обновлённые weaknesses (recovery, перерывы, minimal).

**Achievements:** Первый вдох, Тихая комната, Не сгорел, Очаг горит, Хранитель ресурса.

---

## Momentum

**Engine:** `momentumEngine.ts`  
**UI:** `/momentum`

Метрика устойчивости системы за период. Растёт от последовательности, не от идеальных дней.

---

## Freedom Score

**Engine:** `freedomScoreEngine.ts`, `freedomRewardEngine.ts`  
**UI:** `/freedom`

Композитная метрика «свободы» от привычек. Отключённые факторы (nutrition off) не штрафуют.

---

## Body abilities

**Engine:** `bodyAbilityEngine.ts`  
**UI:** `/growth/abilities`

Способности тела, разблокируемые по прогрессу (не только вес).

---

## Journey map (v3)

**Engine:** `journeyMapEngine.ts`  
**UI:** `/journey`  
**Visual config:** `src/constants/journeyChapterVisuals.ts`  
**Legacy layout config:** `src/constants/journeyMapConfig.ts` (v2, не используется в UI)

Vertical **chapter road** — 9 глав в ширине обычного контента. Не horizontal canvas.

| Breakpoint | Layout |
|------------|--------|
| Desktop (≥1024px) | Vertical route + chapter blocks + sticky `JourneyChapterDetailPanel` справа |
| Mobile (<1024px) | Одна колонка; detail accordion под выбранной главой |

**Компоненты v3:**

| Компонент | Роль |
|-----------|------|
| `JourneyMapV3SummaryBar` | Compact summary вверху страницы |
| `JourneyMapV3Section` | Orchestrator layout |
| `JourneyMapV3Route` | Vertical rail + список глав |
| `JourneyChapterRoadItem` | Chapter block (content + objectives + vignette) |
| `JourneyChapterVignette` | Per-chapter biome panel |
| `JourneyChapterDetailPanel` | Sticky / accordion detail |

**Assets глав:** `public/game-assets/maps/chapters/chapter-NN-*.webp` — 9 фонов этапов; подписи, медальоны и статусы рендерятся UI (`JourneyChapterVignette`). Fallback — CSS gradient из `journeyChapterVisuals.ts`.

Стили: `src/styles/journey-map-v3.css`. Legacy v2: `journey-map-v2.css` (не импортируется).

---

## Hero stages

**Constants:** `heroStages.ts`, `heroProgressEngine.ts`  
**Assets:** `public/game-assets/heroes/{gender}/stage-XX.png`

20 стадий, прогресс ~180 кг → ~100 кг (linear по `progressPercent`). Male: частично готов (1–3, 19–20). Female: полный набор.

Fallback: ближайший якорь (1, 2, 19, 20) пока PNG отсутствует.

---

## Companions

**Constants:** `gameAssets` types  
**Assets:** `public/game-assets/companions/`

| ID | Персонаж |
|----|----------|
| golden_chinchilla_cat | Золотая британская |
| alabai | Алабай |
| raven | Ворон |
| fox_cub | Лисёнок |

---

## Daily mobs

**Assets:** `public/game-assets/mobs/`  
**UI:** Codex

8 мобов дня: sofa_magnet, snack_chaos, fog_of_fatigue, empty_day, impulse_of_rollback, night_call, gray_heaviness, sweet_whisper.

---

## Chapter bosses

**Engine:** `bossEngine.ts` (weekly trials — отдельно)  
**Assets:** `public/game-assets/bosses/`  
**UI:** Journey map, Codex

8 chapter bosses: misty_baron, resource_devourer, divan_king, lord_of_empty_day, chain_of_rollback, night_feast_baron, promise_collector, old_form_guardian.

**Терминология:**

- **Босс главы** — сюжетная сущность пути (journey)
- **Испытание недели** — weekly challenge (`/growth/trials`), не путать с chapter boss

---

## Weekly challenges

**Engine:** `bossEngine.ts`  
**UI:** Week, `/growth/trials`

Случайный недельный вызов с условиями и наградой. Победа → XP + coins.

---

## Nutrition tracking

**Engine:** `nutritionEngine.ts`  
**UI:** Today

Modes: **disabled** | **simple** | **precise**. Recovery suggestions через `NutritionRecoverySuggestionCard`.

---

## Progress map

**Engine:** `progressMapEngine.ts`  
**UI:** `/map`

5 путей: вес, трезвость, шаги, зал, замеры. Независимые майлстоуны.

---

## Weekly reports & insights

**Engines:** `weeklyReportEngine.ts`, `weeklyStoryEngine.ts`, `insightEngine.ts`  
**UI:** `/reports`, `/insights`

Локальная аналитика без облака.

---

## Next best action

**Engine:** `nextBestActionEngine.ts`  
**UI:** Dashboard compact

Один главный CTA «что делать сейчас».
