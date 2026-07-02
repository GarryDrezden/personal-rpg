# Release Notes

## Unreleased

### Added

- **Camp/Base Progression v1:** 8-stage hero camp; derived base score from existing daily, season, body ability and plateau signals; Dashboard base card; Growth `/growth/camp` section; lightweight Today save feedback. DB schema, new economy, manual building and Boss Campaign kept out of scope.
- **Plateau Mode v1 — Удержание перевала:** soft and active plateau detection; manual «Я на перевале» state; route-holding snapshot from existing daily entries; Today plateau card and Dashboard summary; Body Abilities connection as non-weight progress; achievement «Страж перевала». Medical analytics, DB schema changes and new daily metrics kept out of scope.
- **Core Loop Polish v1 — Today:** improved daily Today flow; save reaction card; minimal/recovery day quick path; contextual daily mob; sticky mobile save CTA.
- **Seasons v1:** 28-day season engine; 13 season configs; quest progress from daily entries; partial success; compact season card on Today and Dashboard.
- **Body Abilities v1:** body abilities catalog; manual unlock; soft hints; Dashboard summary; Growth/Freedom integration.
- **Onboarding v1 — Пробуждение ядра:** first-start flow at `/start` for new users (weights, hero, theme, companion, route focus); `OnboardingGate`; remote persist via profile + `customSettingsBackup`; redirect to Today after completion.
- **Stabilize — Remote Sidecar Persist:** achievements, coins and momentum sync to remote `user_data` via `sidecarSync.ts` (debounced save, hydrate on init, merge guards).
- Documented long-term campaign structure for 12–24 month body transformation (`03-game-systems.md`: time layers, acts, parallel progress roads, seasons, plateau mode, body abilities, camp/base).
- Added planned systems to roadmap: Seasons v1, Body Abilities v1, Plateau Mode, Camp/Base Progression, Boss Campaign.
- **Journey Map v3** — vertical chapter road (`JourneyMapV3Section`, `JourneyMapV3Route`, `JourneyChapterRoadItem`, `JourneyChapterVignette`, `JourneyMapV3SummaryBar`, sticky/accordion `JourneyChapterDetailPanel`).
- Per-chapter vignette art: `public/game-assets/maps/chapters/chapter-NN-*.webp`.
- Resource & Rest v1: sleep quality, cognitive breaks, resource score, Today «Восстановление» block, Dashboard compact resource summary.
- PHP + MySQL production backend for shared hosting (`api/`, MySQL auth/storage)
- Updated project wiki as single source of truth for Cursor / ChatGPT
- SQL migration `api/migrations/001_create_accounts_tables.sql`
- `api/config/config.example.php` (real config on server only)
- Production guide [`11-shared-hosting-php-mysql-production.md`](wiki/11-shared-hosting-php-mysql-production.md)
- Accounts/auth foundation (register, login, logout, `/api/auth/me`)
- User profile and settings tables
- Protected routes (`ProtectedRoute`, Login/Register pages)
- Remote storage layer (`remoteStorageClient`) + legacy import (SQLite script + browser banner)
- `docs/wiki/10-accounts-and-storage.md`
- Project wiki structure (`docs/wiki/`, `docs/brandbook/`, `docs/prompts/`)
- Asset gallery manifest (`docs/assets/manifest.json`)
- Privacy plan (`docs/wiki/09-privacy-plan.md`)
- Brandbook: visual style, themes, characters, UI rules

### Changed

- **Journey Map:** replaced horizontal campaign map experiments (v2: Banana canvas, pins, summary dock) with **vertical chapter road (v3)**.
- Journey Map v3 chapter vignette art integrated into chapter cards (atmospheric art panel, no duplicate text on vignette).
- Project wiki and brandbook updated as source of truth (`00-project-state`, roadmap, architecture, decision log, UI rules).
- `docs/README.md` — входная точка вики
- Root `README.md` — ссылка на project wiki

### Fixed (Journey Map v3)

- Rail node clipping on vertical route.
- Vignette art integrated into chapter card (not a separate table column).
- Removed duplicate chapter numbering and title/subtitle/progress inside vignette overlays.
- Simplified vignette to atmospheric biome panel (label + symbol + optional current badge).

### Fixed (other)

- Fixed Journey Map v2 background overlay seam (historical; v2 superseded).
- Reworked lower journey summary blocks into unified dock (historical; replaced by v3 summary bar).
- PHP auth session cookie on shared hosting (explicit Set-Cookie, Path=/)
- Register/login verify session via `/api/auth/me` before data load
- Removed outdated Node backend error hint on frontend

### Removed

- —

---

## Camp/Base Progression v1

- Added 8-stage hero camp progression.
- Added derived base score from existing daily, season, body ability and plateau signals.
- Added Dashboard base card and Growth `/growth/camp` section.
- Added lightweight Today feedback after save.
- Kept DB schema, new economy, manual building and Boss Campaign out of scope.

---

## Plateau Mode v1 — Удержание перевала

- Added soft and active plateau detection (10 / 21 days without new best weight).
- Added manual «Я на перевале» state in `settings.plateauState`.
- Added route-holding snapshot from existing daily entries.
- Added Today plateau card and Dashboard summary.
- Connected Plateau Mode with Body Abilities as non-weight progress.
- Added achievement «Страж перевала».
- Kept medical analytics, DB schema changes and new daily metrics out of scope.

---

## Body Abilities v1

- Added body abilities catalog.
- Added manual unlock flow: «Я заметил улучшение».
- Added soft ability hints from existing data.
- Added Dashboard summary.
- Integrated body abilities into Freedom/Growth area.
- Kept medical analytics, DB schema changes and new daily metrics out of scope.

---

## Seasons v1

- Added 28-day season engine.
- Added 13 season configs.
- Added season quest progress from existing daily entries.
- Added partial success statuses.
- Added compact current season card to Today and Dashboard.
- Kept Boss Campaign, DB schema and new metrics out of scope.

---

## Core Loop Polish v1 — Today

- Improved daily Today flow.
- Added clearer save feedback and game reaction after saving.
- Improved minimal/recovery day presentation.
- Polished mobile Today experience.
- Kept storage and database schema unchanged.

---

## Onboarding v1 — Пробуждение ядра (polish)

- RPG tone copy per step (кампания / стартовая точка / облик героя / спутник / первый ритм).
- Mobile: sticky CTA, compact companions, safe-area padding, no horizontal scroll.
- Desktop: centered `max-w-md` ritual layout with ambient glow.
- Returning users redirected from `/start`; back navigation persists step for reload.
- Today welcome banner polish after route setup.

---

## Stabilize — Production Smoke / Auth Session

- Code review: cookie `Path=/`, `SameSite=Lax`, HttpOnly; Bearer + cookie dual auth.
- Fixed `/api/health.php` routing (`.htaccess` + `api/index.php` fallback).
- Logout clears local auth state even if API request fails.
- `AuthenticatedApp` init race guard; re-init on login via `authenticated` dependency.
- **Production smoke on HTTP (2026-07-02):** `http://fit-rpg.ru` — health OK, register/login/logout/me OK, `dailyEntries` + sidecars persist after re-login.
- Cookie on HTTP: `Set-Cookie` without `Secure` flag — matches `secure_cookie => false`.
- **HTTPS not configured yet** — `https://fit-rpg.ru` returns 404 nginx; recorded as future SSL hardening, not an app blocker.
- Manual browser checklist (reload UI, incognito): see [`11-shared-hosting-php-mysql-production.md`](wiki/11-shared-hosting-php-mysql-production.md).

---

## Stabilize — Remote Sidecar Persist

- Connected local sidecar progress to remote `user_data` storage.
- Achievements, coins and momentum now survive reload/login/device changes.
- Added guard against hydrate → save loops (`isSidecarHydrating`).
- Empty remote payload no longer overwrites existing local sidecar progress.
- Preserved local fallback for unauthenticated/offline usage.
- Re-init app data on login (`AuthenticatedApp` watches `authenticated`).
- Build and tests are green.

---

## Wiki / Game Design Update — Year Campaign Structure

- Added year campaign model for Personal RPG (`03-game-systems.md` → Year Campaign Structure).
- Defined day → week → season → chapter → act → campaign progression.
- Added 28-day seasons as the main long-term retention layer (~13 seasons/year).
- Added weekly quests and season quests as wrappers around existing daily actions.
- Added partial success model for seasons (no «5/5 or fail» logic).
- Added boss hierarchy: daily mobs, weekly elites, seasonal mini-bosses, chapter bosses, act bosses.
- Added boss weakening principle (real actions, not abstract damage).
- Added 13-season catalog as structural baseline for year one.
- Clarified that Boss Campaign is a future layer after core loop, Seasons v1, Body Abilities and Plateau Mode.
- Reinforced UX rule: the game must support return and progress, not become a body accounting system.
- Updated roadmap with correct implementation order: Stabilize → Onboarding → Core Loop Polish → Seasons v1 → …

---

## 2026-06-06 — Deploy & assets

### Added

- GitHub Actions FTP deploy workflow
- `api/health.php`, `.htaccess` for hosting
- Male hero stages 1–3, 19–20 updates (`GAME_ASSET_VERSION=18`)

### Changed

- Journey map layout and dark fantasy styling
- Codex: removed redundant asset blocks

---

## Earlier (see root README)

| Version | Highlights |
|---------|------------|
| v1.4 | Custom secondary goals, card colors |
| v1.3 | Cozy + Dark Fantasy themes |
| v1.2 | Local insights |
| v1.1 | Weekly reports |
| v1.0 | Core RPG: quests, XP, coins, skills, bosses |
