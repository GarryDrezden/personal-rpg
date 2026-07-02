# Assets Gallery

Галерея игровых ассетов проекта.

Источником данных является [`manifest.json`](manifest.json) (**Asset Registry 2.0**, schema v2).

Art Backlog: [`../wiki/13-art-backlog.md`](../wiki/13-art-backlog.md).

## Lifecycle statuses (v2)

| Status | Meaning |
|--------|---------|
| `idea` | Идея |
| `needed` | Нужен, UI на placeholder |
| `prompt-ready` | Промпт готов |
| `generated` | Сырой вывод |
| `processed` | Обработан (webp) |
| `in-app` | Файл в `public/`, в prod |
| `needs-redesign` | Перегенерация |
| `done` | Финал |

Legacy v1: `approved` → `in-app`, `draft` → `needed` (поле `legacyStatus`).

## Priorities

| Priority | Meaning |
|----------|---------|
| P0 | MVP visual core |
| P1 | Campaign polish |
| P2 | Future expansion |
| P3 | Later / nice to have |

## Browse by type (in repo)

| Type | In-app (approx) |
|------|-----------------|
| hero-stage | Male anchors + variants; Female 20 |
| journey-chapter-bg | 9 webp |
| companion | 4 |
| mob | 8 |
| boss-legacy | 8 PNG |
| season/chapter/act bosses | tracked as `needed` |
| camp-base / abilities / rewards | tracked as `needed` |

## View on site

After deploy: `https://<domain>/game-assets/...`

Cache version: `GAME_ASSET_VERSION` in `src/game/assetPaths.ts` (currently **19**).

## Edit workflow

1. Update backlog [`13-art-backlog.md`](../wiki/13-art-backlog.md) if priority changes
2. Add/update entry in `manifest.json` (or run `node scripts/build-asset-manifest.mjs`)
3. Place file in `public/game-assets/` when `in-app`
4. Bump `GAME_ASSET_VERSION`
5. `npm test` — manifest validation
6. Commit + push (triggers deploy)

See [`../wiki/06-assets-gallery.md`](../wiki/06-assets-gallery.md).
