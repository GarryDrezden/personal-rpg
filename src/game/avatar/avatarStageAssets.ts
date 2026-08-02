import type { AppThemeId } from '../../types/theme';
import type { HeroGender, HeroStageNumber } from '../../types/gameAssets';
import type { AvatarStageAssetRef } from '../../types/avatarStages';
import { gameAsset } from '../assetBase';
import {
  getCozyHeroPlaceholderPath,
  getCozyHeroStagePath,
} from '../themeAssetRegistry';
import {
  getGameHeroStageLegacyPath,
  getGameHeroStageVariantPath,
  getHeroStageImageCandidates,
  resolveHeroAssetVariant,
} from '../assetPaths';

function padStage(stage: HeroStageNumber): string {
  return String(stage).padStart(2, '0');
}

/** Per-stage cozy placeholder (shared stage id, cozy art branch). */
export function getCozyAvatarStagePlaceholderPath(
  gender: HeroGender,
  stage: HeroStageNumber,
): string {
  return gameAsset(
    `themes/cozy/avatars/placeholders/${gender}/stage-${padStage(stage)}.svg`,
  );
}

/** Per-stage dark-fantasy placeholder (shared stage id, DF art branch). */
export function getDarkFantasyAvatarStagePlaceholderPath(
  gender: HeroGender,
  stage: HeroStageNumber,
): string {
  return gameAsset(
    `themes/dark-fantasy/avatars/placeholders/${gender}/stage-${padStage(stage)}.svg`,
  );
}

export function getAvatarStagePlaceholderPath(
  themeId: AppThemeId,
  gender: HeroGender,
  stage: HeroStageNumber,
): string {
  return themeId === 'cozy'
    ? getCozyAvatarStagePlaceholderPath(gender, stage)
    : getDarkFantasyAvatarStagePlaceholderPath(gender, stage);
}

/**
 * Theme-aware avatar stage assets: same stage id, different image branches.
 * Prefer real art → stage placeholder → gender placeholder / legacy.
 */
export function getAvatarStageAssetRef(
  themeId: AppThemeId,
  gender: HeroGender,
  stage: HeroStageNumber,
): AvatarStageAssetRef {
  const placeholderPath = getAvatarStagePlaceholderPath(themeId, gender, stage);

  if (themeId === 'cozy') {
    return {
      stage,
      themeId,
      gender,
      path: getCozyHeroStagePath(gender, stage),
      placeholderPath,
    };
  }

  const variant = resolveHeroAssetVariant(themeId);
  return {
    stage,
    themeId,
    gender,
    path: getGameHeroStageVariantPath(gender, stage, variant),
    placeholderPath,
  };
}

/** Candidate list for GameAssetImage — stage placeholder before generic theme fallback. */
export function getAvatarStageImageCandidates(
  gender: HeroGender,
  stage: HeroStageNumber,
  themeId: AppThemeId = 'darkFantasy',
): string[] {
  const stagePlaceholder = getAvatarStagePlaceholderPath(themeId, gender, stage);
  const base = getHeroStageImageCandidates(gender, stage, themeId);

  if (themeId === 'cozy') {
    const genderPlaceholder = getCozyHeroPlaceholderPath(gender);
    const withoutGeneric = base.filter((p) => p !== genderPlaceholder);
    return unique([
      ...withoutGeneric.filter((p) => !p.includes('/placeholders/')),
      stagePlaceholder,
      genderPlaceholder,
    ]);
  }

  return unique([
    getGameHeroStageVariantPath(gender, stage, 'dark-fantasy', 'webp'),
    getGameHeroStageLegacyPath(gender, stage, 'webp'),
    getGameHeroStageVariantPath(gender, stage, 'dark-fantasy', 'png'),
    getGameHeroStageLegacyPath(gender, stage, 'png'),
    stagePlaceholder,
    ...base,
  ]);
}

function unique(paths: string[]): string[] {
  const seen = new Set<string>();
  return paths.filter((p) => {
    if (seen.has(p)) return false;
    seen.add(p);
    return true;
  });
}
