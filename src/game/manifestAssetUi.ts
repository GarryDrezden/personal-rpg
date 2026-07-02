/** Manifest asset ids wired in UI (Dark MVP Batch 1). */

export const ONBOARDING_CORE_AWAKENING_ASSET_ID = 'onboarding-core-awakening';

const BASE_STAGE_ASSET_IDS: Record<string, string> = {
  ember: 'camp-base-stage-01-ember-camp',
  shelter: 'camp-base-stage-02-shelter',
};

const SEASON_REWARD_ASSET_IDS: Record<number, string> = {
  1: 'season-01-reward-core-spark',
};

export function getBaseStageManifestAssetId(stageId: string): string | undefined {
  return BASE_STAGE_ASSET_IDS[stageId];
}

export function getSeasonRewardManifestAssetId(seasonIndex: number): string | undefined {
  return SEASON_REWARD_ASSET_IDS[seasonIndex];
}
