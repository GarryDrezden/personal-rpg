import { useMemo } from 'react';
import { getHeroDeathImageCandidates } from '../game/assetPaths';
import { getResolvedAvatarStageAsset } from '../game/avatar/avatarAssetResolver';
import { useAppTheme } from './useAppTheme';
import type { HeroGender, HeroStageNumber } from '../types/gameAssets';
import type { AvatarTrackId } from '../types/avatarAssets';
import type { HeroStateLevel } from '../types/avatarStages';

export function useHeroStageAssets(
  gender: HeroGender,
  stage: HeroStageNumber,
  options?: {
    trackId?: AvatarTrackId;
    /** Ignored for body path — kept for API clarity / QA. */
    heroState?: HeroStateLevel;
  },
) {
  const { themeId } = useAppTheme();

  return useMemo(() => {
    const resolved = getResolvedAvatarStageAsset({
      themeId,
      gender,
      bodyStage: stage,
      trackId: options?.trackId,
      heroState: options?.heroState,
    });
    return {
      themeId,
      src: resolved.path,
      fallbackCandidates: resolved.fallbackCandidates,
      resolved,
      source: resolved.source,
      usedFallback: resolved.usedFallback,
      debugLabel: resolved.debugLabel,
    };
  }, [gender, stage, themeId, options?.trackId, options?.heroState]);
}

export function useHeroDeathAssets(gender: HeroGender) {
  const { themeId } = useAppTheme();

  return useMemo(() => {
    const candidates = getHeroDeathImageCandidates(gender, themeId);
    return {
      themeId,
      src: candidates[0] ?? '',
      fallbackCandidates: candidates.slice(1),
    };
  }, [gender, themeId]);
}
