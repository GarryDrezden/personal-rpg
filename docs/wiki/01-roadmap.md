# Roadmap

> **Единый источник правды.** Обновлено: 2026-06-06.

## Главный приоритет

**Сначала — многопользовательская и устойчивая игра, потом — красивые ассеты.**

```
Спринт 1 ✅ → аккаунты и данные (PHP + MySQL production)
Спринт 2    → onboarding и связь ассетов с профилем
Спринт 3    → графика и наполнение
```

---

## Сейчас

- [x] PHP + MySQL production auth/storage (shared hosting)
- [x] Journey Map campaign layout (pins, detail panel, summary dock)
- [ ] PHP auth/session stabilization (cookie, `/api/auth/me` flow)
- [ ] Sidecar sync: achievements, coins, momentum → remote `user_data`
- [ ] Production smoke tests на fit-rpg.ru
- [ ] Journey Map — финальный polish (координаты, mobile QA)

---

## Следующий спринт — Onboarding + Asset Registry 2.0

**Цель:** при первом входе понятный старт; ассеты привязаны к полу, теме и стадии.

- [ ] Выбор пола персонажа
- [ ] Выбор темы (cozy / dark fantasy)
- [ ] Цели: стартовый/целевой вес, калории, шаги и т.д.
- [ ] Выбор спутника
- [ ] Связка `gender + theme + stage + asset` в `assetPaths` / manifest
- [ ] Manifest / gallery / wiki в sync с approved assets

**Критерий готовности:** новый пользователь проходит onboarding; герой и UI подтягивают правильные PNG по профилю.

---

## Позже (Спринт 3 — графика)

- [ ] Массовая генерация и approval hero stages
- [ ] Мужчина — dark / light (все 20 стадий + death)
- [ ] Женщина — dark / light (консистентность линейки)
- [ ] Мобы dark/light
- [ ] Боссы dark/light
- [ ] Codex cinematic showcase polish
- [ ] VPS / Node backend — когда будет бюджет на отдельный сервер

---

## Не делать пока

- VPS production (Node `backend/` остаётся experimental)
- OAuth (до стабильного email/login)
- Сложный battle system
- Canvas / WebGL
- Full medical analytics
- Public profiles
- **Массовая генерация всех ассетов до готового Asset Registry 2.0**

---

## Завершено

### Sprint 1: Пользователи и хранение данных ✅

- Регистрация / логин / logout через PHP + MySQL
- Профиль, настройки, `user_data` JSON
- Protected routes, legacy import
- Deploy: `dist/` + `api/` + `.htaccess`

### Недавние UI / infra

- Journey Map v2/v3: layered map, pins, detail panel, summary dock
- Project wiki + brandbook as source of truth
- GitHub Actions FTP deploy
- PHP 8.2 hosting + `health.php`
- Hero theme variant paths

См. [`08-release-notes.md`](08-release-notes.md), [`07-decision-log.md`](07-decision-log.md).
