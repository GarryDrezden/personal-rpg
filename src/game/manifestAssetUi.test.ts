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

  it('maps season reward and bosses', () => {
    expect(getSeasonRewardManifestAssetId(1)).toBe('season-01-reward-core-spark');
    expect(getSeasonRewardManifestAssetId(2)).toBeUndefined();
    expect(getSeasonBossManifestAssetId(1)).toBe('season-boss-01-empty-day-lord');
    expect(getSeasonBossManifestAssetId(2)).toBe('season-boss-02-divan-king');
    expect(getSeasonBossManifestAssetId(3)).toBe('season-boss-03-snack-chaos');
    expect(getSeasonBossManifestAssetId(4)).toBe('season-boss-04-misty-baron');
    expect(getSeasonBossManifestAssetId(5)).toBe('season-boss-05-resource-devourer');
    expect(getSeasonBossManifestAssetId(6)).toBe('season-boss-06-plateau-guardian');
    expect(getSeasonBossManifestAssetId(7)).toBe('season-boss-07-rollback-chain');
    expect(getSeasonBossManifestAssetId(8)).toBe('season-boss-08-night-feast-baron');
    expect(getSeasonBossManifestAssetId(9)).toBe('season-boss-09-promise-collector');
    expect(getSeasonBossManifestAssetId(10)).toBe('season-boss-10-old-form-guardian');
    expect(getSeasonBossManifestAssetId(11)).toBe('season-boss-11-fatigue-archivist');
    expect(getSeasonBossManifestAssetId(12)).toBe('season-boss-12-mobility-gatekeeper');
    expect(getSeasonBossManifestAssetId(13)).toBe('season-boss-13-old-year-shadow');
    expect(getSeasonBossManifestAssetId(14)).toBeUndefined();
  });

  it('exposes batch 2 asset id constants', () => {
    expect(EMPTY_STATE_NO_ENTRIES_ASSET_ID).toBe('empty-state-no-entries');
    expect(PLATEAU_ARTIFACT_PASS_STONE_ASSET_ID).toBe('plateau-artifact-pass-stone');
    expect(getLegacyCodexBossManifestAssetId('lord_of_empty_day')).toBe(
      'season-boss-01-empty-day-lord',
    );
    expect(getLegacyCodexBossManifestAssetId('divan_king')).toBe('season-boss-02-divan-king');
    expect(getLegacyCodexBossManifestAssetId('misty_baron')).toBe('season-boss-04-misty-baron');
    expect(getLegacyCodexBossManifestAssetId('resource_devourer')).toBe(
      'season-boss-05-resource-devourer',
    );
    expect(getLegacyCodexBossManifestAssetId('chain_of_rollback')).toBe(
      'season-boss-07-rollback-chain',
    );
    expect(getLegacyCodexBossManifestAssetId('night_feast_baron')).toBe(
      'season-boss-08-night-feast-baron',
    );
    expect(getLegacyCodexBossManifestAssetId('promise_collector')).toBe(
      'season-boss-09-promise-collector',
    );
    expect(getLegacyCodexBossManifestAssetId('old_form_guardian')).toBe(
      'season-boss-10-old-form-guardian',
    );
  });

  it('provides object-position hints for wired assets', () => {
    expect(getManifestAssetObjectPosition(ONBOARDING_CORE_AWAKENING_ASSET_ID)).toContain('center');
    expect(getManifestAssetObjectPosition(EMPTY_STATE_NO_ENTRIES_ASSET_ID)).toContain('center');
    expect(getManifestAssetObjectPosition('season-boss-01-empty-day-lord')).toBe('center 42%');
    expect(getManifestAssetObjectPosition('season-boss-02-divan-king')).toBe('center 40%');
    expect(getManifestAssetObjectPosition('season-boss-03-snack-chaos')).toBe('center 38%');
    expect(getManifestAssetObjectPosition('season-boss-04-misty-baron')).toBe('center 45%');
    expect(getManifestAssetObjectPosition('season-boss-05-resource-devourer')).toBe('center 42%');
    expect(getManifestAssetObjectPosition('season-boss-06-plateau-guardian')).toBe('center 48%');
    expect(getManifestAssetObjectPosition('season-boss-07-rollback-chain')).toBe('center 40%');
    expect(getManifestAssetObjectPosition('season-boss-08-night-feast-baron')).toBe('center 38%');
    expect(getManifestAssetObjectPosition('season-boss-09-promise-collector')).toBe('center 40%');
    expect(getManifestAssetObjectPosition('season-boss-10-old-form-guardian')).toBe('center 42%');
    expect(getManifestAssetObjectPosition('season-boss-11-fatigue-archivist')).toBe('center 45%');
    expect(getManifestAssetObjectPosition('season-boss-12-mobility-gatekeeper')).toBe('center 40%');
    expect(getManifestAssetObjectPosition('season-boss-13-old-year-shadow')).toBe('center 38%');
    expect(getManifestAssetObjectPosition('unknown')).toBe('center');
  });
});
