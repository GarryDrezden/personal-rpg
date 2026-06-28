# Hero Stage Prompts V2 — «Личная RPG»

> **Legacy reference (full prompt library).** Актуальный индекс:
> - [`prompts/image-generation/README.md`](prompts/image-generation/README.md)
> - [`prompts/image-generation/hero-male-stages.md`](prompts/image-generation/hero-male-stages.md)
> - [`prompts/image-generation/hero-female-stages.md`](prompts/image-generation/hero-female-stages.md)

> **Важно:** старые PNG в `public/avatars/`, `public/game-assets/heroes/` и любые предыдущие генерации — **удалить и не использовать как reference**. Работать только с промптами ниже.

**Пути для экспорта:**
```
public/game-assets/heroes/male/stage-01.png … stage-20.png
public/game-assets/heroes/female/stage-01.png … stage-20.png
```

---

## 1. Universal style block

Вставлять в конец **каждого** промпта:

```text
Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

**Negative prompt (если генератор поддерживает):**

```text
bodybuilder, shredded abs, visible six-pack, fitness model, gym physique, white background, gray background, checkerboard, studio floor, card backdrop, panel behind character, anime, cartoon, chibi, different person, different face, different hairstyle, different clothes, different pose angle, muscle gain progression, early athletic look, lovecraft horror, gore, mocking caricature
```

---

## 2. Главная логика трансформации

```text
CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + narrower waist + less facial fullness + freer neck + more open shoulders + better posture + better clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a bodybuilder.

DO NOT:
- add visible abs or muscle definition before late stages;
- make stage 10 look fitter than stage 20;
- make stages 8–12 look like final form;
- change only belly while ignoring face, neck, posture, shoulders, expression;
- use old reference images or previous generated versions.

Every stage MUST visibly change: body volume, face, neck, waist, posture, shoulders, clothing fit, expression, energy, composure.
```

---

## 3. Таблица stage descriptions (все 20 стадий)

| Stage | % | Описание |
|-------|---|----------|
| 01 | 0% | Very heavy starting body. Maximum body volume. Large belly / abdomen, wide waist, soft face fullness, thicker neck, heavier shoulders, more collapsed posture, low energy, clothing stretched or hanging heavily, expression serious and tired, silhouette loose and unsorted. |
| 02 | 5% | Almost the same as stage 1. Tiny improvement only. Slightly better posture, slightly less facial puffiness, but still very heavy. |
| 03 | 10% | Still very heavy. Small visible reduction in body volume. Slightly less belly projection, face a bit clearer, clothing tension reduced a little. |
| 04 | 15% | Heavy body remains obvious. Waist still wide. Neck still thick. Posture a little less closed. Expression slightly more awake. |
| 05 | 20% | First clearly visible improvement. Still obese/heavy. Belly still prominent. Face still full, but fresher. Shoulders slightly more open. Clothing sits a little better. |
| 06 | 25% | Large body, still heavy. Body volume reduced a little more. Waist slightly cleaner. Posture stronger. Hero looks a little more present. |
| 07 | 30% | Still clearly overweight. Silhouette becoming more structured. Neck visually freer. Clothing hangs more naturally. |
| 08 | 35% | Large-framed, overweight, but already more assembled. Less facial heaviness. Better stance. Slightly more energy. |
| 09 | 40% | Body still large and soft. Not athletic. Clear reduction in waist and belly. Face calmer and more focused. Shoulders less rounded. |
| 10 | 45% | Mid-progress. Still a big overweight person. NO abs, NO fitness-model look, NO exaggerated muscles. Noticeably less body fat than early stages, but still clearly in transformation. Better posture, better clothing fit, stronger presence. |
| 11 | 50% | Noticeably lighter. Still broad / still with softness. Face slimmer. Neck clearer. Waist more defined. Expression more confident. |
| 12 | 55% | Overweight-to-large build. Much better posture. Shoulders more open. Hero looks more awake and engaged. |
| 13 | 60% | Large sturdy build. Natural softness remains. Waist and torso more compact. Clothing fits cleanly. More energy in the pose. |
| 14 | 65% | Strong base. Silhouette clearly collected. Reduced face fullness. Better neck line. Better stance. Hero looks more capable. |
| 15 | 70% | Major visible transformation. Significantly lower body fat. Still realistic. Not bodybuilder. Confident posture, improved waistline, better shoulder placement, noticeably cleaner silhouette. |
| 16 | 75% | Leaner and freer. Movements should feel easier. Clothing fits naturally. Face more alive. Hero appears more physically available and stable. |
| 17 | 80% | Near-final strong realistic form. Body fat lower, but still natural adult body. Not shredded. Energetic, confident, upright. |
| 18 | 85% | Very collected silhouette. Good posture. Open shoulders. Clean waistline. Alert face. Hero looks fully engaged in life. |
| 19 | 90% | Final approach. Stable target-like form. Strong, healthy, composed. Not exaggerated. Not bodybuilder. |
| 20 | 100% | Final target form. Best version of the same person. Strong realistic adult body, clearly reduced body fat, balanced proportions, confident expression, free neck, improved waist, open shoulders, natural clothing fit, visible energy, strong composure, awakened presence. Not shredded, not bodybuilder. |

---

## 4. Порядок генерации

1. **Удалить** все старые `stage-*.png` (male + female).
2. **Male anchors:** 1 → 20 → 10 → 5 → 15
3. **Проверить** anchors (stage 10 не атлет, stage 20 лучше по собранности).
4. **Male промежуточные:** 2–4, 6–9, 11–14, 16–19
5. **Female anchors:** 1 → 20 → 10 → 5 → 15
6. **Female промежуточные:** 2–4, 6–9, 11–14, 16–19

---

# ANCHOR PROMPTS — MALE

## Male Stage 01 — 0% — `stage-01.png`

```text
Create a full-body male hero avatar for a gamified personal transformation RPG.

CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + narrower waist + less facial fullness + freer neck + more open shoulders + better posture + better clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a bodybuilder.
Do NOT use old reference images or previous generated versions.

Character identity lock:
adult man, tall, large-framed, light skin, light-brown / dark blond hair, short beard or stubble, calm determined expression. Same identity, same face type, same hairstyle, same beard style, same height, same clothing style, same shoes, same camera angle, same standing pose across all stages.

Clothing:
dark oversized T-shirt, black athletic shorts, dark sneakers.

This is body transformation stage 1 of 20.
Transformation mode: weight loss.
Progress level: 0% of the full journey.

Body transformation priority:
This character is losing body fat gradually, not becoming muscular too early.
The main transformation is reduced body fat, reduced body volume, reduced belly size, narrower waist, less facial fullness, freer neck, more open shoulders, better posture, improved clothing fit, more visible energy, stronger expression and more collected presence.

At this exact stage, the character must show:
Very heavy starting body. Maximum body volume. Large belly / abdomen, wide waist, soft face fullness, thicker neck, heavier shoulders, more collapsed posture, low energy, clothing stretched or hanging heavily, expression serious and tired, silhouette loose and unsorted.

Important stage rules:
- This is the heaviest starting point of the entire journey.
- No visible abs. No athletic look. No fitness model.
- The body must become lighter and more collected gradually in later stages only.

Visual evolution must affect:
body volume, face, neck, waist, posture, shoulder position, clothing fit, energy level, facial expression, overall composure.

Pose:
full body, front-facing or slight 3/4 standing pose, arms relaxed, grounded stance, centered, full figure visible from head to shoes.

Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

---

## Male Stage 05 — 20% — `stage-05.png`

```text
Create a full-body male hero avatar for a gamified personal transformation RPG.

CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + narrower waist + less facial fullness + freer neck + more open shoulders + better posture + better clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a bodybuilder.
Do NOT use old reference images or previous generated versions.

Character identity lock:
adult man, tall, large-framed, light skin, light-brown / dark blond hair, short beard or stubble, calm determined expression. Same identity, same face type, same hairstyle, same beard style, same height, same clothing style, same shoes, same camera angle, same standing pose across all stages.

Clothing:
dark oversized T-shirt, black athletic shorts, dark sneakers.

This is body transformation stage 5 of 20.
Transformation mode: weight loss.
Progress level: 20% of the full journey.

Body transformation priority:
This character is losing body fat gradually, not becoming muscular too early.
The main transformation is reduced body fat, reduced body volume, reduced belly size, narrower waist, less facial fullness, freer neck, more open shoulders, better posture, improved clothing fit, more visible energy, stronger expression and more collected presence.

At this exact stage, the character must show:
First clearly visible improvement. Still obese/heavy. Belly still prominent. Face still full, but fresher. Shoulders slightly more open. Clothing sits a little better.

Important stage rules:
- Stage 5 must still look much closer to stage 1 than to stage 10.
- No visible abs. No bodybuilder look. No exaggerated muscles.
- Still clearly obese — only first visible improvement.

Visual evolution must affect:
body volume, face, neck, waist, posture, shoulder position, clothing fit, energy level, facial expression, overall composure.

Pose:
full body, front-facing or slight 3/4 standing pose, arms relaxed, grounded stance, centered, full figure visible from head to shoes.

Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

---

## Male Stage 10 — 45% — `stage-10.png`

```text
Create a full-body male hero avatar for a gamified personal transformation RPG.

CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + narrower waist + less facial fullness + freer neck + more open shoulders + better posture + better clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a bodybuilder.
Do NOT use old reference images or previous generated versions.

Character identity lock:
adult man, tall, large-framed, light skin, light-brown / dark blond hair, short beard or stubble, calm determined expression. Same identity, same face type, same hairstyle, same beard style, same height, same clothing style, same shoes, same camera angle, same standing pose across all stages.

Clothing:
dark oversized T-shirt, black athletic shorts, dark sneakers.

This is body transformation stage 10 of 20.
Transformation mode: weight loss.
Progress level: 45% of the full journey — MID-POINT, NOT FINAL FORM.

Body transformation priority:
This character is losing body fat gradually, not becoming muscular too early.
The main transformation is reduced body fat, reduced body volume, reduced belly size, narrower waist, less facial fullness, freer neck, more open shoulders, better posture, improved clothing fit, more visible energy, stronger expression and more collected presence.

At this exact stage, the character must show:
Mid-progress. Still a big overweight person. NO abs, NO fitness-model look, NO exaggerated muscles. Noticeably less body fat than early stages, but still clearly in transformation. Better posture, better clothing fit, stronger presence.

Important stage rules:
- Stage 10 must still look clearly mid-progress and still overweight.
- If he looks athletic, gym-fit, or has visible abs — the image is WRONG.
- Stage 10 must NEVER look fitter or more muscular than stage 20.
- Must look clearly heavier and softer than stage 20.

Visual evolution must affect:
body volume, face, neck, waist, posture, shoulder position, clothing fit, energy level, facial expression, overall composure.

Pose:
full body, front-facing or slight 3/4 standing pose, arms relaxed, grounded stance, centered, full figure visible from head to shoes.

Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

---

## Male Stage 15 — 70% — `stage-15.png`

```text
Create a full-body male hero avatar for a gamified personal transformation RPG.

CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + narrower waist + less facial fullness + freer neck + more open shoulders + better posture + better clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a bodybuilder.
Do NOT use old reference images or previous generated versions.

Character identity lock:
adult man, tall, large-framed, light skin, light-brown / dark blond hair, short beard or stubble, calm determined expression. Same identity, same face type, same hairstyle, same beard style, same height, same clothing style, same shoes, same camera angle, same standing pose across all stages.

Clothing:
dark oversized T-shirt, black athletic shorts, dark sneakers.

This is body transformation stage 15 of 20.
Transformation mode: weight loss.
Progress level: 70% of the full journey.

Body transformation priority:
This character is losing body fat gradually, not becoming muscular too early.
The main transformation is reduced body fat, reduced body volume, reduced belly size, narrower waist, less facial fullness, freer neck, more open shoulders, better posture, improved clothing fit, more visible energy, stronger expression and more collected presence.

At this exact stage, the character must show:
Major visible transformation. Significantly lower body fat. Still realistic. Not bodybuilder. Confident posture, improved waistline, better shoulder placement, noticeably cleaner silhouette.

Important stage rules:
- Significantly transformed but still realistic softness remains.
- No visible abs. No bodybuilder. No fitness competition look.
- Do NOT make him leaner or more muscular than stage 20.

Visual evolution must affect:
body volume, face, neck, waist, posture, shoulder position, clothing fit, energy level, facial expression, overall composure.

Pose:
full body, front-facing or slight 3/4 standing pose, arms relaxed, grounded stance, centered, full figure visible from head to shoes.

Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

---

## Male Stage 20 — 100% — `stage-20.png`

```text
Create a full-body male hero avatar for a gamified personal transformation RPG.

CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + narrower waist + less facial fullness + freer neck + more open shoulders + better posture + better clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a bodybuilder.
Do NOT use old reference images or previous generated versions.

Character identity lock:
adult man, tall, large-framed, light skin, light-brown / dark blond hair, short beard or stubble, calm determined expression. Same identity, same face type, same hairstyle, same beard style, same height, same clothing style, same shoes, same camera angle, same standing pose across all stages.

Clothing:
dark oversized T-shirt, black athletic shorts, dark sneakers.

This is body transformation stage 20 of 20.
Transformation mode: weight loss.
Progress level: 100% of the full journey — FINAL TARGET FORM.

Body transformation priority:
This character is losing body fat gradually, not becoming muscular too early.
The main transformation is reduced body fat, reduced body volume, reduced belly size, narrower waist, less facial fullness, freer neck, more open shoulders, better posture, improved clothing fit, more visible energy, stronger expression and more collected presence.

At this exact stage, the character must show:
Final target form. Best version of the same person. Strong realistic adult body, clearly reduced body fat, balanced proportions, confident expression, free neck, improved waist, open shoulders, natural clothing fit, visible energy, strong composure, awakened presence. Not shredded, not bodybuilder.

Important stage rules:
- Stage 20 is the best and most complete version of THIS person.
- Most collected silhouette and best posture of all stages.
- Fitter and more confident than stage 10, but NOT necessarily more muscular than stage 10.
- No bodybuilder, no shredded abs, no fitness competition physique.

Visual evolution must affect:
body volume, face, neck, waist, posture, shoulder position, clothing fit, energy level, facial expression, overall composure.

Pose:
full body, front-facing or slight 3/4 standing pose, arms relaxed, grounded stance, centered, full figure visible from head to shoes.

Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

---

# ANCHOR PROMPTS — FEMALE

## Female Stage 01 — 0% — `stage-01.png`

```text
Create a full-body female hero avatar for a gamified personal transformation RPG.

CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + softer-to-cleaner facial shape + freer neck + narrower waist + improved posture + more open shoulders + cleaner clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a fitness model.
Do NOT use old reference images or previous generated versions.

Character identity lock:
adult woman, light to medium skin tone, brown hair tied back in a practical ponytail or bun, focused calm expression. Same identity, same face type, same hairstyle, same height, same clothing style, same shoes, same camera angle, same standing pose across all stages.

Clothing:
dark athletic top or dark T-shirt, dark athletic shorts or biker shorts, dark sneakers.

This is body transformation stage 1 of 20.
Transformation mode: weight loss.
Progress level: 0% of the full journey.

Body transformation priority:
This character is losing body fat gradually, not becoming "sporty-fit" too early.
The main transformation is reduced body fat, reduced body volume, softer-to-cleaner facial shape, freer neck, narrower waist, improved posture, more open shoulders, cleaner clothing fit, more visible energy, stronger expression and more collected presence.

At this exact stage, the character must show:
Very heavy starting body. Maximum body volume. Large belly / abdomen, wide waist, soft face fullness, thicker neck, heavier shoulders, more collapsed posture, low energy, clothing stretched or hanging heavily, expression serious and tired, silhouette loose and unsorted. Realistic female fat distribution in belly, waist, hips and thighs.

Important stage rules:
- This is the heaviest starting point of the entire journey.
- No visible abs. No athletic look. No fitness model. No sexualized pose.
- The body must become lighter and more collected gradually in later stages only.

Visual evolution must affect:
body volume, face, neck, waist, posture, shoulder position, clothing fit, energy level, facial expression, overall composure.

Pose:
full body, front-facing or slight 3/4 standing pose, relaxed grounded stance, arms relaxed or one relaxed hand near hip, centered, full figure visible from head to shoes.

Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

---

## Female Stage 05 — 20% — `stage-05.png`

```text
Create a full-body female hero avatar for a gamified personal transformation RPG.

CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + softer-to-cleaner facial shape + freer neck + narrower waist + improved posture + more open shoulders + cleaner clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a fitness model.
Do NOT use old reference images or previous generated versions.

Character identity lock:
adult woman, light to medium skin tone, brown hair tied back in a practical ponytail or bun, focused calm expression. Same identity, same face type, same hairstyle, same height, same clothing style, same shoes, same camera angle, same standing pose across all stages.

Clothing:
dark athletic top or dark T-shirt, dark athletic shorts or biker shorts, dark sneakers.

This is body transformation stage 5 of 20.
Transformation mode: weight loss.
Progress level: 20% of the full journey.

Body transformation priority:
This character is losing body fat gradually, not becoming "sporty-fit" too early.
The main transformation is reduced body fat, reduced body volume, softer-to-cleaner facial shape, freer neck, narrower waist, improved posture, more open shoulders, cleaner clothing fit, more visible energy, stronger expression and more collected presence.

At this exact stage, the character must show:
First clearly visible improvement. Still obese/heavy. Belly still prominent. Face still full, but fresher. Shoulders slightly more open. Clothing sits a little better.

Important stage rules:
- Stage 5 must still look much closer to stage 1 than to stage 10.
- No visible abs. No fitness model look. Still clearly obese.
- No sexualized pose or pin-up styling.

Visual evolution must affect:
body volume, face, neck, waist, posture, shoulder position, clothing fit, energy level, facial expression, overall composure.

Pose:
full body, front-facing or slight 3/4 standing pose, relaxed grounded stance, arms relaxed or one relaxed hand near hip, centered, full figure visible from head to shoes.

Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

---

## Female Stage 10 — 45% — `stage-10.png`

```text
Create a full-body female hero avatar for a gamified personal transformation RPG.

CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + softer-to-cleaner facial shape + freer neck + narrower waist + improved posture + more open shoulders + cleaner clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a fitness model.
Do NOT use old reference images or previous generated versions.

Character identity lock:
adult woman, light to medium skin tone, brown hair tied back in a practical ponytail or bun, focused calm expression. Same identity, same face type, same hairstyle, same height, same clothing style, same shoes, same camera angle, same standing pose across all stages.

Clothing:
dark athletic top or dark T-shirt, dark athletic shorts or biker shorts, dark sneakers.

This is body transformation stage 10 of 20.
Transformation mode: weight loss.
Progress level: 45% of the full journey — MID-POINT, NOT FINAL FORM.

Body transformation priority:
This character is losing body fat gradually, not becoming "sporty-fit" too early.
The main transformation is reduced body fat, reduced body volume, softer-to-cleaner facial shape, freer neck, narrower waist, improved posture, more open shoulders, cleaner clothing fit, more visible energy, stronger expression and more collected presence.

At this exact stage, the character must show:
Mid-progress. Still a big overweight person. NO abs, NO fitness-model look, NO exaggerated muscles. Noticeably less body fat than early stages, but still clearly in transformation. Better posture, better clothing fit, stronger presence.

Important stage rules:
- Stage 10 must still look clearly mid-progress and still noticeably overweight.
- If she looks athletic, gym-fit, toned, or has visible abs — the image is WRONG.
- Stage 10 must NEVER look fitter or more muscular than stage 20.
- Must look clearly heavier and softer than stage 20.

Visual evolution must affect:
body volume, face, neck, waist, posture, shoulder position, clothing fit, energy level, facial expression, overall composure.

Pose:
full body, front-facing or slight 3/4 standing pose, relaxed grounded stance, arms relaxed or one relaxed hand near hip, centered, full figure visible from head to shoes.

Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

---

## Female Stage 15 — 70% — `stage-15.png`

```text
Create a full-body female hero avatar for a gamified personal transformation RPG.

CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + softer-to-cleaner facial shape + freer neck + narrower waist + improved posture + more open shoulders + cleaner clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a fitness model.
Do NOT use old reference images or previous generated versions.

Character identity lock:
adult woman, light to medium skin tone, brown hair tied back in a practical ponytail or bun, focused calm expression. Same identity, same face type, same hairstyle, same height, same clothing style, same shoes, same camera angle, same standing pose across all stages.

Clothing:
dark athletic top or dark T-shirt, dark athletic shorts or biker shorts, dark sneakers.

This is body transformation stage 15 of 20.
Transformation mode: weight loss.
Progress level: 70% of the full journey.

Body transformation priority:
This character is losing body fat gradually, not becoming "sporty-fit" too early.
The main transformation is reduced body fat, reduced body volume, softer-to-cleaner facial shape, freer neck, narrower waist, improved posture, more open shoulders, cleaner clothing fit, more visible energy, stronger expression and more collected presence.

At this exact stage, the character must show:
Major visible transformation. Significantly lower body fat. Still realistic. Not bodybuilder. Confident posture, improved waistline, better shoulder placement, noticeably cleaner silhouette.

Important stage rules:
- Significantly transformed but still realistic softness remains.
- No visible abs. No runway or fitness model look.
- Do NOT make her leaner or more muscular than stage 20.
- Natural hips and thighs remain realistic for a large-framed woman.

Visual evolution must affect:
body volume, face, neck, waist, posture, shoulder position, clothing fit, energy level, facial expression, overall composure.

Pose:
full body, front-facing or slight 3/4 standing pose, relaxed grounded stance, arms relaxed or one relaxed hand near hip, centered, full figure visible from head to shoes.

Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

---

## Female Stage 20 — 100% — `stage-20.png`

```text
Create a full-body female hero avatar for a gamified personal transformation RPG.

CRITICAL TRANSFORMATION LOGIC:
This is ONE person across all 20 stages — not 20 different fitness models.
Progress = gradual body fat reduction + reduced body volume + softer-to-cleaner facial shape + freer neck + narrower waist + improved posture + more open shoulders + cleaner clothing fit + more visible energy + stronger expression + more collected composure.
The character is "waking up" — not becoming a fitness model.
Do NOT use old reference images or previous generated versions.

Character identity lock:
adult woman, light to medium skin tone, brown hair tied back in a practical ponytail or bun, focused calm expression. Same identity, same face type, same hairstyle, same height, same clothing style, same shoes, same camera angle, same standing pose across all stages.

Clothing:
dark athletic top or dark T-shirt, dark athletic shorts or biker shorts, dark sneakers.

This is body transformation stage 20 of 20.
Transformation mode: weight loss.
Progress level: 100% of the full journey — FINAL TARGET FORM.

Body transformation priority:
This character is losing body fat gradually, not becoming "sporty-fit" too early.
The main transformation is reduced body fat, reduced body volume, softer-to-cleaner facial shape, freer neck, narrower waist, improved posture, more open shoulders, cleaner clothing fit, more visible energy, stronger expression and more collected presence.

At this exact stage, the character must show:
Final target form. Best version of the same person. Strong realistic adult body, clearly reduced body fat, balanced proportions, confident expression, free neck, improved waist, open shoulders, natural clothing fit, visible energy, strong composure, awakened presence. Not shredded, not bodybuilder.

Important stage rules:
- Stage 20 is the best and most complete version of THIS person.
- Most collected silhouette and best posture of all stages.
- Fitter and more confident than stage 10, but NOT necessarily more muscular than stage 10.
- Natural hips and thighs remain realistic. No fitness competition model.

Visual evolution must affect:
body volume, face, neck, waist, posture, shoulder position, clothing fit, energy level, facial expression, overall composure.

Pose:
full body, front-facing or slight 3/4 standing pose, relaxed grounded stance, arms relaxed or one relaxed hand near hip, centered, full figure visible from head to shoes.

Style: stylized realistic 3D game art, realistic anatomy base with 30–40% stylization, premium mobile RPG character art, soft studio lighting, clean readable silhouette, subtle dark-fantasy influence similar to elegant modern action-RPG art, not horror, not cartoonish, not anime, not flat vector, not corporate illustration.

BACKGROUND — CRITICAL:
Truly transparent background only. Real alpha transparency around the character.
Do NOT place the character on a white panel, gray panel, checkerboard, card, plate, wall, studio floor, vignette, or any colored backdrop.
No fake transparency pattern. No embedded background rectangle. No scene environment.

FRAMING — CRITICAL:
Full body visible from head to shoes, centered.
The hero must occupy most of the image height and useful visual area.
Do NOT make the character tiny in the middle of the frame.
Do NOT leave large empty margins.
Character must read clearly at small UI card size.
Enough padding for UI cropping, but use the canvas efficiently.

No text, no logo, no watermark, no background scene.
```

---

## 5. Промпт для промежуточных стадий (2–4, 6–9, 11–14, 16–19)

После утверждения anchor stages использовать шаблон + строку из таблицы §3:

```text
Create an INTERMEDIATE [male/female] hero transformation stage between approved anchor stage [PREV] and approved anchor stage [NEXT].

CRITICAL: Use the EXACT same identity, pose, camera angle, clothing and art style as approved anchors.
Do NOT use old reference images.
Do NOT jump ahead in fitness level.

This is stage [N] of 20, progress [P]%.

At this exact stage, the character must show:
[STAGE_DESCRIPTION from table]

Main change: gradual fat reduction, posture, face, neck, shoulders, expression, energy — NOT muscle gain.

[Insert universal style block from §1]
```

**Диапазоны:**
| Stages | Между |
|--------|-------|
| 2–4 | 1 ↔ 5 |
| 6–9 | 5 ↔ 10 |
| 11–14 | 10 ↔ 15 |
| 16–19 | 15 ↔ 20 |

---

## 6. Чеклист после каждой генерации

- [ ] Реальная прозрачность (не белая/серая плашка)
- [ ] Full body head to shoes, герой крупный в кадре
- [ ] Тот же человек, та же одежда, та же поза
- [ ] Меняются лицо, шея, талия, осанка, плечи, выражение
- [ ] Stage 10 — всё ещё overweight, без пресса
- [ ] Stage 20 — лучшая собранность, не бодибилдер
- [ ] Stage 10 не спортивнее stage 20
- [ ] Нет текста, логотипов, watermark
