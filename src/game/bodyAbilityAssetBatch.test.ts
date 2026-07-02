import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BODY_ABILITIES_V1 } from './bodyAbilities/bodyAbilityConfig';
import { BODY_ABILITY_FEATURED_IDS } from './bodyAbilityAssetUi';
import type { AssetManifestV2 } from './assetManifestTypes';
import { validateAssetManifest } from './assetManifestValidation';
import { getManifestAssetUrl } from './assetManifest';

const manifest = JSON.parse(
  readFileSync(join(process.cwd(), 'docs/assets/manifest.json'), 'utf-8'),
) as AssetManifestV2 & {
  bodyAbilityIconsMiniBatch?: {
    assetIds: string[];
    setAssetId: string;
    status: string;
    filesOnDisk: number;
    filesExpected: number;
    filesInApp?: number;
    inApp?: boolean;
    group1InApp?: boolean;
    promptQueue: string;
  };
};

const publicRoot = join(process.cwd(), 'public');
const promptsDir = join(process.cwd(), 'docs/prompts/assets');
const queuePath = join(promptsDir, 'BODY-ABILITY-ICONS-mini-batch-queue.md');
const queueText = readFileSync(queuePath, 'utf-8');

function manifestAssetId(abilityId: string): string {
  return `ability-${abilityId}`;
}

const GROUP1_IDS = [...BODY_ABILITY_FEATURED_IDS];

describe('Body Ability Icons mini-batch', () => {
  it('bodyAbilityConfig defines exactly 12 abilities', () => {
    expect(BODY_ABILITIES_V1).toHaveLength(12);
  });

  it('manifest defines bodyAbilityIconsMiniBatch metadata', () => {
    const batch = manifest.bodyAbilityIconsMiniBatch;
    expect(batch?.filesExpected).toBe(12);
    expect(batch?.filesOnDisk).toBe(4);
    expect(batch?.filesInApp).toBe(4);
    expect(batch?.inApp).toBe(false);
    expect(batch?.group1InApp).toBe(true);
    expect(batch?.status).toBe('partial-in-app');
    expect(batch?.setAssetId).toBe('body-ability-icon-set-v1');
    expect(batch?.promptQueue).toBe('docs/prompts/assets/BODY-ABILITY-ICONS-mini-batch-queue.md');
    expect(batch?.assetIds).toHaveLength(12);
  });

  it('icon set entry is prompt-ready, not in-app', () => {
    const setEntry = manifest.assets.find((a) => a.id === 'body-ability-icon-set-v1');
    expect(setEntry?.status).toBe('prompt-ready');
    expect(setEntry?.fileStatus).toBe('needed');
    expect(setEntry?.path).toBeUndefined();
    expect(getManifestAssetUrl('body-ability-icon-set-v1')).toBeNull();
  });

  for (const abilityId of GROUP1_IDS) {
    it(`group 1: ${abilityId} is in-app with file on disk`, () => {
      const assetId = manifestAssetId(abilityId);
      const asset = manifest.assets.find((a) => a.id === assetId);
      expect(asset, assetId).toBeDefined();
      expect(asset?.category).toBe('bodyAbilities');
      expect(asset?.type).toBe('body-ability-icon');
      expect(asset?.relatedEntityId).toBe(abilityId);
      expect(asset?.status).toBe('in-app');
      expect(asset?.fileStatus).toBe('ready');
      expect(asset?.path).toMatch(/^\/game-assets\/abilities\/ability-.+\.webp$/);
      expect(asset?.targetPath).toBe(asset?.path);

      const diskTarget = join(process.cwd(), 'public', asset!.path!.replace(/^\//, ''));
      expect(existsSync(diskTarget)).toBe(true);

      const promptFile = join(promptsDir, `${assetId}.md`);
      expect(existsSync(promptFile)).toBe(true);
      expect(queueText).toContain(assetId);

      const url = getManifestAssetUrl(assetId);
      expect(url).not.toBeNull();
      expect(url).toContain('/game-assets/abilities/');
      expect(url).toContain('?v=22');
    });
  }

  for (const ability of BODY_ABILITIES_V1.filter((a) => !GROUP1_IDS.includes(a.id))) {
    it(`remaining: ${ability.id} has prompt-ready manifest entry and emoji fallback`, () => {
      const assetId = manifestAssetId(ability.id);
      const asset = manifest.assets.find((a) => a.id === assetId);
      expect(asset, assetId).toBeDefined();
      expect(asset?.category).toBe('bodyAbilities');
      expect(asset?.type).toBe('body-ability-icon');
      expect(asset?.relatedEntityId).toBe(ability.id);
      expect(asset?.status).toBe('prompt-ready');
      expect(asset?.promptStatus).toBe('prompt-ready');
      expect(asset?.fileStatus).toBe('needed');
      expect(asset?.path).toBeUndefined();
      expect(asset?.priority).toBe('P0');
      expect(asset?.targetPath).toMatch(/^\/game-assets\/abilities\/ability-.+\.webp$/);

      const diskTarget = join(process.cwd(), 'public', asset!.targetPath!.replace(/^\//, ''));
      expect(existsSync(diskTarget)).toBe(false);

      const promptFile = join(promptsDir, `${assetId}.md`);
      expect(existsSync(promptFile)).toBe(true);

      expect(queueText).toContain(assetId);
      expect(getManifestAssetUrl(assetId)).toBeNull();
    });
  }

  it('manifest has no duplicate body ability asset ids', () => {
    const ids = manifest.bodyAbilityIconsMiniBatch?.assetIds ?? [];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('manifest validation passes with group 1 body ability files on disk', () => {
    const issues = validateAssetManifest(manifest, {
      publicRoot,
      fileExists: existsSync,
    });
    expect(issues).toEqual([]);
  });
});
