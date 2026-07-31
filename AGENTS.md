# Личная RPG — карта для агента

Короткий always-on индекс. Полные тексты — в `docs/`; не копируй вики/брендбук в ответ целиком.

## Стек (production)

| Слой | Технология |
|------|------------|
| Hosting | Shared hosting, fit-rpg.ru |
| Frontend | React 19 + TypeScript + Vite 6 → `dist/` |
| Backend | PHP 8.2 + PDO + MySQL в `api/` |
| Deploy | GitHub Actions FTP: `dist/` + `api/` + `.htaccess` |

**Запрет:** Node `backend/` — VPS-only / experimental, **не** production.

## Ключевые пути

| Зона | Путь |
|------|------|
| SPA | `src/` (`pages/`, `components/`, `game/`, `store/`) |
| API | `api/` |
| Ассеты | `public/game-assets/`, манифест `docs/assets/manifest.json` |
| Вики | `docs/wiki/` |
| Брендбук | `docs/brandbook/` |
| Промпты ассетов | `docs/prompts/` |

## Читать по задаче

- Крупная фича / статус → `docs/wiki/00-project-state.md` (+ при необходимости `01-roadmap.md`)
- Архитектура / prod → `docs/wiki/02-architecture.md`
- Механики → `docs/wiki/03-game-systems.md`
- UI / визуал → `docs/brandbook/ui-rules.md`, `docs/brandbook/visual-style.md`
- Auth / storage → `docs/wiki/10-accounts-and-storage.md`
- Deploy → `docs/wiki/11-shared-hosting-php-mysql-production.md`
- Ассет / промпт → только нужный файл в `docs/prompts/` (skill `rpg-asset-prompt`)

Индекс: `docs/README.md`.

## После крупной задачи обновить

1. `docs/wiki/00-project-state.md`
2. `docs/wiki/07-decision-log.md` — если было архитектурное решение
3. `docs/wiki/08-release-notes.md` / `01-roadmap.md` — по смыслу
4. `docs/brandbook/*` или `docs/assets/manifest.json` — если менялись UI/ассеты

Чеклист: skill `rpg-update-wiki`.
