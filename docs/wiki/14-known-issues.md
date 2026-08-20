# Known Issues

Living list of real remaining problems after Project Hardening v1 (2026-08-19).
Not a backlog of ideas — only issues that still exist in runtime or production.

| ID | Severity | Area | Description | Reproduction | Status |
|----|----------|------|-------------|--------------|--------|
| KI-01 | Medium | Persistence | Concurrent tabs last-write-wins on `PUT /api/data/:type`. | Two tabs save the same type. | **Closed** for current SPA — `revision` + 409. Copy: save did not apply, refresh. Old PWA that omits revision is still LWW until SW updates. See [`../audits/data-integrity-v1.md`](../audits/data-integrity-v1.md) |
| KI-02 | Low | Auth | Session token also stored in `sessionStorage` as Bearer. Cookie is HttpOnly; Bearer is the XSS residual. | XSS in SPA could read Bearer. | Open — acceptable for this app |
| KI-03 | Low | Infra | Production HTTPS currently depends on a public CA cert on the host. Self-signed certs break browser fetch. | Register in browser against untrusted TLS. | Open — hosting action |
| KI-04 | Low | Docs/UX | Root README historically lagged wiki. Hardening pass updated the top claims; user-facing screenshots still older. | Read README vs `/today`. | Partially fixed |
| KI-05 | Low | Avatar | Dark Fantasy female visual anchors are still placeholders. Cozy female is approved. | DF + female hero. | Open — art backlog |
| KI-06 | Low | UI | TodayPage / SettingsPage were large orchestrators. | Open the files. | **Closed** — page decomposition v1 (`docs/audits/page-decomposition-v1.md`) |
| KI-07 | Low | Performance | Main SPA chunk was ~958 kB gzip ~255 kB with Dashboard/Today eager. | `npm run build` | **Reduced** — lazy Dashboard/Today/Start; main ~631 kB / ~173 kB gzip. Remaining is shell + hosts + store. See [`../audits/bundle-optimization-v1.md`](../audits/bundle-optimization-v1.md) |
| KI-08 | Low | Account | No self-serve delete-account / wipe-data API. | Product decision, not implemented. | Open — future |
| KI-09 | Medium | Game design | Coins have no required sink (~900–2700 / year in sim). Amounts are stable; presentation is secondary. | `simulateUserJourney` in [`../audits/progression-economy-calibration-v1.md`](../audits/progression-economy-calibration-v1.md) | Open — future sink design pass; **do not add a shop in this loop** |
| KI-10 | Low | Game design | Dashboard / Today can present too many co-equal progressions (XP, coins, Home, season, momentum). Hierarchy is documented, not yet a UI pass. | Play Today → Save → Dashboard | **Closed** — NOW / NEXT / LONG on Dashboard (`docs/audits/progression-economy-calibration-v1.md`) |
| KI-11 | Low | Content | Eight daily obstacle IDs are art-bound; flavor rotates but the same mob art can return often. Codex/achievements are not daily-variety systems. | Play 30+ days on Today. | Open — content depth v1 expanded flavor/eligibility; more MobIds need art. See [`../audits/content-depth-v1.md`](../audits/content-depth-v1.md) |
| KI-12 | Low | Game design | After Home 24/24, cozy resources still grant and appear on save (no sink). NEXT no longer points at Home. | Complete all 8 zones, keep logging. | Open — **P4**; do not add endgame rooms this loop. See [`../audits/real-user-journey-v1.md`](../audits/real-user-journey-v1.md) |

Closed in hardening v1 + visual UX v1 + page decomposition v1 + draft safety + bundle v1 + data integrity v1: unauthenticated SQLite API, public `data/*.sqlite`, Cozy free comfort when nutrition is off, Cozy grant/settings split, season window overlap, raw body-stage avatar paths, broken `/dashboard` link, missing error boundary, stale `?v=42` asset tests, male hero manifest PNG vs on-disk WebP, Cozy Journey DF chrome, 768px cramped sidebar, avatar glued to hero floor, giant TodayPage/SettingsPage orchestrators, Settings autosave clobbering dirty draft, last-write-wins concurrent tabs for current SPA.

Closed in game design consistency v1: Journey absolute-kg campaign hard-gate for small goals; NBA ignoring `after_absence`; «День выживания» copy; 200 kg death/game-over on the legacy weight path.

Closed in progression economy calibration v1: Cozy Home 24/24 in ~2–4 weeks for balanced/active (costs retuned, first L1s still cheap); Dashboard co-equal progress signals (NOW / NEXT / LONG). Coins remain a sink-less receipt (KI-09).

Closed in content depth v1: single-line Today reactions, tracking-blind food/sofa obstacles, one return line, thin Home status. Remaining: eight art-bound MobIds (KI-11).

Closed in real user journey v1: NBA asking for disabled nutrition/alcohol; Home 24/24 NEXT dead-end; 409 copy that did not say the save failed; onboarding mixing Cozy+DF before theme choice; mobile Today save under the bottom nav. Remaining: coins with no sink (KI-09), post-Home resource accent (KI-12), Skill Map / Reports merge candidates.
