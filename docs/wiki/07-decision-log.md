# Decision Log

Хронология архитектурных и продуктовых решений.

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
