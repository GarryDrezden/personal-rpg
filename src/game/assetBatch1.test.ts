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

const manifest = JSON.parse(
  readFileSync(join(process.cwd(), 'docs/assets/manifest.json'), 'utf-8'),
) as AssetManifestV2 & {
  darkMvpAssetGenerationBatch1?: { assetIds: string[] };
};

describe('Dark MVP Asset Generation Batch 1', () => {
  it('manifest defines batch 1 with four assets', () => {
    expect(manifest.darkMvpAssetGenerationBatch1?.assetIds).toEqual([...BATCH_1_IDS]);
  });

  for (const id of BATCH_1_IDS) {
    it(`${id} is prompt-ready with prompt file and targetPath`, () => {
      const asset = manifest.assets.find((a) => a.id === id);
      expect(asset).toBeDefined();
      expect(asset?.status).toBe('prompt-ready');
      expect(asset?.promptStatus).toBe('prompt-ready');
      expect(asset?.fileStatus).toBe('needed');
      expect(asset?.targetPath).toMatch(/^\/game-assets\//);
      const promptPath = join(process.cwd(), 'docs/prompts/assets', PROMPT_FILES[id]);
      expect(existsSync(promptPath)).toBe(true);
    });
  }

  it('batch 1 assets are not in-app without files', () => {
    for (const id of BATCH_1_IDS) {
      const asset = manifest.assets.find((a) => a.id === id)!;
      expect(asset.status).not.toBe('in-app');
      expect(asset.status).not.toBe('done');
      if (!asset.path) {
        expect(['prompt-ready', 'needed', 'generated', 'processed']).toContain(asset.status);
      }
    }
  });

  it('manifest validation passes (no broken in-app paths)', () => {
    const issues = validateAssetManifest(manifest, {
      publicRoot: join(process.cwd(), 'public'),
      fileExists: existsSync,
    });
    expect(issues).toEqual([]);
  });
});
