import type { BossId } from '../../types/gameAssets';
import { getManifestAssetUrl } from '../assetManifest';
import { getBossPublicPath } from '../assetPaths';
import { getSeasonBossManifestAssetId } from '../manifestAssetUi';

/** Season mini-boss → existing codex/legacy boss art when dedicated season art missing. */
const SEASON_TO_CODEX_BOSS: Partial<Record<number, BossId>> = {
  1: 'lord_of_empty_day',
  2: 'divan_king',
  4: 'misty_baron',
  5: 'resource_devourer',
  7: 'chain_of_rollback',
  8: 'night_feast_baron',
  9: 'promise_collector',
  10: 'old_form_guardian',
};

/** Public URL for season campaign boss art, or null when only emoji fallback exists. */
export function getSeasonCampaignBossArtUrl(seasonId: number): string | null {
  const manifestId = getSeasonBossManifestAssetId(seasonId);
  if (manifestId) {
    const manifestUrl = getManifestAssetUrl(manifestId);
    if (manifestUrl) return manifestUrl;
  }
  const codexId = SEASON_TO_CODEX_BOSS[seasonId];
  if (!codexId) return null;
  return getBossPublicPath(codexId);
}

export function hasSeasonCampaignBossArt(seasonId: number): boolean {
  return getSeasonCampaignBossArtUrl(seasonId) != null;
}
