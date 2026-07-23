# Ассеты боссов и аватара

> **Legacy / archived.** Актуальная документация:
> - [`brandbook/mobs-and-bosses.md`](brandbook/mobs-and-bosses.md)
> - [`assets/manifest.json`](assets/manifest.json)
> - Chapter bosses: `public/game-assets/bosses/`

## Недельные угрозы (Weekly Threats)

Портреты dark-fantasy в `public/game-assets/bosses/weekly/`, пути через `gameAsset()` в `src/constants/bosses.ts`.

| ID | Файл |
|----|------|
| `monday_laziness` | `weekly-threat-monday-laziness.webp` |
| `weekend_slip` | `weekly-threat-weekend-slip.webp` |
| `brain_fog` | `weekly-threat-brain-fog.webp` |
| `couch_magnet` | `weekly-threat-couch-magnet.webp` |
| `chaos_unplanned` | `weekly-threat-chaos-unplanned.webp` |

Legacy SVG в `public/bosses/*.svg` больше не подключены к UI (можно удалить позже).

Рекомендации: **1024×1024** WebP, единый dark-fantasy стиль с сезонными мини-боссами.

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
