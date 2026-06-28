# Roadmap

> Обновлено: 2026-06-06

## Главный приоритет

**Сначала — многопользовательская и устойчивая игра, потом — красивые ассеты.**

Иначе получится красивый фасад на временном хранении (localStorage / один SQLite без аккаунтов).

```
Спринт 1 → аккаунты и данные
Спринт 2 → onboarding и связь ассетов с профилем
Спринт 3 → графика и наполнение
```

---

## Спринт 1: Пользователи и хранение данных ✅

**Цель:** игра становится многопользовательской, данные живут на сервере, роуты защищены.

- [x] Регистрация / логин / logout
- [x] MySQL + Prisma (`backend/`)
- [x] Профиль пользователя (`UserProfile`)
- [x] Настройки per user (`UserSettings`)
- [x] JSON `UserData` для игровых payload
- [x] Перенос данных (SQLite script + localStorage banner)
- [x] Защита роутов (ProtectedRoute, auth API)

**Критерий готовности:** пользователь входит с другого устройства и видит свои данные; без логина — только `/login` и `/register`.

См. [`10-accounts-and-storage.md`](10-accounts-and-storage.md).

---

## Спринт 2: Onboarding + asset registry

**Цель:** при первом входе понятный старт; ассеты привязаны к полу, теме и стадии.

- [ ] Выбор пола
- [ ] Выбор темы (cozy / dark fantasy)
- [ ] Цели (вес, калории, шаги и т.д.)
- [ ] Связь stage / theme / gender с ассетами (`assetPaths`, variants)
- [ ] Manifest / gallery / wiki в sync с approved assets

**Критерий готовности:** новый пользователь проходит onboarding; герой и UI подтягивают правильные PNG по профилю.

---

## Спринт 3: Графика

**Цель:** визуально наполнить уже устойчивую игру.

- [ ] Мужчина — dark / light (все 20 стадий + death)
- [ ] Женщина — dark / light (консистентность линейки)
- [ ] Мобы
- [ ] Боссы
- [ ] Карта пути (journey polish)
- [ ] Codex (cinematic showcase, коллекции)

**Критерий готовности:** approved-набор в `manifest.json`, `GAME_ASSET_VERSION` актуален, нет placeholder на prod-линейке.

---

## Сейчас

- [x] PHP + MySQL production auth/storage (shared hosting)
- [ ] Production smoke test на fit-rpg.ru
- [ ] Stabilize remote autosave (sidecar sync)

- [x] Проектная вики и брендбук
- [x] Галерея ассетов (`docs/assets/manifest.json`)
- [x] Journey map + Codex (базовый UI)
- [x] Hero theme variants (dark-fantasy / light) + placeholders
- [x] GitHub Actions FTP deploy
- [ ] Dashboard polish (размер героя, один главный CTA)
- [ ] Male hero stages 4–18 — **переносится в Спринт 3**, не блокирует Спринт 1

---

## Ближайшие задачи

- [ ] Onboarding flow (Sprint 2)
- [ ] Asset registry 2.0 — gender/theme/profile binding
- [ ] Mobile navigation: Today в центре
- [ ] Growth hub / Data hub polish
- [ ] Production Node backend hosting

---

## Средний срок (после Спринта 1–2)

- [ ] AI food photo helper
- [ ] Better asset pipeline (automated manifest updates)
- [ ] Companion role integration в journey/dashboard
- [ ] Weekly story reports enhancement
- [ ] Sync between devices (естественно после аккаунтов)

---

## Позже

- [ ] Private wiki / private repo
- [ ] Production hosting hardening (backup, monitoring)
- [ ] More companions
- [ ] Premium paired hero + companion scenes
- [ ] Advanced boss mechanics

---

## Не делать пока

- OAuth (до стабильного email/login)
- Complex battle system
- Canvas / WebGL
- Full medical analytics
- Public profiles
- Массовая генерация ассетов **до** Спринта 1 (фасад без фундамента)

---

## Завершено (недавно)

- **Sprint 1:** accounts, MySQL, auth, user_data, protected routes, legacy import
- Journey development map UI
- Nutrition modes (disabled / simple / precise)
- Freedom Score + Momentum systems
- FTP CI deploy + чистая структура на хостинге
- PHP 8.2 hosting + `health.php`
- Hero theme variant paths (`variants/light`, `variants/dark-fantasy`)
