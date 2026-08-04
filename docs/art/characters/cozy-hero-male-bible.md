# Cozy Hero Male — Character Bible v1

**Working name:** Cozy Hero Male Base  
**Theme set:** Cozy (identity source for all future themes)  
**Status:** Canon locked — final stage art **not** generated yet  
**Parent:** [`avatar-art-direction.md`](avatar-art-direction.md)  
**Prompts:** `art-source/avatar-generation/prompts/cozy-male-*.txt`

---

## Character summary

Adult man, **35–38**, very tall (**~195–200 cm**), heavy athletic bone frame with substantial fat mass at Stage 1. Reads as a **functional large man with a sports past** — broad shoulders, strong limbs — not a weak caricature and not a “lazy fat” joke.

Personality in pose and face: calm, intelligent, slightly tired at the start, inwardly strong. Never aggressive, comic, or pitiful.

He must remain **the same man** on every Body Stage and, later, in Dark Fantasy / Forest Myth / Athlete Return (outfit and lighting may change; identity must not).

---

## Facial identity

| Trait | Canon |
|-------|--------|
| Face shape | Large; rounder early stages; structure stable |
| Eyes | Expressive brown (карие); calm gaze forward |
| Forehead | Broad |
| Nose | Straight or slightly strong/masculine |
| Mouth | Natural lips; closed/neutral calm expression |
| Beard | Short neat beard — **same** on all stages |
| Hair | Dark blond / chestnut; short tidy cut — **same** |
| Age | Locked 35–38; no rejuvenation or aging jumps |
| Makeup / effects | None |

**Signature details (all stages):**

- Short beard
- Tattoo on one arm / forearm (same placement, same design language)
- Smartwatch on one wrist

---

## Body identity

### Bone frame (immutable)

- Very tall
- Heavy skeleton
- Broad shoulders
- Large ribcage / chest cage
- Large arms and legs
- Sports past readable in shoulder width and overall mass capacity

### Soft tissue (changes with stage)

- Belly, sides, chest soft mass, neck fullness, face fullness, thigh/calf soft width
- Clothing fit and posture improve as mass drops

### Character of mass

Not helpless. Not cartoon obese. Functional large adult. Slightly rounded posture early; never caricature hunch.

---

## Outfit (Cozy — locked across stages)

| Piece | Spec |
|-------|------|
| Top | Dark green / muted olive **plain** T-shirt (no logos, text, prints) |
| Bottom | Grey or brown-grey cargo shorts or casual trousers |
| Shoes | Comfortable sneakers in a natural / earth tone |
| Accessories | Smartwatch + arm tattoo only |

**Palette:** forest green, muted olive, warm charcoal, natural brown, cream details.

**Fit rule:** Outfit stays the same garment set; **fit** loosens as body lightens. Do not hide the belly/waist with jackets or long coats.

---

## Pose

- Standing, stable weight on both feet
- Slight **3/4** turn (same angle every stage)
- Shoulders natural (not heroic chest-thrust)
- Arms relaxed at sides; clear view of torso silhouette
- Calm forward gaze
- No theatrical hero pose, no sit, no prop lean

---

## Lighting

- Soft warm daylight (summer home hour)
- Key light direction locked across stages
- No hard coloured rim, no glow outline, no vignette on body
- Transparent background only

---

## Stage progression (Body Stage 1–20)

### What may change

Face fullness, neck, chin soft tissue, chest soft volume, belly, sides, waist definition, leg soft width, clothing fit, posture, shoulder set (still same bone width).

### What must not change

Height, head size, arm/leg bone length, bone frame width, face identity, haircut, beard, tattoo, outfit design, shoes, age, camera, pose angle.

### Anchor stages

| Stage | Body story |
|-------|------------|
| **1** | Very large; big belly; clothes tight; full face; neck barely readable; shoulders slightly dropped; calm tired look |
| **5** | Still very large; face slightly less round; belly slightly reduced; clothes slightly easier; posture a bit more collected |
| **10** | Midway; still a large man but lighter; neck readable; belly reduced; waist begins; shoulders more open; clothes freer |
| **15** | Clearly lighter; powerful frame remains; belly much smaller; drier face; freer stance; **no** bodybuilding |
| **20** | Healthy strong version of the **same** man; large male frame; realistic waist; slight soft belly OK; **no** six-pack, fitness model, or bodybuilder |

### Intermediate guidance

- Stages 2–4: still Stage-1 territory (tiny shifts only)
- Stages 6–9: approach Stage 10 gradually
- Stages 11–14: approach Stage 15
- Stages 16–19: approach Stage 20 without sudden cut

**Never** jump from Stage 1 volume to Stage 20 lean in one neighbour step.

---

## Do / Don’t

### Do

- Keep one recognizable face
- Keep tall heavy bone frame even at Stage 20
- Show honest clothing tension early and ease later
- Keep tattoo + watch readable
- Match female set’s art quality / light / canvas (see art direction)

### Don’t

- Different person between stages
- Age drift (±10 years)
- New haircut / beard style
- New outfit or printed tee
- Bodybuilder / six-pack / shredded look
- Cartoon or anime stylization
- Cropped feet/hands
- Hands covering belly
- Background, furniture, weapons
- Copy a real private person without permission

---

## Technical standard

See [`avatar-art-direction.md`](avatar-art-direction.md) §3.

- Canvas 1536×2048, transparent RGBA → runtime WebP
- Export target: `public/game-assets/themes/cozy/avatars/male/stage-XX.webp`
- Source WIP: `art-source/avatar-generation/cozy/male/`

---

## Hero State

Body sheets are Body Stage only. `depleted | steady | energized | strong` = UI overlay. Do not bake state into male body art for v1.

---

## Future theme notes

| Theme | Keep | Change |
|-------|------|--------|
| Dark Fantasy | Face, height, stage mass, tattoo | Costume, cooler light, fantasy materials (still readable silhouette) |
| Slavic / Forest Myth | Same identity | Folk / forest clothing language |
| Athlete Return | Same identity | Sport kit; still **not** bodybuilder fantasy at Stage 20 |

Cozy Male Stage N ≡ Theme Male Stage N as the **same person**.
