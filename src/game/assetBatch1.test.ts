import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { AssetManifestV2 } from './assetManifestTypes';
import { validateAssetManifest } from './assetManifestValidation';

const BATCH_1_IDS = [
  'onboarding-core-awakening',
  'camp-base-stage-01-ember-camp',
  'camp-base-stage-02-shelter',
  'season-01-reward-core-spark',
] as const;

const PROMPT_FILES: Record<(typeof BATCH_1_IDS)[number], string> = {
  'onboarding-core-awakening': 'onboarding-core-awakening.md',
  'camp-base-stage-01-ember-camp': 'camp-base-stage-01-ember-camp.md',
  'camp-base-stage-02-shelter': 'camp-base-stage-02-shelter.md',
  'season-01-reward-core-spark': 'season-01-reward-core-spark.md',
};

const TARGET_PATHS: Record<(typeof BATCH_1_IDS)[number], string> = {
  'onboarding-core-awakening': 'public/game-assets/onboarding/core-awakening.webp',
  'camp-base-stage-01-ember-camp': 'public/game-assets/base/base-stage-01-ember-camp.webp',
  'camp-base-stage-02-shelter': 'public/game-assets/base/base-stage-02-trail-shelter.webp',
  'season-01-reward-core-spark': 'public/game-assets/rewards/season-01-core-spark.webp',
};

const manifest = JSON.parse(
  readFileSync(join(process.cwd(), 'docs/assets/manifest.json'), 'utf-8'),
) as AssetManifestV2 & {
  darkMvpAssetGenerationBatch1?: {
    assetIds: string[];
    status: string;
    filesOnDisk: number;
    filesExpected: number;
  };
};

const publicRoot = join(process.cwd(), 'public');

describe('Dark MVP Asset Generation Batch 1', () => {
  it('manifest defines batch 1 with four assets', () => {
    expect(manifest.darkMvpAssetGenerationBatch1?.assetIds).toEqual([...BATCH_1_IDS]);
  });

  it('batch 1 metadata reflects files on disk', () => {
    const batch = manifest.darkMvpAssetGenerationBatch1;
    expect(batch?.filesExpected).toBe(4);
    expect(batch?.filesOnDisk).toBe(4);
    expect(batch?.status).toBe('files-on-disk');
  });

  for (const id of BATCH_1_IDS) {
    it(`${id} is processed on disk with prompt file and targetPath`, () => {
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

  it('batch 1 assets are not in-app until UI wire', () => {
    for (const id of BATCH_1_IDS) {
      const asset = manifest.assets.find((a) => a.id === id)!;
      expect(asset.status).not.toBe('in-app');
      expect(asset.status).not.toBe('done');
      expect(asset.status).toBe('processed');
    }
  });

  it('manifest validation passes (no broken in-app paths)', () => {
    const issues = validateAssetManifest(manifest, {
      publicRoot,
      fileExists: existsSync,
    });
    expect(issues).toEqual([]);
  });
});
