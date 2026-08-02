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
5. **Cozy Theme:** center on home + daily care, not battle scene — see [`themes.md`](themes.md) → Cozy Dashboard Concept
6. **Avatar layers:** show «Стадия тела» and «Состояние героя» separately — never one misleading slim-%; body art from `bodyStage` only; Hero State via overlay/chrome (`HeroStateChrome`)
7. Avatar paths only via `getResolvedAvatarStageAsset` / `useHeroStageAssets` — no hardcoded theme paths in panels

## Navigation

- Desktop: sidebar
- Mobile: bottom bar (planned: **Today in center**)
- Growth hub: tabs (`/growth/:tab`)

## Copy tone

- Поддерживающий, взрослый
- Без shame language
- Recovery = помощь, не наказание

## Onboarding (`/start`)

- One main question per step; progress «шаг X из 6»
- Tone: campaign launch («Пробуждение ядра»), not a medical questionnaire
- Theme-aware surfaces; future themes visible as disabled «Скоро»
- Sticky Back / Next on mobile; soft validation; skippable target weight
- After finish → `/today` with soft welcome, not Dashboard dump

## Themes

Two app themes: Cozy Light / Dark Fantasy.
Hero assets follow theme assignment in manifest (see [`themes.md`](themes.md)).

## Theme Branching Rules

- Themes are not simple color modes.
- Each major theme can have its own presentation layer, assets, terminology and visual metaphor.
- Core data remains shared.
- Dark Fantasy assets must not be used as default fallback inside Cozy Theme.
- Cozy fallback should use cozy placeholders.
- Theme-specific bosses/mobs may share internal ids but must have theme-specific presentation.

Runtime helpers: `themeAssetRegistry.ts`, `themeEntityPresentation.ts`, `themeTerms.ts`.

## Components reference

| Area | Key components |
|------|----------------|
| Dashboard | `DashboardScene`, `DailyQuestsCompact`, `NextBestActionCompact` |
| Journey | `JourneyMapV3Section`, `JourneyChapterRoadItem`, `JourneyMapV3SummaryBar`, `JourneyChapterDetailPanel` |
| Codex | `HeroTransformationShowcase`, collections |
| Growth | `SkillsPage`, `BodyAbilitySkillBoard`, `GrowthHubTabs` |
| Game assets | `GameAssetImage`, `GameAssetPlaceholder` |

## Growth Skills tab (mastery roads)

`/growth/skills` — **дороги мастерства героя**, не habit-dashboard.

- Lucide/glyph icons in medallions; **no emoji** as primary skill icons
- Unified dark card shell; per-skill color = accent glow/border/rune line only
- Summary: «Общий ранг / Сильная дорога / Точка роста» — avoid «слабый», shame language
- Footer codex: «Откуда приходит опыт» — orientation, not obligation checklist
- XP/level math unchanged; UI copy lives in `src/components/skills/skillUi.ts`

## Growth Achievements tab (hero trophy collection)

`/growth/achievements` — **коллекция трофеев героя**, не checklist dashboard.

- Hero: «Коллекция героя» + прогресс коллекции; секции «Недавно получено», «Близко к открытию», «Разделы коллекции»
- Locked = «В пути»; earned = warm gold glow; close = subtle violet highlight
- Category `boss` in UI → «Испытания» (not campaign codex bosses)
- Compact cards when locked with zero progress; avoid shame language
- Achievement unlock logic unchanged; UI copy in `src/components/achievements/achievementsUi.ts`

## Growth Hub integration (2026-06)

All `/growth/:tab` siblings share dark violet/gold panel language via `src/components/growth/growthHubUi.ts`:

- Hero eyebrows + title per tab (Навыки героя, Способности тела, Лагерь, Награды героя, Коллекция героя, Испытания недели)
- Tab bar: compact gold-active pills, horizontal scroll on mobile
- Trials UI uses **угроза / испытание** — not campaign boss language
- Empty states: soft copy («лавка пока пуста», «в пути»), not «нет данных»
- Mechanics unchanged across polish passes

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
- vignette справа — только art, biome label, symbol, optional badge «Сейчас» (без title/subtitle/номера).
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

## Resource & Rest (Today / Dashboard)

- Блок **«Восстановление»** на Today: сон, разгрузка головы, энергия — поддерживающий тон, без вины.
- Dashboard: compact **«Ресурс сегодня»** — уровень, сон, голова, одна рекомендация.
- Не дублировать негатив: «ресурс просел», не «провал».

## Long-Term Motivation Rules

- Do not make weight the only source of progress.
- Do not show the whole 1–2 year path as one long bar.
- Use days, weeks, seasons, chapters and acts.
- Reward return, recovery and consistency.
- Use «route held» language instead of failure language.
- During plateaus, emphasize holding the pass.
- The player should feel progress even when weight is stable.
- Minimal day and recovery day are valid game states.

## Year Campaign UX Rules

1. День не должен занимать много времени.
2. У пользователя должен быть минимальный валидный путь.
3. Recovery day — нормальное игровое состояние, а не провал.
4. Плато должно быть заранее объяснено как «перевал».
5. Вес не должен быть единственным источником радости.
6. Большой путь должен быть разбит на понятные горизонты (неделя, сезон, глава).
7. Каждый сезон должен иметь свою историю.
8. Прогресс должен быть виден даже при неровной жизни.
9. Игра должна поддерживать, а не стыдить.
10. Сложность должна расти постепенно.
11. Квесты не должны выглядеть как список обязанностей.
12. Недельные и сезонные квесты используют уже существующие daily-данные — не добавляют новых полей.
13. Минимальный день должен визуально сохранять маршрут.
14. Награды не только за идеальное выполнение (partial success в сезонах).
15. Тон: «маршрут удержан», «ресурс просел», «день восстановления», «возврат», «перевал», «персонаж продолжает путь».
16. Годовая структура не конфликтует с Journey Map v3 (главы/акты), Resource & Rest v1, Momentum, Freedom Score, Body Abilities, PHP/MySQL storage и будущим Asset Registry — сезоны и квесты читают те же `DailyEntry` поля.

## Accessibility

- Readable contrast in both themes
- Hero images: alt text from stage title
- Don't rely on color alone for quest status

## FAQ

Game-assets instructions live in FAQ (`src/constants/faqContent.ts`), not on Codex main view.

## Physical Activity UX Rules

- Do not treat low steps as an empty day if physical activity was marked.
- Do not convert physical activity into exact calories.
- Use qualitative levels: none, light, medium, heavy.
- Heavy activity can hold movement but may lower resource.
- Explain the result in supportive language.
- Distinguish step quest vs overall movement credit.

## Cozy Home UX Rules

- Cozy Home is not a chore list.
- Home upgrades should feel like warm visual rewards for body care.
- Do not punish the player for slow progress.
- Minimal days can still bring small home progress.
- Do not require perfect days for cozy progression.
- Use warm domestic language: дом, уют, сад, двор, свет, порядок, восстановление, ремонт.
- Avoid aggressive battle language in Cozy Home.
- Keep the loop simple: daily care → resources → zone upgrade → home feels warmer.
- No house editor, drag-and-drop, or infinite decor catalog in v1.

## Today v2 UX Rules

- Group fields by meaning: body care → day path → journal trace — not a flat form.
- Offer day-mode presets (normal / minimal / recovery) near the top.
- Highlight minimal day as a valid soft path, not a failure mode.
- Show a compact reaction preview before save; after save show reaction + cozy reward feedback when granted.
- Physical activity should feel like a warm body-care card, not a technical dropdown.
- Avoid questionnaire tone; prefer short supportive leads.

## Cozy Reward Feedback UX Rules

- Show what the home received from the day.
- Keep it compact — inside or under Today save reaction, not a modal.
- Do not use modal reward spam.
- Do not imply perfect days are required.
- Mention minimal/recovery progress warmly.
- Always protect idempotency: showing feedback must not grant resources again.
- CTA opens `/home`; never auto-spend resources.

## Cozy Home Visual Rules

- **Дом** (`/home`) — главный cozy meta-screen.
- Страница должна ощущаться как тёплый деревенский дом и сад, а не как таблица улучшений.
- Использовать дерево, зелень, летний свет, мягкие натуральные поверхности (лён / бумага / штукатурка).
- Hero-блок дома важнее обычных карточек: прогресс, ресурсы, статус, мягкая сцена/placeholder.
- Placeholder дома — CSS/SVG силуэт (дом, солнце, кусты, тёплое окно), без технического «PLACEHOLDER».
- Resource chips: Уют (honey), Материалы (wood), Сад (sage), Ясность (soft sky/gold) — читаемые, не огромные.
- Карточки зон — маленькие комнаты/участки с мягким тоном по типу зоны; «Можно улучшить» видно сразу.
- Орнаменты допустимы только фоново и низкоконтрастно (листья, веточки).
- Не использовать dark fantasy art или battle tone.
- Empty states должны поддерживать, а не обвинять.
- Даже минимальный день может дать маленький уютный прогресс.

## Body Abilities UX Rules

- Never show the same fixed mobility list to every user.
- Setup tone: «карта твоя, не универсальная» — no shame language.
- Subjective changes (shoes, floor, stairs feel) need user confirmation or manual mark — not silent auto-unlock.
- Auto unlocks only for clear data thresholds (weight/waist/streaks).
- Theme changes flavor/title/icon only; core ability IDs stay shared.
- Empty state on `/freedom`: invite to configure the map, not a medical checklist.
- After setup, show a short preview («Вот какой получится твоя карта») — count, categories, 5–6 examples — before save. Do not dump all ~24 in the wizard.
- Preview copy may say: we will not show what already feels normal for the user.
- «Пересобрать карту» needs a confirm: unlocked stay; the rest rebuilds. No random shuffle.
- Ability copy: respectful, no assumed disability, no medical promises. Distinguish body/functional change from route milestones in tone when helpful.
- Existing users get a soft upgrade banner / Settings entry — never a forced onboarding wall. Cancel must leave the map unchanged.
- Setup modes: `initial` | `edit` | `regenerate`; rebuild copy warns that unlocked achievements are kept.
- `/freedom` personal map: feel like a capability map, not an achievement checklist. Unconfigured → primary CTA «Настроить карту тела». Configured → clear summary (goal / path / interests / opened). Cards: suggested soft highlight, unlocked as reward, archived calm. Filters: Все / Можно подтвердить / Открыто / Долгий путь. Cozy = light/home/warmth; Dark Fantasy = seals/artifacts/path. Keep card copy short; mobile = 1 column.

## Cozy Content Rules

- Do not copy Dark Fantasy content and only rename it.
- Cozy conflict should feel like household, garden, rhythm or recovery obstacles.
- Avoid horror, curses, domination and dramatic battle metaphors.
- Use repair, warmth, order, light, garden, home and small-step language.
- Even hard days should sound like the house asking for recovery, not like the player losing a battle.
- Shared IDs are fine; presentation (`cozyContentPack` + `themeContentRegistry`) must diverge.

## Theme / shell UX Rules

- Themes are not just colors: each can have its own metaphor, progression fantasy, assets and copy tone.
- The product is **multi-theme**: Cozy does not replace Dark Fantasy.
- Same core data/systems; **different progress expression** (see Theme distinction in `themes.md`).
- Dark Fantasy: bosses, mobs, curses, path through darkness, old form, dramatic chapter road.
- Cozy: home restoration, garden, repair, warmth, companions, routine, resource, visible comfort, small improvements, peaceful long-term progress.
- Settings theme cards describe the **emotional shell**, not a different game.
- Cozy / Village Home Recovery: calm, warm, human — **not** battle-first; the player brings the world back to life.
- Metaphor to keep: the player restores the body; the hero restores the home.
- Progress fantasy: house repair → rooms → yard → garden → domestic improvements from daily consistency.
- Cozy Progression: Cozy Home v1 adds soft spendable resources (Уют / Материалы / Сад / Ясность) from the daily loop; still not a chore list or house sim.
- Reward conversion: daily signals → cozy resources → zone upgrades on `/home` (nutrition→comfort, steps/PA→materials+garden, sleep→comfort, sober/journal/breaks→clarity).
- Cozy upgrades must not require perfection; minimal/recovery days still grant small cozy progress.
- Cozy copywriting: warm, grounded, domestic (дом, двор, сад, уют, очаг, тепло, маленький шаг, забота, свет в окне). Adult and warm — not childish.
- Cozy avoid: punishment, failure, shame, aggressive battle language, “defeat yourself”, too much darkness, too much childish cuteness.
- Cozy UI: **not** sterile white SaaS / not “lightened Dark Fantasy”. Summer home language: linen/cream/beige base, sage garden, honey sun, wood brown, soft terracotta. Rounded paper/wood cards, gentle shadows, no purple accents as secondary. Adult premium cozy — not cartoon, not neon green.
- Cozy tokens live in `src/index.css` (`[data-theme='cozy']`) + patterns in `src/styles/cozy-theme.css` (surfaces, chips, zone cards, season chronicle forks, sidebar warmth).
- Cozy Dashboard: warmer shell + integrated «Дом становится теплее»; campaign cards keep hierarchy but sit on natural surfaces. Still one clear daily action.
- Cozy Home `/home`: hero restoration block + material zone cards (level pills, ready badges, soft unavailable, honey CTA), resource chips by material color — not a flat upgrade table.
- Cozy Seasons: “садовый журнал / сезонный альбом” — theme-forked chronicle hero/cards (no hard-coded violet panels under cozy).
- Active theme work order: Cozy → Slavic / Forest Myth → Athlete Return / Sports Comeback.
- Cyberpunk is not in the near-term theme roadmap.
