# Progression Economy Calibration v1

Date: 2026-08-20  
Scope: Cozy Home cost retune + Dashboard NOW / NEXT / LONG.  
No new game systems. No shop. No XP retune. No coin amount retune.

Follow-up to [`game-design-consistency-v1.md`](./game-design-consistency-v1.md).  
Principles: [`../design/progression-principles.md`](../design/progression-principles.md).

Simulator: `simulateUserJourney` (`src/utils/gameDesignSimulation.ts`), profiles CASUAL / BALANCED / ACTIVE / RECOVERY_HEAVY / INCONSISTENT, auto-spend via `findAffordableUpgrade`. Fixture: start 95 kg → target 75 kg.

---

## Baseline

Before this pass (economy v1 costs, same income, auto-spend):

| Profile | 28d Home | 90d Home | 365d Home |
|---------|----------|----------|-----------|
| casual | 71% (17/24) | 100% | 100% |
| balanced | **100% (24/24)** | 100% | 100% |
| active | **100% (24/24)** | 100% | 100% |
| recovery_heavy | 83% | 100% | 100% |
| inconsistent | 54% | 92% | 100% |

**Balanced 28d Home = 100%.** That was the bug.

Upgrade cost totals (v1): Comfort 50 · Materials 46 · Garden 23 · Clarity 14. Clarity barely spent. Coins ~900–2700 / year with no sink. XP ~L16–L19 / year for balanced–active — keep.

Dashboard showed hero + CTA + four Cozy resources + season + camp + abilities + plateau + coins pill in primary color.

---

## Home problem

Cozy Home is the world answering care, not a gathering minigame. Completing 24/24 in a month made the house a finished toy instead of a months-long restoration.

Targets (orientation, not a formula):

| Milestone | Balanced |
|-----------|----------|
| First 2–3 upgrades | 5–10 days |
| 6/24 | 2–3 weeks |
| 12/24 | 6–8 weeks |
| 18/24 | 10–14 weeks |
| 24/24 | 16–24 weeks (~4–6 months) |

Active should not finish before ~3 months. Casual may take 6–9 months. Recovery-heavy slower than balanced, not stuck. Inconsistent: early progress, slow full clear.

Calibration via **costs**, not by cutting daily grants to fractions. A good day still yields small whole numbers (1–3).

---

## Resource identity

| Resource | Role | Typical zones |
|----------|------|----------------|
| Comfort / Уют | Warmth, textiles, daily living | bedroom, kitchen, hallway, pet, late porch |
| Materials / Материалы | Repair, structure, workshop | porch, yard, workshop, kitchen structure |
| Garden / Сад | Outside, soil, paths | yard, garden, late pet |
| Clarity / Ясность | Order, light, storage, bench, finishing complex rooms | hallway, kitchen, bedroom, workshop, porch L3, pet L3 |

Clarity is **not** a fourth mandatory currency on every upgrade. Max 1–3 resource types per cost.

---

## Cost model

`COZY_HOME_ECONOMY_VERSION = 2` in `src/constants/cozyHomeConfig.ts`.

Already purchased zone levels are **not** recalculated. Only the next unpaid upgrade uses the new price. Resources are never charged retroactively; `normalizeCozyHomeState` clamps negatives to 0.

Spend order: lowest unfinished **level** first (all practical L1s before L2), so the house wakes room by room instead of maxing the porch.

Porch L1 stays `{ materials: 2 }` (existing spend test: 5 → 3).

Late costs with sum ≥ 40 are labeled «долгий проект» in UI — copy only, not a rarity system.

### Zone costs (v2)

| Zone | L1 | L2 | L3 |
|------|----|----|-----|
| Крыльцо / porch | Materials 2 | Materials 20 · Comfort 32 | Materials 18 · Comfort 80 · Clarity 12 |
| Прихожая / hallway | Comfort 2 | Comfort 40 · Clarity 28 | Comfort 80 · Clarity 48 |
| Кухня / kitchen | Comfort 24 · Clarity 8 | Materials 12 · Comfort 48 · Clarity 16 | Comfort 130 · Materials 12 · Clarity 24 |
| Спальня / bedroom | Comfort 2 | Comfort 56 · Clarity 24 | Comfort 160 · Clarity 28 |
| Двор / yard | Materials 16 · Garden 12 | Materials 14 · Garden 20 | Materials 16 · Garden 42 · Comfort 14 |
| Сад / garden | Garden 22 | Garden 22 · Comfort 28 | Garden 48 · Comfort 28 |
| Мастерская / workshop | Materials 40 · Clarity 20 | Materials 22 · Clarity 28 | Materials 28 · Clarity 54 |
| Уголок спутника / pet | Comfort 24 | Comfort 44 · Materials 8 | Comfort 52 · Garden 12 · Clarity 12 |

Comfort is the main time-gate for indoor L2/L3. Garden gates outdoor zones. Clarity is required for order/light/workshop completions.

---

## Simulations before

See Baseline. Balanced and active: **24/24 at day 28**.

---

## Simulations after

Auto-spend, same profiles, 95→75 kg.

### Home upgrades / 24 and %

| Profile | 28d | 60d | 90d | 180d | 365d |
|---------|-----|-----|-----|------|------|
| casual | 5/24 · 21% | 8/24 · 33% | 11/24 · 46% | 15/24 · 63% | 22/24 · 92% |
| balanced | 9/24 · **38%** | 13/24 · 54% | 18/24 · 75% | 22/24 · 92% | 24/24 · 100% |
| active | 10/24 · 42% | 16/24 · 67% | 19/24 · 79% | 23/24 · 96% | 24/24 · 100% |
| recovery_heavy | 8/24 · 33% | 12/24 · 50% | 15/24 · 63% | 21/24 · 88% | 24/24 · 100% |
| inconsistent | 4/24 · 17% | 7/24 · 29% | 8/24 · 33% | 12/24 · 50% | 17/24 · 71% |

**BEFORE:** balanced 28d = 100% Home.  
**AFTER:** balanced 28d = 38% Home.

First week: balanced/casual ≈ 3 upgrades; active ≈ 5. Early feedback stays fast. Half the house is not done in week 1.

90d balanced 75% is slightly above the 50–70% orientation; accepted after sim (not a rigid formula). Active 90d 79% ≈ 3 months, not a 28-day clear. Casual year almost full; inconsistent never finishes in a year.

### Locked test ranges

- balanced 28d Home `< 50%`
- balanced 180d Home `>= 80%`
- active 28d Home `< 60%`
- recovery_heavy 90d Home `> 25%` and slower than balanced
- balanced 7d upgrades `>= 1` and `< 8`

### Resource leftovers (28 / 90 / 180 days)

Clarity is spent on several zones, so it is no longer a zero-use currency. Daily Clarity income is still healthy and not every upgrade asks for it, so leftover Clarity grows. **No post-max sink in this pass** (P4). Comfort is the indoor time-gate (often near-empty at 28d). After Home 24/24, Dashboard no longer pushes “next upgrade”; `/home` says «Дом восстановлен».

| Profile | 28d leftover | 90d leftover |
|---------|--------------|--------------|
| casual | C20 M14 G10 Cl56 | C4 M0 G28 Cl172 |
| balanced | C12 M20 G14 Cl88 | C48 M3 G43 Cl253 |
| active | C8 M20 G4 Cl160 | C46 M56 G80 Cl374 |
| recovery_heavy | C20 M6 G14 Cl76 | C36 M6 G32 Cl288 |
| inconsistent | C2 M8 G20 Cl32 | C25 M17 G14 Cl132 |

Economy v2 cost totals across all 24 upgrades: Comfort 844 · Materials 208 · Garden 178 · Clarity 302.

Recovery still grants comfort (non-zero). Minimal grants less than a good day — not an optimal farm.

---

## Coins

**Role:** meta receipt / accumulated game currency awaiting meaningful sinks.

**Changed:** Dashboard presentation only (muted `dashboard-coins-meta`, not a primary-colored hero number).

**Unchanged:** grant tables, weekly bonuses, momentum coins, amounts.

**Not built:** shop, loot, gacha, cosmetics, boosts.

### Future sinks (design only)

1. Post-Home ritual: spend leftover Cozy resources / coins on a quiet “house keeps living” beat — not durability decay.
2. Codex stamps / chronicle pages.
3. Companion treat (one-off, not gacha).
4. Journey journal extras after a chapter.
5. Optional cosmetic *after* Home max — separate design pass.

Until a sink exists, coins stay secondary on Dashboard (header/meta, Profile, future Codex). KI-09 remains open for the sink, closed for Home pacing.

---

## XP

**Unchanged.** Year-scale L16–L19 for balanced/active is acceptable. No retune.

---

## Dashboard hierarchy

### Before

Command bridge (hero + threats + day) then full Home resource chips then campaign grid (season + camp + abilities + plateau) then summary strip. Coins pill used primary color next to the title. Several progress systems competed.

### After

Same command-bridge shell. Conceptual order:

1. Hero / context (portrait first on mobile — not reverted)
2. **NOW** — Today CTA, day resource, movement credit, recovery/momentum if needed, compact Hero State in the header
3. **NEXT** — exactly one item from `getDashboardNextProgress`
4. **LONG** — Journey «Глава N из 9» + Body «Стадия тела N из 20»
5. Secondary — slim Cozy Home (upgrade hint or «Дом восстановлен», no four chips), plateau if active, summary strip

Dark Fantasy: no Home card / `/home` still redirects to Dashboard. NEXT skips Home. LONG still Journey + Body. Math identical.

### NOW

Today status, primary CTA (`getNextBestAction`), current obstacle/recovery, compact Hero State (depleted / steady / energized / strong). Not coins, not four resources, not every long bar.

### NEXT

Deterministic priority (Today CTA is **not** replaced):

1. Confirmable Body Ability
2. Affordable Home upgrade (Cozy only)
3. Season near completion
4. Body visual anchor 1 stage away (5 / 10 / 15 / 20)
5. Home missing-resource copy (Cozy)
6. Journey current chapter

Copy is concrete: «До восстановления «Кухня» не хватает 2 Материалов», «Можно проверить: …».

### LONG

One long path: Journey chapter + Body Stage. Not a list of every system.

Momentum = compact NOW indicator when suggested, otherwise a strip link. Day status = Today feedback in the HUD. Streak stays secondary. Season appears in NEXT only when close.

---

## Changes

- `cozyHomeConfig.ts` — economy v2 costs, `COZY_HOME_ECONOMY_VERSION`, long-project helper
- `cozyHomeEngine.ts` — lowest-level spend, max-home copy, missing-resource hint
- `gameDesignSimulation.ts` — horizons 28 / 60 / 90 / 180 / 365
- `dashboardNextProgress.ts` — NEXT resolver
- Dashboard Command Bridge / Next / Long / slim Home card / campaign section
- Tests: simulation ranges, Home invariants, NEXT resolver, Playwright hierarchy
- Docs: this audit, wiki 00 / 03 / 07 / 08 / 14, brandbook UI rules

---

## Existing users

User with Home 10/24:

- 10 purchased upgrades remain
- resource balances remain
- next unpaid upgrade uses v2 cost
- no rollback, no retroactive debit, no negative resources from the config change

---

## Remaining future work

| ID | Item |
|----|------|
| P4 | Post-Home resource / coin sink (after 24/24 leftover Comfort/Clarity/coins) |
| KI-09 | Coin sink design pass — no shop until then |
| — | Skill Map vs Body Abilities overlap — still **do not merge** |
| — | Endgame — still **do not build** |

Daily income was not nerfed. Soft caps were not added.

---

## Acceptance (this pass)

1. Balanced/active no longer finish Home in 28 days.
2. Week 1 still grants at least one upgrade.
3. Full Home is a months-long milestone.
4. Clarity is used on multiple logical zones.
5. Recovery still grants Home progress; minimal < good day.
6. Existing Home progress is kept.
7. Coins not turned into a fake economy; visually secondary.
8. XP unchanged.
9. Dashboard reads NOW / NEXT / LONG.
10. Cozy / DF reward math identical.
