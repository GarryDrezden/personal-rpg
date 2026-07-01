# Project Wiki — Личная RPG

**Единый источник правды** для разработки, Cursor и ChatGPT.

Эта папка содержит внутреннюю проектную вики приложения «Личная RPG».

## Главные разделы

| Файл | Содержание |
|------|------------|
| [`wiki/00-project-state.md`](wiki/00-project-state.md) | **Текущее состояние** — стек, production, долги, приоритеты |
| [`wiki/01-roadmap.md`](wiki/01-roadmap.md) | Дорожная карта: сейчас / следующий спринт / позже |
| [`wiki/02-architecture.md`](wiki/02-architecture.md) | Production architecture: React + PHP + MySQL |
| [`wiki/03-game-systems.md`](wiki/03-game-systems.md) | Игровые системы (Journey, XP, bosses, …) |
| [`wiki/07-decision-log.md`](wiki/07-decision-log.md) | Журнал архитектурных решений |
| [`wiki/08-release-notes.md`](wiki/08-release-notes.md) | Release notes |
| [`wiki/10-accounts-and-storage.md`](wiki/10-accounts-and-storage.md) | Auth, user_data, storage |
| [`wiki/11-shared-hosting-php-mysql-production.md`](wiki/11-shared-hosting-php-mysql-production.md) | PHP + MySQL на shared hosting |
| [`brandbook/ui-rules.md`](brandbook/ui-rules.md) | UI rules, Journey Map rules |
| [`assets/manifest.json`](assets/manifest.json) | Реестр ассетов |

Полный индекс:

- [`wiki/04-brandbook.md`](wiki/04-brandbook.md) — краткий брендбук
- [`wiki/05-ai-prompts.md`](wiki/05-ai-prompts.md) — индекс промптов
- [`wiki/06-assets-gallery.md`](wiki/06-assets-gallery.md) — галерея ассетов
- [`wiki/09-privacy-plan.md`](wiki/09-privacy-plan.md) — правила приватности
- [`wiki/12-ideas-backlog.md`](wiki/12-ideas-backlog.md) — сырые идеи

## AI / Cursor workflow

### Перед крупной задачей читать

1. [`wiki/00-project-state.md`](wiki/00-project-state.md) — что сейчас в production и какие долги
2. [`wiki/01-roadmap.md`](wiki/01-roadmap.md) — приоритеты и «не делать пока»
3. [`wiki/02-architecture.md`](wiki/02-architecture.md) — React + PHP + MySQL, не Node в prod
4. Релевантные разделы:
   - игровая механика → [`wiki/03-game-systems.md`](wiki/03-game-systems.md)
   - UI / визуал → [`brandbook/`](brandbook/)
   - auth / storage → [`wiki/10-accounts-and-storage.md`](wiki/10-accounts-and-storage.md)
   - deploy → [`wiki/11-shared-hosting-php-mysql-production.md`](wiki/11-shared-hosting-php-mysql-production.md)

**Не перечитывать длинные чаты** — актуальное состояние должно быть в wiki.

### После крупной задачи обновлять

1. [`wiki/00-project-state.md`](wiki/00-project-state.md) — если изменился статус / долги
2. [`wiki/07-decision-log.md`](wiki/07-decision-log.md) — если принято архитектурное решение
3. [`wiki/08-release-notes.md`](wiki/08-release-notes.md) — что добавлено / изменено / исправлено
4. [`wiki/01-roadmap.md`](wiki/01-roadmap.md) — если изменились приоритеты
5. [`brandbook/*`](brandbook/) — если менялся UI / визуал / правила экранов
6. [`assets/manifest.json`](assets/manifest.json) — если менялись ассеты

## Legacy-документы

| Файл | Статус |
|------|--------|
| [`AVATAR_ASSETS.md`](AVATAR_ASSETS.md) | legacy — см. `public/game-assets/` + manifest |
| [`BOSS_ASSETS.md`](BOSS_ASSETS.md) | legacy — см. `brandbook/mobs-and-bosses.md` |
| [`HERO_MALE_AVATAR_PROMPT.md`](HERO_MALE_AVATAR_PROMPT.md) | legacy — см. `prompts/image-generation/` |
| [`HERO_STAGE_PROMPTS_V2.md`](HERO_STAGE_PROMPTS_V2.md) | legacy reference |

## Privacy

Вся `docs/` считается **публичной** (репозиторий может быть public).

**Не хранить в wiki и Git:**

- пароли, токены, API keys;
- реальный `config.php` (только `config.example.php`);
- личные фото, raw body references;
- дампы БД, `.env`, SSH-ключи.

Приватные материалы — только в `private-assets/` и `docs/private/` (gitignored).

Подробнее: [`wiki/09-privacy-plan.md`](wiki/09-privacy-plan.md).
