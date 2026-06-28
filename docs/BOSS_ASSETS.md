# Ассеты боссов и аватара

> **Legacy / archived.** Актуальная документация:
> - [`brandbook/mobs-and-bosses.md`](brandbook/mobs-and-bosses.md)
> - [`assets/manifest.json`](assets/manifest.json)
> - Chapter bosses: `public/game-assets/bosses/`

## Боссы

Каждый недельный босс имеет стабильный `id` и путь к картинке в `public/bosses/`.

| ID | Файл (сейчас SVG) | Можно заменить на |
|----|-------------------|-------------------|
| `monday_laziness` | `monday-laziness.svg` | `monday-laziness.png` (512×512+) |
| `weekend_slip` | `weekend-slip.svg` | `weekend-slip.png` |
| `brain_fog` | `brain-fog.svg` | `brain-fog.png` |
| `couch_magnet` | `couch-magnet.svg` | `couch-magnet.png` |
| `chaos_unplanned` | `chaos-unplanned.svg` | `chaos-unplanned.png` |

Чтобы подключить PNG/WebP — положите файл с тем же именем и расширением `.png`, затем обновите `imagePath` в `src/constants/bosses.ts`.

Рекомендации для финального арта:
- **2D иллюстрация** (PNG/WebP) — оптимально: лёгкий вес, стиль RPG, читается в карточке
- **3D рендер** — можно экспортировать в PNG из Blender; Three.js в рантайме не обязателен
- Размер: **512×512** или **1024×1024**, фон прозрачный или с мягким градиентом
- Стиль: единый для всех 5 боссов (как набор в одной игре)

## Аватар персонажа

См. [AVATAR_ASSETS.md](./AVATAR_ASSETS.md).

Пути: `public/avatars/{male,female}/01_stage_heaviest.png` … `07_stage_athletic.png`.

Для «красивого» аватара:
1. **2D спрайты** по стадиям (7 штук × 2 пола) — проще всего
2. **Lottie** — анимация при смене стадии
3. **3D** — только если нужна интерактивность; иначе достаточно PNG-рендеров

## Бестиарий

Страница `/bosses` показывает всех боссов:
- **Ещё впереди** — не встречались в ваших неделях
- **Сражение сейчас** — босс текущей недели
- **Повержен / Идеал** — уже побеждали
