# Themes

## Campaign tones (product decision)

Personal RPG supports **two campaign tones** over the same core mechanics (day, season, body abilities, plateau, camp/base, campaign obstacles).

| Tone | Status | Identity |
|------|--------|----------|
| **Dark Campaign** | **MVP-1 (current)** | Resistance states: fatigue, chaos, empty days, plateau, rollback, night eating, loss of control, old form |
| **Cozy / Light Campaign** | Future parallel variant | Kinder fantasy: cute obstacles, sleepy spirits, playful blockers, cozy «шкодники» |

**Important:** Cozy is **not** a later «post-dark» chapter. It is an **alternative emotional skin** of the same systems — chosen at onboarding or in settings (future), not earned by finishing the dark path.

**Shared:** engines, daily metrics, season length, quest types, plateau/camp/base logic.

**Separate per tone:** avatar, enemy/boss catalog, UI copy, season names/flavor, rewards, visual assets.

Decision log: [`../wiki/07-decision-log.md`](../wiki/07-decision-log.md).

---

## Dark Campaign (MVP-1)

**Где:** Journey map, Codex, Boss Campaign v1, Seasons v1 copy, primary hero assets.

| Элемент | Направление |
|---------|-------------|
| Герой | Human male/female, dark fantasy transformation stages |
| Боссы | Образы сопротивления и паттернов — не horror, не стыд |
| Одежда | Тёмная, нейтральная: charcoal, deep brown, muted navy |
| Палитра UI | Graphite, deep purple, gold accents |
| Mood | Собранность, путь, возвращение силы |
| Не | Яркие casual цвета, детская мультяшность, gore |

## Cozy / Light Campaign (future)

**Где:** Alternate campaign track when implemented — not just UI theme swap.

| Элемент | Направление |
|---------|-------------|
| Герой | Крупный обаятельный **кот** — постепенно легче, подвижнее, энергичнее, увереннее |
| «Враги» | Милые препятствия: сонные духи, игривые блокеры, cozy шкодники — не тёмные боссы |
| Одежда / форма | Мягкие, тёплые; допустима ярче |
| Палитра UI | Cream, soft green, warm amber |
| Mood | Уют, поддержка, мягкий прогресс, позитивный фэнтези |
| Copy | Тот же честный взрослый тон — без shame language |

## UI themes (Settings today)

`themeId` in Settings (`cozy` / `darkFantasy`) currently switches **visual shell** (hero variant paths, palette). Full **Cozy Campaign** content layer is a separate future sprint.

| ID | Название | Today | Future |
|----|----------|-------|--------|
| `darkFantasy` | Тёмное фэнтези | Dark Campaign MVP copy + assets | — |
| `cozy` | Светлая уютная | Light hero variants + cozy UI | Full Cozy Campaign catalog |

Код: `src/constants/themes.ts`, `src/game/assetPaths.ts`

## Candidate: bright male generation

Генерация с **розовой рубашкой и жёлтыми шортами** — **cozy/light candidate**, не dark fantasy.

- Status: `candidate` in manifest
- Path (planned): `heroes/male/variants/light/stage-20-light-v1.png`
- **Не использовать** как основной asset в journey/codex до review

## Theme assignment rules (Asset Registry)

| Asset type | Dark Campaign | Cozy Campaign (future) |
|------------|---------------|------------------------|
| Hero / avatar stages | `category: hero` / `femaleHero` | Separate cat avatar track (TBD) |
| Bosses / obstacles | `seasonBosses`, `chapterBosses`, … | Parallel cozy catalog — separate manifest ids |
| Season flavor / rewards | Current `seasonConfig` | Future cozy `seasonConfig` variant or overlay |
| Companions, mobs | universal / darkFantasy | Cozy re-skin or alternate set (TBD) |

## App themes reference

See also [`../wiki/04-brandbook.md`](../wiki/04-brandbook.md).
