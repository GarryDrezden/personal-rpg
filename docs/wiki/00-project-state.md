# Текущее состояние проекта

> **Единый источник правды.** Обновлено: 2026-06-06. После каждой крупной задачи Cursor обновляет этот файл.

## Краткое описание

**Личная RPG** — gamified personal transformation app: приложение о возвращении тела, движения, контроля, ясности и устойчивости через RPG-механики.

## Главная философия

Приложение не должно быть бухгалтерией похудения.
Это личная RPG, где пользователь возвращает способности тела и устойчивость системы.

Ключевые принципы:

- честность важнее идеальности;
- recovery — инструмент, не наказание;
- вес — не единственный прогресс;
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
- **Journey map** (`/journey`) — RPG campaign map, 9 глав пути + hero stages (20 стадий трансформации)
- **Codex** (`/codex`) — коллекции: герой, спутники, мобы, боссы, артефакты
- **Freedom** (`/freedom`), **Momentum** (`/momentum`) — метрики устойчивости
- **Progress map** (`/map`) — пути веса, шагов, трезвости и др.
- **Reports** (`/reports`), **Insights** (`/insights`)
- **Settings** (`/settings`), **FAQ** (`/faq`)

### Journey Map (актуальный UI)

- Desktop: карта (Banana bg + SVG route + compact pins) + `JourneyChapterDetailPanel` справа
- Tablet: карта сверху, detail panel снизу
- Mobile: `JourneyMapMobile` — вертикальный маршрут
- Под картой: единый `JourneyChapterSummaryDock` (контекст + прогресс + цели)
- См. [`03-game-systems.md`](03-game-systems.md), [`../brandbook/ui-rules.md`](../brandbook/ui-rules.md)

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
- Journey map background: `public/game-assets/maps/`

## Текущие долги

| Приоритет | Задача |
|-----------|--------|
| Высокий | Sidecar sync achievements / coins / momentum на remote `user_data` |
| Высокий | Стабилизация PHP auth / session на shared hosting |
| Средний | Journey Map — финальный visual polish (координаты pins под фон) |
| Следующий спринт | **Sprint 2:** Onboarding + Asset Registry 2.0 |

## Следующий приоритет

**Спринт 2:** Onboarding + Asset Registry 2.0

- пол персонажа, тема, цели, стартовый/целевой вес;
- выбор спутника;
- связка `gender + theme + stage + asset`.

Графика и hero stages — **Спринт 3**. Подробнее: [`01-roadmap.md`](01-roadmap.md).

## Технические риски

- разрастание Dashboard;
- дублирование навигации (legacy routes → redirects);
- рассинхрон ассетов (manifest vs `public/game-assets/` vs `GAME_ASSET_VERSION`);
- приватные данные в публичной вики;
- sidecar sync achievements/coins/momentum — частично через localStorage;
- consistency hero stages (male incomplete);
- FTP deploy не заливает `data/` — MySQL на хостинге отдельно;
- `api/config/config.php` только на сервере, не в Git.

## Последние крупные решения

- Production backend = **PHP + MySQL** (не Node) из-за shared hosting
- Journey Map = RPG campaign map, не таблица карточек
- `docs/` — единый источник правды для Cursor и ChatGPT
- Codex = коллекции; Dashboard = кто я + что делать сегодня

См. [`07-decision-log.md`](07-decision-log.md).

## Правило обновления

После каждой крупной задачи обновлять этот файл и связанные wiki-документы (см. [`../README.md`](../README.md) → AI / Cursor workflow).
