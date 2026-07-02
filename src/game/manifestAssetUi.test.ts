import { describe, expect, it } from 'vitest';
import {
  getBaseStageManifestAssetId,
  getManifestAssetObjectPosition,
  getSeasonRewardManifestAssetId,
  ONBOARDING_CORE_AWAKENING_ASSET_ID,
} from './manifestAssetUi';

describe('manifestAssetUi', () => {
  it('maps camp stages to batch 1 asset ids', () => {
    expect(getBaseStageManifestAssetId('ember')).toBe('camp-base-stage-01-ember-camp');
    expect(getBaseStageManifestAssetId('shelter')).toBe('camp-base-stage-02-shelter');
    expect(getBaseStageManifestAssetId('trail')).toBeUndefined();
  });

  it('maps season 1 reward only', () => {
    expect(getSeasonRewardManifestAssetId(1)).toBe('season-01-reward-core-spark');
    expect(getSeasonRewardManifestAssetId(2)).toBeUndefined();
  });

  it('provides object-position hints for batch 1 assets', () => {
    expect(getManifestAssetObjectPosition(ONBOARDING_CORE_AWAKENING_ASSET_ID)).toContain('center');
    expect(getManifestAssetObjectPosition('unknown')).toBe('center');
  });
});
