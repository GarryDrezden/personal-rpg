# Architecture

## Current architecture (production)

```
Browser (React SPA, dist/)
    │
    └── /api/* → api/index.php (PHP 8.2 LSAPI)
                    │
                    ├── router-accounts.php → MySQL (auth, user_data)
                    └── legacy SQLite routes (dev fallback, optional)
```

**Deploy (GitHub Actions → FTP):** `dist/` + `api/` + `.htaccess` — без `backend/`.

**Experimental (not production):** `backend/` Node + Prisma — VPS-only.

### Frontend

| Область | Путь | Описание |
|---------|------|----------|
| Pages | `src/pages/` | Экраны приложения |
| Auth | `src/auth/`, `src/api/` | AuthProvider, HTTP client |
| Storage | `src/storage/` | remote + legacy repositories |
| Components | `src/components/` | UI, game, journey, dashboard |
| Constants | `src/constants/` | Достижения, боссы, стадии, темы |
| Utils / engines | `src/utils/*Engine.ts` | Игровая логика (pure functions) |
| Game assets | `src/game/assetPaths.ts` | Пути к PNG, версия кэша |
| Store | `src/store/` | Zustand state |
| Types | `src/types/` | TypeScript models |

**Routing:** `src/App.tsx` — React Router v7, protected routes via `ProtectedRoute`.

Legacy redirects: `/skills` → `/growth/skills`, `/bosses` → `/growth/trials`.

### Storage (Sprint 1)

| Данные | Где (authenticated) |
|--------|---------------------|
| Auth, profile, settings | MySQL `User`, `UserProfile`, `UserSettings` |
| Daily, measurements, rewards, bank | MySQL `UserData` JSON (`dailyEntries`, …) |
| Full AppSettings backup | `UserData.customSettingsBackup` |
| Achievements, coins, momentum (MVP) | `UserData` + localStorage sidecar sync |
| Theme UI pref (legacy) | localStorage (TODO: full remote) |
| Game assets | Static files `public/game-assets/` |

**PHP API endpoints** (`api/router-accounts.php`, MySQL):

- `POST /api/auth/register|login|logout`, `GET /api/auth/me`
- `GET/PUT /api/data`, `GET/PUT /api/data/:type`
- `PATCH /api/profile`, `PATCH /api/settings`

Конфиг: `api/config/config.php` (на сервере, не в Git).

**Legacy PHP API** (`api/index.php`, SQLite): `/daily`, `/measurements`, … — dev fallback.

Подробнее: [`11-shared-hosting-php-mysql-production.md`](11-shared-hosting-php-mysql-production.md)

### Server (Windows local)

- `backend/` — Node API (`npm run dev:server`)
- `server/` — nginx + PHP-CGI runtime (legacy local stack)
- `scripts/` — dev-api, build-release, autostart installers

### Hosting (production)

- Shared hosting, PHP 8.2+ — static + PHP API via FTP
- MySQL на хостинге (ispmanager) — `api/config/config.php` вручную
- Node/MySQL `backend/` — **не** в production deploy
- `data/` **не** деплоится через CI

Подробнее: [`10-accounts-and-storage.md`](10-accounts-and-storage.md)

## Previous architecture (pre-Sprint 1)

```
Browser → Vite → /api/* → PHP → SQLite
```

## Planned (Sprint 2+)

## Asset architecture

```
public/game-assets/
  heroes/{male,female}/stage-XX.png
  heroes/{male,female}/death.png
  heroes/{male,female}/variants/   ← future: dark-fantasy/, light/
  companions/
  mobs/
  bosses/
  artifacts/
  logos/                             ← future
  references/                        ← future (non-private refs only in repo)

docs/assets/manifest.json            ← статусы, темы, notes
src/game/assetPaths.ts               ← runtime paths + GAME_ASSET_VERSION
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
| Новый экран | `src/pages/`, `src/App.tsx` |
| Ассеты | `src/game/assetPaths.ts`, `docs/assets/manifest.json` |
| API (production) | `api/`, `api/config/config.example.php`, `api/migrations/` |
| API (VPS-only) | `backend/` |
| Auth / storage | `docs/wiki/10-accounts-and-storage.md` |
| Deploy | `.github/workflows/deploy.yml` |
