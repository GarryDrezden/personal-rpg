import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { AssetManifestV2 } from './assetManifestTypes';
import { validateAssetManifest } from './assetManifestValidation';

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

  it('batch 2 metadata reflects files-on-disk (not in-app)', () => {
    const batch = manifest.darkMvpAssetGenerationBatch2;
    expect(batch?.filesExpected).toBe(3);
    expect(batch?.filesOnDisk).toBe(3);
    expect(batch?.inApp).toBe(false);
    expect(batch?.status).toBe('files-on-disk');
  });

  for (const id of BATCH_2_IDS) {
    it(`${id} is processed on disk with path = targetPath`, () => {
      const asset = manifest.assets.find((a) => a.id === id);
      expect(asset).toBeDefined();
      expect(asset?.status).toBe('processed');
      expect(asset?.promptStatus).toBe('ready');
      expect(asset?.fileStatus).toBe('ready');
      expect(asset?.path).toBe(asset?.targetPath);
      expect(asset?.targetPath).toMatch(/^\/game-assets\//);
      const diskPath = join(process.cwd(), TARGET_PATHS[id]);
      expect(existsSync(diskPath)).toBe(true);
      const promptPath = join(process.cwd(), 'docs/prompts/assets', PROMPT_FILES[id]);
      expect(existsSync(promptPath)).toBe(true);
    });
  }

  it('manifest validation passes (batch 2 not in-app)', () => {
    const issues = validateAssetManifest(manifest, {
      publicRoot,
      fileExists: existsSync,
    });
    expect(issues).toEqual([]);
  });
});
