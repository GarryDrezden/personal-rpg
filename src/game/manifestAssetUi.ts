/** Manifest asset ids wired in UI (Dark MVP Batch 1 + Batch 2). */

export const ONBOARDING_CORE_AWAKENING_ASSET_ID = 'onboarding-core-awakening';
export const EMPTY_STATE_NO_ENTRIES_ASSET_ID = 'empty-state-no-entries';
export const PLATEAU_ARTIFACT_PASS_STONE_ASSET_ID = 'plateau-artifact-pass-stone';
export const SEASON_BOSS_EMPTY_DAY_LORD_ASSET_ID = 'season-boss-01-empty-day-lord';

const BASE_STAGE_ASSET_IDS: Record<string, string> = {
  ember: 'camp-base-stage-01-ember-camp',
  shelter: 'camp-base-stage-02-shelter',
};

const SEASON_REWARD_ASSET_IDS: Record<number, string> = {
  1: 'season-01-reward-core-spark',
};

const SEASON_BOSS_ASSET_IDS: Record<number, string> = {
  1: SEASON_BOSS_EMPTY_DAY_LORD_ASSET_ID,
};

/** Legacy codex BossId → manifest asset id (Batch 2 replacements). */
const LEGACY_CODEX_BOSS_MANIFEST_MAP: Record<string, string> = {
  lord_of_empty_day: SEASON_BOSS_EMPTY_DAY_LORD_ASSET_ID,
};

/** Crop focus per asset — keeps subject readable in compact UI. */
const OBJECT_POSITION: Record<string, string> = {
  'onboarding-core-awakening': 'center 38%',
  'camp-base-stage-01-ember-camp': 'center 58%',
  'camp-base-stage-02-trail-shelter': 'center 48%',
  'season-01-reward-core-spark': 'center',
  'empty-state-no-entries': 'center 45%',
  'plateau-artifact-pass-stone': 'center',
  'season-boss-01-empty-day-lord': 'center 42%',
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
