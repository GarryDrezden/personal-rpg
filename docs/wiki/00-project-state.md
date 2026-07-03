# Текущее состояние проекта

> **Единый источник правды.** Обновлено: 2026-06-06.

## Краткое описание

**Личная RPG** — gamified personal transformation app: приложение о возвращении тела, движения, контроля, ясности и устойчивости через RPG-механики.

## Главная философия

Приложение не должно быть бухгалтерией похудения.
Это личная RPG, где пользователь возвращает способности тела и устойчивость системы.

**Core loop:** внести день → реакция игры → прогресс → вернуться завтра.

**Годовая кампания:** день → неделя → сезон (28 дн.) → глава → акт → кампания. ~13 сезонов в год. См. [`03-game-systems.md`](03-game-systems.md) → Year Campaign Structure.

Ключевые принципы:

- честность важнее идеальности;
- recovery — инструмент, не наказание;
- вес — не единственный прогресс;
- **«Вес стоит, но персонаж не стоит»**;
- пользователь должен видеть героя, путь, спутников, мобов и боссов как живую игровую систему;
- Dashboard не должен быть музеем ассетов.

## Production (сейчас)

| Слой | Статус |
|------|--------|
| **Hosting** | Shared hosting (ispmanager), fit-rpg.ru |
| **Frontend** | React 19 + TypeScript + Vite 6 → `dist/` |
| **Backend** | **PHP 8.2 LSAPI + PDO + MySQL** в `api/` |
| **Database** | MySQL: пользователи, профили, настройки, `user_data` (JSON) |
| **Deploy** | GitHub Actions FTP: `dist/` + `api/` + `.htaccess` |
| **Node `backend/`** | VPS-only / experimental — **не используется в production** |

Подробнее: [`02-architecture.md`](02-architecture.md), [`11-shared-hosting-php-mysql-production.md`](11-shared-hosting-php-mysql-production.md).

## Текущий стек (dev)

| Слой | Технологии |
|------|------------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4, Zustand, React Router |
| Backend (production) | PHP 8.2 + PDO + MySQL в `api/` |
| Backend (experimental) | Node/Express/Prisma в `backend/` — VPS-only |
| Game assets | `public/game-assets/`, `GAME_ASSET_VERSION=24` |

## Текущая версия

- **README:** v1.4 (пользовательская документация)
- **package.json:** 1.0.0
- **GAME_ASSET_VERSION:** 24

## Sprint 1 — Accounts & Storage ✅ (production: PHP + MySQL)

- Auth: register / login / logout / me через **PHP API** (`api/`)
- MySQL: `users`, `user_profiles`, `user_settings`, `user_data`, `auth_sessions`
- Frontend auth layer без переписывания игры
- Legacy import (localStorage banner)
- Node `backend/` — archived / VPS-only
- Подробнее: [`10-accounts-and-storage.md`](10-accounts-and-storage.md)

## Уже реализовано

### Экраны и навигация

- **Dashboard** (`/`) — компактная панель: герой, CTA, ресурс дня, квесты, recovery
- **Today** (`/today`) — ввод дня, квесты, nutrition modes
- **Week** (`/week`) — недельный босс, календарь, бонусы
- **Growth hub** (`/growth/:tab`) — skills, abilities, camp, rewards, achievements, trials; **Growth Hub integration QA (2026-06)** — unified hero panels, tab chrome, trials/achievements copy aligned across tabs
- **Measurements** (`/measurements`) — замеры и графики
- **Journey map** (`/journey`) — вертикальная хроника пути (v3): 9 глав + hero stages (20 стадий трансформации)
- **Codex** (`/codex`) — коллекции: герой, спутники, мобы, боссы, артефакты
- **Freedom** (`/freedom`), **Momentum** (`/momentum`) — метрики устойчивости
- **Progress map** (`/map`) — пути веса, шагов, трезвости и др.
- **Reports** (`/reports`), **Insights** (`/insights`)
- **Settings** (`/settings`), **FAQ** (`/faq`)

### Journey Map (актуальный UI — v3)

**Journey Map v3** = vertical chapter road (не horizontal canvas).

| Breakpoint | Layout |
|------------|--------|
| Desktop (≥1024px) | Vertical route + 9 chapter blocks + sticky `JourneyChapterDetailPanel` справа |
| Mobile (<1024px) | Одна колонка; detail раскрывается под выбранной главой (accordion) |

- **Per-chapter vignettes:** `public/game-assets/maps/chapters/chapter-NN-*.webp` (fallback — CSS gradient).
- **Chapter card:** текст главы слева (статус, title, progress, цели); vignette справа — только art, biome label, symbol, optional current badge «Сейчас».
- **Summary:** `JourneyMapV3SummaryBar` вверху страницы.
- **Legacy v2** (Banana bg, horizontal canvas, `JourneyMapDesktop`, `JourneyMapMobile`, `JourneyChapterSummaryDock`) — **не используется** в UI.

См. [`03-game-systems.md`](03-game-systems.md), [`../brandbook/ui-rules.md`](../brandbook/ui-rules.md).

### Игровые системы

- XP / levels, coins, skills (6 веток)
- Achievements (категории + редкость)
- Recovery / minimal day
- Momentum, Freedom Score, Body abilities
- Weekly boss (trials), daily mobs (codex)
- Chapter bosses (journey map narrative)
- Nutrition tracking (disabled / simple / precise modes)
- Hero stages (20 стадий, male/female)
- Companions (4 спутника)
- Next best action, weekly story reports

### Backend и деплой

- PHP REST API: auth, profile, settings, user_data
- Legacy SQLite routes в `api/index.php` — dev fallback
- `api/health.php` для диагностики на хостинге
- GitHub Actions: build + FTP deploy (`dist/`, `api/`, `.htaccess`)

### Ассеты

- `public/game-assets/` — heroes, companions, mobs, bosses, artifacts, maps
- Female hero: полный набор 20 стадий + death
- Male hero: стадии 1–3, 19–20 + variants 4–18 + death
- 8 legacy codex bosses (PNG), 8 daily mobs, 4 companions
- Journey chapter vignettes: 9 × `.webp` (P0 in-app)
- **Asset Registry 2.0** ✅ — `docs/assets/manifest.json` v2, Art Backlog, validation tests

### Asset Registry 2.0 ✅

- **Manifest v2:** категории hero → uiIcons, приоритеты P0–P3, lifecycle statuses
- **Art Backlog:** [`13-art-backlog.md`](13-art-backlog.md) — P0/P1/P2/P3 без генерации
- **Dark MVP Visual Priority Pack v1** ✅ — 8 prompt-ready ассетов, Nano Banana briefs в `docs/prompts/assets/`
- **Dark MVP Asset Generation Batch 1** ✅ — 4/4 in-app; **Visual QA** (2026-06) — reward banner polish
- **Dark MVP Asset Generation Batch 2** ✅ — 3/3 in-app; optimized webp + UI wire (empty state, plateau artifact, season 1 boss)
- **Body Ability Icons v1** — **12/12 in-app** (visual icon set complete on skill board); glyph fallback remains for future/missing assets
- **Body Abilities UI** — RPG skill board on `/growth/abilities` (all 12 medallions use manifest art v1)
- **Runtime:** `src/game/assetManifest.ts` — `getAssetById`, `getEntityAsset`, `getAssetPlaceholder`
- **Validation:** `assetManifest.test.ts` — unique ids, paths for in-app, categories
- **Prompts:** pack files + `_template-nano-banana-asset.md`, `_template-boss.md`
- **Не в scope:** генерация артов, UI wire, Boss Campaign v2

### Campaign tone (design)

- **MVP-1:** Dark Campaign — resistance-state bosses, dark fantasy copy, human hero
- **Future:** Cozy Campaign — parallel tone, shared mechanics; separate avatar (cat), obstacles, copy, seasons, rewards, assets. **Not** a post-dark stage.

См. [`07-decision-log.md`](07-decision-log.md), [`../brandbook/themes.md`](../brandbook/themes.md).

## Текущие долги

| Приоритет | Задача |
|-----------|--------|
| Средний | **HTTPS / SSL** — сертификат в ispmanager, `secure_cookie => true`, `allowed_origin` → `https://` (future hardening, не блокер) |
| Средний | Journey Map v3 — polish (mobile QA, art tuning) |
| Следующий visual priority | **Boss Campaign v2** art polish (body ability icon set v1 complete) |

### Boss Campaign v1 ✅

- **Каталог:** `src/game/bosses/bossConfig.ts` — 13 season mini-bosses, 9 chapter bosses, 3 act bosses
- **Engine:** `src/game/bosses/bossCampaignEngine.ts` — derived progress (не combat), статусы untouched → sealed
- **UI:** boss line в `SeasonTodayCard`; summary в `SeasonDashboardSummary`; chapter boss в `JourneyChapterDetailPanel`
- **Achievement:** «Первая трещина» (`boss_first_crack`) при 50% progress
- **Не в scope v1:** combat/HP, boss art, отдельный экран, DB migration, новые daily metrics

### Campaign Integration QA v1 ✅

- **Today:** порядок minimal → mob → season → hints → save reaction; body ability hint скрывается при plateau
- **Dashboard:** секция «Кампания» (2-col grid) вместо четырёх разрозненных карточек
- **Growth / Freedom:** навигация и copy к способностям и лагерю без дублей
- **Готовность:** Boss Campaign v1 можно начинать

### Camp/Base Progression v1 ✅

- **8 стадий лагеря:** `src/game/base/baseProgressionConfig.ts` — от «Тлеющий костёр» до «Цитадель формы»
- **Derived engine:** `src/game/base/baseProgressionEngine.ts` — base score из daily entries, seasons, Body Abilities, plateau achievement
- **Без ручного строительства:** прогресс считается автоматически, без новой экономики
- **UI:** `BaseDashboardSummary` на Dashboard, `/growth/camp` в Growth hub, `BaseStageRail` со всеми стадиями
- **Today:** optional `baseLine` в `TodaySaveReactionCard` после save
- **Не в scope v1:** base art/scenes, manual building, DB migration, новые daily metrics

### Plateau Mode v1 ✅

- **Detection engine:** `src/game/plateau/plateauEngine.ts` — soft hint после 10 дней без нового лучшего веса, active после 21 дня или manual flag
- **State:** `settings.plateauState` (manual, dismissed hint) — без DB migration
- **Route holding:** snapshot из existing daily entries (питание, шаги, ресурс, minimal/recovery, alcohol-free, journal, Body Abilities, season)
- **UI:** `PlateauTodayCard` на Today, `PlateauDashboardSummary` на Dashboard; связь с Freedom и Body Abilities
- **Achievement:** «Страж перевала» (`plateau_route_guardian`) — умеренное условие по route-held days
- **Не в scope v1:** медицинская аналитика, Boss Campaign, Camp/Base, новые daily metrics

### Body Abilities v1 ✅

- **Roadmap catalog:** 36 entries in `src/game/bodyAbilities/bodyAbilityConfig.ts` — **12 active** (unlock/hints) + **24 future** (text + glyph placeholders)
- **Progression rings:** `early_signals` (12 active, in-app icons v1), `stable_form` (12 future), `new_mobility` (12 future)
- **Active v1:** mobility, endurance, dailyLife, confidence, clothing, recovery (+ strength category for future entries)
- **Ручное открытие:** «Я заметил улучшение» — только для 12 active; future без CTA и без unlock
- **Мягкие hints:** сигналы из шагов, веса, талии, recovery, дневника — только active abilities
- **UI:** `BodyAbilitySkillBoard` на `/growth/abilities` — 3 секции (первая раскрыта; future свёрнуты по умолчанию); counters «X из 12 активных / на маршруте / в дальнем пути: 24»
- **Art:** icon set v1 — 12/12 in-app; future 24 — glyph placeholders only (Body Ability Icons v2/v3 later)
- **UI:** `BodyAbilityDashboardSummary`, `BodyAbilityTodayHint`
- **Награда:** умеренные coins + XP при первом открытии (once per ability)
- Legacy metric-based abilities сохранены в секции «Прогресс по данным»
- DB schema **без изменений**

### Seasons v1 ✅

- **28-дневный engine:** `src/game/seasons/` — season index/day из `settings.startDate`, progress derived from `dailyEntries`
- **13 season configs:** каталог из wiki + 3–5 квестов на сезон (existing daily fields only)
- **Partial success:** started → marked → held → cleared → empowered (без тона провала)
- **UI:** `SeasonTodayCard` (компактно на Today), `SeasonDashboardSummary` на Dashboard
- **Recap stub:** `getSeasonRecapText()` — текст по статусу, без отдельного экрана
- **Не в scope v1:** Boss Campaign боёвка, season history screen, DB schema, новые daily metrics

### Core Loop Polish v1 — Today ✅

- **Быстрый минимальный день:** карточка «Быстрый ход» + одно нажатие «Включить минимальный день» (сохранение сразу)
- **Реакция игры после сохранения:** `TodaySaveReactionCard` с RPG-копирайтом по состоянию дня (minimal / recovery / ресурс / шаги / питание / квесты)
- **Save UX:** «Сохранить ход», dirty/saved статус, sticky CTA на mobile (375px), desktop save в header
- **Daily mob по состоянию дня:** `getOrCreateDailyMobForEntry` + контекстная строка в `DailyMobCard`
- **Mobile:** `overflow-x-hidden`, `pb-24` под sticky save bar
- Storage / DB schema **без изменений**

### Onboarding v1 — Пробуждение ядра ✅ (QA polish)

- Маршрут `/start`: 5 шагов (пробуждение → вес/рост → герой/тема → спутник → ритм/фокус)
- Gate `OnboardingGate` + redirect с `/start` для завершивших
- RPG-копирайт, sticky CTA на mobile, `max-w-md` ритуал на desktop
- Reload: step/draft в `customSettingsBackup`; «Назад» тоже сохраняет шаг
- После завершения → Today с баннером «Ядро пробуждено»

### Stabilize — sidecar remote persist ✅

- Achievements, coins, momentum сохраняются в remote `user_data` через `sidecarSync.ts`
- Hydrate при login/init; debounced save при изменениях
- Guard: пустой remote не затирает local; hydrate не создаёт save loop
- Local fallback для legacy/unauthenticated режима

### Stabilize — auth/session + production smoke (HTTP) ✅

- Production URL сейчас: **`http://fit-rpg.ru`** (SSL ещё не настроен — это ожидаемо)
- Cookie: `Path=/`, `HttpOnly`, `SameSite=Lax`, **без `Secure`** на HTTP (`secure_cookie => false` на сервере)
- Dual auth: cookie `pr_session` + Bearer token в `sessionStorage`
- Automated API smoke (2026-07-02): register, login, logout, `/api/auth/me`, `dailyEntries`, achievements, `coinTransactions`, `momentumHistory` — OK
- SPA: `index.html` + assets — OK по HTTP
- **HTTPS** (`https://fit-rpg.ru`) → 404 nginx — **не блокер**, future hardening после выпуска сертификата

### Готовность к visual generation / Boss Campaign v2

Asset Registry 2.0 готов: manifest, backlog, naming, placeholders зафиксированы.

## Следующий приоритет

**Batch 2 preparation** (empty-state, plateau artifact, season boss) → **processed + UI wire** → **Body Ability Icons v1 (12/12) in-app** → **Boss Campaign v2** (later). Body Abilities catalog may expand to 24–36 abilities in future year layers — separate from icon set v1.

См. [`01-roadmap.md`](01-roadmap.md) — полный порядок внедрения годовой кампании.

## Технические риски

- разрастание Dashboard;
- дублирование навигации (legacy routes → redirects);
- рассинхрон ассетов (manifest vs `public/game-assets/` vs `GAME_ASSET_VERSION`);
- приватные данные в публичной вики;
- sidecar sync achievements/coins/momentum — **remote persist подключён** (см. Stabilize в долгах);
- consistency hero stages (male incomplete);
- FTP deploy не заливает `data/` — MySQL на хостинге отдельно;
- `api/config/config.php` только на сервере, не в Git.

## Последние крупные решения

- Production backend = **PHP + MySQL** (не Node) из-за shared hosting
- Journey Map v3 = vertical chapter road (не horizontal campaign canvas)
- Year campaign structure documented (seasons, weekly/season quests, boss layers)
- `docs/` — единый источник правды для Cursor и ChatGPT
- Codex = коллекции; Dashboard = кто я + что делать сегодня

См. [`07-decision-log.md`](07-decision-log.md).

## Правило обновления

После каждой крупной задачи обновлять этот файл и связанные wiki-документы (см. [`../README.md`](../README.md) → AI / Cursor workflow).
