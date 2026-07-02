# Decision Log

Хронология архитектурных и продуктовых решений.

---

## 2026-07-02 — Onboarding gate (Пробуждение ядра)

### Context

New users landed on Dashboard with empty profile. Settings page was not a guided RPG start. Stabilize + HTTP smoke unblocked first-start work.

### Decision

- Route `/start` with 5-step wizard (no new DB fields).
- Completion flag + draft in existing `customSettingsBackup` (`AppSettings`).
- Body metrics in `user_profiles` via `PATCH /api/profile`.
- `OnboardingGate` redirects incomplete users; legacy profiles with weight + gender skip automatically.

### Consequences

No schema migration. Settings page unchanged. Asset Registry 2.0 polish deferred. Login still goes to `/`; gate sends new users to `/start`.

---

## 2026-06-06 — Sidecar remote persist (Stabilize)

### Context

Achievements, coins and momentum were hydrated from remote `user_data` on init but never persisted back. Progress could be lost on device/browser change.

### Decision

Wire existing `collectLocalSidecarsForSave()` to debounced `dataApi.putType()` for `achievements`, `coinTransactions`, `momentumHistory`. Trigger save from achievement/coin stores and momentum storage writes. During hydrate, skip remote save; do not apply empty remote over non-empty local sidecars.

### Consequences

No schema change. Silent debounced sync (no new UI). Legacy/local mode unchanged. Login re-triggers `appStore.init()` via `authenticated` dependency.

---

## 2026-06-06 — Year Campaign Structure

### Context

Personal RPG расширяется из короткого RPG-прототипа в годовую кампанию. Большая трансформация тела занимает 12 месяцев и больше. За это время неизбежны плато, усталость, откаты, болезни, перегруз на работе и периоды низкой мотивации. Если игра зависит только от веса, она станет фрустрирующей на плато и скучной со временем.

Трансформация на 12–24 месяца **не должна быть одним прогресс-баром веса**.

### Decision

Годовая структура строится как серия из **~13 сезонов по 28 дней**:

- временные уровни: день → неделя → сезон → глава → акт → кампания → New Game+;
- 8 параллельных дорог прогресса (Weight, Movement, Control, Clarity, Resource, Strength, Freedom, Story);
- weekly quests и season quests как обёртки над **уже существующими** daily-действиями;
- partial success в сезонах (1–2 квеста = маршрут отмечен; нет «5/5 или провал»);
- иерархия боссов: мобы дня → недельные элиты → сезонные мини-боссы → боссы глав → актовые боссы;
- ослабление боссов от реальных действий, не от абстрактного урона.

**Правило:** квесты не добавляют новые обязанности. Они превращают уже существующие ежедневные действия в игровые цели.

**Core loop:** внести день → реакция игры → прогресс → вернуться завтра.

### Why

Игра должна поддерживать маршрут даже тогда, когда вес стоит. Ключевая фраза: **«Вес стоит, но персонаж не стоит»**.

### Consequences / ограничения

Не внедрять все годовые системы одновременно. Порядок:

1. Stabilize (auth, storage, Today, Dashboard, Journey v3, Resource & Rest)
2. Onboarding
3. Core Loop Polish
4. Seasons v1
5. Body Abilities v1
6. Plateau Mode
7. Camp/Base Progression
8. Boss Campaign
9. New Game+

Features should not be added randomly. They must support return, visible progress without weight loss, and story — not turn the app into a body accounting system.

См. [`03-game-systems.md`](03-game-systems.md) → Year Campaign Structure.

---

## 2026-06-06 — Long-term campaign structure (superseded detail)

Расширено решением **Year Campaign Structure** выше. Базовые time layers и parallel roads зафиксированы в `03-game-systems.md`.

---

## 2026-06-06 — Journey Map v3 vertical chapter road

### Контекст

Journey Map v2 (horizontal Banana canvas + pins) перегружала UI, плохо масштабировалась и давала horizontal scroll. Отдельные summary-блоки дублировали detail panel.

### Решение

Journey Map v3 — **vertical chapter road**:

- 9 отдельных chapter blocks с vertical route rail (номера глав на rail node).
- Per-chapter biome vignette: `public/game-assets/maps/chapters/chapter-NN-*.webp`.
- Desktop: chapter list + sticky `JourneyChapterDetailPanel` справа.
- Mobile: одна колонка; detail accordion под выбранной главой.
- Текст главы слева в карточке; vignette справа — только art, biome label, symbol, optional badge «Сейчас».
- `JourneyMapV3SummaryBar` вверху страницы.
- Без одного giant background на все 9 глав.

### Почему

Карта должна читаться как вертикальная хроника пути; UI не должен спорить с контентом и detail panel.

### Последствия

Legacy v2 компоненты (`JourneyMapDesktop`, `JourneyMapMobile`, `JourneyPathSvg`, `JourneyChapterSummaryDock`, …) **не рендерятся**. Активные стили: `journey-map-v3.css`. Конфиг art: `journeyChapterVisuals.ts`.

---

## 2026-06-06 — Journey Map = RPG campaign map (v2, superseded)

### Контекст

Journey Map перегружался 9 большими карточками поверх фона, ломалась композиция, был horizontal scroll и дублирование информации в нижних блоках.

### Решение

1. Карта — **RPG campaign map**, не таблица глав.
2. На карте только: SVG route, nodes, compact chapter pins (`JourneyStagePin`), boss pins, active glow.
3. Полные детали выбранной главы — в `JourneyChapterDetailPanel` (desktop справа / tablet снизу).
4. «Где я сейчас и что делать» — в едином `JourneyChapterSummaryDock` под картой (не две тяжёлые карточки).
5. Mobile — отдельный vertical layout (`JourneyMapMobile`), без absolute desktop scene.

### Почему

Карта должна читаться как путешествие; UI не должен спорить с Banana-фоном и detail panel.

### Последствия

`JourneyStageCard` на desktop-карте не рендерится. Координаты pins в `journeyMapConfig.ts`. Layout: `JourneyMapSection`, `journey-map-v2.css`.

---

## 2026-06-06 — Remove legacy Windows local stack from repo

### Контекст

Production переехал на shared hosting (fit-rpg.ru). В репозитории остались `.bat`, portable nginx/PHP (`server/`), Inno Setup installer и скрипты автозапуска — они не участвуют в деплое и путали структуру проекта.

### Решение

Удалить из Git: корневые `.bat`/`.vbs`, `server/`, `installer/`, скрипты автозапуска и `dev-api.ps1`. Оставить утилиты `scripts/import-measurements.*`, `reset-data.ps1`, `remove_white_bg.py`.

### Почему

Деплой = GitHub Actions → FTP (`dist/` + `api/`). Локальная разработка: `npm run dev` + OSPanel или `php -S` в `api/`.

### Последствия

Меньше мёртвого кода в репо; README и wiki обновлены. Папки `server/runtime/` на диске разработчика можно удалить вручную (не в Git).

---

## 2026-06-06 — PHP auth session stabilization

### Контекст

После перехода production backend на PHP + MySQL при создании героя появлялась ошибка Unauthorized. Frontend показывал устаревшую подсказку про Node backend.

### Решение

Стабилизировать PHP cookie-session flow: явный `Set-Cookie` header с `Path=/`, auto-detect HTTPS, register/login подтверждают сессию через `/api/auth/me` до загрузки данных.

### Почему

На shared hosting `setcookie()` может работать ненадёжно; frontend не должен зависеть от Node.

### Последствия

Создание героя и вход работают через PHP + MySQL; debug endpoint доступен при `debug: true`.

---

## 2026-06-06 — Production backend switched to PHP + MySQL for shared hosting

### Контекст

Sprint 1 был реализован через Node/Express/Prisma/MySQL, но production — shared hosting с ispmanager, PHP LSAPI, MySQL и FTP. Node-процесс на хостинге недоступен, VPS по бюджету нет.

### Решение

Production backend на **PHP + PDO + MySQL** в `api/`, те же URL `/api/auth/*`, `/api/data/*`. Frontend auth/storage слой сохранён.

### Почему

Регистрация и user storage работают на текущем хостинге без VPS.

### Последствия

`backend/` — VPS-only эксперимент. Deploy: `dist/` + `api/` + `.htaccess`.

---

## 2026-06-06 — Accounts & Storage Foundation

### Контекст

Проект перешёл от локального/однопользовательского режима к необходимости хранить данные разных пользователей на сервере.

### Решение

Добавить регистрацию, авторизацию, MySQL, профиль пользователя, настройки пользователя и гибридное JSON-хранилище `user_data` для игровых данных. Node backend в `backend/`, сессии через httpOnly cookie.

### Почему

Это создаёт фундамент для выбора пола, целей, темы, персональных ассетов и синхронизации между устройствами без переписывания всех игровых engines.

### Последствия

Дальнейшая графическая система должна опираться на профиль пользователя и настройки, а не на статичные локальные значения. Production deploy Node+MySQL — отдельная infra-задача; PHP/SQLite остаётся для legacy import.

---

## 2026-06-06 — Вики внутри репозитория

### Контекст

Нужно общее место, которое могут читать Cursor и ChatGPT через GitHub.

### Решение

Хранить проектную вики в `docs/` внутри репозитория.

### Почему

Документация версионируется вместе с кодом и доступна AI-инструментам без Notion/CMS.

### Последствия

После крупных изменений обновлять project state, roadmap, decision log, release notes.

---

## 2026-06-06 — Публичная вики без приватных данных

### Контекст

Репозиторий может быть публичным.

### Решение

Вся `docs/` считается публичной. Приватные материалы — только в `private-assets/` и `docs/private/` (gitignored).

### Последствия

Нет личных фото, паролей, raw body references в repo.

---

## 2026-06-06 — Галерея через manifest.json

### Контекст

Много генераций hero/mob/boss, нужен статус approved/candidate/rejected.

### Решение

`docs/assets/manifest.json` — единый реестр с темами и notes.

### Последствия

При каждой новой генерации — запись в manifest + bump `GAME_ASSET_VERSION` при approved.

---

## 2026-06-06 — Яркая male-генерация = cozy candidate

### Контекст

Генерация с розовой рубашкой и жёлтыми шортами не соответствует dark fantasy линейке.

### Решение

Отнести к `theme: cozy`, `status: candidate`. Dark fantasy heroes — тёмная нейтральная одежда.

### Последствия

Не использовать как основной male hero в journey/codex до перегенерации.

---

## 2026-06-06 — Dashboard ≠ музей ассетов

### Контекст

Dashboard разрастался блоками showcase.

### Решение

Dashboard = «кто я сейчас» + «что делать сегодня» (один главный CTA). Codex = коллекции и cinematic showcase.

### Последствия

Тяжёлые asset-блоки переносить в Codex/Journey.

---

## 2026-06-06 — game-assets как единый путь ассетов

### Контекст

Legacy пути: `public/avatars/`, `public/bosses/`, `public/images/`.

### Решение

Новые ассеты только в `public/game-assets/`. Registry в `src/game/assetPaths.ts`.

### Последствия

Legacy paths остаются как fallback, но не развиваются.

---

## 2026-06-06 — FTP deploy через GitHub Actions

### Контекст

Ручной деплой на shared hosting.

### Решение

Workflow: build → FTP `dist/`, `api/`, `.htaccess`. Secrets: `FTP_*`. `data/` не деплоится.

### Последствия

База SQLite на хостинге живёт отдельно, бэкап вручную.

---

## 2026-06-06 — Будущий private repo

### Контекст

План закрыть wiki/repo.

### Решение

Зафиксировано в privacy plan. Пока — только публично-безопасный контент.

### Последствия

После перехода в private можно расширить закрытую документацию.
