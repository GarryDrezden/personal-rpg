# Real User Journey & Long-Horizon Gameplay QA v1

**Date:** 2026-08-20  
**Scope:** live as a player across first session → months → return, not as a systems designer.  
**Policy:** no new giant systems, no economy retune, no generated images, no shop / endgame / social. Copy, disclosure, dead ends, and tests only.  
**Simulator:** `src/utils/gameDesignSimulation.ts` (`events[]` timeline) + personas `src/utils/realUserJourneyPersonas.ts`. Synthetic fixtures, not a medical model. Auto-spend Home in sim is **not** how a real player clicks (they spend one upgrade at a time).

### New game systems added

NONE

### Economy changed

NONE

### Images generated

NONE

---

## Executive summary

Personal RPG already has a livable core loop: mark a day → the world reacts → there is a next step → come back tomorrow. Recovery, return-after-absence, theme-isolated math, and scaled Journey weight gates survive a real-user pass.

What still breaks **comprehension** (not mechanics) is leftover designer vocabulary and a few dead CTAs:

1. **Next Best Action asked for calories/alcohol after those trackers were off** — a real dead end. Fixed.
2. **Home 24/24 could leave NEXT empty** once Journey was also done. NEXT now falls through to «Ритм продолжается» → Today. Home-complete save copy no longer pretends an upgrade is waiting.
3. **409 copy** did not say the save did not apply. Fixed.
4. **First onboarding screen mixed Cozy house + DF darkness** before the player chose a world. Neutralized.
5. **FAQ still mentioned a companion on start** after pets were removed from onboarding. Fixed.

Long-horizon: a balanced fixture finishes Home around a year, Journey is still open (7/9), coins keep climbing with no sink (KI-09), and Day 90’s dominant loop is **Home restoration + season arcs**, not a slot machine of unlocks. Event density falls from ~6 events/week in week 1 to ~1.6/week by day 365 — quiet days exist. The remaining product gap is **post-Home / coin sink**, explicitly deferred.

**Verdict:** the app is playable as a life companion. Do not add systems. Hide or merge optional meta-screens that answer questions Freedom / Journey / Week already answer.

---

## User journey map

| Stage | User question | Screen answering it | Main feedback |
|-------|---------------|---------------------|---------------|
| First session | What is this, and do I have to finish a character creator? | `/start` → `/today` | Idea of the game; theme; body goal; rhythm. Lands on Today, not Dashboard. |
| Day 1 | What do I mark, and what changed because I marked it? | `/today` save → Dashboard NOW | Reaction + quests closed. Cozy: one Home warmth card. Not seven reward layers. |
| Week 1 | Does it remember yesterday? How did the week go? | Dashboard NOW, `/week` | NBA from yesterday’s state. Week story + recovery as a normal day. First Home L1s. |
| Month 1 | Did a month change anything? | Home, Journey, Season, level | Balanced: Home ~9/24, Journey ~3/9, first season can close ~day 22, level ~5. Body Stage often still 1. |
| Month 3 | Why do I still open this? | Home (~75%) + current season + Journey chapter | Dominant loop: restore the house / close the season / walk the chapter. Not “a bit of everything.” |
| Month 6 | What’s left? | Home ~22/24, Journey ~6/9, Body Stage climbing | Last Home projects are long. Journey and body still have horizon. Coins are a receipt. |
| Return after absence | Do I owe the app a week of catch-up? | Dashboard NOW (`return_after_absence`) | Copy: do not close past days. One small today is enough. |

---

## User lifecycle

```text
register → /start (5 steps) → /today
        → daily save (good / minimal / recovery / partial / bad)
        → Dashboard NOW / NEXT / LONG
        → Week (meaning) → optional Analytics / Reports
        → Home (Cozy) / Journey / Season / Freedom (when ready)
        → absence → return (gap ≥ 7 days) → one small day
        → months: Home fills, seasons archive, Journey/Body Stage are the long spine
        → Home 24/24: NEXT must not ask for another room
```

Companion is **not** in first session (opt-in Settings). Good. FAQ previously still claimed otherwise.

---

## First session

Flow walked: register (mock) → `/start` 5 steps → theme → hero → world → body goal → rhythm → `/today`.

| Question | Finding |
|----------|---------|
| What is this app? | Step 1 lead states it is not “just a tracker.” After copy fix, it no longer names house *and* darkness before a theme exists. |
| Why pick a theme? | Step «Мир»: visual language, not an exam, not forever. Two live worlds + two coming-soon. |
| Too many settings before a result? | Five steps is the edge of acceptable. Companion already removed. Tracking toggles on last step are optional. |
| Hero / world / goal? | Separate steps. Hero = name/gender; world = theme; goal = height/weights. |
| Character creator vs life app? | Residual risk: “Пробуждение ядра” + hero name. Mitigated by landing on Today, not a skill tree. |
| Can I change later? | Rhythm step + FAQ `onboarding-change-later`. Theme/tracking/sidebar later do not wipe XP/Home/Journey. |
| After onboarding? | `/today`. Primary CTA is save. |

**Confusion:** onboarding art on step 1 is still the DF “core in ruins” plate even for a player who will pick Cozy. P3 polish (asset), not a new system.

---

## First 5 minutes

Player should learn: mark today; imperfect is OK; the app reacts; the CTA is save.

They should **not** need Momentum formula, 84 abilities, season math, Home economy, boss campaign.

**Actual:** Today can still show a season strip and an obstacle while the player is filling the first day. Hierarchy after economy pass is better (Dashboard NOW/NEXT/LONG). Today is still the densest screen — acceptable if presets exist (`today-preset-minimal`).

Minimum viable day: preset + save is ~20–30 seconds. **Not P1.**

---

## Day 1

| Variant | Today | After save | Dashboard |
|---------|-------|------------|-----------|
| Good | Full tracking | XP + Home resources (Cozy) + reaction | NOW = hold the day / next missing field |
| Minimal | Preset | Smaller grant, still a reaction | NOW stays a small step |
| Recovery | Preset recovery | Grant continues (recovery is legitimate) | NOW = hold base |
| Partial | Some fields | Save allowed; NBA asks for the next *enabled* signal | Must not ask for disabled nutrition |

Reward comprehension after one save (intended hierarchy):

1. The day is saved (status + reaction).
2. One world beat (Cozy Home warmth **or** DF obstacle/season line).
3. NOW for tomorrow.

XP/coins/Home chips may appear but coins stay secondary. After this pass, completed Home no longer says «Дом стал чуть теплее» as if a room is waiting.

---

## Days 2–7

Re-entry: Dashboard remembers yesterday (NBA uses last entries + recovery state). Draft on Today persists until save.

Content: date-hashed pools (Today reaction, obstacle, Home status). IDs differ; tone can still feel related — KI-11 art-bound mobs.

Companion: off by default. If enabled, chip is presence, not a quest.

**Does it remember yesterday?** Yes, mechanically. The sentence the player needs is on NOW, not in Momentum.

Synthetic mixed week (good/good/minimal/recovery/good/high/imperfect) still moves Home, XP, and Journey. Recovery days are not a loophole and not a wipe.

### First week reward timeline (balanced sim, auto-upgrade)

| Day | Event the *sim* records | What a real player likely sees |
|-----|-------------------------|--------------------------------|
| 1 | 3× Home L1 if they could afford all | NEXT shows **one** «Можно улучшить». One click = one room. |
| 1 | Journey chapter 1 progress, 1 ability unlock (legacy grid) | Journey not required on day 1. Legacy ability is easy to ignore if they stay on Today. |
| 3 | Level 2 | Level HUD on Dashboard. Quiet if they do not stare at XP. |
| 7 | Home ~3/24, level 2, Journey 1/9 | Week screen becomes meaningful. |

**P2:** auto-sim overstates day-1 celebration density. Real UI already serializes Home upgrades. Do not retune costs.

## Week 2–4

Same month-1 systems, quieter days. First season can complete around day 22 (balanced sim). Home is the visible weekly beat; Body Stage often still 1 until measurements move. Week screen is now worth opening.

## Return

Gap ≥ 7 days → Dashboard NOW is `return_after_absence` (Cozy: «Снова дома»). One minimal day counts. No debt, no closing old dates. Persona F is the synthetic of this loop.

## Large-goal user

See Persona A. Early feedback is Home + Journey chapters, not −50 kg.

## Small-goal user

See Persona B. Scaled Journey gates; full 9 chapters; avoid Skill Map −50.

## Recovery-heavy user

See Persona E. Home and XP still move; recovery copy is legitimate.

## Existing legacy user

Onboarding skipped if daily data exists (`onboarding-smoke`). Not forced through character creator.

---

## Week screen

After seven days `/week` answers “how did the week go?” with a story card, boss/threat chrome, and step distribution.

| Question | Answer |
|----------|--------|
| Understand the week without graphs? | Mostly — `WeeklyStoryCard`. Charts are extra. |
| Duplicate of Analytics? | **Partial overlap.** Week = this week’s meaning. Insights = pattern advice. Reports = archived weekly writeups. Distinction is learnable but not obvious without FAQ. **P2.** |
| Recovery as a normal part? | Yes, if those days were marked recovery/minimal. Copy is not shame. |
| Next step? | Link back to Today; not a third Hub. |

---

## Body ability discovery

Personal map (`/freedom`): empty CTA *before* setup does **not** dump 24 chores. Copy: not a duty list; can wait.

When suggested: «Да, стало легче» / «Пока нет» / «Неактуально». That is a check-in, not a checkbox achievement — if the player reads the labels. Growth `/growth/abilities` still stacks the **legacy 84-grid** under the personal map. **MERGE CANDIDATE** (do not merge this pass).

Today shows personal hint **or** legacy hint, not both.

---

## Freedom first visit

No-profile: setup CTA + preview on confirm. Grid appears after answers. Athletic baselineEasy hides beginner mobility (Persona A/D). Small goal still gets a map (Persona B). Shame-copy not used.

---

## Home first visit (Cozy)

House scene first (visual integration pass). Player should read: this is my path made visible; something already changed if they saved; upgrades cost resources earned from life, not a city-builder harvest.

Resources: full chips on `/home`, not a spreadsheet on Dashboard.

**Not a city builder** as long as NEXT does not nag farm. `getCozyUpgradeHintLine` speaks in rooms, not ratios.

---

## First Home upgrade

resource → NEXT «Можно улучшить» → `/home` → upgrade → zone plate changes L0→L1.

Satisfaction risk: L2 still falls back to L1 art (known visual gap). L0→L1 **does** change the plate. If the player upgrades L1→L2 they may see little. **P3** art, already documented.

---

## Home after 28 days

Balanced sim: **9/24 (38%)**. Matches “about 9/24.” House has several rooms awake; late L2/L3 still locked. Horizon visible. Not a resource spreadsheet on Dashboard.

---

## Month 1

Balanced 28d: level 5, coins ~140, Home 9/24, Journey 3/9, season index 2 (first arc can close ~day 22), Body Stage 1, heroState `strong`.

**Did the month change something?** Yes — Home and first season, not the avatar. Body Stage waiting for measurements is correct (physical signals only).

---

## First season completion

Season stays on the incomplete arc until quests actually complete (calendar cannot skip Season 1). When it closes, chronicle stores it; next season becomes current.

Risk: “another bar hit 100%.” Mitigated if `/seasons` is a story (vignette + recap), not only a meter. Player may still not know Season ≠ Journey. **P2 vocabulary** on LONG: Journey is chapters of the body path; Season is a 28-day campaign slice.

---

## Incomplete season

If 28 calendar days pass without quests done, Season 1 stays current. Copy is recap/partial, not shame. Next season does not spawn as a replacement. Covered by `seasonEngine` tests; confirmed as product invariant.

---

## First Body visual change

Sim: balanced Body Stage first move **day 29** (stage 2). Persona A/D can hit stage 2 inside month 1 because the fixture loses more kg. Hero State (`strong` / `energized`) is resource/momentum-like, not a second weight loss bar — but the words sit near Body Stage on Dashboard. **P2:** two “how is my body” readouts. Keep both; do not explain formulas on Day 1.

---

## Small-goal body path (Persona B, 65→55)

Journey still 9 chapters; weight gates scale (50 kg gate → 10 kg). Active Journey titles rewrite (`Снизить вес на X кг`). Skill Map `/map` still contains a **−50 кг** node if the user enables that optional nav. **P2** for anyone who turns Skill Map on.

Visual anchors will not jump to late stages on −10 kg. Month 1 Body Stage stayed 1 in the fixture (0.4 kg lost — sim is conservative). Ability grid still exists as a full game via personal map + Home + seasons.

---

## Large-goal body path (Persona A, 180→100)

Month 1: only **−5.3 kg** of an 80 kg goal, but Home 10/24, Journey 5/9, season 2, level 6. Early feedback is **world + chapters + Home**, not waiting for −50 kg. Athletic `baselineEasy` excludes tie-shoes / first-stairs. Copy must not call them a sofa beginner — onboarding and NBA do not. Growth legacy grid could still surface generic early abilities if they open it. **P2**, same merge.

---

## Month 2–3

Balanced 90d: Home **18/24 (75%)**, Journey 5/9, season index 4, Body Stage 4, level 8, coins ~455, ~3.5 events/week.

**Dominant loop on day 90:** Cozy Home restoration (visible rooms) + the current season arc. Journey is the slow spine. If the answer were “a bit of everything,” the HUD would have failed; NOW/NEXT/LONG plus Home as NEXT while rooms remain is the actual loop.

Content endurance: pools rotate by date hash. Formulaic *tone* is still possible (KI-11). Not a uniqueness bug in IDs.

---

## Month 4–6

Balanced 180d: Home **22/24 (92%)**, Journey 6/9, season 6, Body Stage 7, level 11, coins ~906, ~2.4 events/week.

Emerging gap (do **not** build): after Home 90%+, NEXT spends more time on Journey/season/body. Coins look like a shop promise (KI-09). Post-Home currency is P4.

---

## Home near completion (23/24)

Last project is a long L3 (economy v2). NEXT should name the room and missing resources, not “grind wall” with no explanation. If the last cost is high, copy already calls it a long project. **Do not cheapen it this pass.**

---

## Home completion (24/24)

Balanced year: 24/24. NEXT must **not** say «До следующего улучшения». Tests: `dashboardNextProgress.test.ts`. UI: hint «Дом восстановлен.» Reward card: «Дом уже восстановлен» / «Посмотреть дом». Fallback `continue_rhythm` → Today when Journey is also done.

---

## Post-Home

Resources **keep granting** (economy unchanged). UI still shows chips on save, with complete copy. NEXT no longer points at Home upgrades.

**P4 / KI-12:** dead-feeling currency after 24/24. Softened, not sunk. Do not add endgame rooms.

---

## Coins after months

| Horizon | Balanced coins | Active 365 |
|---------|----------------|------------|
| 28d | ~140 | — |
| 90d | ~455 | — |
| 180d | ~906 | — |
| 365d | ~1824 | ~2763 |

No sink. Secondary on Dashboard. Looks like a future shop. **KI-09 open. Do not implement shop.** Keep secondary.

---

## Long absence (14d) / 30+ (45d)

NBA `after_absence` (gap ≥ 7) wins over “log calories.” Copy: do not close past days. Momentum may be low; it is not a debt wall. Season stays on the incomplete arc. Home does not decay.

Return day can be **minimal**. Recovery-heavy and inconsistent personas still earn XP/Home.

---

## Bad day / three bad days

Honest weak-day language exists; «провал» / game-over / 200 kg death path removed in consistency pass. Three bad days should not paint the whole chrome red. Momentum dips; Hero State can sag; long counters (Journey, Home, level) stay.

---

## Recovery week / high activity week

Recovery grants Home resources (less than a stacked day). High physical activity credits movement when PA tracking is on; NBA should not advertise PA when the tracker is off (steps CTA clause fixed).

---

## Tracking disabled

Nutrition / alcohol / PA off: obstacles and Today reactions already respected tracking. **NBA did not.** Fixed: no `log_calories` / `log_alcohol`; step leftover does not mention PA if PA is off. Product-wide empty blocks for disabled trackers were previously audited; this pass closed the Dashboard CTA hole.

---

## Settings after months / theme switch

Theme does not change math (invariant test). Switching Cozy → DF at day 90 changes presentation (Home hidden in DF nav, art, copy), not XP/coins/Journey/Body Stage. Sidebar visibility is per-theme. Tracking changes hide future CTAs; they do not delete history.

---

## Dark Fantasy full flow

Same loop, denser metaphor (path, seals, threats). Must stay serious, not aggressive. Recovery/return copy is still “small step,” not punishment. Onboarding intro line splits by theme *after* a world is chosen.

---

## Optional navigation

| Screen | Role | Verdict |
|--------|------|---------|
| Chronicle `/seasons` | Season story + history | **KEEP** (core medium loop) |
| Skill Map `/map` | Five habit paths incl. −50 kg | **MERGE CANDIDATE** with Journey/Freedom. Question it answers is already answered. Do not merge this pass. |
| Momentum `/momentum` | Formula + history | **DEFER** as a default dest. Useful as optional “why is NOW saying this?” |
| Hero Growth `/growth` | Hub: skills, abilities, rewards, achievements, trials | **KEEP** as hub. **SIMPLIFY** abilities tab (legacy 84 under personal map). |
| Codex `/codex` | Collection | **KEEP** as museum. Day 1 empty is OK; day 180 should not feel like a second campaign. |
| Analytics `/insights` | Pattern advice | **KEEP**, later discovery. Sparse at 7 days is OK. |
| Reports `/reports` | Archived weekly writeup | **MERGE CANDIDATE** with Week history. Distinction is weak without docs. **P2.** |
| Skills (growth tab) | Meta skill XP roads | **DEFER** / low priority. Easy to confuse with Body Abilities. |

---

## Skill Map vs Freedom

Freedom = personal body changes you confirm in life. Skill Map = five generic milestone tracks (including −50 кг). **Freedom answers the human question. Skill Map answers a designer checklist.** Merge candidate; not merged.

---

## Hero Growth

Actual role: collection hub so `/skills` `/abilities` `/bosses` are not separate apps. Without the hub it would be five dead ends. Keep the shell; slim the abilities tab later.

---

## Codex user test

| Day | Useful? |
|-----|---------|
| 1 | Almost empty. OK if not in default nav. |
| 30 | Some obstacles/seasons if they visited those screens. |
| 180 | Can feel like a gallery of locked art (KI-11). Discovery not required for the core loop. |

---

## Measurements

First weigh-in: needed for Body Stage and Journey weight gates. Not medical framing in current copy. Does not by itself change Home. FAQ quick start updated: “not a medical chart.”

---

## Analytics / Reports

7 days: Insights may be sparse (`hasEnoughDataForInsights`). 30/90: more cards. Reports duplicate Week’s story with more archive. **P2** if a player opens all three in one sitting.

---

## Notifications / PWA

Old SW without `revision` can still last-write-wins (KI-01 residual). Current SPA 409 + clearer copy. Do not silent-save a new schema over an unsynced shell — hydration guard already blocks save-before-load.

---

## Backup UX

Export / import / preview / cancel / restore exists (`docs/wiki/15-backup-and-recovery.md`). Preview before confirm is the user-facing path; JSON is not required to understand the buttons. Pass as product, not a new wizard.

---

## Multi-tab / API failure / load failure

409: «Сохранение не записалось: данные уже обновились в другой вкладке. Обновите страницу.» No SQL/revision in the toast.

Today draft stays local until a successful save; no false success on 409.

Load failure: `ErrorScreen` — not a fake empty account. Retry re-inits.

---

## Navigation / back / mobile / desktop

Core path Dashboard → Today → Home → back → Freedom → Settings → Today uses AppShell + bottom nav. Context (selected day) is URL/`searchParams` on Today/Week.

Mobile 390: first week is scroll-heavy on Today; primary save is the sticky bar. Desktop 1920: command bridge uses width; Cozy scenes are full-bleed. Not a tiny site in a void after visual integration — still not a native 1920 layout system. **P3.**

---

## Cognitive load

Terms a new user can meet:

| Window | Terms |
|--------|-------|
| 5 min | Today, save, theme, hero, steps, nutrition (if on), Home (Cozy) |
| Day 1 | XP (HUD), coins (muted), NOW, maybe season strip, daily obstacle |
| 7 days | Week, recovery/minimal, Journey (if they open LONG), level |
| 30 days | Season, Body Stage, Hero State, Freedom/abilities (if they follow NEXT) |

**Over budget if they enable** Momentum, Skill Map, Codex, Reports, Growth, and Insights in week 1. Those are off or nested by default. Good.

---

## Discovery timeline

| System | First meaningful exposure |
|--------|---------------------------|
| Today | Minute 1 |
| Dashboard NOW | After first save or second visit |
| Home (Cozy) | Early (NEXT when L1 is cheap) |
| Week | Day 7 |
| Season as a *story* | Week 2–4 (first close ~day 22 in sim) |
| Freedom setup | Contextual (NEXT ability or empty CTA) |
| Body Stage visual | ~day 29 in balanced sim, earlier if weight moves |
| Analytics | Later; sparse at day 7 |
| Skill Map / Momentum pages | Only if optional nav enabled |

Season strip on Today in minute 1 is slightly early. **P3.**

---

## Dead ends

| Place | Was | Now |
|-------|-----|-----|
| NBA + nutrition off | «Внести калории» | Skipped |
| Home 24/24 NEXT | Could vanish | Journey or `continue_rhythm` |
| Optional Momentum page | Easy to feel lost in formula | DEFER as default; not removed |
| Skill Map | −50 кг on a −10 kg life | MERGE CANDIDATE |
| Mobile Today save | Under bottom nav | Bar sits above nav |

---

## CTA audit

Dashboard: NOW is the bright CTA; NEXT/LONG are quieter. Today: one save button (mobile bar). Home: upgrade on the next zone, not four equal buttons. Freedom setup: one primary.

**Problem leftover:** Growth abilities tab has personal actions **and** a wall of branch cards. **SIMPLIFY** later.

---

## Data entry burden

Default: simple nutrition + steps + alcohol + optional habits. Not a 5-minute form if the player uses presets. Detailed calories + PA + sleep + custom habits **can** become a questionnaire — that is opt-in. Minimum viable day still holds.

Real-life first: no evidence the optimal strategy is “always pick minimal for better rewards.” Good/stacked days grant more Home than recovery (invariant tests). Editing an old day does not double Cozy grants.

Future dates: not a supported entry path. Timezone/midnight: seasons and daily grants key off local `yyyy-MM-dd`.

---

## Reward gaming / old day / future day

Same-day re-save does not duplicate Cozy resources. Old-day edit should not double-grant. Future days are not offered in the week navigator as “tomorrow’s farm.” Product flow matches hardening tests; this pass did not retune.

---

## Event density / quiet days / milestones

Balanced events/week: 6 (week 1) → 5.3 (month 1) → 3.5 (day 90) → 2.4 (day 180) → 1.6 (day 365).

Quiet days exist. Milestone days: Dashboard still has one NEXT. Today should not fire ability toast + Home card + season + achievement as four equals — toast hosts exist; keep NOW as the verbal priority. **P3** if a host stacks.

---

## Year-scale glimpse (365)

Balanced: Home 24/24, Journey **7/9**, season 13, Body Stage 13, level 16, coins ~1824.  
Active: Home 100%, coins ~2763, level 19.

Gaps (do not build): coin sink, post-Home loop, Journey last chapters vs Body Stage remaining, DF female anchors (KI-05).

---

## Personas

### Persona A — large goal / athletic (180→100)

28d: −5.3 kg, Home 10/24, Journey 5/9, level 6, hero `strong`. Not spoken to as a first-stand-up-from-sofa user in NBA/onboarding. Early feedback is world, not −50 kg.

### Persona B — small goal (65→55)

28d: Journey still 9 chapters, Home 9/24, level 5. Weight gates scale. Path is a full game. Watch Skill Map −50 if they enable it.

### Persona C — low mobility (130→80)

Recovery-heavy + 0.4 step scale. 28d: XP 3260, Home 7/24, hero `energized`. Moves. No shame copy in recovery NBA. Functional abilities belong on Freedom with a low-mobility profile — not auto-tested in this sim’s personal map (sim does not run Freedom setup).

### Persona D — athlete comeback (95→75)

28d: 28 logged days, Home 10/24, Journey 4/9, Body Stage 2. Beginner mobility excluded when they configure Freedom with athletic baseline.

### Persona E — recovery-heavy

90d: Home still advancing, XP > 0, Home < 100%. Recovery is legitimate progress.

### Persona F — inconsistent / returning (5 on / 18 off)

28d: 10 logged / 18 skipped, Home 4/24, season still 1, XP 1280. No catch-up wall in the model. NBA return copy is the live UX for the gap.

### Existing legacy user

Onboarding skipped if daily data exists (`onboarding-smoke`). Not forced through character creator.

---

## Reward comprehension

After recent passes Today is not a seven-reel slot machine **if** the player stays on the save reaction + one Home/DF beat. Risk returns if season card + ability hint + plateau + boss all show on the same first save. Context stack already mutually excludes some hints.

---

## System discovery timeline

See table above. Complex systems that can shout on Day 1 without cause: Today season strip, legacy ability unlock on Growth, Skill Map −50 if enabled.

---

## Confusion points

- Season vs Journey vs Week vs Reports  
- Hero State vs Body Stage  
- Freedom map vs Growth 84-grid vs Skill Map  
- Coins as “money”  
- Onboarding step 1 art still DF-coded (P3)

---

## Dead ends (summary)

Closed this pass: tracking-off NBA, Home 24/24 NEXT, 409 “did my save work?”. Remaining: optional meta-pages, post-Home coins (P4).

---

## Navigation friction

Optional screens in default-off sidebar. Enabling all of them recreates a designer map. Keep defaults.

---

## Cozy

House is the long visible loop. Language: warmth, rooms, recovery. Must not farm. Completion copy fixed.

## Dark Fantasy

Same math. Language: path, seals, threats — not shame. Home is Cozy-only; DF LONG is Journey/body.

---

## Product invariants (checked)

1. Meaningful next step — NOW always; NEXT after 24/24 falls through.  
2. Recovery is progress — grants + copy.  
3. Return is easy — `after_absence`.  
4. Bad day cannot erase long progress — Home/Journey/XP remain.  
5. Theme does not change mathematics.  
6. Body art from physical signals.  
7. No duplicate same-day Cozy grant.  
8. Small-goal user gets a full Journey.  
9. Athletic baseline can exclude beginner mobility.  
10. Missing API ≠ fresh account.  
11. Home completion does not break NEXT.  
12. Tracking-disabled NBA no longer asks for hidden trackers.

---

## Problems found

### P0

None remaining after this pass.

### P1 (fixed unless noted)

- NBA `log_calories` / `log_alcohol` with tracking off — **fixed**.  
- Home 24/24 NEXT could disappear — **fixed** (`continue_rhythm`).  
- 409 did not say the save was rejected — **fixed**.  
- FAQ promised a companion on start — **fixed**.  
- Mobile Today save sat under the bottom nav (Codex intercepted the tap) — **fixed**.

### P2

- Skill Map −50 кг vs scaled Journey. MERGE CANDIDATE.  
- Growth/abilities shows personal map **and** 84 auto-grid. SIMPLIFY.  
- Week / Reports / Insights overlap.  
- Coins look like a shop (KI-09).  
- Season vs Journey vocabulary.  
- Hero State vs Body Stage on the same hero card.  
- Today season strip on minute 1.

### P3

- Onboarding intro art is DF-coded before Cozy is chosen.  
- Home L2→L1 art fallback.  
- 1920 still a wide web app, not a native stage.  
- Codex empty/locked extremes.

### P4

- Post-Home resource grants with no sink (**KI-12**).  
- Year-scale Journey 7/9 + coins 1.8k+ with nowhere to spend.  
- No Home endgame (intentionally not built).

---

## Recommendations

Fix misleading CTAs and dead ends only. Do not add shop, Home endgame, Skill Map merge, or 84-grid deletion in this pass. See «Recommendations not implemented».

## Changes actually made

- NBA respects nutrition/alcohol/PA tracking; tracking-aware recovery copy.  
- Dashboard NEXT: never Home after 24/24; `continue_rhythm` fallback to Today.  
- Cozy save card when Home is complete.  
- 409 user copy.  
- Theme-neutral onboarding step 1 copy.  
- Mobile Today save bar sits above the bottom nav (was untappable under Codex).  
- FAQ: start flow, tracking-off CTA, two tabs, Home complete.  
- Simulator event timeline + personas A–F.  
- DEV `/dev/user-journey-lab`.  
- Playwright `e2e/real-user-journey.spec.ts`.

## Recommendations not implemented

- Shop / coin sink  
- Home endgame / extra rooms  
- Merge Skill Map into Freedom/Journey  
- Hide legacy 84-grid  
- Merge Reports into Week  
- New notifications, streaks, companions XP, social  
- Economy retune (day-1 three L1s in *sim auto-spend* only)  
- New onboarding art plate for Cozy  

## KEEP / SIMPLIFY / MERGE / DEFER / REMOVE CANDIDATE

See optional navigation table. Nothing removed automatically.

---

## Tests

- `src/utils/gameDesignInvariants.test.ts` — tracking-off NBA  
- `src/utils/dashboardNextProgress.test.ts` — Home 24/24 + continue_rhythm  
- `src/utils/realUserJourneySimulation.test.ts` — personas + horizons  
- `src/utils/gameDesignSimulation.ts` — `events[]` (matrix runs `includeEvents: false` for speed)

## Playwright

`e2e/real-user-journey.spec.ts`: A first week, B return 18d, C small-goal Journey, D Home 24/24, E tracking-disabled, F 409 copy.

## Docs

This audit; wiki 00 / 01 / 03 / 07 / 08 / 14; FAQ; data-integrity 409 sentence.

## Git

Not committed in this pass unless the user asks.

---

## Automated journey simulator

`simulateUserJourney(..., includeEvents)` emits `home_upgrade`, `level_up`, `body_stage_change`, `journey_chapter`, `season_complete`, `ability_unlock` with day numbers. DEV lab prints the first 24 events per persona/horizon.
