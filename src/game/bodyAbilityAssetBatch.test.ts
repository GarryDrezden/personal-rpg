import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BODY_ABILITIES_V1, getActiveBodyAbilities } from './bodyAbilities/bodyAbilityConfig';
import { BODY_ABILITY_SKILL_BOARD_DISPLAY_ORDER } from './bodyAbilityAssetUi';
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
    group2InApp?: boolean;
    group3InApp?: boolean;
    v1Complete?: boolean;
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

const GROUP3_IDS = [
  'movement_confidence',
  'recovery_awareness',
  'journal_clarity',
  'stairs_easier',
] as const;

const ABILITY_TARGET_FILES: Record<string, string> = {
  stand_easier: 'ability-mobility-stand.webp',
  tie_shoes_easier: 'ability-mobility-shoes.webp',
  stand_from_floor: 'ability-mobility-floor.webp',
  stairs_breath: 'ability-endurance-stairs.webp',
  long_route: 'ability-endurance-route.webp',
  car_easier: 'ability-daily-car.webp',
  clothing_freer: 'ability-clothing-freer.webp',
  household_easier: 'ability-daily-household.webp',
  movement_confidence: 'ability-confidence-movement.webp',
  recovery_awareness: 'ability-recovery-awareness.webp',
  journal_clarity: 'ability-confidence-journal.webp',
  stairs_easier: 'ability-endurance-stairs-up.webp',
};

describe('Body Ability Icons mini-batch', () => {
  it('bodyAbilityConfig defines 36 roadmap entries (12 active + 24 future)', () => {
    expect(BODY_ABILITIES_V1).toHaveLength(36);
    expect(getActiveBodyAbilities()).toHaveLength(12);
  });

  it('manifest defines bodyAbilityIconsMiniBatch metadata — v1 complete', () => {
    const batch = manifest.bodyAbilityIconsMiniBatch;
    expect(batch?.filesExpected).toBe(12);
    expect(batch?.filesOnDisk).toBe(12);
    expect(batch?.filesInApp).toBe(12);
    expect(batch?.inApp).toBe(true);
    expect(batch?.group1InApp).toBe(true);
    expect(batch?.group2InApp).toBe(true);
    expect(batch?.group3InApp).toBe(true);
    expect(batch?.v1Complete).toBe(true);
    expect(batch?.status).toBe('in-app');
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

  for (const abilityId of BODY_ABILITY_SKILL_BOARD_DISPLAY_ORDER) {
    it(`in-app: ${abilityId} maps to expected webp on disk`, () => {
      const assetId = manifestAssetId(abilityId);
      const asset = manifest.assets.find((a) => a.id === assetId);
      expect(asset, assetId).toBeDefined();
      expect(asset?.category).toBe('bodyAbilities');
      expect(asset?.type).toBe('body-ability-icon');
      expect(asset?.relatedEntityId).toBe(abilityId);
      expect(asset?.status).toBe('in-app');
      expect(asset?.fileStatus).toBe('ready');
      expect(asset?.path).toContain(ABILITY_TARGET_FILES[abilityId]);

      const diskTarget = join(process.cwd(), 'public', asset!.path!.replace(/^\//, ''));
      expect(existsSync(diskTarget)).toBe(true);

      const promptFile = join(promptsDir, `${assetId}.md`);
      expect(existsSync(promptFile)).toBe(true);
      expect(queueText).toContain(assetId);

      const url = getManifestAssetUrl(assetId);
      expect(url).not.toBeNull();
      expect(url).toContain('/game-assets/abilities/');
      expect(url).toContain('?v=41');
    });
  }

  for (const abilityId of GROUP3_IDS) {
    it(`group 3: ${abilityId} is in-app`, () => {
      const asset = manifest.assets.find((a) => a.id === manifestAssetId(abilityId));
      expect(asset?.status).toBe('in-app');
      expect(asset?.path).toContain(ABILITY_TARGET_FILES[abilityId]);
    });
  }

  it('manifest has no duplicate body ability asset ids', () => {
    const ids = manifest.bodyAbilityIconsMiniBatch?.assetIds ?? [];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('manifest validation passes with all 12 body ability files on disk', () => {
    const issues = validateAssetManifest(manifest, {
      publicRoot,
      fileExists: existsSync,
    });
    expect(issues).toEqual([]);
  });
});
