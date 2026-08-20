# Game Design Consistency v1

**Date:** 2026-08-20  
**Scope:** systemic audit of Personal RPG as one game about returning to yourself — not a pile of neighboring mechanics.  
**Policy:** no new giant systems. Economy numbers unchanged until a later sim + before/after pass.  
**Simulator:** `src/utils/gameDesignSimulation.ts` (`simulateUserJourney`) — synthetic fixtures, not medical weight loss.

### New game systems added

NONE

### Images generated

NONE

### Economy changes

NONE (no XP, coin, cozy cost, or grant-rate retune)

---

## Executive summary

Personal RPG **already has a real core loop**: log a day → the world reacts → a next step exists → come back tomorrow. Recovery, theme isolation, Body Stage (physical signals only), and personal Body Abilities are aligned with the product philosophy.

What breaks the feeling of **one game** is not missing content. It is **too many equally loud progressions** answering the same player question (“how am I doing?”) plus two pacing faults:

1. **Cozy Home finishes in weeks** for a balanced/active spender (24/24 upgrades by day 28 in simulation). A long-term world manifestation cannot complete in a month.
2. **Coins accumulate with almost no required sink.** After a year an active fixture holds ~2 700 coins. That is a counter, not an economy.

This pass **did not retune those numbers**. It fixed philosophy contradictions that were already bugs:

- Journey `weight_loss_kg` gates were absolute (1/5/10/20/50 kg). A −10 kg path could never finish the campaign. Gates now scale to the personal goal and are never harder than the original absolute.
- Next Best Action ignored `after_absence` (gap ≥ 7 days), so return copy lost to “log calories”.
- Day status `< 40 XP` was labelled «День выживания» (shame-adjacent).
- Legacy weight path still computed a 200 kg “death / game over”. Live Dashboard does not mount that card; the engine and leftover UI no longer treat high weight as a fail state.

**Verdict:** the product is one game with a crowded HUD. Keep the systems; enforce a reward hierarchy and progressive disclosure. Do not add endgame, shops, or gacha.

---

## Core loop

```text
REAL LIFE ACTION
        ↓
Today data (explicit save)
        ↓
daily completion (quests / recovery / minimal)
        ↓
XP · coins · cozy resources · momentum · abilities · season · journey
        ↓
world feedback (Home, hero, mob, boss presentation, NBA)
        ↓
long-term progression (Body Stage, Journey chapters, seasons)
        ↓
motivation to return tomorrow
```

**Canonical sentence:**

> Забота о теле → день получает смысл → герой и мир реагируют → остаётся заметный след → хочется вернуться завтра.

Runtime **does** support this. The failure mode is **cognitive overload after Save**: XP, coins, cozy chips, season, momentum, ability, boss can all fire as if they were the same layer.

**Supported hierarchy (design, not yet fully reflected in UI emphasis):**

| Layer | Job |
|-------|-----|
| Immediate | Today reaction: quests closed, one world line (Home warmth or DF obstacle), NBA |
| Short (2–7d) | Week reflection, momentum trend, recovery as valid |
| Medium (2–6w) | Home upgrades, personal abilities, current season arc |
| Long (months) | Body Stage, Journey chapters, campaign/boss archive |

Today must remain the **action screen**. Dashboard is NOW / NEXT / LONG. Week is weekly meaning. Reports/Insights are data. Codex is collection.

---

## System map

Each system: input → output → feedback → time scale → player decision → failure → recovery.

### Daily quests / Today

| | |
|--|--|
| INPUT | Logged day (nutrition, steps, alcohol, habits, rest, PA) |
| OUTPUT | Quest completion, XP, coin txs, cozy grant (once), season quest ticks |
| FEEDBACK | Today cards, save reaction, day status |
| TIME SCALE | 1 day |
| USER DECISION | What to do today; normal vs recovery vs minimal |
| FAILURE STATE | Empty/low day; not a moral failure |
| RECOVERY STATE | Recovery / minimal day; NBA after bad day |

### XP / levels

| | |
|--|--|
| INPUT | `calcDailyPoints` + weekly bonuses (+ optional momentum bonus XP) |
| OUTPUT | Total XP, level 1–100 |
| FEEDBACK | Level bar on Dashboard |
| TIME SCALE | Day → year (decorative late) |
| USER DECISION | None required — XP is a receipt |
| FAILURE STATE | Low XP day («Тихий день») |
| RECOVERY STATE | Next day still earns; no XP spend |

### Coins

| | |
|--|--|
| INPUT | Good/great/hero/iron days, week bonuses, recovery/minimal |
| OUTPUT | Balance for user-defined reward shop |
| FEEDBACK | Coin chip |
| TIME SCALE | Day / week |
| USER DECISION | Optional shop spend (if items exist) |
| FAILURE STATE | Balance only grows |
| RECOVERY STATE | Recovery still grants 1 coin — correct |

### Journey (9 chapters)

| | |
|--|--|
| INPUT | Tracking days, scaled kg lost, steps, abilities, recovery markers |
| OUTPUT | Sequential chapter status |
| FEEDBACK | `/journey` road, NBA when close |
| TIME SCALE | Months |
| USER DECISION | Live the chapter conditions — not a separate grind |
| FAILURE STATE | Small-goal users were hard-gated on 50 kg (**fixed this pass**) |
| RECOVERY STATE | Progress never resets |

**Weight gates (this pass):** personal goal G kg maps campaign 1/5/10/20/50 → `min(absolute, G, G×{0.10,0.25,0.50,0.80,1.00})`, first gate stays 1 kg if G ≥ 1.

### Seasons (28-day arcs, 13 / year)

| | |
|--|--|
| INPUT | Existing dailies as season quests |
| OUTPUT | Arc status, recap, season boss presentation |
| FEEDBACK | Dashboard campaign plate, `/seasons` |
| TIME SCALE | ~28 days, can extend if incomplete |
| USER DECISION | Same daily actions — no extra chores |
| FAILURE STATE | Incomplete season stays open (good) |
| RECOVERY STATE | Late completion does not steal the next window |

**One-line distinction:** Journey is the **life-path** (months–years). Season is the **current 28-day rhythm**. Overlap is real (P2) but the time scales differ.

### Boss campaign

| | |
|--|--|
| INPUT | Derived from season/journey/route — not a combat sim |
| OUTPUT | Named resistance pattern, archive |
| FEEDBACK | Cards, Codex |
| TIME SCALE | Season / chapter |
| USER DECISION | Keep the route; boss weakens from living |
| FAILURE STATE | None that punish the person |
| RECOVERY STATE | Boss is the obstacle, not the user |

Winning a boss means **the current resistance pattern lost intensity in the campaign layer**. It is not a second HP bar. Approach is visible via season quests / route-held days. After victory: archive + next season’s pattern. Keep as presentation of resistance, not a war with the self.

### Daily mob / obstacle

| | |
|--|--|
| INPUT | Today context (theme copy) |
| OUTPUT | Immediate friction flavour |
| FEEDBACK | Today / Codex |
| TIME SCALE | 1 day |
| USER DECISION | Notice today’s friction |
| FAILURE STATE | Looking like a second boss (must not) |
| RECOVERY STATE | New day, new obstacle |

Cozy: помеха дня. DF: mob. Same math. Rotation is content, not a dungeon.

### Momentum

| | |
|--|--|
| INPUT | Daily factors, gap decay toward 0 |
| OUTPUT | −100…100 + level |
| FEEDBACK | `/momentum` (opt-in), NBA when low |
| TIME SCALE | Rolling days |
| USER DECISION | Hold a base day |
| FAILURE STATE | Hidden ± soup |
| RECOVERY STATE | Gaps decay toward 0, not −100; low momentum does not cut XP (mult ≥ 1) |

**Unique question:** «Насколько устойчив мой текущий маршрут?»  
Not: how the hero feels (Hero State), not: how the body changed (Body Stage), not: how the week scored (Week).

### Hero State

| | |
|--|--|
| INPUT | Abilities, steps, nutrition, lifestyle, momentum, campaign (chrome only) |
| OUTPUT | depleted / steady / energized / strong |
| FEEDBACK | Dashboard / Freedom |
| TIME SCALE | Days |
| USER DECISION | None — presentation |
| FAILURE STATE | Mixed with Body Stage or Momentum |
| RECOVERY STATE | Can dip; Body Stage does not roll back |

**Unique question:** «Как герой сейчас ощущается?»

### Body Stage (20 gameplay / 5 visual anchors)

| | |
|--|--|
| INPUT | Weight 0.72 + waist 0.20 + other measurements 0.08 |
| OUTPUT | Stage 1–20, visual anchor 1/5/10/15/20 |
| FEEDBACK | Hero scene |
| TIME SCALE | Months, relative to personal start→target |
| USER DECISION | Measurements are factual; no habit-farming the silhouette |
| FAILURE STATE | Habits shrinking the body (**already forbidden**) |
| RECOVERY STATE | Best weight; spikes do not roll art back |

Relative model: −10 kg and −80 kg both walk 20 stages across **their** goal. Art anchors change every ~20% of personal goal (2 kg vs 16 kg). Gameplay stage still ticks at ~5%. Acceptable; large-goal first **art** swap is slower (P3), not five years.

### Body Abilities (personal map ~24)

| | |
|--|--|
| INPUT | Profile (goal band, interests, baselineEasy, hidden topics) + logs/measurements |
| OUTPUT | Locked / suggested / unlocked |
| FEEDBACK | `/growth/abilities`, Freedom |
| TIME SCALE | Weeks–months |
| USER DECISION | Confirm suggested freedoms; live auto-unlocks |
| FAILURE STATE | Beginner abilities for athletes; one-size 50 kg map |
| RECOVERY STATE | Unlocks never disappear because of a bad week |

**Achievement** = you did a significant **event**.  
**Ability** = you noticed a new **freedom of the body**.  
Keep both. Presentation must not call an ability a «победа-достижение».

### Cozy Home

| | |
|--|--|
| INPUT | Daily grant: Уют / Материалы / Сад / Ясность |
| OUTPUT | 8 zones × 3 upgrades = 24 |
| FEEDBACK | `/home`, dashboard card, save chip |
| TIME SCALE | **Intended months; actual weeks** (see simulation) |
| USER DECISION | Spend when ready — should feel like care, not min-max |
| FAILURE STATE | Player farms «Сад» instead of living |
| RECOVERY STATE | Recovery still grants comfort |

### Achievements

| | |
|--|--|
| INPUT | Milestones (absolute kg, streaks, XP, recovery, …) |
| OUTPUT | Codex/growth badges |
| FEEDBACK | Unlock toast / list |
| TIME SCALE | Event-based |
| USER DECISION | None required |
| FAILURE STATE | −10 kg user never sees −50 legendary — **OK** (absolute chronicle) |
| RECOVERY STATE | Already earned stay earned |

Absolute weight achievements are a **museum of events**, not the personal campaign. Journey is now personal; achievements stay global on purpose.

### Recovery / Minimal Day

| | |
|--|--|
| INPUT | `dayMode`, resource, NBA |
| OUTPUT | Softer quests, coins, cozy comfort, Journey recovery ticks |
| FEEDBACK | Recovery card |
| TIME SCALE | 1 day |
| USER DECISION | Choose to hold the route |
| FAILURE STATE | Math so much worse that players avoid recovery (**watch XP**, but coins/home still land) |
| RECOVERY STATE | This **is** the recovery state |

### Measurements / weight

Factual signal. Body Stage may use them. Do not grant aggressive XP for a smaller waist. Weight wording: higher weight is not a worse person. Death-limit copy removed this pass.

### Companion

Presentation / warmth. **No pet XP.** KEEP. Do not add companion leveling.

### Freedom

Composite of load removed, abilities, route — identity of “body freedom”, not a fourth score competing with Momentum. KEEP as destination page.

### Streaks

`calcStreaks` exists; Dashboard QuickStats can show a strict streak. **Painful reset conflicts with anti-all-or-nothing.** Do not add a new streak system. Treat strict streak as optional metadata; consistency record already lives in Momentum / Week. SIMPLIFY later (hide from NOW).

---

## Progression inventory

| System | What progresses | Input | Reward | Cadence | Visible where | Why care |
|--------|-----------------|-------|--------|---------|---------------|----------|
| Character Level | 1–100 | XP | Identity / receipt | Continuous | Dashboard | Short proof the day counted |
| XP | Points | Quests, week bonuses | Level | Day / week | Today, Dashboard | Immediate receipt |
| Coins | Balance | Good days, weeks, recovery | Shop (optional) | Day / week | Dashboard | Optional treat — weak if no sink |
| Journey chapters | 9 sequential | Mixed conditions | Story of the path | Months | `/journey` | Long meaning |
| Boss progress | Season/chapter pattern | Derived actions | Archive, theme | Season | Dashboard, Codex | Name the resistance |
| Daily mob | Day flavour | Today context | Copy/art | Daily | Today, Codex | Immediate friction |
| Seasons | 13 arcs / year | Daily quests | Recap, art | ~28d | Dashboard, `/seasons` | Current rhythm |
| Momentum | −100…100 | Daily factors | Bonus XP if high; NBA if low | Rolling | Opt-in `/momentum` | Route stability |
| Cozy resources | 4 piles | Daily grant | Upgrades | Daily | Home | World reacts to care |
| Cozy upgrades | 0–24 | Spend resources | House restoration | Weeks (too fast) | `/home` | Visible home |
| Body Ability map | ~24 personal | Profile + life | Noticed freedoms | Weeks–months | Growth, Freedom | Body, not spreadsheet |
| Body Stage | 1–20 | Measurements | Silhouette | Months | Hero | Physical change |
| Hero State | 4 levels | Habits + momentum | Chrome | Days | Hero | How the hero feels |
| Weight milestones | Absolute kg | Measurements | Achievements | Events | Growth | Chronicle, not campaign |
| Measurements | cm / kg | User log | Body Stage, abilities | Weekly-ish | `/measurements` | Facts |
| Achievements | Badge set | Many engines | Collection | Events | Growth | “I did that” |
| Streaks | Count | Consecutive logs | QuickStat | Daily | Dashboard | Dangerous if strict |
| Freedom | Composite | Abilities + load | Identity page | Medium | `/freedom` | Why the path matters |
| Companion | None | Choice | Presence | Onboarding / settings | Scene | Warmth |
| Skill map | 6 skills | Built-in habits | Opt-in chart | Slow | `/map` hidden | Overlaps abilities |
| Hero Growth | Hub tabs | Many | Navigation | — | `/growth` hidden | Container, not a system |

---

## Duplicate systems (classification)

Question: **«Насколько хорошо я сейчас иду?»**

| System | Class | Role |
|--------|-------|------|
| Momentum | **core** | Stability of the route |
| Hero State | **core** (presentation) | How the hero feels today |
| Day status | **support** | Today XP band |
| Week status | **core** (weekly) | How the week felt |
| Streak | **optional** | Consecutive days — hide from NOW |
| Season progress | **core** (medium) | This arc |
| Freedom score | **support** | Body-freedom identity |

Other overlaps:

| Pair | Class | Note |
|------|-------|------|
| XP vs Journey | core + core | XP = receipt; Journey = story. Keep both; don’t show both as “the” progress bar. |
| Journey vs Seasons | core + core | Life-path vs 28-day rhythm. P2 overlap in copy. |
| Body Abilities vs Achievements | core + support | Freedom vs event. |
| Body Stage vs weight achievements | core + support | Relative body vs absolute chronicle. |
| Coins vs Cozy resources | support + core (Cozy) | Coins = shop; cozy = home. |
| Hero Growth / Skill map vs Abilities | optional | Hidden; MERGE LATER / DEFER. |
| Codex vs achievements | support | Codex = collection/reference. |
| Week vs Reports vs Insights | core / support / support | Week = reflection; Reports = summary; Insights = research. |

---

## Reward hierarchy

### Immediate (today)

One felt thing after Save: quests closed **or** Home warmth **or** DF obstacle line. XP/coins are receipts, not the scene.

### Short (2–7 days)

Week card, momentum direction, recovery as a held route.

### Medium (2–6 weeks)

Home (intended), personal abilities, season arc.

### Long (months)

Body Stage, Journey, campaign archive.

**Today should not present 7 co-equal rewards.** Current save reaction can still stack cozy + XP + quests. SIMPLIFY later (UI emphasis), not this pass.

---

## Daily reward budget (good normal day)

Approximate **balanced** fixture (nutrition ok, ~12k steps, no alcohol, journal, sleep/breaks):

| Channel | Typical |
|---------|---------|
| XP | ~150–200 + weekly when the week closes |
| Coins | 1–4 (good/great + hero/iron) |
| Cozy | ~3–4 comfort, ~2–3 materials, ~2–3 garden, ~3–5 clarity |
| Quests | several closed |
| Momentum | small positive |
| Season | 0–1 quest tick |
| Ability | rarely an unlock |
| Boss | derived, not a payout |
| Achievements | rare |

**Assessment:** not stingy. **Too many simultaneous channels** (inflation of *attention*, not only numbers). Recovery/minimal still grant comfort + coins — aligned with philosophy.

---

## XP audit

**Sources:** nutrition, steps, alcohol, habits, resource/rest bonuses, weekly bonuses; optional momentum **bonus** (multiplier ≥ 1, never a penalty).

**Level thresholds:** 0, 500, 1200, 2200, 3500, then `prev + l×500`, cap loop at 100.

Simulation (`95 → 75`, synthetic; XP without requiring the momentum bonus for the headline):

| Profile | 28d XP / lvl | 90d | 365d |
|---------|--------------|-----|------|
| casual | 2120 / L3 | 6890 / L6 | 27715 / L11 |
| balanced | 4560 / L5 | 14820 / L8 | 59495 / L16 |
| active | 7000 / L6 | 22455 / L10 | 91270 / L19 |
| recovery_heavy | 3780 / L5 | 12285 / L7 | 49355 / L14 |
| inconsistent | 1310 / L3 | 4585 / L5 | 17185 / L9 |

Early levels are meaningful (L2–L5 in weeks). Late levels are decorative. No XP spend. “Farm” is just logging more habits — acceptable for this product. **Do not retune.**

---

## Coin economy

**Why they exist:** optional reward-shop currency (user-defined sinks).

**Sources:** good/great days, hero/iron, week bonuses, recovery/minimal, excellent steps.

**Sinks:** shop items if the user created them. Default: **almost none**.

Simulation coins after 365d: casual 887 · balanced 1824 · active **2763** · recovery 1512 · inconsistent 523.

**Diagnosis:** not an economy — a counter. Classification: **meta-score / optional currency**. Can stay visible but should not sit in Today’s NOW. Future sinks are a later decision. **No shop added this pass.**

---

## Cozy resource economy

**Upgrade cost totals (24 upgrades):** Comfort 50 · Materials 46 · Garden 23 · Clarity 14.

**Bottleneck:** Materials, then Comfort. **Dead/excess:** Clarity (income ≫ cost).

Simulation Home % (auto-spend when affordable — intended player):

| Profile | 28d | 90d | 365d |
|---------|-----|-----|------|
| casual | 71% (17/24) | 100% | 100% |
| balanced | **100%** | 100% | 100% |
| active | **100%** | 100% | 100% |
| recovery_heavy | 83% | 100% | 100% |
| inconsistent | 54% | 92% | 100% |

**Home completion time:** ~2–4 weeks for balanced/active spenders; ~6–8 weeks casual; inconsistent still finishes inside a year.

Spec: 2 weeks is too fast for a long-term world. **Do not change costs in this pass** (needs dedicated before/after sim). Flagged **P1 pacing / P3 polish**.

Home must remain **world manifestation of care**, not a gathering sim. If costs rise later, keep grants tied to real care, not to optimizing Сад.

---

## Journey pacing

9 sequential chapters. Open when **all** conditions of the previous chapter complete.

Weight gates are now **personal**. Other gates stay absolute (steps 500k/1M, gym 50, abilities 5/10/20, 30 sober days).

Simulation Journey completed / 9 (20 kg personal goal in the fixture):

| Profile | 28d | 90d | 365d |
|---------|-----|-----|------|
| casual | 2 | 3 | 3 |
| balanced | 3 | 5 | 7 |
| active | 4 | 5 | 8 |
| recovery_heavy | 3 | 5 | 7 |
| inconsistent | 2 | 3 | 3 |

Not “a chapter every 3 days”. Not “half a year for chapter 1”. Chapter 1 is first data. Casual can stall on **chapter 4** (requires a recovery/minimal day) if they never mark recovery — philosophically good, worth a clearer NBA hint (P3).

Active year still misses chapter 9 if the last kg of a 20 kg goal is not in the synthetic curve — Journey remains a **long** campaign.

---

## Seasons pacing

28-day arcs, 13 per year, quests from existing dailies, window can extend.

Simulation `seasonIndex` (active season number in snapshot): casual year → 6 (slow, incomplete arcs stretch); active year → 13 (quests complete, calendar walk).

**Why Season exists beside Journey:** Season is the **current 28-day rhythm**; Journey is the **life-path**. If copy starts saying both are “your campaign chapter”, merge later.

---

## Boss / daily mob

Boss = named pattern of resistance, derived from the season/chapter. Not combat. Winning = the pattern lost intensity; the person is not the enemy.

Daily mob = **immediate friction**, not a second boss. Theme copy only (Cozy obstacle / DF mob). KEEP both as presentation layers.

---

## Momentum vs Hero State vs Body Stage

| | Answers |
|--|---------|
| Momentum | How stable is the path? |
| Hero State | How does the hero feel now? |
| Body Stage | How has the body physically changed? |

Do not mix. Low momentum does not shrink the body. Hero State may dip. Body Stage uses measurements only.

14-day gap: momentum decays **toward 0**, not −100. One bad day after a good week stays above −50 in invariant tests.

Inconsistent year can sit at **−70** — harsh but not a wall of overdue quests. NBA after absence now offers a small return step (**fixed**).

---

## Body Abilities vs achievements vs weight milestones

Personal map ~24 from a large bank. `baselineEasy` drops beginner mobility for athletes (Profile A covered by tests). Hidden topics respected.

Unlock pacing in the **legacy** ability list (Journey still counts this list): 28d ~7–14, 90d ~11–21, 365d ~15–25. Personal map is a subset; many remain locked/suggested by design. Suggested-confirmation abilities may never confirm — correct.

Achievements for 15/20/30/50 kg stay **absolute**. A −10 kg user will not earn legendary −50. That is a chronicle, not a blocked campaign.

---

## Recovery / Minimal Day / return loop

Recovery is valid progress: Journey requires recovery markers; coins and cozy comfort still land; long-term progress does not reset.

Minimal Day = «I held the route», not 20% pity XP. It is a smaller day by construction (fewer stacked habits) but not a punishment loop.

**Return after 14 days:** RecoveryCard already had «Снова в игре». NBA now matches (`return_after_absence`) instead of jumping to calories. No overdue-quest wall. No mocking boss copy in engines reviewed.

---

## Failure states (model)

| Scenario | What they see |
|----------|----------------|
| 1 bad day | Quiet/low day status; recovery NBA; momentum dips, not erased |
| 3 bad days | Recovery available; Home/Journey intact |
| 1 bad week | Week = «Слабая неделя» (factual); streak may reset (P2) |
| 14 days away | Momentum toward 0; NBA small step; no −100; no 15 overdue quests |
| 1 month away | Same return ritual; seasons may still be the open arc |

---

## Week / Analytics / Reports / Dashboard / Today / Codex

| Screen | Job |
|--------|-----|
| Today | Action. Minimize meta gauges before Save. |
| Dashboard | NOW (today + NBA) / NEXT (week, season) / LONG (Journey, Body Stage). Already a bit crowded. No redesign this pass. |
| Week | «How was my week?» — not Analytics lite. |
| Reports | Summary export/story. |
| Insights | Data exploration. |
| Codex | Knowledge / collection / reference — not another progress page. |
| Freedom | Body-freedom destination. |

---

## Optional screens

| Screen | Verdict |
|--------|---------|
| Momentum | **KEEP** (role is unique) — stay opt-in |
| Skill Map | **MERGE LATER** with abilities/growth |
| Hero Growth | **KEEP** as hub; not a separate progression |
| Chronicle / Seasons | **KEEP** as season UI (opt-in sidebar) |
| WeightHero (legacy) | **REMOVE CANDIDATE** (unused; death copy stripped) |

---

## Personalization (archetypes A–D)

Fixtures: `src/fixtures/bodyAbilityProfiles.ts`.

| | Goal | Body Abilities | Journey weight | Body Stage |
|--|------|----------------|----------------|------------|
| A 180→100 athletic | 80 kg | beginner mobility excluded | gates stay 1/5/10/20/50 | relative; first art ~16 kg |
| B 65→55 | 10 kg | appearance/tone map; no daily-life beginner dump | 1 / 2.5 / 5 / 8 / **10** — campaign completable | relative; first art ~2 kg |
| C 130→80 low mobility | 50 kg | mobility/stairs stay | 1/5/10/20/50 | relative |
| D 95→75 comeback | 20 kg | athlete-return interests | 1/5/10/16/20 | relative |

**Gender:** rewards identical. Avatar/body art may differ. **Theme:** same math (invariant test). No medical claims in ability copy (existing tone rules).

Exercise baseline: `baselineEasy` covers abilities. Journey/XP/Home are habit-based, not “you’re a beginner because your goal is large.” Weight achievements remain absolute (chronicle bias toward large goals — acceptable).

---

## Simulation (28 / 90 / 365)

Fixture: start 95 kg, target 75 kg, auto-spend Home, synthetic weight = profile × year-fraction × day/364. Not medical.

| Profile | 28d lvl · Home% · abl · season · Journey · coins | 90d | 365d |
|---------|---------------------------------------------------|-----|------|
| casual | L3 · 71% · 8 · S1 · 2/9 · 68 | L6 · 100% · 11 · S4 · 3/9 · 221 | L11 · 100% · 15 · S6 · 3/9 · 887 |
| balanced | L5 · 100% · 11 · S2 · 3/9 · 140 | L8 · 100% · 18 · S4 · 5/9 · 455 | L16 · 100% · 24 · S13 · 7/9 · 1824 |
| active | L6 · 100% · 14 · S2 · 4/9 · 212 | L10 · 100% · 21 · S4 · 5/9 · 679 | L19 · 100% · 25 · S13 · 8/9 · **2763** |
| recovery_heavy | L5 · 83% · 14 · S2 · 3/9 · 116 | L7 · 100% · 19 · S4 · 5/9 · 377 | L14 · 100% · 24 · S13 · 7/9 · 1512 |
| inconsistent | L3 · 54% · 7 · S1 · 2/9 · 40 | L5 · 92% · 11 · S3 · 3/9 · 140 | L9 · 100% · 15 · S6 · 3/9 · 523 |

**Runaway:** coins (active year 2763, no sink); Home % (balanced/active **done in 28 days**). XP large but levels stay < 20 in a year — OK. Journey does not complete in a year for a 20 kg path — OK.

---

## Diminishing novelty / content exhaustion

First 7 days: onboarding, first Journey chapter, first Home chips, first mob, first season.

After ~1–2 months: Home likely **finished** for active users → world stops changing. Ability map still has locked/suggested. Journey still long. Seasons rotate.

**After Home 24/24 + Journey 9/9 + seasons:** no endgame. **P4 / later roadmap.** Do not invent infinite content now. Gap: **Home has no post-max ritual**.

---

## Cognitive load / onboarding / progressive disclosure

**Glossary (~22 terms a new user could hit):** XP, coins, Journey, boss, mob/obstacle, Momentum, Freedom, abilities, Body Stage, Hero State, season, Home resources (×4), quests, recovery, minimal day, achievements, streaks, companion, Codex, Week, reports.

**Do not teach in the first 5 minutes:** Momentum, Freedom math, skill map, season index, four Home resources as a table, Body Stage 1–20, coin shop.

**Day 1:** Today, theme, goal, companion, “save the day → something answers”.

| When | Accent |
|------|--------|
| Day 1 | Today + one world reaction |
| Week 1 | Week, recovery is allowed, first Journey chapter |
| Month 1 | Home, abilities, season, Body Stage if measurements exist |
| Later | Momentum, Codex completion, Growth hub, reports |

Onboarding v1 already matches this (idea → hero → world → body goal → rhythm). Do not expand it.

---

## Reward copy / negative copy / recovery philosophy

- Not every event is «Победа» / «Награда» / «Достижение».
- Factual bad days OK; no shame identity.
- **Fixed:** «День выживания» → «Тихий день».
- **Fixed:** death/game-over at 200 kg.
- Consistency > perfection. Formulas that punish recovery = High. Recovery grants and Journey recovery ticks **agree**. Strict streak on Dashboard is the remaining tension (P2).

---

## Game economy invariants

1. Recovery day never resets long-term progress.
2. One bad day cannot erase a week.
3. Body visual progress never comes from habits alone.
4. Theme never changes reward mathematics.
5. Re-saving the same day cannot duplicate cozy grants.
6. Long-term unlocks never disappear because of a temporary setback.
7. Small-goal Journey weight gates complete at 100% of personal goal.
8. Large-goal Journey weight gates are never harder than campaign absolutes.
9. Athletic `baselineEasy` excludes beginner mobility abilities.
10. After absence, NBA offers a next small step.

Tests: `src/utils/gameDesignInvariants.test.ts`, `src/utils/gameDesignSimulation.test.ts`, `src/utils/journeyWeightGates.test.ts`.

---

## Problems found

### P0 — philosophy

| ID | Issue | Status |
|----|-------|--------|
| P0-1 | Journey absolute 50 kg blocked small-goal campaign | **Fixed** — personal scale |
| P0-2 | NBA ignored `after_absence` | **Fixed** |
| P0-3 | «День выживания» shame-adjacent | **Fixed** → «Тихий день» |
| P0-4 | Legacy 200 kg death / game over | **Fixed** in engine + leftover WeightHero |

### P1 — progression / economy

| ID | Issue | Status |
|----|-------|--------|
| P1-1 | Cozy Home completes in ~2–4 weeks | **Unchanged numbers** — retune later with sim |
| P1-2 | Coins have no required sink (year ~900–2700) | **Unchanged** — not a shop pass |
| P1-3 | Clarity income ≫ cost (dead/excess resource) | Documented |

### P2 — confusing overlap

| ID | Issue |
|----|-------|
| P2-1 | Momentum / Hero State / day status / streak / season all answer “how am I doing?” — hierarchy exists in design, not in HUD |
| P2-2 | Journey vs Seasons copy overlap |
| P2-3 | Strict streak vs anti-all-or-nothing |
| P2-4 | Dashboard shows too many layers as NOW |
| P2-5 | Skill map / Hero Growth / Abilities |

### P3 — balance / polish

| ID | Issue |
|----|-------|
| P3-1 | Large-goal first **art** anchor is ~20% of goal (16 kg on −80) |
| P3-2 | Casual can stall Journey ch.4 without a recovery mark |
| P3-3 | Save reaction can stack too many receipts |
| P3-4 | WeightHero unused leftover |

### P4 — future / endgame

| ID | Issue |
|----|-------|
| P4-1 | After Home max + Journey 9: no ritual |
| P4-2 | Optional coin sinks |
| P4-3 | Home cost retune for 3–6 month world |
| P4-4 | Progressive disclosure of terms (UI, not locks) |

---

## Changes actually made

- Personal Journey `weight_loss_kg` scaling + titles when the target differs (`journeyWeightGates.ts`, `journeyMapEngine.ts`).
- NBA `return_after_absence`.
- Day status «Тихий день».
- Weight journey: `isGameOver` always false; no death countdown; WeightHero death UI removed; gain-delta no longer uses danger color as “worse person”.
- Dev simulator + invariant / simulation tests.
- Docs: this audit, `docs/design/progression-principles.md`, wiki 03/07/08/14.

## Systems intentionally unchanged

XP tables, coin amounts, cozy grant rates, Home upgrade costs, season length, Body Stage weights, achievement kg list, skill map, companions, boss/mob combat (none), gacha/login/energy.

---

## KEEP / SIMPLIFY / MERGE LATER / DEFER / REMOVE CANDIDATE

| System | Verdict |
|--------|---------|
| Today | KEEP (action) |
| Dashboard | SIMPLIFY later (NOW/NEXT/LONG emphasis) |
| Week | KEEP |
| Reports / Insights | KEEP distinct |
| Codex | KEEP (collection) |
| Journey | KEEP (now personal weight) |
| Seasons | KEEP (28-day rhythm) |
| Boss campaign | KEEP (derived, not combat) |
| Daily mob | KEEP (immediate friction) |
| XP / levels | KEEP (receipt) |
| Coins | SIMPLIFY later (hide from NOW if no sink) |
| Cozy Home | KEEP role; **DEFER** cost retune |
| Cozy resources | KEEP; clarity is excess |
| Momentum | KEEP unique role; opt-in |
| Hero State | KEEP presentation |
| Body Stage | KEEP relative physical |
| Body Abilities | KEEP personal map |
| Achievements | KEEP absolute chronicle |
| Recovery / Minimal | KEEP |
| Freedom | KEEP destination |
| Companion | KEEP presentation |
| Streaks | SIMPLIFY later (don’t lead) |
| Skill Map | MERGE LATER |
| Hero Growth hub | KEEP container |
| WeightHero legacy | REMOVE CANDIDATE |
| Endgame / shop / gacha | DEFER / never gacha |

---

## Tests

- `gameDesignInvariants.test.ts` — recovery, theme math, no duplicate grant, small/large goal Journey, athletic baseline, one bad day, habits-only Body Stage, NBA after absence, quiet-day copy, no game-over.
- `gameDesignSimulation.test.ts` — deterministic 28/90/365 ranges.
- `journeyWeightGates.test.ts` — 10 kg vs 80 kg mapping.

## npm run verify

See pass output in the implementation report.

---

## Do not turn into mobile gacha

No daily login ladders, loot boxes, energy, premium currency, random rarity, FOMO timers, punishing streak as core. This audit does not add any of those.
