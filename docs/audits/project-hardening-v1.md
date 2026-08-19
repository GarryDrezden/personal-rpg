# Project Hardening v1

**Date:** 2026-08-19  
**Scope:** full-repo audit of Personal RPG (React + PHP + MySQL).  
**Goal:** make the existing product more stable, testable, and production-safe without adding new game systems.

Status of this document: findings + work log. Items marked **Fixed** were addressed in this pass.

---

## Critical

| ID | Finding | Status |
|----|---------|--------|
| C1 | Unauthenticated legacy SQLite API in `api/index.php` (`/daily`, `/backup`, full dump). Production `/api/*` hits this after accounts routes miss. | **Fixed** — gated off when MySQL config exists |
| C2 | `data/personal-rpg.sqlite` can be web-served (`!-f` in `.htaccess`) after the legacy API creates it. | **Fixed** — deny `data/` + htaccess |
| C3 | Cozy Home grants comfort whenever nutrition tracking is **disabled** (`isNutritionLogged` returns true by design for Freedom). | **Fixed** — rewards use quest-completed, not “logged” |
| C4 | Cozy grant is two writes (`upsertDaily` then `saveSettings`). Settings failure stamps the day with no resources. | **Fixed** — settings first + `lastDailyGrantDate` guard |

---

## High

| ID | Finding | Status |
|----|---------|--------|
| H1 | No login/register rate limit. | **Fixed** — file throttle in `api/sessions/throttle` |
| H2 | Malformed JSON accepted as `[]`. | **Fixed** — 400 Invalid JSON |
| H3 | No request body size cap. | **Fixed** — 2 MiB |
| H4 | `health.php` leaks MySQL exception text. | **Fixed** |
| H5 | `secure_cookie: true` did not force `Secure`. | **Fixed** |
| H6 | Sidecar save failures silent in production. | **Fixed** — SaveStatusStore |
| H7 | Season windows overlap after late Season 1 completion (`extendOpenEnd` on completed + next). | **Fixed** — freeze completed end; next starts after |
| H8 | Legacy avatar path builders used raw Body Stage / old anchors `[1,2,19,20]` and cozy `heroes/.../light`. | **Fixed** — visual anchors + resolver |
| H9 | Freedom card linked Dark Fantasy to `/dashboard` (no such route). | **Fixed** → `/` |
| H10 | No React error boundary (white screen on engine throw). | **Fixed** |
| H11 | Home upgrade closed over stale settings. | **Fixed** — `getState()` |

---

## Medium

| ID | Finding | Status |
|----|---------|--------|
| M1 | `themeId` not passed through `resolveThemeId` in `normalizeAppSettings`. | **Fixed** |
| M2 | `calorie_limit_days` in personal auto-unlock identical to tracking days. | **Fixed** |
| M3 | `countRecentDays` used UTC `toISOString` (off-by-one near midnight). | **Fixed** |
| M4 | Invalid `lastUpgrade` passed through cozy normalize. | **Fixed** |
| M5 | Today `saveDay` had no catch (unhandled rejection). | **Fixed** |
| M6 | README still describes local SQLite, 7 avatar stages, Node-like local app. | **Fixed** (truth pass) |
| M7 | Journey Map v2 components + CSS unused. | **Fixed** — removed proven-dead cluster |
| M8 | Last-write-wins on concurrent `PUT /api/data/:type`. | **Known** — documented, no versioning layer this pass |
| M9 | Bearer token in `sessionStorage` (XSS residual). | **Known** — cookie remains HttpOnly primary |

---

## Low

| ID | Finding | Status |
|----|---------|--------|
| L1 | `needsBodyAbilityMapUpgrade` true for never-configured users (soft CTA). | **Intentional** — not a forced onboarding redirect |
| L2 | `getSeasonDayNumber` without index uses calendar, not active arc. | **Left** — callers that omit index want calendar math |
| L3 | Password policy min 6 chars. | **Left** — personal app, not enterprise IdP |
| L4 | Scattered `themeId === 'cozy'` branches outside registries. | **Deferred** — no behavior change; registries remain source of truth for art/copy |
| L5 | TodayPage / SettingsPage still large. | **Deferred** — split only if a bug required it |

---

## Cleanup

- Journey v2: Desktop/Mobile/Background/PathSvg/pins/dock/connector/label/marker + `journey-map-v2.css`
- Avatar candidate list: old `[1,2,19,20]` nearest-stage lie
- Cozy placeholder dual names (`male-placeholder.svg` vs `male.svg`) aligned to manifest
- `npm run verify` quality gate (typecheck + tests + validate:avatars + vite build)
- Master + theme-switch + legacy E2E specs (`e2e/master-core.spec.ts`, `e2e/theme-switch.spec.ts`)
- Male hero registry paths aligned to on-disk `.webp`; validator accepts `.webp` sibling if a listed `.png` is missing

---

## Future

- HTTPS Let’s Encrypt on hosting (infra, not code)
- Optimistic concurrency / `updatedAt` If-Match for `user_data`
- Chapter/act boss dedicated art (P2)
- Weekly season quests (deferred by roadmap)
- Deeper Freedom Score × Body Abilities v2
- Formal AAA a11y
- Split AppSettings UI prefs vs meta-progression stores

---

## Design decisions (disputed spots)

### Cozy nutrition when tracking is off

**Was:** `isNutritionLogged` is true when nutrition is disabled so Freedom/Momentum do not punish. Cozy used that helper and granted “Питание отмечено” every qualifying save.

**Choice:** keep Freedom semantics; Cozy rewards require an actual nutrition quest completion (`getNutritionQuestCompleted`). Disabled tracking does not mint comfort.

### Season freeze after late completion

**Was:** incomplete Season 1 correctly stays active. After it finally completes on day 100, Season 2 still used calendar days 29–100 as well → double-counting.

**Choice:** on-time completion still freezes at the 28-day calendar end (Season 2 starts on day 29). Late completion freezes at the completion date; Season 2 starts the next day. No overlapping entry windows.

### Legacy SQLite API

**Was:** always reachable. Needed for OSPanel SQLite-only local without `config.php`.

**Choice:** enabled only when MySQL `config.php` is absent, or `app.legacy_sqlite_api = true`. Production with MySQL config → 404.

---

## Quality gates (2026-08-19)

| Command | Result |
|---------|--------|
| `npm run typecheck` | pass |
| `npm test` | 48 files, **375** tests pass |
| `npm run validate:avatars` | OK — Cozy M/F 5/5 approved; DF male 5/5 approved; DF female 5/5 placeholders |
| `vite build` | pass (PWA precache 43 entries) |
| `npm run verify` | **pass** |

Playwright master/theme-switch specs exist under `e2e/` and are **not** part of `verify` (no credentials/browser install required for the local gate).

---
