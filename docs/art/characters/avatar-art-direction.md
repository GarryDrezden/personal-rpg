# Avatar Art Direction v1

**Status:** Character Bible v1 + **20 Body Stages / 5 Avatar Visual Anchors** (production).  
**Scope:** Cozy Hero Male + Cozy Hero Female as the visual identity base for all themes.  
**Related:**
- [`cozy-hero-male-bible.md`](cozy-hero-male-bible.md)
- [`cozy-hero-female-bible.md`](cozy-hero-female-bible.md)
- [`avatar-stage-qa-checklist.md`](../avatar-stage-qa-checklist.md)
- Prompts: `art-source/avatar-generation/prompts/`
- Runtime: `themes/{cozy|dark-fantasy}/avatars/{male|female}/stage-{01,05,10,15,20}.webp`
- Mapping: `getAvatarVisualStage` / `AVATAR_VISUAL_STAGES`

---

## 1. Purpose

This document is the **shared art canon** for hero body assets.

Goals:

1. One man across all visual anchors and themes.
2. One woman across all visual anchors and themes.
3. No face / age / height / outfit / proportion drift.
4. Gradual, realistic body change between the **five** production images.
5. Male and female feel like one game.
6. Cozy stays adult, warm, non-cartoon.

**Production decision (2026-08):** do **not** ship 20 near-identical AI frames.  
Body Stage stays 1–20 for progress/UI; art uses five anchors for identity stability.

---

## 2. Visual style (shared)

| Axis | Direction |
|------|-----------|
| Style | Semi-realistic game character; painterly realism |
| Tone | Adult premium idle / narrative RPG |
| Silhouette | Clean, readable at small UI size |
| Body | Clear, honest proportions |
| Avoid | Hyperreal photo, anime, cartoon, glossy fashion illustration, plastic skin |

**Cozy mood:** warmth, calm, home life, village house, repair, garden, recovery, natural materials, soft summer daylight. Heroes look like **real adults**, not fitness models.

---

## 3. Technical standard (shared canvas)

| Spec | Value |
|------|--------|
| Canvas | **1536 × 2048** px (portrait) |
| Background | Transparent (RGBA) |
| Runtime | WebP |
| Source | PNG / PSD allowed in `art-source/` (not served) |
| Scale | Identical FOV / camera height / perspective across stages |
| Framing | Full body; feet on one baseline; crown height locked |
| Hands | Arms relaxed at sides; **do not** cover belly, waist, or hips |
| Pose | Standing; slight 3/4 or near-front; no sit / lean / props |
| Light | Soft warm daylight; same key direction; no hard coloured rim; no body glow |
| Props | No furniture, weapons, backgrounds, text, logos, watermarks |

Same canvas and composition for male and female sets so they share one UI slot language.

---

## 4. Body Stage vs Avatar Visual Stage vs Hero State

| Layer | What it is | Asset |
|-------|------------|-------|
| **Body Stage** (1–20) | Engine + UI progression | Not 20 files |
| **Avatar Visual Stage** (1/5/10/15/20) | Production art key via `getAvatarVisualStage` | `stage-XX.webp` anchors |
| **Hero State** | depleted / steady / energized / strong | UI overlay / chrome only |

**v1 rule:** Hero State must **not** require a new body sheet.  
Body→Visual mapping is canonical — not “nearest missing stage” fallback.

| Body | Visual |
|------|--------|
| 1–4 | 01 |
| 5–8 | 05 |
| 9–12 | 10 |
| 13–16 | 15 |
| 17–20 | 20 |

UI continues to show «Стадия тела: N из 20».

---

## 5. Cross-theme identity

Themes (Cozy → Dark Fantasy → Slavic / Forest Myth → Athlete Return) reuse **the same people**.

| May change | Must not change |
|------------|-----------------|
| Outfit / costume | Face identity |
| Presentation / lighting flavour | Height, age, limb lengths |
| Theme accents / materials | Gender, bone frame |
| Props that do not hide body silhouette | Body Stage meaning (stage N = same progress) |

**Example:** Cozy Male Stage 10 and Dark Fantasy Male Stage 10 must read as the **same man** in different clothes/lighting.

Do not mix Cozy and Dark Fantasy into one base sheet. Generate Cozy identity first; theme variants are re-dresses of approved bases.

---

## 6. Generation order (production = five anchors)

Generate and approve only:

1 → 5 → 10 → 15 → 20

for each gender (Cozy first, then theme variants).

Do **not** generate intermediate body files (02–04, 06–09, …) for production.

Workflow:

1. Approve **base identity** (male + female).
2. Generate the five visual anchors with locked reference.
3. Pair QA (see §7).
4. Ship via manifest `approved` + `npm run validate:avatars`.

Future denser anchors: extend `AVATAR_VISUAL_STAGES` — do not revive a 20-file AI grid by default.

---

## 7. Pair QA — male + female as one game

Both heroes must share:

- same realism level;
- same light quality;
- same canvas and composition rules;
- same stylization strength;
- same body-change logic (gradual fat loss, not muscle redesign).

They must **not**:

- be gender-swapped copies of one face;
- share the same outfit;
- share the same body-type story (male = heavy bone frame athlete past; female = soft adult feminine figure).

---

## 8. Hard don’ts (project-wide)

- Do not generate 20 near-identical AI frames for production.
- Do not randomize faces between anchors.
- Do not turn the man into a bodybuilder.
- Do not turn the woman into a fashion model or sexualized figure.
- Do not hide the body behind oversized coats.
- Do not change outfit between stages within a theme set.
- Do not make Stage 5 already lean.
- Do not make Stage 20 extreme cut / six-pack / runway thin.
- Do not copy a real private person without licensed reference.
- Do not use Dark Fantasy chrome on Cozy base sheets.

---

## 9. Prompt pack

| File | Role |
|------|------|
| `art-source/avatar-generation/prompts/cozy-male-base.txt` | Lock male identity |
| `art-source/avatar-generation/prompts/cozy-female-base.txt` | Lock female identity |
| `art-source/avatar-generation/prompts/cozy-male-stage-template.txt` | Stage 1/5/10/15/20 male |
| `art-source/avatar-generation/prompts/cozy-female-stage-template.txt` | Stage 1/5/10/15/20 female |
| `art-source/avatar-generation/prompts/negative-prompt.txt` | Shared negatives |

Always attach the approved base reference when generating stages.

---

## 10. Runtime paths (when art ships)

```
art-source/avatar-generation/cozy/{male|female}/   # WIP source
public/game-assets/themes/cozy/avatars/{male|female}/stage-01.webp … stage-20.webp
```

Manifest + `npm run validate:avatars` + [`avatar-stage-qa-checklist.md`](../avatar-stage-qa-checklist.md) before `approved`.
