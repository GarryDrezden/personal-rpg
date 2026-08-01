# Themes

## Theme Roadmap

The project supports multiple visual/gameplay themes.

Themes are not just colors. Each theme can have its own visual metaphor, progression fantasy, asset set and copywriting tone.

### Active theme work

1. **Cozy / Village Home Recovery**
2. **Slavic / Forest Myth RPG**
3. **Athlete Return / Sports Comeback**

### Existing theme

- **Dark Fantasy** remains available as a separate theme.

### Not in near-term roadmap

- **Cyberpunk** is not planned for the current theme roadmap.

---

## Product principle

Personal RPG is a **multi-theme** product. Themes are parallel emotional shells over the same core mechanics — not a single campaign path and not “stages” that replace each other.

| Theme / shell | Status | Identity |
|---------------|--------|----------|
| **Dark Fantasy** | Existing / available | Resistance states: fatigue, chaos, empty days, plateau, rollback, night eating, loss of control, old form |
| **Cozy / Village Home Recovery** | Active theme work (next major layer) | Village home: repair, garden, yard, comfort — body progress → living space |
| **Slavic / Forest Myth RPG** | Active theme work (after Cozy) | Forest myth, folk spirits, woodland path |
| **Athlete Return / Sports Comeback** | Active theme work (after Slavic) | Athletic return, career of the body |
| **Cyberpunk** | Not in near-term roadmap | Parked |

**Important:**

- Cozy is **not** the new sole course of the whole project.
- Cozy does **not** replace Dark Fantasy.
- Cozy is **not** a post-dark reward chapter.
- Themes are chosen (today via Settings `themeId`; later richer campaign catalogs).

**Shared across themes:** engines, daily metrics, season length, quest types, plateau / camp / base logic.

**Separate per theme (when fully built):** avatar line, obstacle/boss catalog, UI copy, season flavor, rewards, visual assets.

Decision log: [`../wiki/07-decision-log.md`](../wiki/07-decision-log.md).

---

## Theme distinction

Both themes use the **same core data and game systems**, but they should **express progress differently**.

### Dark Fantasy

Dark Fantasy focuses on:

- bosses;
- mobs;
- curses;
- path through darkness;
- struggle with old form;
- dramatic chapter road.

### Cozy

Cozy focuses on:

- home restoration;
- garden;
- repair;
- warmth;
- pets/companions;
- routine;
- resource;
- visible comfort;
- small improvements;
- peaceful long-term progress.

| Layer | Shared | Expressed differently |
|-------|--------|------------------------|
| Daily entries, seasons, quests, plateau, camp/base engines | ✅ | — |
| What “progress looks like” | — | Dark: path, bosses, struggle · Cozy: home, garden, warmth, comfort |
| Copy / scenes / obstacles | — | Separate catalogs — not a palette swap |

---

## Dark Fantasy (existing)

**Где:** Journey map, Codex, Boss Campaign, Seasons copy, primary dark hero assets; Settings theme `darkFantasy`.

| Элемент | Направление |
|---------|-------------|
| Герой | Human male/female, dark fantasy transformation stages |
| Боссы | Образы сопротивления и паттернов — не horror, не стыд |
| Одежда | Тёмная, нейтральная: charcoal, deep brown, muted navy |
| Палитра UI | Graphite, deep purple, gold accents |
| Mood | Собранность, путь, возвращение силы |
| Не | Яркие casual цвета, детская мультяшность, gore |

---

## Cozy Theme — Village Home Recovery

Cozy Theme is a light, warm and supportive theme built around a village home.

**Коротко (Settings):**  
Светлая тема про дом в деревне, сад, ремонт и уют. Прогресс тела превращается в восстановление своего пространства.

### Core fantasy

> The player restores the body.  
> The hero restores the home.

> Пользователь восстанавливает тело.  
> Герой восстанавливает дом.

### Progress visualization

The theme visualizes progress through:

- repairing an old village house;
- cleaning and improving rooms;
- restoring the yard;
- building a garden;
- adding cozy furniture and decorations;
- creating warm light, order and life in the home;
- unlocking small domestic improvements from daily consistency.

### Tone

This is **not** a battle-first theme.  
It should feel calm, warm, human and motivating.

The player is not punished by the world.  
The player brings the world back to life.

### Design direction

| Элемент | Направление |
|---------|-------------|
| Прогресс-метафора | Дом → комнаты → двор → сад → участок; мелкие бытовые улучшения за consistency |
| Visual mood | Свет, тепло, дерево, сад, мягкий быт, живой дом |
| Палитра UI | Linen `#f1ebe0`, paper `#fff8ee`, wood border, honey `#c4922a`, sage `#5f7a5a`, terracotta — **not** slate-white + violet |
| UI feel | Summer village home: wood/paper surfaces, soft vignette shell, garden journal seasons, warm RPG without battle neon |
| Copy | Честный взрослый тон без shame; упор на уют, ремонт, жизнь в доме |
| Camp / base | Естественно стыкуется с восстановлением дома и двора |
| Obstacles | «Запущенность» пространства (холодный очаг, сорняки, хаос в комнатах) — не бой и не тёмные боссы сопротивления |
| Не | Battle-first; наказание миром; замена Dark Fantasy; киберпанк; детская «только cute» без смысла дома |

### Cozy Progression

Cozy Theme can use the **same XP, coins, achievements and daily entries**, but **visual rewards are framed as home/garden improvements**.

Possible unlock categories:

#### House exterior

- fix porch;
- repair roof details;
- restore windows;
- paint facade;
- add warm lights;
- repair fence;
- clean yard.

#### Interior

- clean first room;
- add table;
- add stove/fireplace;
- add curtains;
- add bookshelf;
- add cozy bed;
- add kitchen details;
- add workshop corner.

#### Garden and yard

- clear weeds;
- plant flowers;
- build garden beds;
- plant herbs;
- add fruit bushes;
- add path stones;
- build greenhouse;
- add bench/swing;
- add small pond or water barrel.

#### Companions

- cat bed;
- dog corner;
- bird feeder;
- pet bowl;
- cozy companion spots.

#### Seasonal decor

- spring garden;
- summer flowers;
- autumn leaves;
- winter lights;
- holiday details.

**Design rule:** do not invent a parallel economy. Re-skin / re-frame existing rewards as domestic unlocks; keep engines shared with Dark Fantasy.

### Reward conversion

Daily and weekly progress can give **resources for cozy upgrades**.

Examples:

| Progress signal | Cozy reward framing |
|-----------------|---------------------|
| Nutrition tracking | Small repair materials |
| Steps / movement / physical activity | Path stones, yard progress, repair progress |
| Sleep / resource | Warm light or comfort upgrades |
| Alcohol-free days | Clarity / cleanliness upgrades |
| Physical activity | Repair progress |
| Weight / measurements milestones | Bigger restoration stages |
| Seasons | Major home / garden transformations |

**Important:**

- Cozy upgrades must **not** require perfection.
- Minimal days and recovery days can still give **small cozy progress**.
- Partial / soft success still feeds the home — route held is enough for a small improvement.

### Cozy Theme Copywriting Rules

Use warm, grounded and domestic language.

**Good words:**

- дом;
- двор;
- сад;
- уют;
- очаг;
- порядок;
- тепло;
- восстановление;
- маленький шаг;
- забота;
- возвращение жизни;
- ремонт;
- улучшение;
- чистый угол;
- свет в окне.

**Avoid:**

- punishment;
- failure;
- shame;
- aggressive battle language;
- “defeat yourself” tone;
- too much darkness;
- too much childish cuteness.

Cozy should feel **adult and warm**, not childish.

### Cozy Theme UI Direction

Cozy UI should feel **lighter and warmer** than Dark Fantasy.

**Visual direction:**

- warm off-white / cream backgrounds;
- soft beige / honey / sage / muted green accents;
- rounded cards;
- gentle shadows;
- subtle paper/wood texture;
- small home/garden icons;
- less neon glow;
- less black/purple;
- more natural light.

**Do not** make it look like a corporate wellness app.  
It should still feel like a **game**.

**Desired feeling:**

- cozy idle game;
- village house restoration;
- warm RPG journal;
- soft progress dashboard.

| Do | Don't |
|----|-------|
| Cream, honey, sage, soft daylight | Neon glow, heavy black/purple |
| Rounded cards, gentle shadows | Harsh chrome “wellness SaaS” look |
| Home/garden icons, paper/wood hints | Flat corporate fitness dashboard |
| Soft game / RPG journal mood | Childish sticker-book clutter |

### Cozy Dashboard Concept

In Cozy Theme, the dashboard should **not** center on a battle scene.

It should center on the **hero's home and daily care**.

**Possible structure:**

| Zone | Content |
|------|---------|
| Top | Current home / stage preview |
| Main block | «Что сегодня можно улучшить?» |
| Daily action | One main action |
| Resource card | «Сколько сил у дома и героя?» |
| Quests | Small tasks that produce repair / garden progress |
| Companion | Pet / helper inside the home or yard |
| Progress | House / garden restoration stage |

**Example copy:**

- «Сегодня можно зажечь свет в прихожей.»
- «Питание отмечено — появились материалы для кухни.»
- «Физическая активность засчитана — ремонт двора продвинулся.»
- «Сон восстановлен — в доме стало теплее.»

**UX rules:**

- Prefer home preview over boss/mob duel framing.
- One clear daily action — not a combat CTA.
- Quests explain how they feed house/garden progress.
- Companion lives in the home/yard, not as a battle familiar only.
- Soft progress language (улучшить, зажечь, продвинулось, теплее) — see Cozy Theme Copywriting Rules.

**Сегодня в продукте:** `themeId: cozy` — summer-home palette + surface CSS; Cozy Home `/home`; warmer Dashboard shell; theme-aware Летопись (альбом/журнал). Dark Fantasy shell untouched.  
**Следующий слой:** hero/scene art for house/garden; further Dashboard declutter of campaign widgets under cozy; optional copy overlay for seasons.

Идея «кот как аватар Cozy» остаётся в [`../wiki/12-ideas-backlog.md`](../wiki/12-ideas-backlog.md) как опциональная ветка, **не** как главный канон Cozy.

---

## UI themes (Settings today)

Код: `src/constants/themes.ts`, `ThemeSelector`, `src/game/assetPaths.ts`.

| ID | Название | Today | Direction |
|----|----------|-------|-----------|
| `cozy` | Светлая уютная | Light shell + light hero variants | Cozy / Village Home Recovery content layer |
| `darkFantasy` | Тёмное фэнтези | Dark shell + Dark Campaign assets/copy | Remains a separate available theme |

---

## Candidate: bright male generation

Генерация с **розовой рубашкой и жёлтыми шортами** — **cozy/light candidate**, не dark fantasy.

- Status: `candidate` in manifest
- Path (planned): `heroes/male/variants/light/stage-20-light-v1.png`
- **Не использовать** как основной asset в journey/codex до review

---

## Theme assignment rules (Asset Registry)

| Asset type | Dark Fantasy | Cozy / Village Home Recovery |
|------------|--------------|------------------------------|
| Hero / avatar stages | Human dark / dark-fantasy variants | Human light variants today; house/world scenes as Cozy expands |
| Bosses / obstacles | Resistance bosses | Soft home/yard blockers — separate catalog, not recolor |
| Season flavor / rewards | Current `seasonConfig` | Future cozy overlay or variant |
| Companions, mobs | universal / darkFantasy | Cozy alternate set; companion spots in home/yard |
| Future path prefixes (TODO) | — | `cozy/house/exterior`, `cozy/house/interior`, `cozy/garden`, `cozy/yard`, `cozy/companions`, `cozy/decor/seasonal`, `cozy/icons`, `cozy/ui` |

Documented in [`../wiki/06-assets-gallery.md`](../wiki/06-assets-gallery.md) and [`../wiki/13-art-backlog.md`](../wiki/13-art-backlog.md). **Do not** add empty TODO entries to machine `docs/assets/manifest.json` until assets exist.

---

## App themes reference

See also [`../wiki/04-brandbook.md`](../wiki/04-brandbook.md), [`ui-rules.md`](ui-rules.md).
