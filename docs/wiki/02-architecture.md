# Architecture

> **Единый источник правды.** Обновлено: 2026-08-19.

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
| Pages | `src/pages/` | Экраны-оркестраторы |
| Page models | `src/hooks/useTodayPageModel.ts`, `src/hooks/useSettingsDraft.ts` | Draft + actions; derived Today state is pure `src/utils/todayPageModel.ts` |
| Auth | `src/auth/`, `src/api/` | AuthProvider, HTTP client |
| Storage | `src/storage/` | remote + legacy repositories |
| Components | `src/components/` | UI, game, journey, dashboard |
| Journey map | `src/components/journey/map/` | Campaign map, pins, detail panel, summary dock |
| Constants | `src/constants/` | Достижения, боссы, стадии, journey map config |
| Utils / engines | `src/utils/*Engine.ts` | Игровая логика (pure functions) |
| Game assets | `src/game/assetPaths.ts` | Пути к PNG, версия кэша |
| Store | `src/store/` | Zustand state |
| Types | `src/types/` | TypeScript models |

**Page pattern (Today / Settings):** `Page` → page model hook → domain engines (pure) → presentational sections. Game rules stay in `src/utils/*Engine.ts` / `src/game/`. Sections do not compute Cozy rewards, seasons, or Body Ability selection.

**Settings persistence:** two layers, not one global form. Autosave islands (theme, sidebar visibility, sleep, body-map regenerate) write via `useAppStore.getState()`. Draft-owned fields (goals, hero, avatar, nutrition, weeks, coins, XP, habits) stay local until Save. Incoming store updates merge with `mergePersistedIntoDraft` so dirty keys are kept and pristine keys follow persisted settings. Explicit Save overlays dirty keys onto the latest store snapshot. See [`../audits/settings-draft-safety-v1.md`](../audits/settings-draft-safety-v1.md).

**User data:** `dataSchemaVersion` on settings; `migrateUserData` then `normalizeUserDataWithReport`. Store `hydrationStatus` blocks save until load succeeds. Backup/restore: [`15-backup-and-recovery.md`](15-backup-and-recovery.md).

**Routing:** `src/App.tsx` — React Router v7, protected routes via `ProtectedRoute`. Authenticated pages are `lazy()` with `PageLoader` (`Загрузка раздела...`). Login/register stay eager. After auth, Dashboard and Today are prefetched in parallel with `init()`. `/dev/avatar-pipeline` is `import.meta.env.DEV` only.

**PWA:** `vite-plugin-pwa` — web manifest, service worker (`autoUpdate`), precached hashed SPA shell, NetworkOnly `/api/*`, cache-first `game-assets`. Install hint: Settings → «Установить на телефон». After a deploy, hashed lazy chunks replace the old precache on the next SW activation; missing-chunk-after-HTML-update is not a custom reload loop. Chunk-load / render failures surface in `AppErrorBoundary` (reload / home). Bundle budget: `npm run check:bundle` after `vite build`. See [`../audits/bundle-optimization-v1.md`](../audits/bundle-optimization-v1.md).

Legacy redirects: `/skills` → `/growth/skills`, `/bosses` → `/growth/trials`.

## Storage (authenticated users)

| Данные | Где |
|--------|-----|
| Auth, profile, settings | MySQL `users`, `user_profiles`, `user_settings` |
| Daily, measurements, rewards, bank | MySQL `user_data` JSON |
| Full AppSettings backup | `user_data.customSettingsBackup` |
| Meta-progression on AppSettings | `plateauState`, `bodyAbilityState`, `cozyHome` (game progress stored in settings JSON by convention) |
| UI prefs on AppSettings | `sidebarVisibility` — per-theme opt-in sidebar sections (`cozy` / `darkFantasy`); normalized on load |
| Avatar art | Body Stage 1–20 (engine) → `getAvatarVisualStage` → 5 production anchors; Hero State = overlay only |
| Achievements, coins, momentum (MVP) | `user_data` + localStorage sidecar sync ⚠️ |
| Game assets | Static `public/game-assets/` |

**PHP API endpoints** (`api/router-accounts.php`):

- `POST /api/auth/register|login|logout`, `GET /api/auth/me`
- `GET/PUT /api/data`, `GET/PUT /api/data/:type`
- `POST /api/data/restore` (transactional backup restore)
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
  themes/{cozy,dark-fantasy}/avatars/{male,female}/stage-XX.webp
  themes/{cozy,dark-fantasy}/avatars/placeholders/{male,female,neutral}.svg
  themes/{cozy,dark-fantasy}/avatars/hero-state/*-overlay.svg
  heroes/{male,female}/…          ← DF legacy (migration TODO)
  companions/  mobs/  bosses/  artifacts/
  maps/journey-map-bg-*.png

art-source/avatar-generation/   ← WIP sources (not runtime)

src/constants/avatarAssetManifest.ts
src/game/avatar/avatarAssetResolver.ts
src/game/assetPaths.ts          ← GAME_ASSET_VERSION + legacy helpers
docs/assets/manifest.json
```

**Avatar pipeline rules:**

- One resolver: `getResolvedAvatarStageAsset` (no hardcoded paths in UI)
- No cross-theme fallback; production missing stage → same-theme placeholder
- Body Stage selects silhouette; Hero State is overlay/chrome only
- Bump `GAME_ASSET_VERSION` when replacing runtime art
- `npm run validate:avatars` before approving sets

## Testing

- Unit: Vitest (`src/**/*.test.ts`)
- E2E: Playwright (`npm run test:e2e`) — master core, visual/responsive smoke, Today/Settings architecture smoke, onboarding, theme switch, measurements
- Local gate: `npm run verify` (typecheck + unit tests + `validate:avatars` + production build)

## Key files for AI

| Задача | Файлы |
|--------|-------|
| Новая игровая механика | `src/utils/*Engine.ts`, `src/constants/` |
| Journey map | `src/components/journey/map/v3/*`, `journeyMapConfig.ts`, `journey-map-v3.css` |
| Новый экран | `src/pages/`, `src/App.tsx` |
| Today / Settings pages | `useTodayPageModel`, `todayPageModel.ts`, `useSettingsDraft`, `src/components/today/`, `src/components/settings/` |
| Ассеты | `src/game/assetPaths.ts`, `docs/assets/manifest.json` |
| API (production) | `api/`, `api/config/config.example.php`, `api/migrations/` |
| API (VPS-only) | `backend/` |
| Auth / storage | `docs/wiki/10-accounts-and-storage.md` |
| Deploy | `.github/workflows/deploy.yml` |
