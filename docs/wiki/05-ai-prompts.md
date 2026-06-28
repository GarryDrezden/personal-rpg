# AI Prompts

Индекс промптов для Cursor и генерации изображений.

## Cursor prompts

- [`../prompts/cursor/README.md`](../prompts/cursor/README.md)

## Image generation prompts

| Файл | Содержание |
|------|------------|
| [`../prompts/image-generation/README.md`](../prompts/image-generation/README.md) | Общие правила, модели, workflow |
| [`../prompts/image-generation/hero-male-stages.md`](../prompts/image-generation/hero-male-stages.md) | Мужской герой, 20 стадий |
| [`../prompts/image-generation/hero-female-stages.md`](../prompts/image-generation/hero-female-stages.md) | Женский герой, 20 стадий |
| [`../prompts/image-generation/companions.md`](../prompts/image-generation/companions.md) | Спутники |
| [`../prompts/image-generation/mobs.md`](../prompts/image-generation/mobs.md) | Daily mobs |
| [`../prompts/image-generation/bosses.md`](../prompts/image-generation/bosses.md) | Chapter bosses |
| [`../prompts/image-generation/artifacts.md`](../prompts/image-generation/artifacts.md) | Артефакты |
| [`../prompts/image-generation/logos.md`](../prompts/image-generation/logos.md) | Логотип и символы |

## Legacy (полные промпты)

- [`../HERO_STAGE_PROMPTS_V2.md`](../HERO_STAGE_PROMPTS_V2.md) — полная библиотека стадий v2
- [`../HERO_MALE_AVATAR_PROMPT.md`](../HERO_MALE_AVATAR_PROMPT.md) — male workflow + референсы

## После генерации

1. PNG → `public/game-assets/`
2. `python local/tools/process_hero_png.py <path>` — обрезка фона
3. Bump `GAME_ASSET_VERSION` в `src/game/assetPaths.ts`
4. Обновить `docs/assets/manifest.json`
5. Запись в `wiki/07-decision-log.md` при смене стиля/линейки
