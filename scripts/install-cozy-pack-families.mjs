/**
 * Install Journey / bosses / mobs / companions / seasons from generated PNGs.
 * Run: node scripts/install-cozy-pack-families.mjs
 */
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gen = join(
  process.env.USERPROFILE ?? '',
  '.cursor',
  'projects',
  'e-OSPanel-domains-personal-rpg',
  'assets',
);

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function install({ srcName, destPng, destWebp, width, height, quality = 82 }) {
  const src = join(gen, srcName);
  mkdirSync(dirname(destPng), { recursive: true });
  mkdirSync(dirname(destWebp), { recursive: true });
  copyFileSync(src, destPng);
  await sharp(src)
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .webp({ quality, effort: 6 })
    .toFile(destWebp);
  console.log(`${srcName} → ${destWebp.replace(root + '\\', '')} ${kb(statSync(destWebp).size)}`);
}

const JOURNEY = [
  ['cozy-journey-01-first-light.png', '01'],
  ['cozy-journey-02-cleared-porch.png', '02'],
  ['cozy-journey-03-yard-path.png', '03'],
  ['cozy-journey-04-kitchen-order.png', '04'],
  ['cozy-journey-05-garden-breath.png', '05'],
  ['cozy-journey-06-warm-room.png', '06'],
  ['cozy-journey-07-house-holds-warmth-r2.png', '07'],
  ['cozy-journey-08-open-windows.png', '08'],
  ['cozy-journey-09-living-house.png', '09'],
];

for (const [srcName, n] of JOURNEY) {
  await install({
    srcName,
    destPng: join(root, `art-source/cozy/journey/chapter-${n}.png`),
    destWebp: join(root, `public/game-assets/themes/cozy/journey/chapters/chapter-${n}.webp`),
    width: 1280,
    height: 720,
  });
}

const BOSSES = [
  'misty_baron',
  'resource_devourer',
  'divan_king',
  'lord_of_empty_day',
  'chain_of_rollback',
  'night_feast_baron',
  'promise_collector',
  'old_form_guardian',
];

for (const id of BOSSES) {
  await install({
    srcName: `cozy-boss-${id}.png`,
    destPng: join(root, `art-source/cozy/bosses/${id}.png`),
    destWebp: join(root, `public/game-assets/themes/cozy/bosses/${id}.webp`),
    width: 640,
    height: 640,
    quality: 84,
  });
}

const MOBS = [
  'sofa_magnet',
  'snack_chaos',
  'fog_of_fatigue',
  'empty_day',
  'impulse_of_rollback',
  'night_call',
  'gray_heaviness',
  'sweet_whisper',
];

for (const id of MOBS) {
  await install({
    srcName: `cozy-mob-${id}.png`,
    destPng: join(root, `art-source/cozy/mobs/${id}.png`),
    destWebp: join(root, `public/game-assets/themes/cozy/mobs/${id}.webp`),
    width: 640,
    height: 640,
    quality: 84,
  });
}

const COMPANIONS = [
  ['cozy-companion-golden_chinchilla_cat.png', 'golden_chinchilla_cat'],
  ['cozy-companion-alabai-r3.png', 'alabai'],
  ['cozy-companion-raven.png', 'raven'],
  ['cozy-companion-fox_cub.png', 'fox_cub'],
];

for (const [srcName, id] of COMPANIONS) {
  await install({
    srcName,
    destPng: join(root, `art-source/cozy/companions/${id}.png`),
    destWebp: join(root, `public/game-assets/themes/cozy/companions/${id}.webp`),
    width: 768,
    height: 1024,
    quality: 84,
  });
}

const SEASONS = [
  ['cozy-season-01-summer-morning.png', '01'],
  ['cozy-season-02-garden-after-rain.png', '02'],
  ['cozy-season-03-kitchen-evening.png', '03'],
  ['cozy-season-04-first-autumn.png', '04'],
  ['cozy-season-05-cold-window.png', '05'],
  ['cozy-season-06-spring-porch.png', '06'],
  ['cozy-season-07-harvest-table-r2.png', '07'],
  ['cozy-season-08-quiet-snow.png', '08'],
];

for (const [srcName, n] of SEASONS) {
  await install({
    srcName,
    destPng: join(root, `art-source/cozy/seasons/vignette-${n}.png`),
    destWebp: join(root, `public/game-assets/themes/cozy/ui/seasons/vignette-${n}.webp`),
    width: 1280,
    height: 720,
  });
}

console.log('Cozy families install complete.');
