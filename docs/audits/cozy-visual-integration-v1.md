# Cozy Visual Integration & Art Direction Pass v1

Date: 2026-08-20

Related: [`cozy-asset-production-v1.md`](cozy-asset-production-v1.md)

**Gameplay / economy / avatars / generation:** unchanged. `IMAGES GENERATED = 0`. `GAME_ASSET_VERSION` remains 67.

Screenshots: `artifacts/visual-qa/cozy-integration-v1/` (gitignored). `after/` captured by Playwright after composition (390/768/1440/1920 Cozy + DF 390/1440 Dashboard/Today/Journey). BEFORE was a live layout/code audit of the production-pack UI before this pass; a separate `before/` folder was not frozen on disk because composition landed in the same session.

---

## BEFORE (layout audit)

Assets existed in `themes/cozy/` but the UI still treated them as dashboard chrome.

| Screen | What the user actually saw | Severity |
|--------|----------------------------|----------|
| Dashboard | Interior backdrop + avatar (good). Threats as 3:4 **portrait** cards using `object-contain` — environmental plates looked like postage stamps and competed with the hero. Companion was a 56–64px chip (and off by default). Home banner was a second bordered card in LONG. | high |
| Today | Daily obstacle as 112×112 `object-contain` stamp inside a Card. One image (good), but it did not answer “what kind of day is this?” as a scene. | med |
| Home | Text header card first, then a capped 15–18rem scene, then an 8-card thumbnail grid (`h-28` + inner border + nested “next” box). House was not first. | high |
| Journey | v3 road with ~42% vignette (`left: 58%`). Cozy inherited DF darkening (`brightness(0.78)`). Current/past/future existed but art did not dominate the current chapter. | high |
| Seasons | Current vignette in header **and** again as a product thumb on the current card; all eight seasons as equal cards. | med |
| Codex | Collection showcase (acceptable). Obstacle/companion art as contain stamps. | low |
| Week / Freedom / Analytics / Reports / Settings | Little or no Cozy raster. Functional screens; not empty voids that require P6 art. | low |
| Measurements empty | Shared manifest empty plate + copy. Not Cozy-specific; not a composition break. | low |

Repeated issues: nested cards, equal rounded rectangles, art locked inside inner frames, DF contain-fit on Cozy environments, same art twice on Seasons.

No high-impact **missing** asset that broke a layout. Home L2 correctly falls back to L1. Empty-state rasters not required.

---

## Art hierarchy (after)

| Level | Role | After this pass |
|-------|------|-----------------|
| **A — Scene** | Space of the screen | Dashboard hero environment; Home hero (house first); current Journey vignette; current Season chronicle band |
| **B — Event / progress** | Mid block | Home zone plates (bleed); main obstacle banner (larger than daily); daily obstacle as a wide day-strip on Today; past Journey / season memories |
| **C — Character / detail** | Presence | Avatar (unchanged files); Cozy companion as circular scene presence; DF companion chip unchanged |

---

## AFTER (composition)

### Dashboard

- Threats: Cozy uses **banner** layout + cover scene; main obstacle taller than daily. DF stays portrait sprites.
- Hero column wider on Cozy. Companion: circular presence in the scene (when pets are visible). NOW remains the action column.
- NEXT / LONG: Cozy drops extra card chrome; functional max-width so 1920 does not stretch copy.
- Home LONG banner: botanical+inner card removed; exterior plate remains one Level A below the fold.

### Home

- Opens on the house (scene + overlay title/progress). Resources and zone controls follow.
- Zone art bleeds to the card edge (~9–11rem), no inner image border. Nested “next” box flattened to type.

### Journey

- Cozy current vignette takes more of the row (`left: 36%` desktop). Past/future recede. DF darkening removed on Cozy art. Mobile: current band taller than past/future. Still v3, not canvas v2.

### Today

- One wide cover strip for the daily obstacle. No art on quests. Recovery/minimal copy unchanged.

### Seasons

- Current season = Level A chronicle band. Current card no longer repeats the thumb. Past/upcoming = divider memory list with small desaturated markers.

### Companions

- Cat / raven / fox: readable at scene size.
- Alabai: usable draft. At ~72–88px the breed drift toward retriever is **not** a product-blocker. No generation. Issue only if a future UI shows a large portrait.

### Obstacles

- Main = wider banner on Dashboard. Daily = smaller banner there, one scene strip on Today. No monster frames in Cozy.

### Card fatigue removed

- Home header card (merged into scene overlay)
- Zone inner art border + nested next panel
- Dashboard Cozy botanical wrapper around Home LONG
- Cozy NEXT/LONG box shadows
- Season current botanical frame + duplicate current thumb
- Past seasons as product grid → memory list
- Today Cozy Card+stamp → one scene strip
- Dashboard Cozy threat portraits (second-hero chrome)

Accessibility grouping and testids kept (`dashboard-now`, zone cards, `daily-mob-card`, `companion-status-chip`).

### Empty states

P6 raster **not** generated. Home empty resources work with type. Measurements already has a shared empty plate. Week/Freedom/Analytics/Reports do not need filler art.

### Responsive

| Viewport | Intent |
|----------|--------|
| 390 | Home scene capped ~11.5rem; Journey one vertical story; Today one strip; hero before threats |
| 768 | Mobile chrome; not a squashed 1440 grid |
| 1440 | Primary desktop: hero scene + secondary banners |
| 1920 | Art can widen; NEXT/LONG copy max-width; AppShell dashboard `max-w-7xl` |

### Performance

- Runtime WebP only; `GameAssetImage` lazy by default
- Eager: Dashboard backdrop, Home hero, current Season band
- No JS image imports, no base64, no Journey/Home/Season pack on Dashboard
- Aspect/min-height reserved on scenes
- Dashboard loads backdrop + avatar + (optional) companion + two threat plates — not the full Home/Journey/Season sets

### Dark Fantasy

Shared `GameSceneBannerCard` / `DailyMobCard` fork by theme. DF keep contain sprites, portrait threats, top-right companion chip. No Cozy cover leakage intended. Regression shots: DF 390 + 1440 Dashboard / Today / Journey.

### Generation exception

Not used. No single missing asset broke composition.

---

## Remaining visual gaps (real, not wishlist)

1. Home L2 still falls back to L1 (known; do not generate in this pass).
2. Alabai usable draft — revisit only at large portrait size.
3. Companions default **off** in sidebar visibility; scene presence is opt-in.
4. Shared measurements empty plate is not Cozy-specific (optional later, not P6-blocking).
5. Week / Freedom / Analytics remain functional, not scenic — acceptable.
