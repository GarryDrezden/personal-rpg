# Art Backlog

> **Asset Registry 2.0** — приоритеты визуальных ассетов без генерации в этом спринте.
> Машиночитаемый реестр: [`../assets/manifest.json`](../assets/manifest.json).
> Промпты: [`../prompts/assets/`](../prompts/assets/).

## Как читать таблицу

| Поле | Значение |
|------|----------|
| **Статус** | `idea` → `needed` → `prompt-ready` → `generated` → `processed` → `in-app` → `done` |
| **Промпт** | `missing` / `planned` / `ready` |
| **Файл** | `missing` / `planned` / `ready` |
| **Manifest** | `registered` когда запись есть в manifest.json |
| **Prompt file** | `docs/prompts/assets/{asset-id}.md` |

## Naming convention

```
public/game-assets/{folder}/{entity-type}-{index}-{semantic-name}.webp
```

Примеры:

- `public/game-assets/bosses/seasons/season-boss-01-empty-day-lord.webp`
- `public/game-assets/bosses/chapters/chapter-boss-01-ruins-warden.webp`
- `public/game-assets/base/base-stage-01-ember-camp.webp`
- `public/game-assets/abilities/ability-mobility-shoes.webp`
- `public/game-assets/rewards/season-01-core-spark.webp`

Правила: lowercase, kebab-case, `.webp` preferred, тяжёлые исходники не в `public/`.

## Placeholder strategy

1. **Каждый отсутствующий ассет** — безопасный fallback (emoji / icon / glow / gradient card).
2. **Никогда** не подставлять несуществующий `src` в `<img>` — `getAssetPathOrNull()` в `src/game/assetManifest.ts`.
3. **Journey chapters** — CSS gradient если `.webp` недоступен (уже в prod).
4. **Boss Campaign v1** — emoji из `bossConfig` до появления арта.
5. **Body Abilities / Camp** — emoji из config до иконок/сцен.

---

## P0 — MVP Visual Core

> Важно учесть и не потерять. **Не значит «срочно генерировать».**

### Мужской герой (anchor stages)

| Название | Тип | Где используется | Связанная система | Статус | Приоритет | Промпт | Файл | Manifest | Комментарий |
|----------|-----|------------------|-------------------|--------|-----------|--------|------|----------|-------------|
| Male stage 01–03, 19–20 | hero-stage | Dashboard, Codex, Journey | heroStages | in-app | P0 | ready | ready | registered | Anchor PNG в `public/` |
| Male stages 04–18 (variant) | hero-stage | assetPaths fallback | heroStages | in-app | P0 | ready | ready | registered | `variants/dark-fantasy/` |
| Journey chapter 1–9 | journey-chapter-bg | Journey Map v3 | journeyChapterVisuals | in-app | P0 | ready | ready | registered | `.webp` в `maps/chapters/` |
| Companions ×4 | companion | Onboarding, Codex | assetRegistry | in-app | P0 | ready | ready | registered | PNG approved |
| Body ability icons ×12 | body-ability-icon | Growth abilities | bodyAbilityConfig | needed | P0 | planned | missing | registered | Emoji placeholder |
| Camp base stage 1 (ember) | camp-base-scene | Dashboard, /growth/camp | baseProgressionConfig | needed | P0 | ready | missing | registered | Prompt template ready |
| Season boss (current) | season-mini-boss | SeasonTodayCard | bossCampaign v1 | needed | P0 | ready* | missing | registered | Emoji until art; *S01–02 prompts first |
| Onboarding core awakening | onboarding-hero | /start | Onboarding v1 | needed | P0 | ready | missing | registered | Text ritual OK without image |
| Empty states ×2 | empty-state | Dashboard, Growth | UI | needed | P0 | planned | missing | registered | Gradient + symbol |

**Prompt file:** см. [`_template-nano-banana-asset.md`](../prompts/assets/_template-nano-banana-asset.md)

---

## P1 — Campaign Visual Polish

### Season mini-bosses (13)

| Название | Тип | Где используется | Связанная система | Статус | Приоритет | Промпт | Файл | Manifest |
|----------|-----|------------------|-------------------|--------|-----------|--------|------|----------|
| Владыка Пустого Дня … Тень Старого Года | season-mini-boss | Season cards | bossConfig SEASON_MINI_BOSSES | needed | P1 | planned | missing | registered |

**Prompt file:** [`_template-boss.md`](../prompts/assets/_template-boss.md) → `docs/prompts/assets/season-boss-NN.md`

### Camp / base scenes (8)

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| Тлеющий костёр → Цитадель формы | camp-base-scene | /growth/camp | baseProgressionConfig | needed | P1 | planned | missing | registered |

### Daily mobs (improve)

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| 8 daily mobs | mob | Today, Codex | dailyMobEngine | **in-app** | P1 | ready | ready | registered | Polish / .webp migration later |

### Season rewards (13)

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| Искра ядра … Артефакт года | season-reward | Season summary | seasonConfig | needed | P1 | planned | missing | registered |

### Plateau artifact

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| Страж перевала | plateau-artifact | Plateau card | plateauEngine | needed | P1 | planned | missing | registered |

### Improved companions / onboarding

| Название | Тип | Где | Система | Статус | P | Промпт | Файл | Manifest |
|----------|-----|-----|---------|--------|---|--------|------|----------|
| Companion polish | companion | Codex | assetRegistry | in-app | P1 | ready | ready | registered | Optional .webp refresh |
| Onboarding illustrations | onboarding-art | /start | Onboarding | needed | P1 | ready | missing | registered |

---

## P2 — Future Expansion

| Название | Тип | Где | Система | Статус | P | Комментарий |
|----------|-----|-----|---------|--------|---|-------------|
| Chapter bosses ×9 | chapter-boss | Journey detail | bossConfig CHAPTER_BOSSES | needed | P2 | Emoji in v1 |
| Act bosses ×3 | act-boss | future act UI | bossConfig ACT_BOSSES | needed | P2 | Not in UI v1 |
| Codex artifact set (15) | artifact-set | Codex | assetRegistry | needed | P2 | Paths in code |
| Achievement badge set | achievement-badge | Growth | achievements.ts | needed | P2 | iconKey per achievement |
| Female hero full polish | hero-stage | Dashboard | female 1–20 in-app | in-app | P2 | Already in repo; P2 for theme parity |

---

## P3 — Later / Nice to have

| Название | Тип | Статус | Комментарий |
|----------|-----|--------|-------------|
| Logo dark fantasy | logo | needed | Heraldic Huginn/Muninn |
| New Game+ art | — | idea | **Out of scope** — track only |
| Alternate themes | hero-variant | idea | Cozy/light variants |
| Advanced animations | — | idea | Hero stage transitions |
| Seasonal recap illustrations | season-recap | idea | No recap screen in v1 |
| Male hero stages 4–18 root PNG | hero-stage | partial | Variants cover runtime |

---

## Workflow

```
Backlog (this file) → prompt file → generate (manual) → public/game-assets/
→ manifest status in-app → bump GAME_ASSET_VERSION → optional UI wire
```

## Связанные документы

- [`06-assets-gallery.md`](06-assets-gallery.md) — галерея и manifest schema
- [`04-brandbook.md`](04-brandbook.md) — визуальное направление
- [`05-ai-prompts.md`](05-ai-prompts.md) — общий workflow промптов
