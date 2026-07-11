# Architecture

> **Единый источник правды.** Обновлено: 2026-06-06.

## Current production architecture

```text
React frontend  →  dist/          (static SPA)
PHP API         →  api/           (auth, profile, settings, user_data)
MySQL           →  shared hosting database (users, profiles, settings, user_data)
.htaccess       →  SPA fallback + /api/* routing
```

**Deploy (GitHub Actions → FTP):** `dist/` + `api/` + `.htaccess` — без `backend/`, без `data/`.

```text
Browser (React SPA)
    │
    └── /api/* → api/index.php (PHP 8.2 LSAPI)
                    │
                    └── router-accounts.php → MySQL
```

Конфиг production: `api/config/config.php` (на сервере, **не в Git**). Шаблон: `api/config/config.example.php`.

Подробнее: [`11-shared-hosting-php-mysql-production.md`](11-shared-hosting-php-mysql-production.md).

## Node backend status

```text
backend/ = VPS-only / experimental
not used in current production
```

Node/Express/Prisma в `backend/` — прототип Sprint 1 для VPS. Production переключён на PHP + MySQL из-за shared hosting без Node-процесса. Код сохранён для будущего VPS, когда появится бюджет.

## Frontend

| Область | Путь | Описание |
|---------|------|----------|
| Pages | `src/pages/` | Экраны приложения |
| Auth | `src/auth/`, `src/api/` | AuthProvider, HTTP client |
| Storage | `src/storage/` | remote + legacy repositories |
| Components | `src/components/` | UI, game, journey, dashboard |
| Journey map | `src/components/journey/map/` | Campaign map, pins, detail panel, summary dock |
| Constants | `src/constants/` | Достижения, боссы, стадии, journey map config |
| Utils / engines | `src/utils/*Engine.ts` | Игровая логика (pure functions) |
| Game assets | `src/game/assetPaths.ts` | Пути к PNG, версия кэша |
| Store | `src/store/` | Zustand state |
| Types | `src/types/` | TypeScript models |

**Routing:** `src/App.tsx` — React Router v7, protected routes via `ProtectedRoute`.

**PWA:** `vite-plugin-pwa` — web manifest, service worker (`autoUpdate`), precached SPA shell, network-first `/api/*`, cache-first `game-assets`. Install hint: Settings → «Установить на телефон». Legacy PHP SQLite API is not cached for offline writes.

Legacy redirects: `/skills` → `/growth/skills`, `/bosses` → `/growth/trials`.

## Storage (authenticated users)

| Данные | Где |
|--------|-----|
| Auth, profile, settings | MySQL `users`, `user_profiles`, `user_settings` |
| Daily, measurements, rewards, bank | MySQL `user_data` JSON |
| Full AppSettings backup | `user_data.customSettingsBackup` |
| Achievements, coins, momentum (MVP) | `user_data` + localStorage sidecar sync ⚠️ |
| Game assets | Static `public/game-assets/` |

**PHP API endpoints** (`api/router-accounts.php`):

- `POST /api/auth/register|login|logout`, `GET /api/auth/me`
- `GET/PUT /api/data`, `GET/PUT /api/data/:type`
- `PATCH /api/profile`, `PATCH /api/settings`

**Legacy PHP API** (`api/index.php`, SQLite): `/daily`, `/measurements`, … — dev fallback only.

## Dev environment

- `npm run dev` — frontend (Vite)
- API: OSPanel или `php -S` в `api/`
- `scripts/` — import-measurements, reset-data, utilities

## Hosting (production)

- Shared hosting, PHP 8.2+ LSAPI, MySQL (ispmanager)
- FTP deploy через GitHub Actions
- Node/MySQL `backend/` — **не** в production deploy
- `data/` и `config.php` — **не** деплоятся через CI

## Asset architecture

```text
public/game-assets/
  heroes/{male,female}/stage-XX.png
  heroes/{male,female}/variants/
  companions/  mobs/  bosses/  artifacts/
  maps/journey-map-bg-*.png

docs/assets/manifest.json     ← статусы, темы, notes
src/game/assetPaths.ts        ← runtime paths + GAME_ASSET_VERSION
src/constants/journeyMapConfig.ts  ← journey map layout
```

**Правила:**

- Не перемещать файлы без обновления `assetPaths.ts`
- При замене PNG — bump `GAME_ASSET_VERSION`
- Новые variant-папки — для будущих тем, не ломая текущие пути

## Testing

- Unit: Vitest (`src/**/*.test.ts`)
- E2E: Playwright (`npm run test:e2e`)

## Key files for AI

| Задача | Файлы |
|--------|-------|
| Новая игровая механика | `src/utils/*Engine.ts`, `src/constants/` |
| Journey map | `src/components/journey/map/*`, `journeyMapConfig.ts`, `journey-map-v2.css` |
| Новый экран | `src/pages/`, `src/App.tsx` |
| Ассеты | `src/game/assetPaths.ts`, `docs/assets/manifest.json` |
| API (production) | `api/`, `api/config/config.example.php`, `api/migrations/` |
| API (VPS-only) | `backend/` |
| Auth / storage | `docs/wiki/10-accounts-and-storage.md` |
| Deploy | `.github/workflows/deploy.yml` |
