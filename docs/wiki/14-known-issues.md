# Known Issues

Living list of real remaining problems after Project Hardening v1 (2026-08-19).
Not a backlog of ideas — only issues that still exist in runtime or production.

| ID | Severity | Area | Description | Reproduction | Status |
|----|----------|------|-------------|--------------|--------|
| KI-01 | Medium | Persistence | Concurrent tabs last-write-wins on `PUT /api/data/:type`. No `If-Match` / version. | Open two tabs, save Today in both quickly. | Open — deferred (no versioning layer this pass) |
| KI-02 | Low | Auth | Session token also stored in `sessionStorage` as Bearer. Cookie is HttpOnly; Bearer is the XSS residual. | XSS in SPA could read Bearer. | Open — acceptable for this app |
| KI-03 | Low | Infra | Production HTTPS currently depends on a public CA cert on the host. Self-signed certs break browser fetch. | Register in browser against untrusted TLS. | Open — hosting action |
| KI-04 | Low | Docs/UX | Root README historically lagged wiki. Hardening pass updated the top claims; user-facing screenshots still older. | Read README vs `/today`. | Partially fixed |
| KI-05 | Low | Avatar | Dark Fantasy female visual anchors are still placeholders. Cozy female is approved. | DF + female hero. | Open — art backlog |
| KI-06 | Low | UI | TodayPage / SettingsPage were large orchestrators. | Open the files. | **Closed** — page decomposition v1 (`docs/audits/page-decomposition-v1.md`) |
| KI-07 | Low | Performance | Main SPA chunk was ~958 kB gzip ~255 kB with Dashboard/Today eager. | `npm run build` | **Reduced** — lazy Dashboard/Today/Start; main ~631 kB / ~173 kB gzip. Remaining is shell + hosts + store. See [`../audits/bundle-optimization-v1.md`](../audits/bundle-optimization-v1.md) |

Closed in hardening v1 + visual UX v1 + page decomposition v1 + draft safety + bundle v1: unauthenticated SQLite API, public `data/*.sqlite`, Cozy free comfort when nutrition is off, Cozy grant/settings split, season window overlap, raw body-stage avatar paths, broken `/dashboard` link, missing error boundary, stale `?v=42` asset tests, male hero manifest PNG vs on-disk WebP, Cozy Journey DF chrome, 768px cramped sidebar, avatar glued to hero floor, giant TodayPage/SettingsPage orchestrators, Settings autosave clobbering dirty draft.
