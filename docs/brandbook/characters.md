# Characters — Hero

## Overview

Два героя: **male** и **female**. По **20 стадий** каждый + фигура **Death** (200 kg silhouette).

Прогресс: ~180 kg → ~100 kg через **снижение жировой массы**, не через набор мышц.

## Anchor stages

Ключевые контрольные точки для генерации и review:

| Stage | Title | Role |
|-------|-------|------|
| 1 | Начало пути | Старт, максимальный груз |
| 5 | Первое облегчение | Первый заметный сдвиг |
| 10 | Половина первой силы | Ещё крупный, но уже изменился |
| 15 | Форма возвращается | Заметная трансформация |
| 20 | Перерождение формы | Финал: реалистично похудевший, не fitness model |

## Transformation logic

**Один человек** на всех 20 стадиях:

- постепенное снижение объёма тела;
- уже талия, меньше fullness лица;
- свободнее шея, открытые плечи;
- лучше осанка, посадка одежды;
- больше энергии во взгляде.

**Не:** bodybuilder arc, visible six-pack, gym physique.

## Stage 10 vs Stage 20

- **Stage 10** — ещё заметно крупный, середина пути
- **Stage 20** — реалистично похудевшая версия того же человека, **не** fitness model

## Current asset status (2026-06-06)

| Gender | Coverage |
|--------|----------|
| Female | Stages 1–20 + death — **approved set** |
| Male | Stages 1–3, 19–20 + death — **partial**; 4–18 fallback to anchors |

## File paths

```
public/game-assets/heroes/{male,female}/stage-XX.png
public/game-assets/heroes/{male,female}/death.png
```

Approved references (style only, no private photos in repo):
`heroes/male/_reference/stage-20-approved.png`

## Weight mapping

Linear по `progressPercent` в `src/constants/heroStages.ts`.
Engine: `src/utils/heroProgressEngine.ts`.

## Death figure

Силуэт «200 kg» — чёрная мантия, коса. Не grotesque body.
Separate PNG: `death.png`.

## Prompts

- [`../prompts/image-generation/hero-male-stages.md`](../prompts/image-generation/hero-male-stages.md)
- [`../prompts/image-generation/hero-female-stages.md`](../prompts/image-generation/hero-female-stages.md)
- Legacy full prompts: [`../HERO_STAGE_PROMPTS_V2.md`](../HERO_STAGE_PROMPTS_V2.md)
