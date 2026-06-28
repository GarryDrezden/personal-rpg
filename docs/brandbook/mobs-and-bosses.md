# Mobs and Bosses

## Terminology

| Term (RU) | English | Where | Meaning |
|-----------|---------|-------|---------|
| **Моб дня** | Daily mob | Codex | Мелкое ежедневное «препятствие» (привычка/состояние) |
| **Босс главы** | Chapter boss | Journey map | Сюжетная веха пути, 8 entities |
| **Испытание недели** | Weekly challenge | Week, `/growth/trials` | Недельный вызов с условиями и наградой |

**Не путать:** chapter boss ≠ weekly trial boss.

---

## Daily mobs (8)

Codex collection. Assets: `public/game-assets/mobs/`.

| ID | File | Theme |
|----|------|-------|
| sofa_magnet | sofa-magnet.png | Лень, диван |
| snack_chaos | snack-chaos.png | Хаос перекусов |
| fog_of_fatigue | fog-of-fatigue.png | Усталость |
| empty_day | empty-day.png | Пустой день |
| impulse_of_rollback | impulse-of-rollback.png | Импульс отката |
| night_call | night-call.png | Ночной зов |
| gray_heaviness | gray-heaviness.png | Серая тяжесть |
| sweet_whisper | sweet-whisper.png | Сладкий шёпот |

Tone: personified obstacles, **not** shame monsters. Dark fantasy stylization, not horror.

---

## Chapter bosses (8)

Journey narrative. Assets: `public/game-assets/bosses/`.

| ID | File |
|----|------|
| misty_baron | misty-baron.png |
| resource_devourer | resource-devourer.png |
| divan_king | divan-king.png |
| lord_of_empty_day | lord-of-empty-day.png |
| chain_of_rollback | chain-of-rollback.png |
| night_feast_baron | night-feast-baron.png |
| promise_collector | promise-collector.png |
| old_form_guardian | old-form-guardian.png |

Larger silhouette than mobs. Story entities tied to journey chapters.

---

## Weekly challenges

**Engine:** `bossEngine.ts`  
Random weekly conditions (alcohol-free days, gym visits, XP %, calories…).

Victory → XP + coins. Perfect week → bonus.

UI: Week page, Growth hub → Trials tab.

---

## Legacy

Old weekly boss IDs and `public/bosses/` SVG — **legacy**.
See [`../BOSS_ASSETS.md`](../BOSS_ASSETS.md) (archived reference).

Current game assets use chapter bosses in codex/journey and separate weekly trial system.

## Prompts

- [`../prompts/image-generation/mobs.md`](../prompts/image-generation/mobs.md)
- [`../prompts/image-generation/bosses.md`](../prompts/image-generation/bosses.md)
