# Roadmap

> **Единый источник правды.** Обновлено: 2026-06-06 (year campaign structure).

## Главный приоритет

**Сначала — стабильный core loop и многопользовательская игра, потом — годовые системы и красивые ассеты.**

```
Стабилизация → Onboarding → Core Loop Polish → Seasons v1 → … → Boss Campaign (позже)
```

**Правило:** квесты не добавляют новые обязанности — они оборачивают уже существующие daily-действия. Boss Campaign не раньше стабилизации core loop и Seasons v1.

---

## Сейчас — Stabilize (в процессе)

- [x] PHP + MySQL production auth/storage (shared hosting)
- [x] Journey Map v3 vertical chapter road, per-chapter vignettes, sticky/accordion detail panel
- [x] Resource & Rest v1
- [ ] PHP auth/session stabilization (cookie, `/api/auth/me` flow)
- [ ] Sidecar sync: achievements, coins, momentum → remote `user_data`
- [x] Production smoke tests на `http://fit-rpg.ru` (API: 2026-07-02 — OK)
- [ ] HTTPS / SSL certificate + redirect (future hardening)
- [ ] Journey Map v3 — polish (mobile QA, chapter art tuning)
- [ ] Mobile layout polish

**Критерий готовности:** production стабилен; Today + Dashboard + Journey работают на хостинге без критичных багов.

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

### Asset Registry 2.0 (осталось)

- [ ] Режим питания в onboarding (сейчас — через firstFocus → simple nutrition)
- [ ] Цели (калории, шаги) — частично через routeMode defaults
- [ ] Связка `gender + theme + stage + asset` в `assetPaths` / manifest
- [ ] Manifest / gallery / wiki в sync с approved assets
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

## 5. Body Abilities v1

- [ ] Ability categories
- [ ] Manual unlock: «Я заметил улучшение»
- [ ] Automatic hints
- [ ] Freedom Score integration

---

## 6. Plateau Mode

- [ ] Plateau detection (10–21 дней без улучшения веса)
- [ ] Copy: «Удержание перевала»
- [ ] Route holding rewards
- [ ] Achievement: Страж перевала

---

## 7. Camp/Base Progression

- [ ] Visual base progression (non-weight)
- [ ] Unlocks from streaks, seasons, resource, abilities
- [ ] Long-term cosmetic rewards

---

## 8. Boss Campaign

**Только после пунктов 1–6.** Не ближайший этап.

- [ ] Связать мобов, недельных элит, сезонных мини-боссов, боссов глав и актов
- [ ] Boss weakening от реальных действий
- [ ] Boss artifacts
- [ ] Seasonal trials integration

---

## 9. New Game+ / Maintenance

- [ ] Режим поддержки после первого года
- [ ] Strength / mobility campaigns
- [ ] Advanced analytics

---

## Позже — графика (параллельно, не блокирует core)

- [ ] Массовая генерация и approval hero stages
- [ ] Мужчина — dark / light (все 20 стадий + death)
- [ ] Женщина — dark / light (консистентность линейки)
- [ ] Мобы / боссы dark/light
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
