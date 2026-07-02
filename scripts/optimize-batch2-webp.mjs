#!/usr/bin/env node
/**
 * Resize + recompress Dark MVP Batch 2 webp assets in place.
 * Run: node scripts/optimize-batch2-webp.mjs
 */
import { copyFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmpDir = join(root, 'scripts', '.batch2-opt-tmp');

const TARGETS = [
  {
    id: 'empty-state-no-entries',
    rel: 'public/game-assets/empty-states/no-entries.webp',
    width: 1280,
    height: 720,
    quality: 82,
    skipBelowKb: 900,
  },
  {
    id: 'season-boss-01-empty-day-lord',
    rel: 'public/game-assets/bosses/seasons/season-boss-01-empty-day-lord.webp',
    width: 1280,
    height: 720,
    quality: 82,
    skipBelowKb: 900,
  },
  {
    id: 'plateau-artifact-pass-stone',
    rel: 'public/game-assets/artifacts/plateau-pass-stone.webp',
    width: 512,
    height: 512,
    quality: 85,
    skipBelowKb: 500,
  },
];

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

for (const target of TARGETS) {
  const abs = join(root, target.rel);
  const before = statSync(abs).size;
  if (before / 1024 < target.skipBelowKb) {
    console.log(`${target.id}: skip (already ${kb(before)})`);
    continue;
  }

  const tmpAbs = join(tmpDir, target.rel.split('/').pop());
  const output = await sharp(abs)
    .resize(target.width, target.height, { fit: 'cover', position: 'centre' })
    .webp({ quality: target.quality, effort: 6 })
    .toBuffer();

  writeFileSync(tmpAbs, output);
  copyFileSync(tmpAbs, abs);
  unlinkSync(tmpAbs);
  console.log(`${target.id}: ${kb(before)} → ${kb(output.length)}`);
}

console.log('Batch 2 webp optimization complete.');
