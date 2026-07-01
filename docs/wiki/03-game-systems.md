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

## Journey map

**Engine:** `journeyMapEngine.ts`  
**UI:** `/journey`  
**Layout config:** `src/constants/journeyMapConfig.ts`  
**Components:** `src/components/journey/map/JourneyMapSection.tsx` (+ Desktop / Mobile / PathSvg / StageCard / BossMini)

Dark fantasy карта **9 глав пути** (condition-based stages из `journeyMap.ts`). Отдельно от progress map (`/map`) и от 20 hero stages.

### Архитектура блока

| Компонент | Назначение |
|-----------|------------|
| `JourneyMapSection` | Обёртка, заголовок, переключение desktop/mobile |
| `JourneyMapDesktop` | Широкая сцена 1200×720, SVG + HTML в общем coord-layer |
| `JourneyMapMobile` | Вертикальный маршрут (узел слева, карточка справа) |
| `JourneyPathSvg` | SVG: рельеф, путь, узлы, коннекторы |
| `JourneyStageCard` | Карточка главы (статус, прогресс) |
| `JourneyBossMini` | Миниатюра босса у ключевых этапов |

Координаты desktop — **проценты общего слоя 1200×720**: `node { x, y }` + `cardPlacement` / `bossPlacement` (смещение от узла, `journeyMapAnchors.ts`). Mobile — вертикальный список без absolute.

Боссы привязаны к этапам 1, 3, 5, 7, 9 (`getBossPublicPath`). При отсутствии PNG — placeholder с инициалом.

Опциональные фоны: `public/game-assets/maps/journey-map-bg-desktop.webp`, `journey-map-bg-mobile.webp` (graceful fallback на CSS-градиенты).

Ширина: `/journey` в `AppShell` без `max-w-6xl`; блок `.journey-map-shell { width: 100% }`. Без `100vw` и внутреннего scroll.

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
