# Content principles

Canonical rules for presentation copy in Personal RPG.  
Not a new game system. Audit: [`../audits/content-depth-v1.md`](../audits/content-depth-v1.md).

1. **Context before randomness.** Eligible pool comes from theme, day mode, tracking flags, and known signals. Random soup is not variety.
2. **Same-day text is stable.** Reloading an unchanged day must not shuffle the line. Selection is `date + family + theme + extra`, hashed. No `Math.random()` on render.
3. **Avoid immediate repetition.** Do not show the same variant ID two days in a row when the pool allows. Lookback is reconstructed from the date seed (last 3 days). No giant content-history store.
4. **Themes change presentation, not facts.** Cozy and Dark Fantasy share entity IDs and mechanics. A nutrition-held day stays nutrition-held; only the metaphor changes. Theme switch may change today's chrome; saved Chronicle strings stay as stored.
5. **No shame.** No punishment, failure identity, «ты опоздал», death, game-over, or self-humiliation.
6. **No invented emotions.** Copy may describe logged facts (steps, recovery mode, a gap). It must not diagnose mood, motivation, or psychology.
7. **High-frequency content needs larger pools.** Today reactions, daily obstacles, companion micro-lines, and NEXT phrasing are seen almost every day. Journey chapters and bosses are low-frequency; depth is state flavor, not more entities.
8. **Copy stays short enough for UI.** Micro-reactions ≈ one line. Over ~120 characters is a lab flag, not always a hard fail.
9. **World reacts; it does not lecture.** Home, companion, obstacle, and season answer the day. They do not coach, therapy-talk, or sell productivity.
10. **Variety should not obscure meaning.** A reaction must still say what happened. Concrete names (zone, ability, resource deficit) beat a prettier synonym.

## Cadence tiers

| Tier | Cadence | Pool size (orientation) |
|------|---------|-------------------------|
| High | Almost daily | ~20–40 useful variants across contexts/theme |
| Medium | Week / month | ~10–20 contextual pieces |
| Low | Milestones | Several state lines per entity |

Quality beats exact counts. Eight art-bound daily obstacles stay eight IDs; flavor and eligibility grow around them.

## Selection pipeline

```
context signals → eligible pool → date-stable hash → anti-repeat lookback → presentation
```

Prefer this over persisted variant history. Persist only if anti-repeat is otherwise impossible.

## Vocabulary

**Cozy:** дом, окно, сад, крыльцо, свет, дерево, кухня, порядок, воздух, комната, дорожка, мастерская, вечер, утро. Do not stamp «уют» on every line.

**Dark Fantasy:** путь, туман, камень, след, огонь, перевал, крепость, сумрак, броня, рассвет, ворота. Avoid death, blood, darkness-as-identity.

DEV inspector: `/dev/content-lab` (not a production route).
