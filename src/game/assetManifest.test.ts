import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAssetById, getAssetPlaceholder, getEntityAsset, getManifestAssetUrl } from './assetManifest';
import type { AssetManifestV2 } from './assetManifestTypes';
import { validateAssetManifest } from './assetManifestValidation';

const manifestPath = join(process.cwd(), 'docs/assets/manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as AssetManifestV2;
const publicRoot = join(process.cwd(), 'public');

describe('asset manifest validation', () => {
  it('manifest is valid with existing public files', () => {
    const issues = validateAssetManifest(manifest, {
      publicRoot,
      fileExists: existsSync,
    });
    expect(issues).toEqual([]);
  });

  it('has unique asset ids', () => {
    const ids = manifest.assets.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes journey chapter assets for chapters 1-9', () => {
    for (let ch = 1; ch <= 9; ch++) {
      const n = String(ch).padStart(2, '0');
      const entry = getAssetById(`journey-chapter-${n}`);
      expect(entry?.status).toBe('in-app');
      expect(entry?.path).toMatch(/chapter-\d{2}-.+\.webp$/);
    }
  });
});

describe('asset manifest helpers', () => {
  it('getEntityAsset resolves season mini-boss', () => {
    const entry = getEntityAsset('season_mini_01');
    expect(entry?.id).toBe('season-boss-01-empty-day-lord');
    expect(entry?.category).toBe('seasonBosses');
    expect(entry?.status).toBe('in-app');
  });

  it('getAssetPlaceholder returns safe fallback', () => {
    expect(getAssetPlaceholder('campBase')).toBe('🔥');
    expect(getAssetPlaceholder('bodyAbilities')).toBe('✨');
  });

  it('getAssetById returns undefined for unknown id', () => {
    expect(getAssetById('nonexistent-asset')).toBeUndefined();
  });

  it('getManifestAssetUrl returns versioned path for in-app batch 1 assets', () => {
    const url = getManifestAssetUrl('onboarding-core-awakening');
    expect(url).toMatch(/\/game-assets\/onboarding\/core-awakening\.webp\?v=21$/);
  });

  it('getManifestAssetUrl returns versioned path for in-app batch 2 assets', () => {
    expect(getManifestAssetUrl('empty-state-no-entries')).toMatch(
      /\/game-assets\/empty-states\/no-entries\.webp\?v=21$/,
    );
    expect(getManifestAssetUrl('plateau-artifact-pass-stone')).toMatch(
      /\/game-assets\/artifacts\/plateau-pass-stone\.webp\?v=21$/,
    );
    expect(getManifestAssetUrl('season-boss-01-empty-day-lord')).toMatch(
      /\/game-assets\/bosses\/seasons\/season-boss-01-empty-day-lord\.webp\?v=21$/,
    );
  });

  it('getManifestAssetUrl returns null for needed assets without in-app status', () => {
    expect(getManifestAssetUrl('body-ability-icon-set-v1')).toBeNull();
  });
});
