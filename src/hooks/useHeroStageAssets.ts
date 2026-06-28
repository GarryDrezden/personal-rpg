import { useMemo } from 'react';
import {
  getHeroDeathImageCandidates,
  getHeroStageImageCandidates,
  getHeroStageImageSrc,
} from '../game/assetPaths';
import { useAppTheme } from './useAppTheme';
import type { HeroGender, HeroStageNumber } from '../types/gameAssets';

export function useHeroStageAssets(gender: HeroGender, stage: HeroStageNumber) {
  const { themeId } = useAppTheme();

  return useMemo(() => {
    const candidates = getHeroStageImageCandidates(gender, stage, themeId);
    return {
      themeId,
      src: candidates[0] ?? getHeroStageImageSrc(gender, stage, themeId),
      fallbackCandidates: candidates.slice(1),
    };
  }, [gender, stage, themeId]);
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
