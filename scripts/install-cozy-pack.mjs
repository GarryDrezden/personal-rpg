/**
 * Copy approved Cozy sources into art-source/ and emit runtime WebP.
 * Run: node scripts/install-cozy-pack.mjs
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
  console.log(
    `${srcName} → ${destWebp.replace(root + '\\', '')} ${kb(statSync(destWebp).size)}`,
  );
}

const HOME = [
  ['cozy-home-porch-l0.png', 'porch', 0],
  ['cozy-home-hallway-l0-r3.png', 'hallway', 0],
  ['cozy-home-kitchen-l0.png', 'kitchen', 0],
  ['cozy-home-bedroom-l0.png', 'bedroom', 0],
  ['cozy-home-yard-l0.png', 'yard', 0],
  ['cozy-home-garden-l0.png', 'garden', 0],
  ['cozy-home-workshop-l0-r2.png', 'workshop', 0],
  ['cozy-home-pet_corner-l0.png', 'pet_corner', 0],
  ['cozy-home-porch-l1.png', 'porch', 1],
  ['cozy-home-hallway-l1.png', 'hallway', 1],
  ['cozy-home-kitchen-l1.png', 'kitchen', 1],
  ['cozy-home-bedroom-l1.png', 'bedroom', 1],
  ['cozy-home-yard-l1.png', 'yard', 1],
  ['cozy-home-garden-l1.png', 'garden', 1],
  ['cozy-home-workshop-l1-r2.png', 'workshop', 1],
  ['cozy-home-pet_corner-l1-r2.png', 'pet_corner', 1],
];

for (const [srcName, zone, level] of HOME) {
  const n = String(level).padStart(2, '0');
  await install({
    srcName,
    destPng: join(root, `art-source/cozy/home/${zone}/level-${n}.png`),
    destWebp: join(root, `public/game-assets/themes/cozy/home/${zone}/level-${n}.webp`),
    width: 960,
    height: 720,
  });
}

console.log('Home L0/L1 install complete.');
