import type { AppThemeId } from '../../types/theme';
import type { HeroGender, HeroStageNumber } from '../../types/gameAssets';
import type { AvatarStageAssetRef } from '../../types/avatarStages';
import type { AvatarTrackId } from '../../types/avatarAssets';
import {
  getAvatarGenderPlaceholderPath,
  padAvatarStage,
} from '../../constants/avatarAssetManifest';
import { gameAsset } from '../assetBase';
import {
  getAvatarStageAssetCandidates,
  getResolvedAvatarStageAsset,
} from './avatarAssetResolver';

/** @deprecated Prefer gender-level placeholder via resolver. */
export function getCozyAvatarStagePlaceholderPath(
  gender: HeroGender,
  _stage: HeroStageNumber,
): string {
  return gameAsset(getAvatarGenderPlaceholderPath('cozy', gender));
}

/** @deprecated Prefer gender-level placeholder via resolver. */
export function getDarkFantasyAvatarStagePlaceholderPath(
  gender: HeroGender,
  _stage: HeroStageNumber,
): string {
  return gameAsset(getAvatarGenderPlaceholderPath('darkFantasy', gender));
}

export function getAvatarStagePlaceholderPath(
  themeId: AppThemeId,
  gender: HeroGender,
  _stage?: HeroStageNumber,
): string {
  return gameAsset(getAvatarGenderPlaceholderPath(themeId, gender));
}

export function getAvatarStageAssetRef(
  themeId: AppThemeId,
  gender: HeroGender,
  stage: HeroStageNumber,
): AvatarStageAssetRef {
  const resolved = getResolvedAvatarStageAsset({
    themeId,
    gender,
    bodyStage: stage,
  });
  return {
    stage,
    themeId,
    gender,
    path: resolved.path,
    placeholderPath: resolved.usedFallback
      ? resolved.path
      : gameAsset(getAvatarGenderPlaceholderPath(themeId, gender)),
  };
}

/**
 * Candidate list for GameAssetImage — unified pipeline resolver.
 * Production: same-theme placeholder when stage art missing (no nearest-stage lie).
 */
export function getAvatarStageImageCandidates(
  gender: HeroGender,
  stage: HeroStageNumber,
  themeId: AppThemeId = 'darkFantasy',
  options?: {
    trackId?: AvatarTrackId;
    allowDraft?: boolean;
    allowNearestStageFallback?: boolean;
  },
): string[] {
  return getAvatarStageAssetCandidates({
    themeId,
    gender,
    bodyStage: stage,
    trackId: options?.trackId,
    allowDraft: options?.allowDraft,
    allowNearestStageFallback: options?.allowNearestStageFallback,
  });
}

export { getResolvedAvatarStageAsset, padAvatarStage };
