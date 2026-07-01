# Release Notes

## Unreleased

### Added

- PHP + MySQL production auth API in `api/` (shared hosting)
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

- `docs/README.md` — входная точка вики
- Root `README.md` — ссылка на project wiki

### Fixed

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
