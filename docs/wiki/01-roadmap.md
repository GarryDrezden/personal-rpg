# Roadmap

> **Единый источник правды.** Обновлено: 2026-07-21 (Stabilize closeout).

## Главный приоритет

**Сначала — стабильный core loop и многопользовательская игра, потом — годовые системы и красивые ассеты.**

```
Стабилизация → Onboarding → Core Loop Polish → Seasons v1 → … → Boss Campaign (позже)
```

**Правило:** квесты не добавляют новые обязанности — они оборачивают уже существующие daily-действия. Boss Campaign не раньше стабилизации core loop и Seasons v1.

---

## Сейчас — Stabilize ✅ (closeout)

- [x] PHP + MySQL production auth/storage (shared hosting)
- [x] Journey Map v3 vertical chapter road, per-chapter vignettes, sticky/accordion detail panel
- [x] Resource & Rest v1
- [x] PHP auth/session stabilization (cookie, `/api/auth/me` flow — HTTP dual auth)
- [x] Sidecar sync: achievements, coins, momentum → remote `user_data`
- [x] Production smoke tests на `http://fit-rpg.ru` (API: 2026-07-02 — OK)
- [x] Journey Map v3 — mobile polish (full-width road, accordion toggle/scroll, vignette band, safe-area)
- [x] Mobile layout polish (AppShell bottom safe-area under BottomNav)
- [ ] HTTPS / SSL certificate + redirect (future hardening — hosting cert, not a code blocker)

**Критерий готовности:** production стабилен на HTTP; Today + Dashboard + Journey работают на телефоне без критичных багов. HTTPS — отдельный infra-шаг.

---

## 2. Onboarding + Asset Registry 2.0

**Цель:** понятный старт кампании; ассеты привязаны к профилю.

### Onboarding v1 — Пробуждение ядра ✅

- [x] Стартовый вес
- [x] Целевой вес
- [x] Рост
- [x] Пол героя
- [x] Тема (cozy / dark fantasy)
- [x] Спутник
- [x] Ритм маршрута (мягкий / обычный / усиленный)
- [x] Первый фокус (питание / движение / ресурс / ясность / минимальный день)
- [x] Gate + `/start` flow → Today после завершения

### Asset Registry 2.0 ✅

- [x] Manifest v2 schema (categories, priorities, lifecycle statuses)
- [x] Art Backlog [`13-art-backlog.md`](13-art-backlog.md) — P0/P1/P2/P3
- [x] Naming convention + placeholder strategy
- [x] Nano Banana prompt templates (`docs/prompts/assets/`)
- [x] Runtime helpers + manifest validation tests
- [x] Journey chapters 1–9, hero/companions/mobs reflected in manifest
- [ ] Boss/base/ability **art generation** (tracked as needed — separate sprint)
- [ ] Visual polish onboarding (иллюстрации, анимации)

**Критерий готовности v1:** новый пользователь проходит «Пробуждение ядра»; данные в profile + remote settings.

---

## 3. Core Loop Polish ✅ (v1 — Today)

**Цель:** усилить формулу «внести день → реакция → прогресс → вернуться завтра».

- [x] Быстрое заполнение дня (Today) — minimal quick card, один тап
- [x] Понятная реакция игры (save reaction copy, contextual daily mob)
- [x] Понятная награда (существующие coins, momentum, progress — без новых метрик)
- [x] Надёжное сохранение (PHP `user_data`, dirty/save UX)
- [x] Minimal day / recovery day визуально сохраняют маршрут
- [ ] Отсутствие перегруза на Dashboard (остаётся для polish)

**Критерий готовности v1:** день занимает 30–60 сек; есть минимальный валидный путь; после сохранения — игровая реакция.

---

## 4. Seasons v1 ✅ → v2 ✅

**Цель:** 28-дневные арки как главный слой годового удержания.

- [x] Season config (13 сезонов, act, focus, mini-boss label, reward)
- [ ] Weekly quests (отложено — Week уже покрывает weekly trials)
- [x] Season quests (3–5 на сезон, из existing daily data)
- [x] Season progress + partial success (derived engine)
- [x] Soft season reward unlock (narrative: earned at cleared/empowered; no artifact engine / coins)
- [x] Season recap stub (chronicle tone)
- [x] Season history / летопись (`/seasons`)

**Критерий готовности v2:** летопись сезонов 1…current (+ fog); soft reward status на Dashboard/летописи; без combat, DB migration и новых daily metrics.

---

## 5. Body Abilities v1 ✅

- [x] Ability categories (mobility, endurance, dailyLife, confidence, clothing, recovery)
- [x] Manual unlock: «Я заметил улучшение»
- [x] Automatic soft hints from existing data
- [x] Storage in `settings.bodyAbilityState` (no DB migration)
- [x] Dashboard + Today hint + Growth/Freedom integration
- [ ] Deeper Freedom Score integration (v2)
- [ ] Ability art/icons (later)

**Критерий готовности v1:** пользователь отмечает наблюдения в жизни; hints не звучат как диагноз; прогресс сохраняется remote/local.

---

## 6. Plateau Mode ✅

- [x] Plateau detection (10–21 дней без улучшения веса)
- [x] Copy: «Удержание перевала»
- [x] Route holding rewards (snapshot из existing daily data)
- [x] Achievement: Страж перевала
- [x] Manual flag «Я на перевале»
- [x] Today card + Dashboard summary

**Критерий готовности v1:** мягкий режим без тона провала; route holding из существующих метрик; без DB migration.

---

## 7. Camp/Base Progression ✅

- [x] 8-stage hero camp config
- [x] Derived base score from daily, season, body ability, plateau signals
- [x] Dashboard base card
- [x] Growth hub section `/growth/camp`
- [x] Lightweight Today save feedback
- [x] No manual building, no new economy

**Критерий готовности v1:** визуальный долгий прогресс без новых обязанностей; derived only; без DB migration и ассетов.

---

## 7b. Campaign Integration QA ✅

- [x] Today block order and de-duplication
- [x] Dashboard campaign section grouping
- [x] Growth Hub navigation to abilities/camp
- [x] Freedom dedup with Growth links
- [x] Empty/progressed user copy review
- [x] Mobile layout polish (compact summaries)
- [x] Onboarding gate verified
- [x] Ready for Boss Campaign v1

---

## 8. Boss Campaign v1 ✅ → v2 ✅

- [x] Boss catalog (13 season mini-bosses, 9 chapter, 3 act)
- [x] Derived boss progress from existing data
- [x] Boss line in Today season card
- [x] Boss summary in Dashboard campaign section
- [x] Chapter boss label in Journey Map detail
- [x] Achievement «Первая трещина»
- [x] Boss history / campaign archive on Growth → Испытания (seasons, chapters, acts)
- [x] Act boss progression (derived from season seals + chapter completion)
- [x] Boss art wire for existing season assets (emoji fallback otherwise)
- [x] Full boss art set / Asset Registry generation (season mini-bosses S01–S13 dedicated webp)
- [ ] Chapter / act boss dedicated art (P2, later)

**Критерий готовности v2:** архив кампании виден; акты показывают derived progress; без combat и DB migration.  
**Season art (2026-07-22):** dedicated `season-boss-01`…`13` webp in-app via manifest (`GAME_ASSET_VERSION` 39).

---

## 9. New Game+ / Maintenance

- [ ] Режим поддержки после первого года
- [ ] Strength / mobility campaigns
- [ ] Advanced analytics

---

## 10. Cozy / Village Home Recovery (active theme work)

**Не единственный курс проекта и не замена Dark Fantasy.** Параллельная тема / оболочка над теми же mechanics: day, season, body abilities, plateau, camp/base.

**Метафора:** the player restores the body; the hero restores the home.

**Tone:** not battle-first — calm, warm, human. The player is not punished by the world; the player brings the world back to life.

**Progress fantasy:** repair house → clean/improve rooms → restore yard → build garden → cozy furniture & warm light → small domestic unlocks from daily consistency.

**Cozy Progression:** same XP/coins/achievements/daily entries; visual rewards framed as home/garden unlocks (exterior, interior, garden/yard, companion spots, seasonal decor). See [`../brandbook/themes.md`](../brandbook/themes.md) → Cozy Progression + Reward conversion.

- [x] **Cozy Home v1** — page `/home`, 8 zones L0–3, resources comfort/materials/garden/clarity, daily claim, Dashboard card, FAQ
- [x] Cozy UI direction pass v1 — summer-home palette + surfaces (`cozy-theme.css`); `/home`, Dashboard warmth, theme-aware Летопись; not sterile white
- [x] **Cozy theme branch layer** — theme-aware asset registry, cozy placeholders, terminology («Главная помеха» / «Помеха дня»), no DF art fallback in Cozy
- [ ] Cozy UI polish v2 — final house/garden scene art; replace SVG placeholders with finished illustrations
- [ ] Cozy Dashboard concept deepen (home preview art, companion in home)
- [ ] Cozy Progression unlock catalog expand (seasonal decor, more rooms)
- [x] Reward conversion map v1 (daily actions → cozy resources; spend on zones)
- [x] Soft progress on minimal/recovery days — no perfection gate
- [ ] Optional later: wire some unlocks also to XP/coins/achievements framing (keep Cozy Home resources)
- [ ] Cozy house / yard / garden progression scenes (art)
- [ ] Cozy copy overlay (season flavor, supportive home metaphors)
- [ ] Align Camp/Base visuals with home restoration
- [ ] Expand beyond UI shell: Settings `themeId: cozy` already exists; deepen content catalog
- [ ] Optional later: alternate avatar experiments (see ideas backlog) — **not** required for Cozy canon

**Shared:** engines, daily metrics, season structure. **Separate when built:** world metaphors, obstacles, copy, visuals.

См. [`07-decision-log.md`](07-decision-log.md), [`../brandbook/themes.md`](../brandbook/themes.md).

---

## 11. Theme Roadmap (active theme work)

Themes are not just colors. Each theme can have its own visual metaphor, progression fantasy, asset set and copywriting tone.

1. **Cozy / Village Home Recovery** — current focus
2. **Slavic / Forest Myth RPG**
3. **Athlete Return / Sports Comeback**

**Existing:** Dark Fantasy remains available as a separate theme.

**Not in near-term roadmap:** Cyberpunk.
---

## Позже — графика (параллельно, не блокирует core)

- [ ] Массовая генерация и approval hero stages
- [ ] Мужчина — dark / light (все 20 стадий + death)
- [ ] Женщина — dark / light (консистентность линейки)
- [ ] Мобы / боссы dark + **cozy parallel catalogs** (home/yard blockers, not light reskin of dark bosses)
- [ ] Codex cinematic showcase polish
- [ ] VPS / Node backend — когда будет бюджет

---

## Не делать пока

- VPS production (Node `backend/` остаётся experimental)
- OAuth (до стабильного email/login)
- Полноценная Boss Campaign до Core Loop + Seasons v1
- Сложный battle system
- Canvas / WebGL
- Full medical analytics
- Public profiles
- 20 новых экранов за один спринт
- **Массовая генерация всех ассетов до готового Asset Registry 2.0**
- **Cyberpunk theme** — вне near-term roadmap (паркуем)

---

## Завершено

### Sprint 1: Пользователи и хранение данных ✅

- Регистрация / логин / logout через PHP + MySQL
- Профиль, настройки, `user_data` JSON
- Protected routes, legacy import
- Deploy: `dist/` + `api/` + `.htaccess`

### Недавние UI / systems

- Journey Map v3: vertical chapter road, per-chapter vignettes, sticky/accordion detail panel, summary bar
- Resource & Rest v1
- Project wiki + brandbook as source of truth
- GitHub Actions FTP deploy
- PHP 8.2 hosting + `health.php`
- Year campaign structure documented in wiki

См. [`08-release-notes.md`](08-release-notes.md), [`07-decision-log.md`](07-decision-log.md), [`03-game-systems.md`](03-game-systems.md).
