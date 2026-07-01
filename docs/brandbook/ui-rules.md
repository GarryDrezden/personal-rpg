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
| Journey | `JourneyMapV3Section`, `JourneyChapterRoadItem`, `JourneyMapV3SummaryBar`, `JourneyChapterDetailPanel` |
| Codex | `HeroTransformationShowcase`, collections |
| Game assets | `GameAssetImage`, `GameAssetPlaceholder` |

## Journey Map rules

Карта возвращения тела (`/journey`) — **вертикальная хроника пути (v3)**, не горизонтальная карта-мир.

**Layout v3:**

| Breakpoint | Структура |
|------------|-----------|
| Desktop (≥1024px) | Vertical route + chapter blocks слева, sticky `JourneyChapterDetailPanel` справа |
| Mobile (<1024px) | Одна колонка; detail раскрывается под выбранной главой (accordion) |

**Каждая глава — отдельный блок:**

- premium vignette с chapter art, интегрированным в карточку (не отдельная колонка);
- номер главы только на rail node;
- current chapter раскрыта (progress + next goal); upcoming/completed — компактные строки;
- конфиг art paths: `journeyChapterVisuals.ts` (`JOURNEY_CHAPTER_VISUALS`);
- route node + vertical rail;
- boss mini, progress, 1–3 objectives;
- **не** один giant background на все 9 глав.
- **не** вшивать текст/номера в PNG — только UI поверх art.

**Компоненты v3:** `JourneyMapV3Section`, `JourneyMapV3Route`, `JourneyChapterRoadItem`, `JourneyChapterVignette`, `JourneyMapV3SummaryBar`.

**Не использовать (legacy v2):** `JourneyMapDesktop`, horizontal Banana canvas, `JourneyStagePin` на полотне.

**Assets глав:** `public/game-assets/maps/chapters/chapter-NN-*.webp` — см. README в папке. Fallback: biome gradient без art.

Конфиг: `src/constants/journeyChapterVisuals.ts`. Стили: `src/styles/journey-map-v3.css`.

## Journey v3 vignette rules

- Chapter vignette is an atmospheric art area, not a second text card.
- Do not duplicate chapter title, subtitle, number or progress inside vignette.
- Text source of truth is the left chapter content area (`JourneyChapterRoadItem`).
- Vignette may show only biome label, decorative symbol and optional current badge.

## Accessibility

- Readable contrast in both themes
- Hero images: alt text from stage title
- Don't rely on color alone for quest status

## FAQ

Game-assets instructions live in FAQ (`src/constants/faqContent.ts`), not on Codex main view.
