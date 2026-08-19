# Bundle Optimization v1

**Date:** 2026-08-19  
**KI-07:** initial main JS after Today/Settings decomposition was ~958 kB / ~255 kB gzip.

## Baseline (before this pass)

From the post-decomposition production build:

| Metric | Before |
|--------|--------|
| Main `index-*.js` raw | 957.61 kB |
| Main gzip | 255.19 kB |
| Main CSS | 341.31 kB / 40.22 kB gzip |
| LineChart (recharts) | 393.30 kB — already lazy |
| GrowthHub | 115.72 kB — already lazy |
| Settings | 42.76 kB — already lazy |

## Biggest contributors (eager graph)

Dashboard + Today were imported from `App.tsx`, so the initial chunk included:

- Dashboard campaign/hero graph (`useGameHeroState` → `avatarStageEngine` → **personal Body Ability bank**)
- Today page UI + `todayPageModel`
- Onboarding (`StartRoutePage`)
- App shell, hosts, store, date-fns named imports, lucide named nav icons

Already fine:

- Named lucide / date-fns imports (no `import *`)
- Recharts only from Measurements/Momentum charts (lazy routes)
- `/dev/avatar-pipeline` is `import.meta.env.DEV` lazy
- Fixtures only in `*.test.ts`
- Game art via URL paths under `public/game-assets/`
- Journey v2 CSS not in the bundle (`journey-map-v3.css` was global)

## Changes

1. **Route split:** `DashboardPage`, `TodayPage`, `StartRoutePage` are `lazy()`. Other heavy pages were already lazy.
2. **Prefetch:** after auth, prefetch Dashboard + Today in parallel with `init()` so the post-login loader hides the chunk fetch.
3. **CSS:** `journey-map-v3.css` imported from `JourneyMapPage` only (separate CSS chunk).
4. **Fallback:** existing `PageLoader` (“Загрузка раздела...”) for Suspense.
5. **Guard:** `npm run check:bundle` fails if main `index-*.js` exceeds 850 kB raw. Wired into `npm run verify` after `vite build`.

Not done (would hurt architecture):

- Splitting the personal ability bank out of `avatarStageEngine` — Dashboard hero state needs it.
- Rewriting the service worker — Vite PWA `autoUpdate` + hashed chunks already replace stale precache.

## After

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Main raw | 957.61 kB | 631.01 kB | **−326.6 kB (−34%)** |
| Main gzip | 255.19 kB | 172.52 kB | **−82.7 kB (−32%)** |
| Main CSS raw | 341.31 kB | 323.06 kB | −18.3 kB |
| Journey CSS | (in main CSS) | 16.61 kB lazy | split |
| Dashboard chunk | (in main) | 60.28 kB | split |
| Today chunk | (in main) | 60.14 kB | split |
| Start/onboarding | (in main) | 26.98 kB | split |
| Personal ability engine | (in main) | 47.19 kB async shared | split |

Vite still warns on chunks >500 kB because of main (631) and LineChart (393). LineChart is route-lazy; main is shell + hosts + store.

## PWA

`registerType: 'autoUpdate'`. New hashed JS/CSS are precached. Navigate fallback remains `index.html` except `/api`. Missing-chunk-after-deploy is handled by the next SW activation, not a custom reload loop.

Lazy fallback is the existing `PageLoader`. Chunk/render failure uses `AppErrorBoundary` (reload / home). No extra prefetch system beyond Dashboard + Today after auth.

Playwright: `e2e/lazy-route-smoke.spec.ts` opens `/reports` after a delayed `WeeklyReportsPage` module fetch and waits for `reports-page` (no blank error screen). Full CDP network throttle was too aggressive (HTML never loaded); route delay is enough.
