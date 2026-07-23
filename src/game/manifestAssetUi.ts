/** Manifest asset ids wired in UI (Dark MVP Batch 1 + Batch 2 + season boss set). */

export const ONBOARDING_CORE_AWAKENING_ASSET_ID = 'onboarding-core-awakening';
export const EMPTY_STATE_NO_ENTRIES_ASSET_ID = 'empty-state-no-entries';
export const PLATEAU_ARTIFACT_PASS_STONE_ASSET_ID = 'plateau-artifact-pass-stone';
export const SEASON_BOSS_EMPTY_DAY_LORD_ASSET_ID = 'season-boss-01-empty-day-lord';
export const SEASON_BOSS_DIVAN_KING_ASSET_ID = 'season-boss-02-divan-king';
export const SEASON_BOSS_SNACK_CHAOS_ASSET_ID = 'season-boss-03-snack-chaos';
export const SEASON_BOSS_MISTY_BARON_ASSET_ID = 'season-boss-04-misty-baron';
export const SEASON_BOSS_RESOURCE_DEVOURER_ASSET_ID = 'season-boss-05-resource-devourer';
export const SEASON_BOSS_PLATEAU_GUARDIAN_ASSET_ID = 'season-boss-06-plateau-guardian';
export const SEASON_BOSS_ROLLBACK_CHAIN_ASSET_ID = 'season-boss-07-rollback-chain';
export const SEASON_BOSS_NIGHT_FEAST_BARON_ASSET_ID = 'season-boss-08-night-feast-baron';
export const SEASON_BOSS_PROMISE_COLLECTOR_ASSET_ID = 'season-boss-09-promise-collector';
export const SEASON_BOSS_OLD_FORM_GUARDIAN_ASSET_ID = 'season-boss-10-old-form-guardian';
export const SEASON_BOSS_FATIGUE_ARCHIVIST_ASSET_ID = 'season-boss-11-fatigue-archivist';
export const SEASON_BOSS_MOBILITY_GATEKEEPER_ASSET_ID = 'season-boss-12-mobility-gatekeeper';
export const SEASON_BOSS_OLD_YEAR_SHADOW_ASSET_ID = 'season-boss-13-old-year-shadow';

const BASE_STAGE_ASSET_IDS: Record<string, string> = {
  ember: 'camp-base-stage-01-ember-camp',
  shelter: 'camp-base-stage-02-shelter',
};

const SEASON_REWARD_ASSET_IDS: Record<number, string> = {
  1: 'season-01-reward-core-spark',
  2: 'season-02-reward-trail-mark',
  3: 'season-03-reward-base-stone',
  4: 'season-04-reward-tower-key',
  5: 'season-05-reward-pass-mark',
  6: 'season-06-reward-lake-light',
  7: 'season-07-reward-fortress-seal',
  8: 'season-08-reward-river-drop',
  9: 'season-09-reward-form-shield',
  10: 'season-10-reward-strength-medal',
  11: 'season-11-reward-clarity-lantern',
  12: 'season-12-reward-gate-key',
  13: 'season-13-reward-year-artifact',
};

const SEASON_BOSS_ASSET_IDS: Record<number, string> = {
  1: SEASON_BOSS_EMPTY_DAY_LORD_ASSET_ID,
  2: SEASON_BOSS_DIVAN_KING_ASSET_ID,
  3: SEASON_BOSS_SNACK_CHAOS_ASSET_ID,
  4: SEASON_BOSS_MISTY_BARON_ASSET_ID,
  5: SEASON_BOSS_RESOURCE_DEVOURER_ASSET_ID,
  6: SEASON_BOSS_PLATEAU_GUARDIAN_ASSET_ID,
  7: SEASON_BOSS_ROLLBACK_CHAIN_ASSET_ID,
  8: SEASON_BOSS_NIGHT_FEAST_BARON_ASSET_ID,
  9: SEASON_BOSS_PROMISE_COLLECTOR_ASSET_ID,
  10: SEASON_BOSS_OLD_FORM_GUARDIAN_ASSET_ID,
  11: SEASON_BOSS_FATIGUE_ARCHIVIST_ASSET_ID,
  12: SEASON_BOSS_MOBILITY_GATEKEEPER_ASSET_ID,
  13: SEASON_BOSS_OLD_YEAR_SHADOW_ASSET_ID,
};

/** Legacy codex BossId → manifest asset id (dedicated season replacements). */
const LEGACY_CODEX_BOSS_MANIFEST_MAP: Record<string, string> = {
  lord_of_empty_day: SEASON_BOSS_EMPTY_DAY_LORD_ASSET_ID,
  divan_king: SEASON_BOSS_DIVAN_KING_ASSET_ID,
  misty_baron: SEASON_BOSS_MISTY_BARON_ASSET_ID,
  resource_devourer: SEASON_BOSS_RESOURCE_DEVOURER_ASSET_ID,
  chain_of_rollback: SEASON_BOSS_ROLLBACK_CHAIN_ASSET_ID,
  night_feast_baron: SEASON_BOSS_NIGHT_FEAST_BARON_ASSET_ID,
  promise_collector: SEASON_BOSS_PROMISE_COLLECTOR_ASSET_ID,
  old_form_guardian: SEASON_BOSS_OLD_FORM_GUARDIAN_ASSET_ID,
};

/** Crop focus per asset — keeps subject readable in compact UI. */
const OBJECT_POSITION: Record<string, string> = {
  'onboarding-core-awakening': 'center 38%',
  'camp-base-stage-01-ember-camp': 'center 58%',
  'camp-base-stage-02-trail-shelter': 'center 48%',
  'season-01-reward-core-spark': 'center',
  'season-02-reward-trail-mark': 'center',
  'season-03-reward-base-stone': 'center',
  'season-04-reward-tower-key': 'center',
  'season-05-reward-pass-mark': 'center',
  'season-06-reward-lake-light': 'center',
  'season-07-reward-fortress-seal': 'center',
  'season-08-reward-river-drop': 'center',
  'season-09-reward-form-shield': 'center',
  'season-10-reward-strength-medal': 'center',
  'season-11-reward-clarity-lantern': 'center',
  'season-12-reward-gate-key': 'center',
  'season-13-reward-year-artifact': 'center',
  'empty-state-no-entries': 'center 45%',
  'plateau-artifact-pass-stone': 'center',
  'season-boss-01-empty-day-lord': 'center 42%',
  'season-boss-02-divan-king': 'center 40%',
  'season-boss-03-snack-chaos': 'center 38%',
  'season-boss-04-misty-baron': 'center 45%',
  'season-boss-05-resource-devourer': 'center 42%',
  'season-boss-06-plateau-guardian': 'center 48%',
  'season-boss-07-rollback-chain': 'center 40%',
  'season-boss-08-night-feast-baron': 'center 38%',
  'season-boss-09-promise-collector': 'center 40%',
  'season-boss-10-old-form-guardian': 'center 42%',
  'season-boss-11-fatigue-archivist': 'center 45%',
  'season-boss-12-mobility-gatekeeper': 'center 40%',
  'season-boss-13-old-year-shadow': 'center 38%',
};

export function getBaseStageManifestAssetId(stageId: string): string | undefined {
  return BASE_STAGE_ASSET_IDS[stageId];
}

export function getSeasonRewardManifestAssetId(seasonIndex: number): string | undefined {
  return SEASON_REWARD_ASSET_IDS[seasonIndex];
}

export function getSeasonBossManifestAssetId(seasonIndex: number): string | undefined {
  return SEASON_BOSS_ASSET_IDS[seasonIndex];
}

export function getLegacyCodexBossManifestAssetId(bossEntityId: string): string | undefined {
  return LEGACY_CODEX_BOSS_MANIFEST_MAP[bossEntityId];
}

export function getManifestAssetObjectPosition(assetId: string): string {
  return OBJECT_POSITION[assetId] ?? 'center';
}
