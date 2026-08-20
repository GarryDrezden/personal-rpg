# Content Depth / Anti-Repetition v1

Date: 2026-08-20  
Scope: presentation copy only. No new currencies, loops, XP, Home costs, Journey IDs, Season logic, or companion XP.

Principles: [`../design/content-principles.md`](../design/content-principles.md).

## Executive summary

High-frequency copy (Today reactions, daily obstacle flavor, companion micro-lines, return-after-absence, Home status) now uses **contextual pools + date-stable selection** (`src/content/selectVariant.ts`). Same saved day keeps the same line. Consecutive duplicates are avoided when the pool has more than one item. Tracking flags hide nutrition/alcohol/PA-specific content. Cozy and Dark Fantasy stay isolated. Gameplay and economy are unchanged.

## Selection architecture

```
known context → eligible candidates (theme + tags) → hash(date|family|theme|extra)
             → reconstruct last 3 calendar days’ picks → skip those IDs → fallback if pool tiny
```

No persisted content-history system. Chronicle still stores recap **strings** at archive time; a later theme switch does not rewrite past stored recaps. Current-season recap is derived.

Helper: `selectForDate` / `selectContentVariant`.

## Content inventory

| Family | Theme | Variants (after) | Used in | Cadence | Selection | Repetition risk | Context inputs | Fallback |
|--------|-------|------------------|---------|---------|-----------|-----------------|----------------|----------|
| Today reactions | both | ~5–6 per context × 18 contexts | Today save / preview | High | `pickTodayReaction` | Was ~1 line/context; now weeks | mode, PA, steps, resource, nutrition, alcohol, gap, loggedDays | `default` |
| Daily obstacles | both | 8 IDs × 4 flavor | Today / Dashboard mob | High | semantic + eligible hash + flavor | IDs art-bound; flavor rotates | tracking, sleep, energy, activity | `empty_day` |
| Bosses | both | 8 × victory/setback | Journey panel | Low | by boss ID | Fine | chapter status | existing weakness text |
| Journey flavor | both | 9 chapters × 5 states | Journey detail | Low | state + date | Was 1 card for months | status, % | chapter description |
| Season copy | both | 6 phases × 3–4 | Recap / chronicle | Medium | phase + date | 13 seasons/year | dayNumber, status, past | STATUS_RECAP |
| Home status | cozy | 6 bands × 4–5 | `/home` | Medium | band + optional last zone | Was 4 bands / 1 line | percent, lastUpgrade | empty band |
| Home long project | cozy | 4 | Zone card / NEXT | Medium | date + zone | Label unchanged | cost ≥ 40 | «долгий проект» |
| Companion micro | both | 4 companions × 8 ctx × 2–3 | Dashboard chip | High | date + companion + ctx | Was static title | day, gap, home upgrade | `presence` |
| Body Ability flavor | both | category fallbacks + 5 title overrides | Ability board | Medium | by ability ID | Less «легче» / one generic line | theme, category | category line |
| Achievements | — | unchanged bank | Growth | Low | existing | Coverage already good | — | — |
| NBA | both | 7 families × 2–3 | Dashboard CTA | High | priority unchanged; phrasing hashed | Template-y | recovery, return, empty | original fallback |
| Dashboard NEXT | both | extra phrasing on season/home | NEXT card | High | same resolver | Titles stay concrete | kind, date | previous sentences |
| Return after absence | both | 4 bands × 4 | NBA + Recovery card | High-value | daysAway band | Was 1 line | gap 3–6 / 7–13 / 14–29 / 30+ | RECOVERY_STATE_MESSAGES |
| Empty states | both | 6 keys, 1–3 desc | Home / path setup | Occasional | optional date | Titles stable for tests | screen key | canonical title+desc |
| Codex | — | unchanged | `/codex` | Low | n/a | Reference, not daily | — | — |
| First day / veteran | both | `first_day`, `veteran` contexts | Today | High at edges | loggedDays | Avoids «первые шаги» at 100d | loggedDays, gap | default |

### Before → after (headline counts)

| Family | Before | After | Cadence | Repeat horizon (active daily user) |
|--------|--------|-------|---------|-------------------------------------|
| Today reactions | ~13 cozy singles + inline DF | ~170 paired lines across 18 contexts | daily | 1 week: low if context changes; same context ~5–6 days before a loop, not consecutive |
| Daily obstacle flavor | 1 line / mob / theme | 4 / mob / theme | daily | IDs still 8 (art). Flavor ~4 days. Semantic match reduces sofa-on-active-day |
| Bosses | 1 blurb | + victory + setback | chapter | months |
| Journey | title + desc + completed | + intro/current/near/complete/memory | months | OK |
| Seasons | 5 recap strings, DF-leaning | 6 phases × theme + history mixed/incomplete | 28d | year: phases repeat, wording varies |
| Home status | 4 bands | 6 bands × several + zone-recent | months | OK |
| Companion | static name | micro-reactions | daily | weeks (short pool per ctx; anti-repeat) |
| Return | 1 NBA + 1 recovery | 4 bands × 4 | rare | OK |
| NBA / NEXT | 1 string / id | families + date pick | daily | templates stay concrete |
| Empty states | 6 canonical | + alt descriptions | occasional | titles unchanged without date |
| Body abilities | 1 generic flavor | category flavors + title overrides | medium | remaining: bank titles still share «легче» in DF fallback if no override |
| Codex / achievements | existing | unchanged | low | still shallow as daily content (by design) |

## Anti-repeat

- No new persisted state.
- Lookback: previous 3 ISO dates, same family/theme/extra, reconstruct pick, exclude IDs.
- Tiny pool: fall back to today’s hash index (consecutive still possible if pool size 1).

## Context signals used (only data the app knows)

theme, day mode, day quality via points/quests, physical activity, steps, nutrition logged/mode, sleep/resource, alcohol tracking + `none`, recovery mode, days away, logged day count, Momentum is **not** required for Today pick, Hero State unused here, season phase, Journey status/%, Home percent + last zone, suggested ability (NEXT only), companion id. Weather unused.

## Tracking respect

- Nutrition `disabled` → no food mobs (`snack_chaos`, `sweet_whisper`, `night_call`) and no nutrition-held Today context.
- Alcohol off → no `night_call`, no `alcohol_free` reaction.
- PA off → no physical/heavy_physical reactions; sofa still possible if the day is inactive.
- Sofa blocked when sleep is good / energy high **and** the day is active (steps or marked PA).

## Mob vs boss

Daily obstacle = small friction of the day. Boss = durable chapter pattern. Flavor scale kept apart; IDs not expanded (art-bound).

## Chronicle

Past recap strings are not migrated. Newly computed history recaps use theme-aware incomplete/mixed lines. Theme switch does not rewrite stored presentation.

## Content simulation (selections, not gameplay)

365 days × 5 `SIM_PROFILE_IDS` (`contentSimulation.test.ts`): unique Today IDs > 8 per profile; consecutive reaction/obstacle/companion ID repeats = 0 in the fixture (context/family rotation + lookback).

30-day minimal Today: consecutive duplicate rate 0. 90-day sofa flavor: consecutive rate 0.

## Bundle

High-frequency Today/obstacle/companion live in feature chunks (Today / Dashboard lazy). DEV `/dev/content-lab` is `import.meta.env.DEV` only. Do not import `todayReactions` from the shell. Gate: `npm run check:bundle`.

After this pass (production build): main `index-*.js` **~648 kB / ~178 kB gzip** (limit 850 kB). Before the pass ~638 kB. Content registries did not pull Today pools into the shell.

## Tests

- `src/content/selectVariant.test.ts`
- `src/content/contentCoverage.test.ts`
- `src/content/contentThemeIsolation.test.ts`
- `src/content/contentAntiRepeat.test.ts`
- `src/content/contentTrackingRespect.test.ts`
- `src/content/contentSimulation.test.ts`

`npm run verify`: typecheck + **470** tests + avatars + production build + bundle gate.

## Playwright

`e2e/visual-master-smoke.spec.ts` and `e2e/dashboard-hierarchy.spec.ts`: **9 passed**. Cozy/DF × 390/1440 on Today, Dashboard, Home, Journey, Seasons. No new screenshot baselines.

## Families still shallow

- **8 daily MobIds** — art-bound; flavor only.
- **Achievements bank** — not expanded; flavor already event-like.
- **Codex** — reference; not daily variety.
- **DF companion lines** — short; personality is there, pool per context is 2–3.
- **Body Ability bank titles** — a few still say «легче» in the shared definition; presentation overrides cover the worst repeats.
- **NBA calories/alcohol/steps** — still mostly one template (priority pass must not change).

## Non-goals (kept)

No new game systems. No economy/XP/Home cost/Journey threshold/Season logic/ability unlock changes. No companion leveling. No LLM. No images. No CMS.
