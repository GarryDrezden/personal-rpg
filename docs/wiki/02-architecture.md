# Architecture

## Current architecture

```
Browser (React SPA)
    │
    ├── Vite build → dist/ (static)
    │
    └── /api/* → PHP (api/index.php)
                    │
                    └── SQLite (data/personal-rpg.sqlite)
```

### Frontend

| Область | Путь | Описание |
|---------|------|----------|
| Pages | `src/pages/` | Экраны приложения |
| Components | `src/components/` | UI, game, journey, dashboard |
| Constants | `src/constants/` | Достижения, боссы, стадии, темы |
| Utils / engines | `src/utils/*Engine.ts` | Игровая логика (pure functions) |
| Game assets | `src/game/assetPaths.ts` | Пути к PNG, версия кэша |
| Store | `src/store/` | Zustand state |
| Types | `src/types/` | TypeScript models |

**Routing:** `src/App.tsx` — React Router v7.

Legacy redirects: `/skills` → `/growth/skills`, `/bosses` → `/growth/trials`.

### Storage (current)

| Данные | Где |
|--------|-----|
| Daily entries, measurements, settings | SQLite via PHP API |
| Theme, часть UI prefs | localStorage |
| Coins, achievements, game progress (частично) | localStorage + SQLite mix |
| Game assets | Static files `public/game-assets/` |

**API endpoints** (`api/index.php`):

- `GET/PUT/DELETE /daily/{date}`
- `GET/POST/DELETE /measurements`
- `GET/PUT /settings`
- `GET/POST/DELETE /week-goals`
- `GET/POST/DELETE /rewards`
- `GET /health` (`health.php`)

### Server (Windows local)

- `server/` — nginx + PHP-CGI runtime, autostart scripts
- `scripts/` — dev-api, build-release, autostart installers

### Hosting (production)

- Shared hosting, PHP 8.2+
- GitHub Actions: `npm run build` → FTP upload `dist/`, `api/`, `.htaccess`
- `data/` **не** деплоится через CI — SQLite создаётся на сервере

## Planned architecture

```
Browser
    │
    └── API (PHP or Node — TBD)
            │
            ├── PostgreSQL (or selected DB)
            └── user_data table by userId
```

- User accounts (registration / login)
- Server-side storage per user
- Migration tool: local SQLite + localStorage → account
- Sync between devices

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
| API | `api/index.php`, `api/Database.php` |
| Deploy | `.github/workflows/deploy.yml` |
