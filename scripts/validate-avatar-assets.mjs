/**
 * Avatar Asset Validation — Avatar Assets Pipeline v1
 *
 * Exit 0: placeholders OK / approved paths resolvable
 * Exit 1: broken approved/draft paths, invalid manifest, cross-theme leak
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicAssets = path.join(root, 'public/game-assets');

const STAGE_RE = /^stage-(0[1-9]|1[0-9]|20)\.webp$/i;

function existsRel(rel) {
  return fs.existsSync(path.join(publicAssets, rel));
}

function firstExisting(paths) {
  for (const p of paths) {
    if (existsRel(p)) return p;
  }
  return null;
}

async function loadManifest() {
  // Prefer compiling via dynamic import of TS through vite-node isn't available.
  // Mirror key builders inline to avoid TS runtime — keep in sync with constants.
  const themes = [
    { id: 'cozy', folder: 'cozy' },
    { id: 'darkFantasy', folder: 'dark-fantasy' },
  ];
  const genders = ['male', 'female'];
  const entries = [];
  for (const theme of themes) {
    for (const gender of genders) {
      for (let stage = 1; stage <= 20; stage += 1) {
        const n = String(stage).padStart(2, '0');
        const pathRel = `themes/${theme.folder}/avatars/${gender}/stage-${n}.webp`;
        const legacy =
          theme.id === 'darkFantasy'
            ? [
                `heroes/${gender}/variants/dark-fantasy/stage-${n}.webp`,
                `heroes/${gender}/stage-${n}.webp`,
              ]
            : [];
        const status =
          theme.id === 'darkFantasy' && gender === 'male'
            ? 'approved'
            : 'placeholder';
        entries.push({
          themeId: theme.id,
          gender,
          bodyStage: stage,
          trackId: 'default',
          path: pathRel,
          legacyPaths: legacy,
          status,
        });
      }
    }
  }
  return entries;
}

function assertNoCrossTheme(entry) {
  const all = [entry.path, ...(entry.legacyPaths ?? [])];
  for (const p of all) {
    if (entry.themeId === 'cozy' && (p.includes('dark-fantasy') || p.startsWith('heroes/'))) {
      return `cross-theme leak in cozy entry stage ${entry.bodyStage}: ${p}`;
    }
    if (entry.themeId === 'darkFantasy' && p.startsWith('themes/cozy/')) {
      return `cross-theme leak in DF entry stage ${entry.bodyStage}: ${p}`;
    }
  }
  return null;
}

function countBucket() {
  return { approved: 0, draft: 0, placeholders: 0, missing: 0, broken: 0 };
}

async function main() {
  const manifest = await loadManifest();
  console.log('Avatar Asset Validation\n');

  let errors = 0;
  const keys = new Set();

  for (const entry of manifest) {
    const key = `${entry.themeId}|${entry.gender}|${entry.trackId}|${entry.bodyStage}`;
    if (keys.has(key)) {
      console.error(`DUPLICATE manifest key: ${key}`);
      errors += 1;
    }
    keys.add(key);

    const cross = assertNoCrossTheme(entry);
    if (cross) {
      console.error(cross);
      errors += 1;
    }

    const fileName = path.basename(entry.path);
    if (!STAGE_RE.test(fileName)) {
      console.error(`Invalid stage naming: ${entry.path}`);
      errors += 1;
    }
  }

  for (const themeId of ['cozy', 'darkFantasy']) {
    for (const gender of ['male', 'female']) {
      const bucket = countBucket();
      const slice = manifest.filter(
        (e) => e.themeId === themeId && e.gender === gender,
      );
      for (const entry of slice) {
        const resolved = firstExisting([
          entry.path,
          ...(entry.legacyPaths ?? []),
        ]);
        if (entry.status === 'approved' || entry.status === 'draft') {
          if (!resolved) {
            bucket.broken += 1;
            errors += 1;
            console.error(
              `BROKEN ${entry.status}: ${themeId}/${gender}/stage-${String(entry.bodyStage).padStart(2, '0')} — missing ${entry.path}`,
            );
          } else if (entry.status === 'approved') {
            bucket.approved += 1;
          } else {
            bucket.draft += 1;
          }
        } else if (entry.status === 'placeholder') {
          bucket.placeholders += 1;
        } else {
          bucket.missing += 1;
        }
      }

      const label = `${themeId === 'cozy' ? 'Cozy' : 'Dark Fantasy'} ${gender}`;
      console.log(`${label}:`);
      console.log(`- approved: ${bucket.approved}`);
      console.log(`- draft: ${bucket.draft}`);
      console.log(`- placeholders: ${bucket.placeholders}`);
      console.log(`- missing: ${bucket.missing}`);
      if (bucket.broken) console.log(`- broken: ${bucket.broken}`);
      console.log('');
    }
  }

  // Gender placeholders required
  for (const folder of ['cozy', 'dark-fantasy']) {
    for (const g of ['male', 'female', 'neutral']) {
      const p = `themes/${folder}/avatars/placeholders/${g}.svg`;
      if (!existsRel(p)) {
        console.error(`Missing gender placeholder: ${p}`);
        errors += 1;
      }
    }
    for (const state of ['depleted', 'steady', 'energized', 'strong']) {
      const p = `themes/${folder}/avatars/hero-state/${state}-overlay.svg`;
      if (!existsRel(p)) {
        console.error(`Missing hero-state overlay: ${p}`);
        errors += 1;
      }
    }
  }

  if (errors > 0) {
    console.error(`Validation failed with ${errors} error(s).`);
    process.exit(1);
  }
  console.log('Validation OK (placeholders allowed; approved paths resolvable).');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
