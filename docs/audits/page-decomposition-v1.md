# Page Decomposition v1 — Today + Settings

**Date:** 2026-08-19  
**Constraint:** no user-facing behavior change, no new game systems, no visual redesign.

## Baseline

### TodayPage.tsx

| Metric | Before |
|--------|--------|
| Lines | 883 |
| Import lines | 77 |
| `useState` | 9 |
| `useEffect` | 2 |
| `useMemo` | 14 |
| `useCallback` | 2 |
| Store subscription | `useAppStore()` whole slice (`dailyEntries`, `measurements`, `settings`, `updateDaily`, `deleteDaily`, `saveSettings`) |

**Responsibilities (before):**

1. URL week/date selection + dirty navigation confirms
2. Draft `DailyEntry` synced from store
3. Quest/momentum/season/boss/plateau/body-ability derived state
4. Cozy reward preview + save reaction
5. Mode presets, recovery/nutrition/momentum suggestions, plateau actions
6. Save / reset / mode-persist (duplicated four times)
7. Full page JSX (header, week, body/path/trace, summary, mobile CTA)

**Effects (before):**

| Effect | Why | Keep? |
|--------|-----|-------|
| Sync `entry` from `dailyEntries` + `selectedDate` | Draft must follow store/day | Yes — draft vs persisted |
| Clear `saveReaction` on `selectedDate` | Must not clear on post-save store update | Yes — cannot derive |

### SettingsPage.tsx

| Metric | Before |
|--------|--------|
| Lines | 638 |
| Import lines | 40 |
| `useState` | 2 (`local`, `saving`) |
| `useEffect` | 1 (sync `local` ← `settings`) |
| `useCallback` | 1 (theme autosave) |
| Store subscription | `settings`, `measurements`, `saveSettings` |

**Responsibilities (before):**

1. Header + TOC + 14 inline cards
2. Dual persistence: autosave (theme, sleep, sidebar, body map) vs local draft + Save
3. Avatar preview math
4. Weekly goals CRUD, XP/coins resets
5. Theme change (already a whole-card control)

**Effects (before):**

| Effect | Why | Keep? |
|--------|-----|-------|
| `setLocal(settings)` on settings change | Draft follows remote/autosave | Yes — existing overwrite semantics |

## Problems found

- Today mixed orchestration, engines, and ~350 lines of JSX.
- Four near-identical persist+reaction flows for mode changes.
- Settings mixed autosave islands with a large local draft in one file.
- TOC ids were duplicated literals vs `SettingsToc`.
- KI-06: both pages too large for safe ongoing change.

## Refactor plan

1. Pure `buildTodayDerivedState` + small mode/save helpers (no engine copies).
2. `useTodayPageModel` for draft/actions; page as orchestrator; presentational sections.
3. `useSettingsDraft` for Save-button fields; autosave sections self-contained.
4. Shared Settings TOC ids + thin `SettingsSection` wrapper (Card + id only).
5. Tests for helpers + Playwright smoke; freeze UI/copy/save order.

## Changes

### Today

- `src/utils/todayPageModel.ts` — `withSelectedDayMode`, `didCozyGrantOnSave`, labels, `buildTodayDerivedState`.
- `src/hooks/useTodayPageModel.ts` — draft, URL selection, save/reset, unified `persistDayMode`.
- Sections: `TodayHeader` (+ mobile save bar), `TodayWeekCard`, `TodayContextStack`, `TodayBodyCareSection`, `TodayTrackingSection`, `TodayDayTraceSection`, `TodayDaySummary`.
- Existing `TodayDayModePresets` / `TodayMinimalQuickCard` kept.

### Settings

- `src/hooks/useSettingsDraft.ts` — local snapshot + Save (still overwrites `enableSleepTracking` from persisted settings).
- Autosave islands stay self-contained: theme, sidebar, PWA, body map, experimental sleep.
- Draft sections: character, game hero, avatar, nutrition, defaults, weeks, coins, XP, habits, backup.
- `SETTINGS_SECTION_IDS` / `SETTINGS_TOC_SECTIONS` — single source of TOC anchors. Experimental sleep remains off-TOC.

## Behavior preserved

- Today save: `updateDaily` still runs Cozy grant → settings persist → upsert (store). Page still applies reaction with `didCozyGrantOnSave`.
- Mode suggestion cards still persist immediately; presets still only patch the draft.
- Save failure still leaves `dirty` true (no new error banner).
- Settings Save still does not write sleep tracking from the local draft.
- Theme cards remain whole-card controls. Sidebar visibility still per-theme. Body map still `/freedom?setup=1`.
- Copy, section order, and visual classes kept.

## Tests

- `src/utils/todayPageModel.test.ts` — mode energy, Cozy first-grant flag, labels, derived flags for minimal/recovery, nutrition quest filtered from main list.
- `src/components/settings/settingsTocSections.test.ts` — unique TOC ids, experimental excluded.
- Existing Cozy grant / Today reaction / settings normalize tests unchanged.
- `e2e/today-settings-architecture.spec.ts` — Cozy/DF × 390/1440: Today sections + Settings anchors + overflow.

## Metrics after

| File | Before lines | After lines | Imports after |
|------|--------------|-------------|----------------|
| `TodayPage.tsx` | 883 | 42 | 10 |
| `SettingsPage.tsx` | 638 | 51 | 13 |
| `useTodayPageModel.ts` | — | 333 | — |
| `useSettingsDraft.ts` | — | 168 | — |
| `todayPageModel.ts` | — | ~270 | — |

TodayPage: `useState`/`useEffect` moved into the hook (still 9 / 2). SettingsPage: 0 local state; draft hook keeps 2 / 1.

**New files:** 2 hooks, 1 pure Today model, ~12 section modules, 2 unit test files, 1 Playwright spec.

**Effects removed:** none (both remaining effects are required draft/feedback sync).

## Remaining issues

- Settings draft is still overwritten when any autosave (sleep/theme/sidebar) updates `settings` — pre-existing.
- Today/Settings still in the main JS chunk (KI-07). Main bundle ~958 kB / ~255 kB gzip after this pass (was ~955 / 254). Not a new architecture problem.
- KI-05 DF female placeholders unchanged.
