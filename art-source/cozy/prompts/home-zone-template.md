# Cozy Home zone progression

Canon house (lock from `home-hero.webp`): modest Eastern-European village house, cream plaster, honey wood, brown shingles, brick chimney, summer daylight, picket fence, stone path, rolling green hills. Not a mansion. Not a forest cabin. Not American suburb.

Existing `themes/cozy/home/zones/{id}.webp` = **L3 fully restored**. Do not replace. Generate earlier levels from that plate as camera lock.

## Shared style

Semi-realistic painterly narrative game illustration. Adult cozy RPG. Warm summer / late-spring light. Soft shadows. Cream, sage, honey, forest green, terracotta, warm stone. No people. No text. No UI.

## Camera lock

Keep: camera height, room geometry, window/door positions, large furniture, wall edges.

Change: wear, repair, plants, order, textiles, light warmth, small props.

## Levels

| Level | File | Meaning |
|-------|------|---------|
| L0 | `level-00.webp` | Neglected, not ruins. Empty, tired materials. |
| L1 | `level-01.webp` | First signs of life. Swept, one plant, a few new boards. |
| L2 | `level-02.webp` | Clearly improved. Optional if geometry drifts. |
| L3 | existing `zones/{id}.webp` | Fully restored, lived-in, not luxury. |

## Prompt skeleton

```
Same camera and architecture as the reference photo of this exact room/yard.
Personal RPG Cozy theme. Semi-realistic painterly game illustration, adult, warm narrative, summer natural light.
[ZONE + LEVEL DETAILS]
Materials: cream plaster, honey wood, muted sage, terracotta, linen.
No people, no text, no UI, no watermark, no logos, no extra doors, no anime, no cartoon, no dark fantasy, no neon.
```

Runtime: `public/game-assets/themes/cozy/home/{zone}/level-0N.webp`
Source: `art-source/cozy/home/{zone}/`
