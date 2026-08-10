/**
 * Avatar Asset Validation — Avatar Assets Pipeline v1
 *
 * Production expects **5 visual anchors** per theme×gender:
 * stage-01 / 05 / 10 / 15 / 20
 *
 * Missing intermediate body-stage files (02–04, …) are NOT errors.
 *
 * Exit 0: placeholders OK / approved anchors resolvable
 * Exit 1: broken approved/draft anchors, invalid manifest, cross-theme leak
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicAssets = path.join(root, 'public/game-assets');

/** Keep in sync with AVATAR_VISUAL_STAGES */
const AVATAR_VISUAL_STAGES = [1, 5, 10, 15, 20];
const STAGE_RE = /^stage-(01|05|10|15|20)\.webp$/i;

function existsRel(rel) {
  return fs.existsSync(path.join(publicAssets, rel));
}

function firstExisting(paths) {
  for (const p of paths) {
    if (existsRel(p)) return p;
  }
  return null;
}

function resolveStatus(themeId, gender) {
  if (gender === 'male') return 'approved';
  if (themeId === 'cozy' && gender === 'female') return 'approved';
  return 'placeholder';
}

async function loadManifest() {
  const themes = [
    { id: 'cozy', folder: 'cozy' },
    { id: 'darkFantasy', folder: 'dark-fantasy' },
  ];
  const genders = ['male', 'female'];
  const entries = [];
  for (const theme of themes) {
    for (const gender of genders) {
      for (const stage of AVATAR_VISUAL_STAGES) {
        const n = String(stage).padStart(2, '0');
        const pathRel = `themes/${theme.folder}/avatars/${gender}/stage-${n}.webp`;
        const legacy =
          theme.id === 'darkFantasy'
            ? [
                `heroes/${gender}/variants/dark-fantasy/stage-${n}.webp`,
                `heroes/${gender}/stage-${n}.webp`,
              ]
            : [];
        entries.push({
          themeId: theme.id,
          gender,
          bodyStage: stage,
          trackId: 'default',
          path: pathRel,
          legacyPaths: legacy,
          status: resolveStatus(theme.id, gender),
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

async function main() {
  const manifest = await loadManifest();
  console.log('Avatar Asset Validation (5 visual anchors)\n');

  let errors = 0;
  const keys = new Set();

  if (manifest.length !== themesGendersAnchorsExpected()) {
    console.error(
      `Unexpected manifest size: ${manifest.length} (expected ${themesGendersAnchorsExpected()})`,
    );
    errors += 1;
  }

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
      const slice = manifest.filter(
        (e) => e.themeId === themeId && e.gender === gender,
      );
      let approved = 0;
      let draft = 0;
      let placeholders = 0;
      let broken = 0;

      for (const entry of slice) {
        const resolved = firstExisting([
          entry.path,
          ...(entry.legacyPaths ?? []),
        ]);
        if (entry.status === 'approved' || entry.status === 'draft') {
          if (!resolved) {
            broken += 1;
            errors += 1;
            console.error(
              `BROKEN ${entry.status}: ${themeId}/${gender}/stage-${String(entry.bodyStage).padStart(2, '0')} — missing ${entry.path}`,
            );
          } else if (entry.status === 'approved') {
            approved += 1;
          } else {
            draft += 1;
          }
        } else {
          placeholders += 1;
        }
      }

      const label = `${themeId === 'cozy' ? 'Cozy' : 'Dark Fantasy'} ${gender}`;
      console.log(`${label}:`);
      console.log(`- approved anchors: ${approved}/5`);
      console.log(`- draft anchors: ${draft}/5`);
      console.log(`- placeholder anchors: ${placeholders}/5`);
      if (broken) console.log(`- broken: ${broken}`);
      console.log('');
    }
  }

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
  console.log(
    'Validation OK (5 visual anchors per theme×gender; intermediate body files not required).',
  );
  process.exit(0);
}

function themesGendersAnchorsExpected() {
  return 2 * 2 * AVATAR_VISUAL_STAGES.length;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
