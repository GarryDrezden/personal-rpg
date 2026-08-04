# Avatar Stage QA Checklist

Use this checklist for every set of **20 stages** per theme × gender before setting manifest status to `approved`.

Related:
- Avatar Assets Pipeline v1 · Body Stage vs Hero State
- **Character Bible v1:** [`characters/avatar-art-direction.md`](characters/avatar-art-direction.md), [`characters/cozy-hero-male-bible.md`](characters/cozy-hero-male-bible.md), [`characters/cozy-hero-female-bible.md`](characters/cozy-hero-female-bible.md)
- Prompts: `art-source/avatar-generation/prompts/`

## Identity

- [ ] One person across stages 01–20
- [ ] Face identity stable (eyes / nose / lips / head shape)
- [ ] Age stable (no ±10–15 year jumps)
- [ ] Hair / beard stable
- [ ] Tattoos / watch / signature details preserved
- [ ] Height and limb lengths stable
- [ ] Shoulder frame stable (fat loss ≠ becoming a different build type)

## Composition

- [ ] Single canvas (recommended **1536×2048**)
- [ ] Transparent background (RGBA WebP)
- [ ] Same scale / FOV / camera distance
- [ ] Feet on shared baseline
- [ ] Crown height stable
- [ ] Full body in frame (no crop of head / hands / feet)
- [ ] Enough transparent padding at edges
- [ ] Silhouette readable at small UI size
- [ ] Hands do not cover belly / waist

## Body progression

- [ ] No sudden jumps between neighbours
- [ ] Stages 1–5 still heavy / early change only
- [ ] Mid stages (9–12) still realistic — belly reduced, not gone
- [ ] Final (17–20) healthier lighter version of the **same** person
- [ ] Final is **not** bodybuilder / fashion model by default
- [ ] Fat mass changes gradually; muscle mass not reinvented

## Clothing

- [ ] Same outfit across stages
- [ ] Fit changes naturally with body
- [ ] Outfit does not hide waist/belly progression
- [ ] Theme-correct: Cozy everyday vs Dark Fantasy readable silhouette (no full plate)

## Technical

- [ ] `.webp` only in runtime folder
- [ ] Names: `stage-01.webp` … `stage-20.webp`
- [ ] Alpha clean (no white fringe)
- [ ] No text / logos / watermarks
- [ ] No extra props that change per stage
- [ ] Manifest entry `status: approved` only after this checklist
- [ ] `npm run validate:avatars` passes

## Hero State (not body art)

- [ ] Hero State uses overlay / chrome, not a second body sheet
- [ ] Switching depleted → strong does not change body asset path
- [ ] State has a text label (not color-only)

## Theme isolation

- [ ] Cozy set never falls back to Dark Fantasy art
- [ ] Dark Fantasy set never falls back to Cozy art
- [ ] No male ↔ female fallback

## Future (optional note)

- [ ] If goal bands diverge visually later, use `avatarTrackId` (`small_goal` …) — do not fork stage IDs per theme
