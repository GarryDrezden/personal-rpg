#!/usr/bin/env node
/**
 * Generates per-ability prompt files for Body Ability Icons mini-batch.
 * Run once after updating BODY_ABILITIES in build-asset-manifest.mjs / bodyAbilityConfig.ts.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs/prompts/assets');

const CATEGORY_LABEL = {
  mobility: 'Мобильность',
  endurance: 'Выносливость',
  dailyLife: 'Быт',
  confidence: 'Уверенность',
  clothing: 'Одежда',
  recovery: 'Восстановление',
};

/** [entityId, slug, title, category, emojiFallback, subject, composition, details, mood] */
const ABILITIES = [
  [
    'tie_shoes_easier',
    'mobility-shoes',
    'Легче завязать обувь',
    'mobility',
    '👟',
    'Leather travel boots with warm ember-gold laces on a stone enamel medallion',
    'Boots centered, laces slightly loose as if mid-tie',
    'Mobility token — bending and fine motor ease when tying shoes in daily life',
    'Quiet ease; small ritual of readiness, not athletic triumph',
  ],
  [
    'stand_from_floor',
    'mobility-floor',
    'Легче встать с пола',
    'mobility',
    '🧎',
    'Low stone step or floor tile with a rising boot print and soft upward glow',
    'Boot and hand-knee support motif — rising from low surface',
    'Mobility token — getting up from floor or low seat without extra strain',
    'Return of agency; gentle strength, not gym heroics',
  ],
  [
    'stairs_breath',
    'endurance-stairs',
    'Меньше одышки после лестницы',
    'endurance',
    '🪜',
    'Stone staircase segment with calm breath wisps and ember trail light',
    'Stairs diagonal, soft mist — breath settling after climb',
    'Endurance token — stairs feel calmer, breath recovers faster',
    'Steady lungs; route rhythm, not medical oxygen icon',
  ],
  [
    'long_route',
    'endurance-route',
    'Проще пройти длинный маршрут',
    'endurance',
    '🗺️',
    'Rolled map scroll or trail stone with long path markers and warm lantern dot',
    'Map/trail centered on medallion — distance without exhaustion',
    'Endurance token — longer walks or routes feel more manageable',
    'Horizon ahead; patient journey, not step-counter app',
  ],
  [
    'stand_easier',
    'mobility-stand',
    'Проще стоять',
    'mobility',
    '🧍',
    'Standing figure silhouette as aged metal relief — balanced, relaxed posture',
    'Silhouette on enamel badge — ease while standing in daily tasks',
    'Mobility token — standing in queue, kitchen, or transit feels lighter',
    'Grounded calm; body holding position without constant discomfort',
  ],
  [
    'car_easier',
    'daily-car',
    'Проще ездить в машине',
    'dailyLife',
    '🚗',
    'Car seat silhouette or door frame with soft interior glow — compact freedom',
    'Seat/door symbol on dark violet background — daily travel comfort',
    'Daily life token — getting in/out of car and riding feels freer',
    'Everyday independence; commute as normal life, not clinical rehab',
  ],
  [
    'clothing_freer',
    'clothing-freer',
    'Одежда сидит свободнее',
    'clothing',
    '👕',
    'Flowing shirt or cloak fabric on mannequin bust — relaxed fit, soft fold',
    'Garment centered with room to breathe — freedom in fit',
    'Clothing token — choosing and wearing clothes with less pressure',
    'Self-respect in mirror; comfort without shame narrative',
  ],
  [
    'household_easier',
    'daily-household',
    'Проще заниматься бытом',
    'dailyLife',
    '🏠',
    'Home hearth token: small broom, key, or lantern by doorway — domestic ritual',
    'Household tools as RPG inventory on stone badge',
    'Daily life token — chores and home tasks without constant “cannot reach”',
    'Lived-in home; dignity in ordinary tasks',
  ],
  [
    'movement_confidence',
    'confidence-movement',
    'Больше уверенности в движении',
    'confidence',
    '✨',
    'Footprints with soft spark trail on dark path — confidence in motion',
    'Steps leading forward with warm ember spark — not spotlight stage',
    'Confidence token — walking in public, choosing routes, moving without shame',
    'Quiet pride; body as ally in the world',
  ],
  [
    'recovery_awareness',
    'recovery-awareness',
    'Мягче возвращаться после усталости',
    'recovery',
    '🔋',
    'Soft hearth ember or rest chalice — recovery resource refilling gently',
    'Ember cup / rest token — return after fatigue without quitting the route',
    'Recovery token — soft days and rest help stay on path',
    'Mercy, not punishment; ember rekindling',
  ],
  [
    'journal_clarity',
    'confidence-journal',
    'Яснее видеть свой день',
    'confidence',
    '📓',
    'Leather journal with quill and faint route lines on open page',
    'Journal open — clarity through noticing, not grades or scores',
    'Confidence token — diary helps see what already changes',
    'Reflection as power; observer of own path',
  ],
  [
    'stairs_easier',
    'endurance-stairs-up',
    'Легче подниматься по лестнице',
    'endurance',
    '⬆️',
    'Upward stone stairs with single warm step-light — climb feels lighter',
    'Ascent motif — stairs as ally, not enemy of the day',
    'Endurance token — climbing stairs is less of a daily blocker',
    'Small victory on vertical path; hope in repetition',
  ],
];

const NEGATIVE =
  'no text, no letters, no numbers, no medical symbols, no hospital, no red cross, no flat vector, no corporate icon, no anime, no photorealistic product photo, no gore, no horror';

function renderPrompt(row) {
  const [entityId, slug, title, category, emoji, subject, composition, details, mood] = row;
  const assetId = `ability-${entityId}`;
  const categoryLabel = CATEGORY_LABEL[category] ?? category;

  return `# Asset: ${title}

## Purpose

Иконка Body Ability v1 — \`BodyAbilityV1Card\`, \`BodyAbilityV1Section\`, \`BodyAbilityDashboardSummary\`, \`/growth/abilities\`.
Заменит emoji fallback (\`${emoji}\`) после генерации и UI wire. **Сейчас не in-app.**

## Body ability meaning

**Ability id:** \`${entityId}\`  
**Category:** ${categoryLabel} (\`${category}\`)  
**Игровой смысл:** ${details}

## Style

- stylized realistic 3D game item icon
- dark fantasy + cozy
- premium mobile RPG feel
- warm ember/gold accent
- dark violet/blue atmospheric background
- readable at 48–64px
- no text
- no UI frame (UI draws card border)

## Composition

${composition}

**Central subject:** ${subject}

## Mood

${mood}

Не медицинский, не наказующий, не фитнес-приложение. Артефакт возвращения свободы тела.

## Details

- Shared set language with \`body-ability-icon-set-v1\`: aged metal + soft enamel + ember key light (top-left)
- Category hint (muted): ${categoryLabel}
- Safe padding ~10% for circular/rounded UI crop
- Current emoji placeholder: ${emoji}

## Format

- **Aspect:** 1:1 (512×512 master recommended)
- **Target:** \`.webp\`
- **Background:** dark atmospheric vignette (not transparent — matches dark UI cards)
- **Centered object** with safe padding

## Negative prompt

${NEGATIVE}

## Output path

\`public/game-assets/abilities/ability-${slug}.webp\`

## Manifest id

\`${assetId}\`
`;
}

for (const row of ABILITIES) {
  const assetId = `ability-${row[0]}`;
  writeFileSync(join(outDir, `${assetId}.md`), renderPrompt(row), 'utf-8');
  console.log('Wrote', assetId + '.md');
}

console.log(`Done: ${ABILITIES.length} prompt files.`);
