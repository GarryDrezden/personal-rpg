# Characters — Hero

## Overview

Два героя: **male** и **female**. **Body Stage 1–20** (игровая прогрессия) + **5 Avatar Visual Anchors** (`1/5/10/15/20`) как production art.  
Прогресс: снижение жировой массы у **одного и того же человека**, не набор мышц / fitness arc.

## Character Bible v1 (канон)

| Документ | Назначение |
|----------|------------|
| [`../art/characters/avatar-art-direction.md`](../art/characters/avatar-art-direction.md) | Общий стиль, canvas, Hero State, cross-theme, QA пары |
| [`../art/characters/cozy-hero-male-bible.md`](../art/characters/cozy-hero-male-bible.md) | Cozy Hero Male Base |
| [`../art/characters/cozy-hero-female-bible.md`](../art/characters/cozy-hero-female-bible.md) | Cozy Hero Female Base |
| `art-source/avatar-generation/prompts/` | Base + stage templates + negative |

**Сейчас:** identity / outfit / progression зафиксированы. Production art = **пять anchors** на gender×theme. Промежуточные AI-кадры (02–04 и т.д.) не генерировать.

## Anchor stages

| Stage | Title | Role |
|-------|-------|------|
| 1 | Начало пути | Старт, максимальный объём |
| 5 | Первое облегчение | Первый заметный сдвиг (всё ещё крупный) |
| 10 | Середина пути | Ещё крупный, но уже изменился |
| 15 | Форма возвращается | Заметная трансформация |
| 20 | Здоровая версия того же человека | Финал: не fitness model |

## Transformation logic

**Один человек** на всех 20 стадиях:

- постепенное снижение объёма тела;
- уже талия, меньше fullness лица;
- свободнее шея, открытые плечи;
- лучше осанка, посадка одежды.

**Не:** bodybuilder arc, visible six-pack, gym physique, sexualized female pose, outfit swap.

## Body Stage vs Hero State

- **Body Stage** → `stage-XX.webp`
- **Hero State** (`depleted` / `steady` / `energized` / `strong`) → UI overlay only

## Runtime paths (Pipeline v1)

```
public/game-assets/themes/cozy/avatars/{male,female}/stage-XX.webp
public/game-assets/themes/dark-fantasy/avatars/{male,female}/stage-XX.webp
```

Legacy DF roots may still exist under `heroes/` until migration — see Avatar Assets Pipeline.

## Weight / engine

Body Stage from weight + measurements (`avatarStageEngine`). Habits do **not** slim the body sprite.

## Prompts (legacy + new)

- **Canon (Cozy Bible):** `art-source/avatar-generation/prompts/`
- Legacy: [`../prompts/image-generation/hero-male-stages.md`](../prompts/image-generation/hero-male-stages.md), [`hero-female-stages.md`](../prompts/image-generation/hero-female-stages.md)
- Legacy full: [`../HERO_STAGE_PROMPTS_V2.md`](../HERO_STAGE_PROMPTS_V2.md)

## QA

[`../art/avatar-stage-qa-checklist.md`](../art/avatar-stage-qa-checklist.md)
