# Cozy Hero Female — Character Bible v1

**Working name:** Cozy Hero Female Base  
**Theme set:** Cozy (identity source for all future themes)  
**Status:** Canon locked — final stage art **not** generated yet  
**Parent:** [`avatar-art-direction.md`](avatar-art-direction.md)  
**Prompts:** `art-source/avatar-generation/prompts/cozy-female-*.txt`

---

## Character summary

Adult woman, **32–38**, height **~168–178 cm** (average to slightly tall). Stage 1 shows **honest adult fullness** — hips, belly, soft arms, rounded face — not a glossy plus-size fashion pose and not a cruel caricature.

Personality: calm, intelligent, warm, independent; slightly tired early; gradually more collected and confident. Never “weight-loss ad girl.”

She must remain **the same woman** on every Body Stage and across future themes (outfit/lighting may change; identity must not).

She shares the **same game art language** as Cozy Hero Male (realism, light, canvas, gradual progression) but is **not** a gender-swapped copy of his face.

---

## Facial identity

| Trait | Canon |
|-------|--------|
| Features | Soft, adult, natural |
| Eyes | Expressive; calm, slightly tired early |
| Brows | Natural |
| Expression | Quiet, grounded; not smiling-for-camera |
| Makeup | Minimal / none — no glam |
| Age | Locked 32–38; no de-aging across stages |
| Face ID | Same bone structure and features every stage |

---

## Hair (immutable style)

| Trait | Canon |
|-------|--------|
| Color | Chestnut / dark blond |
| Length | Medium |
| Style | Low ponytail **or** neat low bun — **pick one and lock it** for the whole set |
| Flyaways | A few natural strands OK |
| Change across stages | **None** (color, cut, style locked) |

**Canon choice for v1 generation:** low neat bun with a few soft strands (reads clearly at UI size; less silhouette drift than a long free ponytail).

---

## Body identity

### Immutable

- Height
- Head size
- Limb lengths
- Face shape / eye color
- Hair style
- Age
- Feminine adult structure (hips and chest remain naturally present)

### Soft tissue (changes with stage)

Face fullness, chin, neck, arms, soft chest volume, belly, waist, hips soft mass, legs soft width, clothing fit, posture, visual confidence.

### Important

Progression must **not** masculinize the figure or push extreme thinness. Hips, chest, and natural softness remain readable at Stage 20 in a healthy way.

---

## Outfit (Cozy — locked across stages)

**Recommended canon outfit:**

| Piece | Spec |
|-------|------|
| Top | Soft sage / warm sage plain T-shirt (or soft long-sleeve if silhouette still clear) |
| Bottom | Dark brown or graphite comfortable trousers / matte leggings (no shine) |
| Shoes | Beige or olive simple sneakers |
| Optional | Light overshirt **only** if it does not hide waist/belly; prefer **no** overshirt for stage readability |

No logos, text, prints. No outfit swap between stages.

**Palette:** sage, warm beige, muted terracotta accents (shoes/stitch only), deep brown, cream.

**Fit rule:** Same garments; fit eases as body lightens. Do not hide progression under bulky layers.

---

## Pose

- Standing, stable
- Slight **3/4** (same angle as male set’s camera language)
- Arms relaxed; belly and waist visible
- Feet not crossed
- No model hip pop, no arched “glamour” stance, no sexualization
- Calm forward gaze

---

## Lighting

- Soft warm daylight (match male set)
- Same key direction as male Cozy sheets
- No glow, no coloured rim, transparent background

---

## Stage progression (Body Stage 1–20)

### What may change

Face fullness, chin, neck, shoulders soft set, arms, soft chest volume, belly, waist, hips soft mass, legs, clothing fit, posture, visual composure.

### What must not change

Height, limb lengths, head size, face identity, hair, eye color, age, outfit design, shoes, camera, pose angle.

### Anchor stages

| Stage | Body story |
|-------|------------|
| **1** | Clear fullness; round face; noticeable belly; clothes tight; shoulders slightly dropped; calm tired look |
| **5** | Small change; face slightly lighter; belly slightly reduced; clothes slightly easier; posture a bit better |
| **10** | Noticeable silhouette shift; waist begins; face less round; arms/legs lighter; **hips remain**; still naturally feminine |
| **15** | Clear weight loss; waist readable; belly much smaller; freer clothes; more confident posture; **no** fitness cut |
| **20** | Healthy naturally leaner version of the **same** woman; not model, not bodybuilder, not extremely thin; chest and hips still natural; same face and age; calm confident stance |

### Intermediate guidance

Same neighbour-gradual rule as male. Stage 5 must still read “early path,” not mid transformation.

---

## Do / Don’t

### Do

- Keep one face and one hairstyle
- Keep feminine structure through Stage 20
- Match male set’s painterly realism and light
- Keep outfit plain and adult
- Show belly/waist honestly

### Don’t

- Different woman between stages
- Age / beauty-filter drift
- New hairstyle
- Fashion model, runway thin, plastic skin
- Sexualized pose or tight glam clothing
- Bodybuilder / ripped look
- Anime / cartoon
- Hands covering belly or hips
- Background, furniture, text, logos
- Copy a real private person without permission
- Make her a female clone of the male hero’s face

---

## Technical standard

See [`avatar-art-direction.md`](avatar-art-direction.md) §3.

- Canvas 1536×2048, transparent RGBA → runtime WebP
- Export target: `public/game-assets/themes/cozy/avatars/female/stage-XX.webp`
- Source WIP: `art-source/avatar-generation/cozy/female/`

---

## Hero State

Body Stage only on the sheet. Hero State = UI chrome. Do not bake energy states into body art for v1.

---

## Future theme notes

| Theme | Keep | Change |
|-------|------|--------|
| Dark Fantasy | Face, height, stage mass, hair | Costume, mood lighting; silhouette still readable |
| Slavic / Forest Myth | Same identity | Folk / forest clothing |
| Athlete Return | Same identity | Sport kit; Stage 20 still healthy adult, not competition cut |

Cozy Female Stage N ≡ Theme Female Stage N as the **same person**.
