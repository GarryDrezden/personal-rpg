# Project Wiki — Личная RPG

Эта папка содержит внутреннюю проектную вики приложения «Личная RPG».

## Главные разделы

- [`wiki/00-project-state.md`](wiki/00-project-state.md) — текущее состояние проекта
- [`wiki/01-roadmap.md`](wiki/01-roadmap.md) — дорожная карта
- [`wiki/02-architecture.md`](wiki/02-architecture.md) — архитектура
- [`wiki/03-game-systems.md`](wiki/03-game-systems.md) — игровые системы
- [`wiki/04-brandbook.md`](wiki/04-brandbook.md) — краткий брендбук
- [`wiki/05-ai-prompts.md`](wiki/05-ai-prompts.md) — индекс промптов
- [`wiki/06-assets-gallery.md`](wiki/06-assets-gallery.md) — галерея ассетов
- [`wiki/07-decision-log.md`](wiki/07-decision-log.md) — журнал решений
- [`wiki/08-release-notes.md`](wiki/08-release-notes.md) — release notes
- [`wiki/09-privacy-plan.md`](wiki/09-privacy-plan.md) — правила приватности
- [`wiki/10-accounts-and-storage.md`](wiki/10-accounts-and-storage.md) — аккаунты, MySQL, auth (Sprint 1)

## Legacy-документы

Старые материалы сохранены и связаны ссылками:

| Файл | Статус |
|------|--------|
| [`AVATAR_ASSETS.md`](AVATAR_ASSETS.md) | legacy — заменён `public/game-assets/` + manifest |
| [`BOSS_ASSETS.md`](BOSS_ASSETS.md) | legacy — см. `brandbook/mobs-and-bosses.md` |
| [`HERO_MALE_AVATAR_PROMPT.md`](HERO_MALE_AVATAR_PROMPT.md) | legacy — см. `prompts/image-generation/hero-male-stages.md` |
| [`HERO_STAGE_PROMPTS_V2.md`](HERO_STAGE_PROMPTS_V2.md) | legacy reference — полные промпты стадий |

## Для Cursor и AI

**Перед крупной задачей читать:**

1. [`wiki/00-project-state.md`](wiki/00-project-state.md)
2. [`wiki/01-roadmap.md`](wiki/01-roadmap.md)
3. relevant brandbook / game systems files

**После крупной задачи обновлять:**

1. [`wiki/00-project-state.md`](wiki/00-project-state.md)
2. [`wiki/01-roadmap.md`](wiki/01-roadmap.md), если изменились приоритеты
3. [`wiki/07-decision-log.md`](wiki/07-decision-log.md)
4. [`wiki/08-release-notes.md`](wiki/08-release-notes.md)
5. [`assets/manifest.json`](assets/manifest.json), если менялись ассеты
6. [`wiki/04-brandbook.md`](wiki/04-brandbook.md) или [`brandbook/*`](brandbook/), если менялся стиль

## Privacy

Сейчас вики может быть публичной, потому что репозиторий может быть публичным.
Не хранить здесь приватные фото, пароли, токены, реальные `.env`, SSH-ключи или личные медицинские данные.

Подробнее: [`wiki/09-privacy-plan.md`](wiki/09-privacy-plan.md).
