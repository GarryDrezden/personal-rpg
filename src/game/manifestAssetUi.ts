/** Manifest asset ids wired in UI (Dark MVP Batch 1). */

export const ONBOARDING_CORE_AWAKENING_ASSET_ID = 'onboarding-core-awakening';

const BASE_STAGE_ASSET_IDS: Record<string, string> = {
  ember: 'camp-base-stage-01-ember-camp',
  shelter: 'camp-base-stage-02-shelter',
};

const SEASON_REWARD_ASSET_IDS: Record<number, string> = {
  1: 'season-01-reward-core-spark',
};

/** Crop focus per asset — keeps ember/core readable in compact UI. */
const OBJECT_POSITION: Record<string, string> = {
  'onboarding-core-awakening': 'center 38%',
  'camp-base-stage-01-ember-camp': 'center 58%',
  'camp-base-stage-02-trail-shelter': 'center 48%',
  'season-01-reward-core-spark': 'center',
};

export function getBaseStageManifestAssetId(stageId: string): string | undefined {
  return BASE_STAGE_ASSET_IDS[stageId];
}

export function getSeasonRewardManifestAssetId(seasonIndex: number): string | undefined {
  return SEASON_REWARD_ASSET_IDS[seasonIndex];
}

export function getManifestAssetObjectPosition(assetId: string): string {
  return OBJECT_POSITION[assetId] ?? 'center';
}
