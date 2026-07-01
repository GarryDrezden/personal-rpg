# Decision Log

Хронология архитектурных и продуктовых решений.

---

## 2026-06-06 — Long-term campaign structure

### Context

A major body transformation can take 12–24 months. If the game depends only on weight loss, it will become frustrating during plateaus and boring over time.

### Decision

Design the game as a long-term RPG campaign with multiple time layers:

- days;
- weeks;
- 28-day seasons;
- chapters;
- acts;
- full campaign.

Weight is only one of several progress roads. The game also tracks movement, control, clarity, strength, resource, recovery and body abilities.

### Consequences

Future development should prioritize systems that create long-term retention:

- Seasons v1;
- Body Abilities;
- Plateau Mode;
- Camp/Base Progression;
- Boss Campaign.

Features should not be added randomly. They must support the long-term campaign loop.

См. [`03-game-systems.md`](03-game-systems.md) → Long-Term Game Structure.

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
