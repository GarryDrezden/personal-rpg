# Avatar Stage QA Checklist

Use this checklist for every theme × gender **visual anchor set** before `approved`.

Production art = **5 Avatar Visual Anchors** (`01 / 05 / 10 / 15 / 20`).  
Body Stage remains **1–20** in the engine/UI — do not QA 20 separate production files unless anchors are deliberately densified later.

Related:
- Avatar Assets Pipeline v1 · Body Stage vs Hero State · **20 Body / 5 Visual**
- **Character Bible v1:** [`characters/avatar-art-direction.md`](characters/avatar-art-direction.md)
- Prompts: `art-source/avatar-generation/prompts/`

## Identity (across the five anchors)

- [ ] One person across visual 01 → 05 → 10 → 15 → 20
- [ ] Face identity stable
- [ ] Age stable
- [ ] Hair / beard / signature details stable
- [ ] Height and limb lengths stable
- [ ] Shoulder frame stable (fat loss ≠ different build type)

## Composition

- [ ] Canvas **1536×2048**, transparent WebP
- [ ] Same scale / FOV / camera / baseline / crown
- [ ] Full body in frame; hands do not cover belly/waist
- [ ] Silhouette readable at small UI size

## Visual progression (anchors only)

- [ ] 01 still heavy / early path
- [ ] 05 early change only
- [ ] 10 clear mid path
- [ ] 15 clearly lighter, powerful frame remains
- [ ] 20 healthy same person — not bodybuilder / fashion model
- [ ] Steps between anchors are readable but not cartoon jumps

## Mapping / runtime

- [ ] `getAvatarVisualStage` used (no ad-hoc nearest in UI)
- [ ] Body 7 → visual 05 is **not** marked as missing/fallback when 05 is approved
- [ ] UI still shows «Стадия тела: N из 20»
- [ ] Theme switch keeps Body Stage; swaps theme folder only
- [ ] No Cozy↔DF fallback

## Clothing

- [ ] Same outfit across the five anchors (fit changes OK)
- [ ] Theme-correct silhouette

## Technical

- [ ] Only `stage-01/05/10/15/20.webp` in runtime folder
- [ ] `npm run validate:avatars` passes (5 anchors)
- [ ] Manifest `approved` only after this checklist
- [ ] Alpha clean; no text/logos

## Hero State

- [ ] Overlay / chrome only — does not change body path
