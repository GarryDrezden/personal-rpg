# TODO: ассеты аватара (v1.0)

> **Legacy / archived.** Актуальная документация:
> - [`README.md`](README.md) — вход в вики
> - [`wiki/06-assets-gallery.md`](wiki/06-assets-gallery.md) — галерея
> - [`brandbook/characters.md`](brandbook/characters.md) — герои
> - Ассеты: `public/game-assets/heroes/` (не `public/avatars/`)

Сейчас в репозитории **нет PNG** персонажа. `AvatarDisplay` пробует загрузить картинки в таком порядке:

1. **Новый формат (v1.0)** — `public/avatars/{gender}/`
   - `01_stage_heaviest.png`
   - `02_stage_very_overweight.png`
   - `03_stage_overweight.png`
   - `04_stage_mid_progress.png`
   - `05_stage_fit.png`
   - `06_stage_lean.png`
   - `07_stage_athletic.png`

2. **Legacy (до v1.0)** — `public/images/weight/{gender}/`
   - `stage-1.png` … `stage-7.png`

3. Если оба варианта недоступны — показывается градиентный placeholder.

## Что сделать

- [ ] Добавить финальные PNG в `public/avatars/male/` и `public/avatars/female/`
- [ ] Или временно положить старые спрайты в `public/images/weight/male/` и `female/` (имена `stage-1.png` … `stage-7.png`)
- [ ] После добавления файлов проверить Dashboard и раздел «Аватар» в настройках
