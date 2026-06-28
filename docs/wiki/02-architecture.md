# Architecture

## Current architecture (Sprint 1)

```
Browser (React SPA)
    │
    ├── Vite build → dist/ (static)
    │
    └── /api/* → Node backend (backend/, port 3001)
                    │
                    ├── Prisma ORM
                    └── MySQL (users, profiles, settings, user_data, sessions)
```

**Legacy (still in repo):**

```
/api/* (PHP) → SQLite (data/personal-rpg.sqlite)   ← import source, not used when authenticated
```

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

**Node API endpoints** (`backend/src/routes/`):

- `POST /api/auth/register|login|logout`, `GET /api/auth/me`
- `GET/PUT /api/data`, `GET/PUT /api/data/:type`
- `PATCH /api/profile`, `PATCH /api/settings`

**Legacy PHP API** (`api/index.php`): daily, measurements, settings, rewards — для импорта и старого deploy.

### Server (Windows local)

- `backend/` — Node API (`npm run dev:server`)
- `server/` — nginx + PHP-CGI runtime (legacy local stack)
- `scripts/` — dev-api, build-release, autostart installers

### Hosting (production)

- Shared hosting, PHP 8.2+ — **static frontend + legacy PHP** via FTP
- Node/MySQL backend — **отдельный хост** (VPS/Railway) — TODO for prod accounts
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
| API (accounts) | `backend/src/`, `backend/prisma/` |
| API (legacy) | `api/index.php`, `api/Database.php` |
| Auth / storage | `docs/wiki/10-accounts-and-storage.md` |
| Deploy | `.github/workflows/deploy.yml` |
