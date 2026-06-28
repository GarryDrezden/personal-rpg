# Assets Gallery

Галерея игровых ассетов проекта.

Источником данных является [`manifest.json`](manifest.json).

## Статусы

| Status | Meaning |
|--------|---------|
| `draft` | Черновик |
| `candidate` | Кандидат на утверждение |
| `approved` | Утверждено, в prod |
| `rejected` | Отклонено |
| `archived` | Архив |

## Темы

| Theme | Use |
|-------|-----|
| `darkFantasy` | Основная RPG-линейка |
| `cozy` | Светлая / летняя |
| `universal` | Спутники, мобы, UI |

## Browse by type

| Type | Count in repo (approx) |
|------|------------------------|
| hero-stage | Female 20 + Male 6 |
| hero-death | 2 |
| companion | 4 |
| mob | 8 |
| boss | 8 |
| artifact | 0 (paths in code only) |
| logo | 0 (pending) |

## View on site

After deploy: `https://<domain>/game-assets/...`

Cache version: `GAME_ASSET_VERSION` in `src/game/assetPaths.ts` (currently **18**).

## Edit workflow

1. Add/update entry in `manifest.json`
2. Place PNG in `public/game-assets/` if approved
3. Bump asset version
4. Commit + push (triggers deploy)

See [`../wiki/06-assets-gallery.md`](../wiki/06-assets-gallery.md).
