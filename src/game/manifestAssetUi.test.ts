import { describe, expect, it } from 'vitest';
import {
  EMPTY_STATE_NO_ENTRIES_ASSET_ID,
  getBaseStageManifestAssetId,
  getManifestAssetObjectPosition,
  getLegacyCodexBossManifestAssetId,
  getSeasonBossManifestAssetId,
  getSeasonRewardManifestAssetId,
  ONBOARDING_CORE_AWAKENING_ASSET_ID,
  PLATEAU_ARTIFACT_PASS_STONE_ASSET_ID,
} from './manifestAssetUi';

describe('manifestAssetUi', () => {
  it('maps camp stages to batch 1 asset ids', () => {
    expect(getBaseStageManifestAssetId('ember')).toBe('camp-base-stage-01-ember-camp');
    expect(getBaseStageManifestAssetId('shelter')).toBe('camp-base-stage-02-shelter');
    expect(getBaseStageManifestAssetId('trail')).toBeUndefined();
  });

  it('maps season 1 reward and boss only', () => {
    expect(getSeasonRewardManifestAssetId(1)).toBe('season-01-reward-core-spark');
    expect(getSeasonRewardManifestAssetId(2)).toBeUndefined();
    expect(getSeasonBossManifestAssetId(1)).toBe('season-boss-01-empty-day-lord');
    expect(getSeasonBossManifestAssetId(2)).toBeUndefined();
  });

  it('exposes batch 2 asset id constants', () => {
    expect(EMPTY_STATE_NO_ENTRIES_ASSET_ID).toBe('empty-state-no-entries');
    expect(PLATEAU_ARTIFACT_PASS_STONE_ASSET_ID).toBe('plateau-artifact-pass-stone');
    expect(getLegacyCodexBossManifestAssetId('lord_of_empty_day')).toBe(
      'season-boss-01-empty-day-lord',
    );
  });

  it('provides object-position hints for wired assets', () => {
    expect(getManifestAssetObjectPosition(ONBOARDING_CORE_AWAKENING_ASSET_ID)).toContain('center');
    expect(getManifestAssetObjectPosition(EMPTY_STATE_NO_ENTRIES_ASSET_ID)).toContain('center');
    expect(getManifestAssetObjectPosition('season-boss-01-empty-day-lord')).toBe('center 42%');
    expect(getManifestAssetObjectPosition('unknown')).toBe('center');
  });
});
