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
| misty_baron | seasons/season-boss-04-misty-baron.webp (`season-boss-04-misty-baron`) |
| resource_devourer | seasons/season-boss-05-resource-devourer.webp (`season-boss-05-resource-devourer`) |
| divan_king | seasons/season-boss-02-divan-king.webp (`season-boss-02-divan-king`) |
| lord_of_empty_day | seasons/season-boss-01-empty-day-lord.webp (`season-boss-01-empty-day-lord`) |
| chain_of_rollback | seasons/season-boss-07-rollback-chain.webp (`season-boss-07-rollback-chain`) |
| night_feast_baron | seasons/season-boss-08-night-feast-baron.webp (`season-boss-08-night-feast-baron`) |
| promise_collector | seasons/season-boss-09-promise-collector.webp (`season-boss-09-promise-collector`) |
| old_form_guardian | seasons/season-boss-10-old-form-guardian.webp (`season-boss-10-old-form-guardian`) |

Larger silhouette than mobs. Story entities tied to journey chapters.

---

## Weekly challenges

**Engine:** `bossEngine.ts`  
Random weekly conditions (alcohol-free days, gym visits, XP %, calories…).

Victory → XP + coins. Perfect week → bonus.

UI: Week page, Growth hub → Trials tab.

**Art (in-app):** `public/game-assets/bosses/weekly/weekly-threat-*.webp` (5 portraits), wired via `src/constants/bosses.ts` + `GAME_ASSET_VERSION`.

---

## Legacy

Old `public/bosses/*.svg` cartoons — **legacy**, no longer wired.
See [`../BOSS_ASSETS.md`](../BOSS_ASSETS.md).

Current game assets use chapter/season bosses in codex/journey and dedicated weekly threat portraits for Trials/Week.

## Prompts

- [`../prompts/image-generation/mobs.md`](../prompts/image-generation/mobs.md)
- [`../prompts/image-generation/bosses.md`](../prompts/image-generation/bosses.md)
