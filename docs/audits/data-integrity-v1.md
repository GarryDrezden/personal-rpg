# Data Integrity v1

**Date:** 2026-08-19  
**Scope:** schema version, migrate vs normalize, hydration safety, JSON backup/restore, optional revision concurrency.

## Data path

```text
Browser state
  → Zustand (hydrationStatus: pending | ready | failed)
  → dataApi PUT/GET /api/data/:type
  → PHP DataController
  → MySQL user_data JSON blobs (+ user_profiles / user_settings)
  → reload GET /api/data
  → envelopeFromRawData → migrateUserData → normalizeUserData
  → runtime
```

Writes are blocked until `hydrationStatus === 'ready'`. Load failure does not replace store with empty defaults and does not save.

## Data inventory

| Data | Where | Canonical type | Required | Normalize | Default | Migration | Owner |
|------|--------|----------------|----------|-----------|---------|-----------|--------|
| Profile | MySQL `user_profiles` | displayName, heroGender, weights, height | row required; fields optional | PHP serializers | nulls | additive columns | user |
| Relational settings | MySQL `user_settings` | themeId, nutrition mode, calorie limit, companion | row required | PHP patch | cozy/DF defaults | additive | user |
| Full AppSettings | `user_data.customSettingsBackup` | `AppSettings` | optional blob | `normalizeAppSettings` | `DEFAULT_APP_SETTINGS` | v0→v1 nutrition + `dataSchemaVersion` | user |
| Daily entries | `user_data.dailyEntries` | `DailyEntry[]` | optional | drop malformed items | `[]` | none (shape normalize) | user |
| Measurements | `user_data.measurements` | `MeasurementEntry[]` | optional | drop malformed | `[]` | none | user |
| Rewards | `user_data.rewards` | `Reward[]` | optional | drop malformed | `[]` | none | user |
| Bank deposits | `user_data.bankDeposits` | `BankDeposit[]` | optional | drop malformed | `[]` | none | user |
| Cozy Home | inside AppSettings | `CozyHomeState` | optional | `normalizeCozyHomeState` | empty house | none | user |
| Body Ability state | inside AppSettings | `BodyAbilityState` | optional | `normalizeBodyAbilityState` | empty | none | user |
| Plateau | inside AppSettings | `plateauState` | optional | `normalizePlateauState` | empty | none | user |
| Onboarding | inside AppSettings | flags + draft | optional | passthrough | incomplete | none | user |
| Theme | settings + `user_settings.theme_id` | `AppThemeId` | optional | `resolveThemeId` | cozy | none | user |
| Sidebar visibility | AppSettings | per-theme map | optional | `normalizeThemeSidebarSettings` | hidden optionals | none | user |
| Avatar config | AppSettings | `avatarSettings` | optional | resolver | defaults | none | user |
| Companion | settings + column | id | optional | passthrough | golden chinchilla | none | user |
| Season progress | derived from `settings.startDate` + dailies | not a blob | — | engines | — | none | derived |
| Achievements | `user_data.achievements` + localStorage sidecar | array | optional | sidecar empty-guard | `[]` | none | user |
| Coins | `user_data.coinTransactions` + sidecar | array | optional | sidecar empty-guard | `[]` | none | user |
| Momentum history | `user_data.momentumHistory` + sidecar | object | optional | sidecar empty-guard | `{}` | none | user |
| Other blobs | freedomHistory, journeyState, bodyAbilities, artifacts, bosses, dailyMobs, legacyImport | JSON | optional | preserved as extras | omitted | none | user |
| Auth | `users`, `auth_sessions` | login + hash + token | required | — | — | — | **not in backup** |

Relational vs JSON: identity/profile/theme columns are relational. Game progress and full settings live as JSON blobs keyed by `type`. This pass does **not** explode blobs into tables.

## Schema version

`CURRENT_DATA_SCHEMA_VERSION = 1` (`src/storage/userDataConstants.ts`).

Unversioned production data is **v0**. Load: detect → migrate → normalize. Save stamps `settings.dataSchemaVersion`.

## Migration vs normalize

- **migrateUserData:** v0 → v1 (nutrition defaults + stamp). Pure, stepwise, idempotent.
- **normalizeUserDataWithReport:** missing/malformed/unknown enum → safe defaults; **unknown future keys preserved**.

Normalize is not a hidden migration dump.

## PUT contract

`PUT /api/data/:type` `{ payload, revision? }` **replaces** that type’s blob (not a deep merge). `updated_at` + `revision` increment. Body cap 2 MiB. Malformed JSON → 400. Unknown type → 400.

`PUT /api/data` `{ data: { type: payload } }` is transactional bulk replace of listed types.

`POST /api/data/restore` snapshots current blobs, then replaces listed types + optional profile/settings columns in one transaction.

## Concurrency (KI-01)

If the client sends `revision` and it does not match the row, API returns **409** `{ error, currentRevision }`. SPA shows: «Данные изменились в другой вкладке. Перезагрузите страницу.»

Clients that omit `revision` stay last-write-wins (old PWA until SW updates).

## Hydration safety

`hydrationStatus` is independent of “settings look like defaults”. Failed GET → error screen + Retry; no empty save. `assertHydrationReady` on store writes.

## Backup

Versioned file: `{ format: "personal-rpg-backup", backupFormatVersion: 1, dataSchemaVersion, exportedAt, data }`. No password, session, or user id.

Import: validate → migrate → normalize → preview → confirm → download current copy → restore transaction → re-init.

Future fields: **preserve**.

## Server snapshots

Table `user_data_backups` (last 10 / user). Reasons: `restore`. Not on every autosave. No UI list in v1 (phpMyAdmin).

## Size

Synthetic 5-year daily + weekly measurements JSON is **under 1.5 MiB** (2 MiB API cap has headroom). Normalize of that fixture is well under 2s in tests.

## Remaining data-loss risks

- Two tabs both on a pre-revision PWA still last-write-wins until SW updates.
- Cozy grant then failed daily write can persist settings without the day stamp (hardening order kept; `lastDailyGrantDate` still blocks double grant).
- Extra `user_data` types omitted from a backup are **not deleted** on restore.
- No account-delete API (future).
- Schema writeback after v0→v1 is best-effort; in-memory data is already migrated.
