# Текущее состояние проекта

> Обновлено: 2026-06-06. После каждой крупной задачи Cursor обновляет этот файл.

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

## Текущий стек

| Слой | Технологии |
|------|------------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4, Zustand, React Router |
| Backend (production) | PHP 8.2 LSAPI + PDO + MySQL в `api/` |
| Backend (experimental) | Node/Express/Prisma в `backend/` — VPS-only, не в production |
| Dev / deploy | GitHub Actions FTP: `dist/` + `api/` + `.htaccess` |
| Game assets | `public/game-assets/`, версия кэша `GAME_ASSET_VERSION=19` |

## Текущая версия

- **README:** v1.4 (пользовательская документация)
- **package.json:** 1.0.0
- **GAME_ASSET_VERSION:** 19

## Sprint 1 — Accounts & Storage (production: PHP + MySQL)

- Auth: register / login / logout / me через **PHP API** (`api/`)
- MySQL: `users`, `user_profiles`, `user_settings`, `user_data`, `auth_sessions`
- Frontend auth layer без переписывания игры
- Legacy import (localStorage banner)
- Node `backend/` — archived / VPS-only
- Подробнее: [`10-accounts-and-storage.md`](10-accounts-and-storage.md), [`11-shared-hosting-php-mysql-production.md`](11-shared-hosting-php-mysql-production.md)

## Уже реализовано

### Экраны и навигация

- **Dashboard** (`/`) — компактная панель: герой, CTA, квесты, неделя, recovery
- **Today** (`/today`) — ввод дня, квесты, nutrition modes
- **Week** (`/week`) — недельный босс, календарь, бонусы
- **Growth hub** (`/growth/:tab`) — skills, abilities, rewards, achievements, trials
- **Measurements** (`/measurements`) — замеры и графики
- **Journey map** (`/journey`) — dark fantasy карта пути (20 стадий)
- **Codex** (`/codex`) — коллекции: герой, спутники, мобы, боссы, артефакты
- **Freedom** (`/freedom`), **Momentum** (`/momentum`) — метрики устойчивости
- **Progress map** (`/map`) — пути веса, шагов, трезвости и др.
- **Reports** (`/reports`), **Insights** (`/insights`)
- **Settings** (`/settings`), **FAQ** (`/faq`)

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

- PHP REST API: daily, measurements, settings, week goals, rewards
- SQLite schema + migrations в `api/Database.php`
- `api/health.php` для диагностики на хостинге
- GitHub Actions: build + FTP deploy (`dist/`, `api/`, `.htaccess`)
- Windows autostart: nginx + PHP (`server/`)

### Ассеты

- `public/game-assets/` — heroes, companions, mobs, bosses, artifacts
- Female hero: полный набор 20 стадий + death
- Male hero: стадии 1–3, 19–20 + death (4–18 — fallback на якоря)
- 8 chapter bosses, 8 daily mobs, 4 companions

## В работе

- Догенерация male hero stages 4–18 (dark fantasy линейка)
- Консистентность hero stages между male/female
- Полный remote sync sidecar-данных (achievements, coins, momentum) — частично через localStorage
- Production deploy Node backend (сейчас dev + отдельный VPS TODO)
- Полировка journey map и codex showcase

## Следующий приоритет

**Спринт 2:** Onboarding + Asset Registry 2.0 (выбор пола, темы, целей, связь ассетов с профилем).

Графика и hero stages — **Спринт 3**. Подробнее: [`01-roadmap.md`](01-roadmap.md).

## Технические риски

- разрастание Dashboard;
- дублирование навигации (legacy routes `/skills`, `/bosses` → redirects);
- рассинхрон ассетов (manifest vs `public/game-assets/` vs `GAME_ASSET_VERSION`);
- приватные данные в публичной вики;
- миграция localStorage / SQLite → accounts + DB — **MVP готов**, sidecar sync частичный;
- consistency hero stages (male incomplete);
- FTP deploy не заливает `data/` — база на хостинге отдельно.

## Последние крупные решения

- `docs/` — единый источник правды для Cursor и ChatGPT
- ассеты через `public/game-assets/` + `docs/assets/manifest.json`
- яркая male-генерация — cozy/light candidate, не dark fantasy
- Codex = коллекции; Dashboard = кто я + что делать сегодня
- CI deploy на shared hosting по FTP

См. также: [`07-decision-log.md`](07-decision-log.md)

## Правило обновления

После каждой крупной задачи Cursor должен обновить этот файл и связанные wiki-документы (см. [`../README.md`](../README.md)).
