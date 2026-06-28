# Cursor Prompt Library

## Правила

Каждый крупный Cursor prompt должен:

- иметь **дату**;
- иметь **цель**;
- иметь **список файлов/зон**;
- иметь **критерии проверки**;
- после выполнения обновлять `wiki/00-project-state.md` и `wiki/07-decision-log.md`.

## Формат имени

```
YYYY-MM-DD-short-task-name.md
```

Пример: `2026-06-06-journey-map-layout.md`

## Шаблон prompt-файла

```md
# [Title]

**Date:** YYYY-MM-DD  
**Goal:** …

## Context files to read
- docs/wiki/00-project-state.md
- …

## Files to modify
- …

## Acceptance criteria
- [ ] …

## After completion
- [ ] Update project-state
- [ ] Decision log entry
- [ ] Release notes if user-facing
```

## Перед крупной задачей (стандартный блок)

```
Read first:
1. docs/wiki/00-project-state.md
2. docs/wiki/01-roadmap.md
3. Relevant docs/brandbook/* and docs/wiki/03-game-systems.md
4. docs/wiki/09-privacy-plan.md — no private data in commits
```

## Prompts archive

Сохраняй завершённые промпты в этой папке:

```
docs/prompts/cursor/
  2026-06-06-wiki-structure.md   ← example (this task)
```

## Связь с image prompts

Генерация ассетов — отдельно: [`../image-generation/README.md`](../image-generation/README.md)
