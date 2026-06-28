# Visual Style

## Core look

**Premium stylized realistic 3D game art** — как персонажи современной mobile action-RPG, не как фото и не как мультфильм.

| Параметр | Значение |
|----------|----------|
| Anatomy base | Realistic |
| Stylization | 30–40% |
| Lighting | Soft studio, readable silhouette |
| Background | **Transparent alpha** — обязательно |
| Mood | Dark fantasy elegance, **not horror** |

## Do

- Полное тело head-to-shoes, центрировано
- Герой занимает большую часть кадра
- Чистый силуэт, читается в маленькой карточке UI
- Единый масштаб и поза между стадиями одного героя
- Сохранять лицо, волосы, бороду, одежду (стиль), позу

## Do not

- **Anime / chibi / cartoon**
- **Flat vector / corporate illustration**
- **Hyperrealistic photo** (looks like real person photo)
- **Bodybuilder / six-pack / fitness model** progression
- **Grotesque body** or mocking caricature
- White/gray panel, checkerboard, studio floor behind character
- Lovecraft horror, gore

## Universal style block

Полный текст для генераторов: [`../HERO_STAGE_PROMPTS_V2.md`](../HERO_STAGE_PROMPTS_V2.md) § Universal style block.

## Post-processing

```powershell
python local/tools/process_hero_png.py public/game-assets/heroes/male/stage-01.png
```

Удаляет белый/серый фон, обрезает прозрачность.

## UI integration

- Карточки: rounded, dark fantasy borders
- Placeholder: `GameAssetPlaceholder` при missing PNG
- Cache bust: `?v=GAME_ASSET_VERSION`
