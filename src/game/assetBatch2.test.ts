import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { AssetManifestV2 } from './assetManifestTypes';
import { validateAssetManifest } from './assetManifestValidation';
import { getManifestAssetUrl } from './assetManifest';

const BATCH_2_IDS = [
  'empty-state-no-entries',
  'plateau-artifact-pass-stone',
  'season-boss-01-empty-day-lord',
] as const;

const PROMPT_FILES: Record<(typeof BATCH_2_IDS)[number], string> = {
  'empty-state-no-entries': 'empty-state-no-entries.md',
  'plateau-artifact-pass-stone': 'plateau-artifact-pass-stone.md',
  'season-boss-01-empty-day-lord': 'season-boss-01-empty-day-lord.md',
};

const TARGET_PATHS: Record<(typeof BATCH_2_IDS)[number], string> = {
  'empty-state-no-entries': 'public/game-assets/empty-states/no-entries.webp',
  'plateau-artifact-pass-stone': 'public/game-assets/artifacts/plateau-pass-stone.webp',
  'season-boss-01-empty-day-lord':
    'public/game-assets/bosses/seasons/season-boss-01-empty-day-lord.webp',
};

/** Soft guard — optimized Batch 2 should stay under ~1 MB each. */
const MAX_FILE_BYTES = 1_000_000;

const manifest = JSON.parse(
  readFileSync(join(process.cwd(), 'docs/assets/manifest.json'), 'utf-8'),
) as AssetManifestV2 & {
  darkMvpAssetGenerationBatch2?: {
    assetIds: string[];
    status: string;
    filesOnDisk: number;
    filesExpected: number;
    inApp?: boolean;
    excludedFromBatch?: string[];
  };
};

const publicRoot = join(process.cwd(), 'public');

describe('Dark MVP Asset Generation Batch 2', () => {
  it('manifest defines batch 2 with three assets (body abilities excluded)', () => {
    expect(manifest.darkMvpAssetGenerationBatch2?.assetIds).toEqual([...BATCH_2_IDS]);
    expect(manifest.darkMvpAssetGenerationBatch2?.excludedFromBatch).toContain(
      'body-ability-icon-set-v1',
    );
  });

  it('batch 2 metadata reflects in-app wired state', () => {
    const batch = manifest.darkMvpAssetGenerationBatch2;
    expect(batch?.filesExpected).toBe(3);
    expect(batch?.filesOnDisk).toBe(3);
    expect(batch?.inApp).toBe(true);
    expect(batch?.status).toBe('in-app');
  });

  for (const id of BATCH_2_IDS) {
    it(`${id} is in-app on disk with prompt file and targetPath`, () => {
      const asset = manifest.assets.find((a) => a.id === id);
      expect(asset).toBeDefined();
      expect(asset?.status).toBe('in-app');
      expect(asset?.promptStatus).toBe('ready');
      expect(asset?.fileStatus).toBe('ready');
      expect(asset?.path).toBe(asset?.targetPath);
      expect(asset?.targetPath).toMatch(/^\/game-assets\//);
      const diskPath = join(process.cwd(), TARGET_PATHS[id]);
      expect(existsSync(diskPath)).toBe(true);
      expect(statSync(diskPath).size).toBeLessThan(MAX_FILE_BYTES);
      const promptPath = join(process.cwd(), 'docs/prompts/assets', PROMPT_FILES[id]);
      expect(existsSync(promptPath)).toBe(true);
      const url = getManifestAssetUrl(id);
      expect(url).toContain('?v=22');
      expect(url).toContain(asset?.path?.replace(/^\//, '') ?? '');
    });
  }

  it('manifest validation passes including in-app file paths', () => {
    const issues = validateAssetManifest(manifest, {
      publicRoot,
      fileExists: existsSync,
    });
    expect(issues).toEqual([]);
  });
});
