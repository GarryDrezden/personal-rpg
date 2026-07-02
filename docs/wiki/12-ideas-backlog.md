# Ideas Backlog — сырые идеи

Заметки «на потом». Не roadmap и не принятые решения — только идеи для обсуждения и проработки.

**Как пользоваться:** новые идеи добавлять в конец с датой. Когда идея созреет — переносить в [`01-roadmap.md`](01-roadmap.md) или [`07-decision-log.md`](07-decision-log.md).

---

## 2026-06-06 — Аватар худеющего героя = кот

**Статус:** эволюция → **Cozy Campaign hero** (см. [`07-decision-log.md`](07-decision-log.md) → Campaign Tone)

**Суть:** визуальный аватар прогресса в **Cozy Campaign** — не человек, а **крупный обаятельный кот**, который постепенно становится легче, подвижнее, энергичнее и увереннее (20 стадий трансформации).

**Не путать с:** Dark Campaign MVP (human hero) и с `themeId: cozy` в Settings (сегодня — UI shell + light hero variants, не полный cozy catalog).

**Зачем:** мягкий игровой образ; альтернативный тон тем же механикам — не «после тёмной кампании».

**Вопросы на потом (Cozy Campaign sprint):**

- Отдельный `campaignTone` vs расширение `themeId`?
- Один кот для всех или варианты окраса?
- Параллельный `bossConfig` / `seasonConfig` cozy overlay?
- Отдельный набор ассетов в manifest (`cozyHero`, cozy bosses)?

**Связанные файлы:** `docs/brandbook/themes.md`, `docs/assets/manifest.json`, `src/constants/avatar.ts`, компаньон `golden_chinchilla_cat`.
