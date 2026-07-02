import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getBossPublicPath } from './assetPaths';
import { getAssetById, getManifestAssetUrl } from './assetManifest';
import {
  getLegacyCodexBossManifestAssetId,
  SEASON_BOSS_EMPTY_DAY_LORD_ASSET_ID,
} from './manifestAssetUi';

const ROOT = process.cwd();
const LEGACY_PNG = join(ROOT, 'public/game-assets/bosses/lord-of-empty-day.png');
const NEW_WEBP = join(
  ROOT,
  'public/game-assets/bosses/seasons/season-boss-01-empty-day-lord.webp',
);

const NO_LEGACY_PNG_PATHS = [
  'src/game/assetPaths.ts',
  'scripts/build-asset-manifest.mjs',
  'src/game/assetRegistry.ts',
  'docs/prompts/image-generation/bosses.md',
  'docs/brandbook/mobs-and-bosses.md',
];

describe('Legacy boss asset replacement', () => {
  it('maps lord_of_empty_day to Batch 2 manifest asset id', () => {
    expect(getLegacyCodexBossManifestAssetId('lord_of_empty_day')).toBe(
      SEASON_BOSS_EMPTY_DAY_LORD_ASSET_ID,
    );
  });

  it('getBossPublicPath returns manifest URL for lord_of_empty_day', () => {
    const url = getBossPublicPath('lord_of_empty_day');
    expect(url).toMatch(/\/game-assets\/bosses\/seasons\/season-boss-01-empty-day-lord\.webp\?v=/);
    expect(url).toBe(getManifestAssetUrl(SEASON_BOSS_EMPTY_DAY_LORD_ASSET_ID));
  });

  it('legacy boss-lord-of-empty-day manifest entry is superseded, not in-app', () => {
    const legacy = getAssetById('boss-lord-of-empty-day');
    expect(legacy?.status).toBe('done');
    expect(legacy?.legacyStatus).toBe('superseded');
    expect(legacy?.path).toBeUndefined();
  });

  it('season-boss-01-empty-day-lord is in-app with file on disk', () => {
    const asset = getAssetById(SEASON_BOSS_EMPTY_DAY_LORD_ASSET_ID);
    expect(asset?.status).toBe('in-app');
    expect(existsSync(NEW_WEBP)).toBe(true);
  });

  it('legacy lord-of-empty-day.png is not on disk', () => {
    expect(existsSync(LEGACY_PNG)).toBe(false);
  });

  it('key project files do not reference lord-of-empty-day.png', () => {
    for (const rel of NO_LEGACY_PNG_PATHS) {
      const text = readFileSync(join(ROOT, rel), 'utf-8');
      expect(text, rel).not.toContain('lord-of-empty-day.png');
    }
  });
});
