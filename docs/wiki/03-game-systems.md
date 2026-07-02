# Game Systems

> Единый справочник игровых механик. Код: `src/utils/*Engine.ts`, константы: `src/constants/`.

## Tone rules (все системы)

- **Не использовать:** «провал», «сорвался», «наказание», «ты плохой»
- **Heavy day** не обнуляет человека — recovery предлагает помощь
- **Nutrition** может быть disabled / simple / precise — если выключено, не штрафует Freedom/Momentum
- **Вес** — один из сигналов прогресса, не единственный KPI

### Core loop (все системы)

```
Внести день → получить реакцию игры → увидеть прогресс → захотеть вернуться завтра
```

Любое расширение должно усиливать одно из трёх:

1. Пользователь проще возвращается завтра.
2. Пользователь видит прогресс даже без снижения веса.
3. Пользователь чувствует, что его путь — это история, а не таблица.

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

8 мобов дня (уровень 1 в [Boss Layers](#boss-layers)): sofa_magnet, snack_chaos, fog_of_fatigue, empty_day, impulse_of_rollback, night_call, gray_heaviness, sweet_whisper.

См. правила подбора мобов в [Boss Layers](#boss-layers).

---

## Chapter bosses

**Engine:** `bossEngine.ts` (weekly trials — отдельно)  
**Assets:** `public/game-assets/bosses/`  
**UI:** Journey map, Codex

8 chapter bosses (уровень 4 в [Boss Layers](#boss-layers)): misty_baron, resource_devourer, divan_king, lord_of_empty_day, chain_of_rollback, night_feast_baron, promise_collector, old_form_guardian.

**Терминология:**

- **Босс главы** — сюжетная сущность пути (journey); см. [Boss Layers](#boss-layers)
- **Испытание недели** — weekly challenge (`/growth/trials`), не путать с chapter boss
- **Сезонный мини-босс** — конфликт 28-дневного сезона (планируется в Seasons v1)

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

5 путей в коде сегодня: вес, трезвость, шаги, зал, замеры. Долгосрочный дизайн — 8 [Parallel Progress Roads](#parallel-progress-roads) (включая Resource и Story).

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

## Year Campaign Structure

> Ранее: Long-Term Game Structure. Годовая кампания = 12+ месяцев, ~13 сезонов по 28 дней.

### Core idea

Personal RPG — долгосрочная RPG-кампания восстановления тела, веса, контроля, ресурса и мобильности. Не трекер похудения и не таблица привычек.

The game must support 12–24 months of progression without relying only on weight loss.

Weight is important, but it is not the only source of progress.

Main principle:

> День держит ритм.  
> Неделя строит привычку.  
> Сезон даёт историю.  
> Глава меняет тело.  
> Акт меняет жизнь.

**80 кг — это не один длинный прогресс-бар. Это 12–24 месяца сезонов, глав, навыков, ритуалов, открытий и возвращений.**

Нельзя строить годовую игру как один bar «180 кг → 100 кг».

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

Базовая игровая единица.

Purpose:

- hold the route;
- complete minimal actions;
- mark state;
- fight daily mobs;
- protect momentum;
- get game reaction and want to return tomorrow.

**Минимальный день и recovery day — валидные игровые состояния, а не провал.**

Examples:

- nutrition marked;
- steps;
- no alcohol;
- sleep/resource;
- cognitive breaks;
- journal line.

### Week

Ритм. Цель недели: выбрать фокус, прожить неделю, получить хронику, скорректировать маршрут.

Purpose:

- create rhythm;
- choose focus;
- review progress;
- prevent burnout.

Weekly loop:

```
Выбрать фокус → прожить неделю → получить хронику → скорректировать маршрут
```

Calendar rhythm (optional):

- Monday: plan / weight / measurements / focus;
- midweek: daily quests and resource checks;
- Friday: fatigue/resource check;
- Sunday: weekly chronicle.

См. [Weekly Quests](#weekly-quests).

### Season

A season lasts **28 days** (~4 weeks). Главный инструмент годового удержания. За год ≈ **13 сезонов**.

Purpose:

- create a medium-term story;
- avoid relying only on weight;
- give focused quests and rewards.

Each season has:

- id;
- title;
- actId;
- startDate;
- endDate;
- focus;
- season quests (3–5);
- weekly focuses;
- mini-boss or trial;
- reward/artifact;
- recap;
- status.

Seasonal loop:

```
Начать сезон → выполнить часть квестов → ослабить босса → получить recap/reward
```

См. [Season Quests](#season-quests), [13 Seasons Catalog](#13-seasons-catalog).

### Chapter

A chapter is a major body/lifestyle milestone.
The current Journey Map v3 has 9 chapters.

### Act

Acts group chapters into long-term arcs.
A full campaign has 3 acts.

### Campaign

The whole 12–24 month transformation journey.

Campaign loop:

```
Пройти сезоны → открыть главы → пройти акты → изменить тело и образ жизни
```

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
- journal;
- mental clarity.

### Resource Road

Tracks:

- sleep quality;
- cognitive breaks;
- energy level;
- recovery days;
- resource consistency (Resource & Rest v1).

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
- Freedom Score;
- mobility.

### Story Road

Tracks:

- chapters (Journey Map v3);
- seasons completed;
- bosses weakened;
- artifacts earned;
- weekly/season recaps;
- narrative milestones.

Design rule:

If weight is stuck, other roads must still create visible progress.

---

## Seasons v1

A season is a **28-day** medium-term arc (= 4 weeks = одна небольшая сюжетная арка).

Purpose:

- create a manageable goal horizon;
- keep the game interesting for 1–2 years (~13 seasons/year);
- give story and rewards without depending only on weight.

**Status:** implemented (Seasons v1). Boss Campaign / season history — later.

Design rules:

- seasons reward consistency, not perfection;
- failed quests must not destroy the season;
- partial completion still produces story;
- season recap = chronicle, not judgment;
- no tone of «провал», shame or punishment.

---

## Weekly Quests

**Status:** planned (Seasons v1).

Недельные квесты **не добавляют новые обязанности**. Они превращают уже существующие ежедневные действия в игровые цели.

### Data sources (existing daily fields)

- питание / учёт;
- шаги;
- алкоголь;
- сон;
- когнитивные перерывы;
- энергия;
- дневник;
- зал / зарядка;
- minimal day;
- recovery day;
- вес;
- замеры.

### Week focus types

| Тип недели | Фокус |
|------------|-------|
| Неделя контроля | учёт, минимальные дни |
| Неделя движения | шаги, ходьба |
| Неделя ресурса | сон, перерывы, энергия |
| Неделя ясности | алкоголь, дневник |
| Неделя возврата | return после тяжёлых дней |
| Неделя плато | удержание маршрута |
| Неделя силы | зал, зарядка |
| Неделя восстановления | recovery, minimal day |

### Example — Неделя 1: Зажечь маршрут

**Фокус:** вернуться в систему без героизма.

**Квесты:**

- 4 дня с любым учётом питания;
- 3 дня 5000+ шагов;
- 2 дня без алкоголя;
- 1 строка дневника в любой день;
- 1 минимальный день считается **сохранением маршрута**, а не потерей.

**Правила:** мягкие, частично выполнимые, без тона списка наказаний.

---

## Season Quests

**Status:** planned (Seasons v1).

Сезон = 28 дней = 4 недели. 3–5 сезонных квестов на основе тех же daily-данных, что и недельные квесты.

### Example — Сезон 1: Искра в руинах

**Фокус:** не стать идеальным, а зажечь систему.

**Квесты:**

- 18 дней с любым учётом питания;
- 14 дней 5000+ шагов;
- 7 дней без алкоголя;
- 5 дней с отмеченным ресурсом;
- 3 минимальных дня без обвала.

**Мини-босс:** Владыка Пустого Дня  
**Награда:** Искра ядра  
**Recap:** Ты не построил империю за месяц. Ты зажёг костёр, к которому можно вернуться.

### Partial success (обязательно)

| Закрыто квестов | Результат |
|-----------------|-----------|
| 1–2 | маршрут отмечен |
| 3 | сезон удержан |
| 4 | сезон пройден |
| 5 | сезон усилен |

**Нет логики «не выполнил 5/5 → сезон провален».** Personal RPG не использует тон провала, стыда и наказания.

---

## 13 Seasons Catalog

Базовый годовой маршрут. Краткие карточки — структура, не полный нарратив.

| # | Сезон | Act | Focus | Конфликт | Мини-босс | Награда |
|---|-------|-----|-------|----------|-----------|---------|
| 1 | Искра в руинах | I | зажечь систему | пустые дни, хаос | Владыка Пустого Дня | Искра ядра |
| 2 | Первый тракт | I | первые шаги, ритм | лень, диван | Диванный Король | Метка тропы |
| 3 | Каменная база | I | учёт, контроль | перекусы, хаос еды | Хаос Перекусов | Камень базы |
| 4 | Башня режима | I→II | режим, сон | туман, усталость | Туманный Барон | Ключ башни |
| 5 | Перевал выносливости | II | движение, выносливость | истощение | Пожиратель Ресурса | Перевальная метка |
| 6 | Озеро восстановления | II | отдых, ресурс | инерция, плато | Страж Перевала | Озёрный свет |
| 7 | Крепость устойчивости | II | удержание привычек | откаты | Цепь Отката | Печать крепости |
| 8 | Река движения | II | шаги, активность | ночные срывы | Барон Ночного Пира | Капля реки |
| 9 | Цитадель формы | II→III | форма, замеры | обещания без дела | Собиратель Обещаний | Щит формы |
| 10 | Зал силы | III | зал, сила | старая форма | Хранитель Старой Формы | Медаль силы |
| 11 | Тропа ясности | III | ясность, трезвость | усталость, архив | Серый Архивариус Усталости | Фонарь ясности |
| 12 | Врата новой мобильности | III | мобильность | страх изменений | Привратник Новой Мобильности | Ключ врат |
| 13 | Перерождение года | III | итог года, новая жизнь | тень прошлого | Тень Старого Года | Артефакт года |

---

## Boss Layers

**Status:** Boss Campaign v1 implemented (narrative derived layer, no combat).

Четыре уровня противников:

| Уровень | Роль | Статус v1 |
|---------|------|-----------|
| 1. Мобы дня | по состоянию дня | ✅ daily mobs (отдельно) |
| 2. Недельные элиты | проблема недели | позже |
| 3. Сезонные мини-боссы | конфликт 28-дневного сезона | ✅ derived progress |
| 4. Боссы глав / актов | символы этапа | ✅ chapter labels; act config only |

### Boss Campaign v1 engine

- `src/game/bosses/bossCampaignEngine.ts` — progress из season quests, route-held days, minimal/recovery, Body Abilities, plateau, camp/base
- Статусы: untouched → noticed → weakened → broken → sealed
- Тон: босс **слабеет**, не «убит»; без combat economy
- UI: встроено в Season card (Today/Dashboard), Journey chapter detail

**Not in v1:** combat/HP UI, boss art, dedicated boss screen, DB migrations, new daily metrics.

### Daily mobs (уровень 1)

| Моб | ID | Когда |
|-----|-----|-------|
| Диванный Магнит | sofa_magnet | нет шагов |
| Хаос Перекусов | snack_chaos | хаос питания |
| Туман Усталости | fog_of_fatigue | низкий ресурс |
| Пустой День | empty_day | нет учёта |
| Импульс Отката | impulse_of_rollback | риск отката |
| Ночной Зов | night_call | ночная еда / алкоголь |
| Серая Тягость | gray_heaviness | перегруз |
| Сладкий Шёпот | sweet_whisper | срыв на сладкое |

### Seasonal mini-bosses (уровень 3)

1. Владыка Пустого Дня  
2. Диванный Король  
3. Хаос Перекусов  
4. Туманный Барон  
5. Пожиратель Ресурса  
6. Страж Перевала  
7. Цепь Отката  
8. Барон Ночного Пира  
9. Собиратель Обещаний  
10. Хранитель Старой Формы  
11. Серый Архивариус Усталости  
12. Привратник Новой Мобильности  
13. Тень Старого Года  

### Chapter bosses (уровень 4)

1. Страж Руин  
2. Несущий Груз  
3. Хозяин Старой Тропы  
4. Смотритель Башни Режима  
5. Повелитель Тяжёлого Перевала  
6. Озёрный Хранитель Инерции  
7. Комендант Крепости Привычек  
8. Хранитель Реки Движения  
9. Последняя Тень Старой Формы  

Каталог в коде: `src/game/bosses/bossConfig.ts` (`CHAPTER_BOSSES`).

### Act bosses

| Act | Босс |
|-----|------|
| Act I — Пробуждение системы | Повелитель Хаоса |
| Act II — Становление формы | Архонт Плато |
| Act III — Новая мобильность | Хранитель Старой Жизни |

### Boss weakening (принцип)

Босс **не умирает от абстрактного урона**. Он **слабеет от реальных действий** игрока.

**Пожиратель Ресурса** ослабевает от:

- 3 дней с отмеченным сном;
- 2 дней с когнитивным перерывом;
- 1 recovery day;
- 1 записи в дневнике.

**Диванный Король** ослабевает от:

- 4 дней 5000+ шагов;
- 1 дня 8000+ шагов;
- 1 прогулки в день низкого ресурса.

**Хаос Перекусов** ослабевает от:

- 4 дней с учётом питания;
- 2 дней без ночного переедания;
- 1 минимального дня без обвала.

---

## Plateau Mode — Удержание перевала

**Status:** Plateau Mode v1 implemented.

Plateaus are expected and must be treated as part of the campaign — not as failure.

### Detection (v1)

- **Soft hint:** 10–20 дней без нового лучшего веса (>0.05 кг улучшения)
- **Active plateau:** 21+ день без нового лучшего веса **или** manual flag «Я на перевале»
- **Dismiss:** soft hint можно скрыть до перехода в active
- **No medical claims:** игровой режим удержания маршрута, не диагноз

Engine: `src/game/plateau/plateauEngine.ts`. State: `settings.plateauState`.

### Route holding (v1)

Snapshot за 10 дней из existing daily entries:

- route-held days (saved day / minimal / recovery / nutrition quest)
- nutrition, movement, resource, alcohol-free, journal
- Body Abilities unlocked during plateau
- season quest progress

### UI (v1)

- **Today:** compact `PlateauTodayCard` (active или soft hint)
- **Dashboard:** `PlateauDashboardSummary` + manual toggle
- **Freedom / Body Abilities:** мягкая связь с не-весовым прогрессом

### Achievement

**Страж перевала** — active plateau + 4 route-held days за 7 дней (или 3 + 1 minimal/recovery).

Plateau copy:

> Вес стоит. Это не тупик, а перевал.  
> На перевале важны не рывки, а удержание маршрута.

During plateau mode, the game emphasizes (not punishes):

- sleep / resource;
- steps;
- nutrition tracking;
- no alcohol;
- recovery/minimal days;
- Body Abilities and season progress.

Design rule:

Plateau Mode must never imply failure.
It should reframe stagnation as a defensive phase — «персонаж не стоит».

**Not in v1:** Boss Campaign, Camp/Base, medical analytics, new daily metrics, DB migrations.

---

## Body Abilities Long-Term System

**Status:** Body Abilities v1 implemented.

Body abilities are **user-observed improvements** — not medical claims. The game may suggest a hint when existing data shows consistency, but the user confirms: «Я заметил улучшение».

### v1 (implemented)

- Catalog in `src/game/bodyAbilities/bodyAbilityConfig.ts`
- Manual unlock primary; soft hints from steps, weight, waist, recovery, journal
- State in `AppSettings.bodyAbilityState` (unlocked ids, unlock records, dismissed hints)
- UI: Growth `/growth/abilities`, Dashboard summary, optional Today hint
- Legacy metric-based abilities remain under «Прогресс по данным»

### Design rule (unchanged)

Body abilities help the game remain meaningful even when weight progress is slow.

---

## Camp / Base Progression — Лагерь героя

**Status:** Camp/Base Progression v1 implemented.

The hero camp is **derived meta-progression** — it grows from route stability, not from weight alone or manual building.

### 8 stages (v1)

1. Тлеющий костёр
2. Укрытие
3. Тропа
4. Мастерская
5. Башня ясности
6. Очаг восстановления
7. Крепость режима
8. Цитадель формы

Engine: `src/game/base/baseProgressionEngine.ts`. Config: `src/game/base/baseProgressionConfig.ts`.

### Score sources (derived, no new daily fields)

- saved days, minimal/recovery days
- resource, movement, alcohol-free, nutrition days
- Body Abilities unlocked (+3 each)
- seasons held/cleared/empowered (+5 each)
- achievement «Страж перевала» (+5)

### UI (v1)

- **Dashboard:** compact `BaseDashboardSummary`
- **Growth:** `/growth/camp` — all stages, progress rail
- **Today:** optional base spark line in save reaction

### Design rule

Camp grows when the route is held — **not a new obligation**. No manual building, no construction economy.

During plateaus, camp progression shows that «персонаж не стоит» even when weight stalls.

**Not in v1:** base art/scenes, manual upgrades, Boss Campaign, DB migrations, new daily metrics.

Future assets for camp stages → asset backlog, not blocking v1.

---

## Future System — Camp / Base Progression (legacy notes)

*Superseded by v1 implementation above. Kept for historical design intent.*

The hero can have a visual base that grows from stability, not only from weight.

Possible progression (now implemented as 8 stages):

1. Тлеющий костёр … 8. Цитадель формы

Base upgrades can be unlocked by:

- tracking streaks;
- alcohol-free days;
- recovery days;
- seasons completed;
- resource consistency;
- body abilities.

Purpose:

Create non-weight visual progress for long plateaus and maintenance.

---
