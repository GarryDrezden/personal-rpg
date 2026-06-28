# Themes

## Dark Fantasy (primary)

**Где:** Journey map, Codex (dark mode), основная RPG-линейка hero assets.

| Элемент | Направление |
|---------|-------------|
| Одежда героя | Тёмная, нейтральная: charcoal, deep brown, muted navy |
| Палитра UI | Graphite, deep purple, gold accents |
| Mood | Собранность, путь, возвращение силы |
| Не | Яркие casual цвета, летняя одежда, neon |

## Cozy / Light (secondary)

**Где:** Theme «Светлая уютная» в Settings, future summer variants.

| Элемент | Направление |
|---------|-------------|
| Одежда | Мягкие, тёплые, допустима ярче |
| Палитра UI | Cream, soft green, warm amber |
| Mood | Уют, поддержка, мягкий прогресс |

## Candidate: bright male generation

Генерация с **розовой рубашкой и жёлтыми шортами** — **cozy/light candidate**, не dark fantasy.

- Status: `candidate` in manifest
- Path (planned): `heroes/male/variants/light/stage-20-light-v1.png`
- **Не использовать** как основной asset в journey/codex до review

## Theme assignment rules

| Asset type | Default theme |
|------------|---------------|
| Hero stages (main) | darkFantasy |
| Hero variants | cozy or darkFantasy (explicit in manifest) |
| Companions, mobs, bosses | universal / darkFantasy |
| Logos | darkFantasy |

## App themes (Settings)

| ID | Название | Brandbook |
|----|----------|-----------|
| cozy | Светлая уютная | Cozy / Light |
| darkFantasy | Тёмное фэнтези | Dark Fantasy |

Код: `src/constants/themes.ts`
