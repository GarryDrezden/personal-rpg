# UI Rules

## Screen roles

| Screen | Role | Not |
|--------|------|-----|
| **Dashboard** | Кто я сейчас + что делать сегодня | Музей ассетов |
| **Today** | Ввод дня, квесты | Analytics dump |
| **Codex** | Коллекции, cinematic showcase | Daily input |
| **Journey** | Путь, 20 стадий, chapter bosses | Settings |
| **Growth** | Skills, abilities, rewards, achievements, trials | Measurements |
| **Data** | Measurements, reports, insights, map | Hero gallery |

## Dashboard rules

1. **Один главный CTA** — next best action
2. Компактные блоки: квесты, неделя, recovery (если нужен)
3. Герой — один, не carousel всех стадий
4. Тяжёлые блоки (full codex, all achievements) → Growth/Codex

## Navigation

- Desktop: sidebar
- Mobile: bottom bar (planned: **Today in center**)
- Growth hub: tabs (`/growth/:tab`)

## Copy tone

- Поддерживающий, взрослый
- Без shame language
- Recovery = помощь, не наказание

## Themes

Two app themes: Cozy Light / Dark Fantasy.
Hero assets follow theme assignment in manifest (see [`themes.md`](themes.md)).

## Components reference

| Area | Key components |
|------|----------------|
| Dashboard | `DashboardScene`, `DailyQuestsCompact`, `NextBestActionCompact` |
| Journey | `JourneyMapSection`, desktop grid (map scene + `JourneyChapterDetailPanel`), `JourneyStagePin`, `JourneyMapMobile` |
| Codex | `HeroTransformationShowcase`, collections |
| Game assets | `GameAssetImage`, `GameAssetPlaceholder` |

## Accessibility

- Readable contrast in both themes
- Hero images: alt text from stage title
- Don't rely on color alone for quest status

## FAQ

Game-assets instructions live in FAQ (`src/constants/faqContent.ts`), not on Codex main view.
