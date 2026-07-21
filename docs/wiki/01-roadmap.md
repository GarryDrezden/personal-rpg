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

## 4. Seasons v1 ✅

**Цель:** 28-дневные арки как главный слой годового удержания.

- [x] Season config (13 сезонов, act, focus, mini-boss label, reward)
- [ ] Weekly quests (отложено — отдельный слой)
- [x] Season quests (3–5 на сезон, из existing daily data)
- [x] Season progress + partial success (derived engine)
- [ ] Season reward / artifact unlock (narrative label only в v1)
- [x] Season recap stub (chronicle tone, без экрана)
- [ ] Season history (Seasons v2)

**Критерий готовности v1:** текущий сезон виден на Today/Dashboard; квесты считаются из daily entries; partial success без наказаний.

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

## 8. Boss Campaign v1 ✅

- [x] Boss catalog (13 season mini-bosses, 9 chapter, 3 act)
- [x] Derived boss progress from existing data
- [x] Boss line in Today season card
- [x] Boss summary in Dashboard campaign section
- [x] Chapter boss label in Journey Map detail
- [x] Achievement «Первая трещина»
- [ ] Boss art / Asset Registry 2.0 (v2)
- [ ] Boss history page (v2)
- [ ] Act boss progression (v2)

**Критерий готовности v1:** narrative derived layer без combat и новых обязанностей.

---

## 9. New Game+ / Maintenance

- [ ] Режим поддержки после первого года
- [ ] Strength / mobility campaigns
- [ ] Advanced analytics

---

## 10. Cozy Campaign (future — parallel tone)

**Не post-dark.** Альтернативная эмоциональная версия тех же mechanics: day, season, body abilities, plateau, camp/base.

- [ ] Cozy obstacle/boss catalog (сонные духи, игривые блокеры, шкодники)
- [ ] Cat hero avatar line (20 stages — lighter, agile, energetic, confident)
- [ ] Separate season flavor, copy, rewards, assets from Dark Campaign
- [ ] Onboarding / settings: choose campaign tone (future; today `themeId` = UI shell only)

**Shared:** engines, daily metrics, season structure. **Separate:** avatar, enemies, copy, visuals.

См. [`07-decision-log.md`](07-decision-log.md) → Campaign Tone.

---

## Позже — графика (параллельно, не блокирует core)

- [ ] Массовая генерация и approval hero stages
- [ ] Мужчина — dark / light (все 20 стадий + death)
- [ ] Женщина — dark / light (консистентность линейки)
- [ ] Мобы / боссы dark + **cozy parallel catalogs** (not light reskin of dark bosses)
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
