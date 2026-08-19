# Visual / UX Pass v1

**Date:** 2026-08-19  
**Scope:** responsive + theme isolation + layout polish. No new game systems, no generated art.

Checked: Dashboard, Today, Week, Journey, Home, Freedom, Codex, Measurements, Analytics, Reports, Settings, Onboarding (code), Seasons, optional routes (Momentum, Skill Map, Growth, FAQ).  
Viewports in automated smoke: 390, 430, 768, 1024, 1366-class (1440), 1920. Themes: Cozy + Dark Fantasy.

Status: findings + work log. **Fixed** = addressed in this pass.

---

## Critical

| ID | Screen | Viewport | Theme | Problem | Fix | Status |
|----|--------|----------|-------|---------|-----|--------|
| VUX-001 | Journey | ≥768 | Cozy | Chapter road used Dark Fantasy navy/slate chrome (`#070b16`, `#f8fafc`) — theme leakage. | Cozy overrides: paper surfaces, ink text, wood borders. | **Fixed** |
| VUX-002 | App shell | 768 | Both | Sidebar at `md` (768) was 356px; content ~412px + no bottom nav. Cramped tablet. | Sidebar + desktop nav from `lg` (1024). Width 304px. | **Fixed** |

## High

| ID | Screen | Viewport | Theme | Problem | Fix | Status |
|----|--------|----------|-------|---------|-----|--------|
| VUX-003 | Dashboard hero | all | Both | Avatar glued to scene floor (`pb-[5%]`), `overflow-visible` could spill. Companion sat on feet in legacy panel. | Lift avatar (`pb-[14–16%]`), clip to scene, companion top-right. | **Fixed** |
| VUX-004 | Dashboard | 390 | Both | Command bridge stacked threats (boss/mob) **above** the hero. | CSS `order`: hero → threats → day on mobile. | **Fixed** |
| VUX-005 | Journey | ≥768 | Both | `.journey-page { width: 75% }` created giant empty side gutters. | Full width of the content column. | **Fixed** |

## Medium

| ID | Screen | Viewport | Theme | Problem | Fix | Status |
|----|--------|----------|-------|---------|-----|--------|
| VUX-006 | Home | 390+ | Cozy | Three botanical frames (header + hero + empty) + page-corner leaves. | One hero botanical surface; header/empty plain; hide page leaves on mobile. | **Fixed** |
| VUX-007 | Home | all | Cozy | Status line used `cozy-hand-accent` (functional copy). | Regular status typography. | **Fixed** |
| VUX-008 | Dark Fantasy | all | DF | `--app-glow` was purple; `hero-glow` 40px neon halo. | Gold glow, softer radius. | **Fixed** |
| VUX-009 | Mobile nav | 390 | Both | Drawer did not lock body scroll; no `aria-expanded`. | Scroll lock + dialog semantics. | **Fixed** |
| VUX-010 | Freedom | all | Both | `space-y-8` wall of cards. | Tighter `space-y-5`. | **Fixed** |
| VUX-011 | Today | all | Both | Save reaction card padding felt large after save. | Slightly tighter padding. | **Fixed** |

## Low

| ID | Screen | Viewport | Theme | Problem | Fix | Status |
|----|--------|----------|-------|---------|-----|--------|
| VUX-012 | Global | all | Both | Inconsistent focus rings. | `:focus-visible` outline via tokens. | **Fixed** |
| VUX-013 | Avatar assets | all | Both | Large transparent margins in 1536×2048 canvases. | Layout compensation only (documented). Files unchanged. | **Documented** |
| VUX-014 | DF female | Dashboard | DF | Placeholder anchors (art backlog). | None this pass. | Open — KI-05 |
| VUX-015 | Today/Settings | all | Both | Large page orchestrators. | Not split. | Open — KI-06 |
| VUX-016 | Settings | 1280 | Both | Theme card looked clickable; only inner «Выбрать» fired. | Whole card is the control. | **Fixed** |
| VUX-017 | Onboarding | all | Cozy | Selected theme card used hardcoded violet glow. | Token `--app-shadow`. | **Fixed** |

## Design decisions

### Tablet breakpoint `md` → `lg`

**Was:** desktop sidebar from 768px.  
**Why suspicious:** 356px sidebar left ~412px for Dashboard command-bridge.  
**Choice:** treat 768–1023 as phone-like (bottom nav). Desktop chrome from 1024.

### Cozy Journey restyle

**Was:** v3 CSS written as Dark Fantasy.  
**Choice:** keep DF look as default; Cozy override block uses paper/wood tokens. Rail gold current-node stays (shared progress language).

### Avatar lift vs generating crops

Assets keep transparent padding. We do **not** edit approved files. Padding + overflow clip is the compensation.

---

## Automated QA added

- `e2e/visual-helpers.ts` — overflow, theme session, `gotoAppRoute` (retry on `ERR_ABORTED`), optional screenshots
- `e2e/visual-master-smoke.spec.ts` — Cozy/DF × 390/1440 × core + optional routes
- `e2e/responsive-smoke.spec.ts` — overflow at 390/430/768/1024/1440/1920
- Screenshots: `artifacts/visual-qa/` when `VISUAL_QA=1` (gitignored)

---

## Remaining

See `docs/wiki/14-known-issues.md` (KI-05, KI-06, KI-07). Visual leftovers: DF female placeholders; main JS chunk size; no pixel-perfect snapshot baselines (intentionally, too brittle).
