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

Способности тела, разблокируемые по прогрессу (не только вес). Долгосрочный дизайн — см. [Body Abilities Long-Term System](#body-abilities-long-term-system).

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

---

## Long-Term Game Structure

### Core idea

Personal RPG is designed as a long-term body recovery campaign, not a short challenge.

The game must support 12–24 months of progression without relying only on weight loss.

Weight is important, but it is not the only source of progress.

Main principle:

> День держит ритм.  
> Неделя строит привычку.  
> Сезон даёт историю.  
> Глава меняет тело.  
> Акт меняет жизнь.

**80 кг — это не один длинный прогресс-бар. Это 12–24 месяца сезонов, глав, навыков, ритуалов, открытий и возвращений.**

### Why

Large body transformation can take 1–2 years. During this time:

- weight will fluctuate;
- plateaus will happen;
- motivation will rise and fall;
- life stress will interfere;
- perfect discipline is unrealistic.

The game must reward:

- returning after difficult days;
- maintaining habits;
- recovery;
- sleep and resource;
- movement;
- body abilities;
- consistency;
- awareness;
- freedom of body.

The game should never imply that progress stops when weight stops.

Key phrase:

> Вес стоит, но персонаж не стоит.

---

## Time Layers

The game uses several time layers:

### Day

Purpose:

- hold the route;
- complete minimal actions;
- mark state;
- fight daily mobs;
- protect momentum.

Examples:

- nutrition marked;
- steps;
- no alcohol;
- sleep/resource;
- cognitive breaks;
- journal line.

### Week

Purpose:

- create rhythm;
- choose focus;
- review progress;
- prevent burnout.

Weekly loop:

- Monday: plan / weight / measurements / focus;
- midweek: daily quests and resource checks;
- Friday: fatigue/resource check;
- Sunday: weekly chronicle.

### Season

A season lasts 28 days.

Purpose:

- create a medium-term story;
- avoid relying only on weight;
- give focused quests and rewards.

Each season has:

- title;
- focus;
- 3–5 seasonal quests;
- mini-boss or trial;
- reward/artifact;
- recap.

### Chapter

A chapter is a major body/lifestyle milestone.
The current Journey Map v3 has 9 chapters.

### Act

Acts group chapters into long-term arcs.
A full campaign has 3 acts.

### Campaign

The whole 12–24 month transformation journey.

### New Game+

After the main goal:

- maintenance;
- strength;
- mobility;
- identity;
- lifestyle stabilization.

---

## Campaign Acts

### Act I — Пробуждение системы

Approximate duration:
2–4 months.

Focus:

- tracking;
- steps;
- nutrition awareness;
- alcohol reduction;
- minimal days;
- return after difficult days.

Emotional goal:

> Я снова управляю процессом.

Chapters:

1. Пробуждение ядра
2. Первая трещина в грузе
3. База движения

### Act II — Становление формы

Approximate duration:
4–12 months.

Focus:

- stability;
- gym;
- sleep;
- endurance;
- waist changes;
- recovery;
- plateau resistance;
- body abilities.

Emotional goal:

> Тело начинает отвечать.

Chapters:

4. Контроль режима
5. Возврат выносливости
6. Печать тяжести ослабла

### Act III — Новая мобильность

Approximate duration:
12–24 months.

Focus:

- identity shift;
- strength;
- mobility;
- confidence;
- clothes;
- activity;
- maintenance thinking;
- long-term lifestyle.

Emotional goal:

> Это уже не временный режим, это новая жизнь.

Chapters:

7. Устойчивая система
8. Новая мобильность
9. Великое перерождение

---

## Parallel Progress Roads

The game must not depend on weight only.

### Weight Road

Tracks:

- best achieved weight;
- weight loss milestones;
- body stage;
- avatar transformation.

Uses best achieved weight, not daily fluctuations.

### Movement Road

Tracks:

- steps;
- walking consistency;
- endurance;
- distance;
- body comfort.

### Control Road

Tracks:

- nutrition tracking;
- minimal days;
- return days;
- consistency;
- no catastrophic resets.

### Clarity Road

Tracks:

- alcohol-free days;
- sleep;
- cognitive breaks;
- resource;
- journal.

### Strength Road

Tracks:

- gym;
- mobility;
- charging/warmup;
- body abilities;
- recovery.

### Freedom Road

Tracks:

- waist;
- measurements;
- subjective body abilities;
- Freedom Score.

Design rule:

If weight is stuck, other roads must still create visible progress.

---

## Seasons v1

A season is a 28-day medium-term arc.

Purpose:

- create a manageable goal horizon;
- keep the game interesting for 1–2 years;
- give story and rewards without depending only on weight.

Each season has:

- id;
- title;
- actId;
- startDate;
- endDate;
- focus;
- quests;
- reward;
- recap;
- status.

Example season:

### Season 1 — Искра в руинах

Duration:
28 days.

Focus:
Не стать идеальным, а зажечь систему.

Quests:

- 18 days with any nutrition tracking;
- 14 days with 5000+ steps;
- 7 alcohol-free days;
- 5 days with resource marked;
- 3 minimal days without route collapse.

Reward:
Искра ядра.

Design rules:

- seasons should reward consistency, not perfection;
- failed quests should not destroy the season;
- partial completion should still produce story;
- season recap should be written as chronicle, not judgment.

---

## Plateau Mode — Удержание перевала

Plateaus are expected and must be treated as part of the campaign.

Trigger example:

- weight does not improve for 10–21 days;
- or user manually marks plateau.

Plateau copy:

> Вес стоит. Это не тупик, а перевал.  
> На перевале важны не рывки, а удержание маршрута.

During plateau mode, the game rewards:

- sleep;
- resource;
- steps;
- nutrition tracking;
- no alcohol;
- recovery/minimal days;
- measurements;
- returning after difficult days.

Possible achievement:
Страж перевала — удержал маршрут во время плато.

Design rule:

Plateau Mode must never imply failure.
It should reframe stagnation as a defensive phase.

---

## Body Abilities Long-Term System

Body abilities are subjective or semi-objective improvements that show the body is becoming freer.

Examples:

- easier to tie shoes;
- easier to stand up;
- less breathlessness;
- easier stairs;
- easier walking;
- easier car trips;
- easier clothes choice;
- easier household tasks;
- more comfortable standing;
- more confidence in movement.

Abilities can be unlocked by:

- weight milestones;
- steps consistency;
- waist reduction;
- gym/mobility;
- manual user confirmation: «Я заметил улучшение».

Design rule:

Body abilities help the game remain meaningful even when weight progress is slow.

---

## Future System — Camp / Base Progression

The hero can have a visual base that grows from stability, not only from weight.

Possible progression:

1. Тлеющий костёр
2. Укрытие
3. Тропа
4. Мастерская
5. Башня ясности
6. Очаг восстановления
7. Крепость режима
8. Цитадель формы

Base upgrades can be unlocked by:

- tracking streaks;
- alcohol-free days;
- recovery days;
- seasons completed;
- resource consistency;
- body abilities.

Purpose:

Create non-weight visual progress for long plateaus and maintenance.
