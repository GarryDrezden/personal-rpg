# Release Notes

## Unreleased

### Added

- PHP + MySQL production backend for shared hosting (`api/`, MySQL auth/storage)
- Journey Map v3 vertical chapter road (`JourneyMapV3Section`, per-chapter vignettes)
- `JourneyChapterDetailPanel` — selected chapter details (desktop/tablet/mobile)
- `JourneyChapterSummaryDock` — unified lower summary block (context + progress + goals)
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

- Added Journey Map v3 chapter vignette art support with UI-rendered captions, chapter medallions, and status overlays.
- Rebuilt Journey Map as vertical chapter road (v3): per-chapter biome vignettes, route rail, sticky detail panel, summary bar.
- Reworked Journey Map into layered RPG campaign map (v2, superseded by v3).
- Project wiki and brandbook updated as source of truth (`00-project-state`, roadmap, architecture, decision log, UI rules).
- `docs/README.md` — входная точка вики
- Root `README.md` — ссылка на project wiki

### Fixed

- Fixed Journey Map v3 rail node clipping.
- Improved chapter card layout so vignette art is integrated into the card instead of appearing as a separate table column.
- Reduced duplicate chapter numbering in Journey vignettes.
- Removed duplicated chapter title/subtitle/progress from Journey v3 vignette overlays.
- Simplified chapter art area into atmospheric biome panel.

- Fixed Journey Map background overlay seam.
- Reworked lower journey summary blocks into a single chapter summary dock.
- Removed overlapping full chapter cards from the desktop journey map.
- Fixed map overflow and detached stage labels.
- Fixed stretched map composition and horizontal overflow.
- Fixed Journey Map v2 desktop overflow, sidebar offset, detached stage labels, and active node mismatch.
- PHP auth session cookie on shared hosting (explicit Set-Cookie, Path=/)
- Register/login verify session via `/api/auth/me` before data load
- Removed outdated Node backend error hint on frontend

### Removed

- —

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
