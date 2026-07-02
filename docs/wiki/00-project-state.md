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
| Game assets | `public/game-assets/`, `GAME_ASSET_VERSION=19` |

## Текущая версия

- **README:** v1.4 (пользовательская документация)
- **package.json:** 1.0.0
- **GAME_ASSET_VERSION:** 19

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
- **Growth hub** (`/growth/:tab`) — skills, abilities, rewards, achievements, trials
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
- Male hero: стадии 1–3, 19–20 + death (4–18 — fallback на якоря)
- 8 chapter bosses, 8 daily mobs, 4 companions
- Journey chapter vignettes: `public/game-assets/maps/chapters/` (9 × `.webp`)

## Текущие долги

| Приоритет | Задача |
|-----------|--------|
| Средний | **HTTPS / SSL** — сертификат в ispmanager, `secure_cookie => true`, `allowed_origin` → `https://` (future hardening, не блокер) |
| Средний | Journey Map v3 — polish (mobile QA, art tuning) |
| Следующий спринт | **Core Loop Polish** |

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

### Готовность к Core Loop Polish

**Можно начинать** после деплоя Onboarding v1 на HTTP production.

## Следующий приоритет

**Core Loop Polish** → Asset Registry 2.0 visual polish → Seasons v1.

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
