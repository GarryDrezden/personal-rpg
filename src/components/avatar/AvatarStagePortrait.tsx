import { useMemo } from 'react';
import type { AppThemeId } from '../../types/theme';
import type { HeroGender, HeroStageNumber } from '../../types/gameAssets';
import type { HeroStateLevel } from '../../types/avatarStages';
import type { AvatarTrackId } from '../../types/avatarAssets';
import { getResolvedAvatarStageAsset } from '../../game/avatar/avatarAssetResolver';
import { GameAssetImage } from '../game/GameAssetImage';
import { HeroStateChrome } from './HeroStateChrome';

type AvatarStagePortraitProps = {
  themeId: AppThemeId;
  gender: HeroGender;
  bodyStage: HeroStageNumber;
  heroState?: HeroStateLevel;
  trackId?: AvatarTrackId;
  alt: string;
  className?: string;
  imageClassName?: string;
  showHeroStateLabel?: boolean;
  showDevMissingMarker?: boolean;
};

/**
 * Single entry for body stage art + optional Hero State chrome.
 * All Dashboard / Freedom / Codex surfaces should prefer this or useHeroStageAssets.
 */
export function AvatarStagePortrait({
  themeId,
  gender,
  bodyStage,
  heroState = 'steady',
  trackId = 'default',
  alt,
  className = '',
  imageClassName = '',
  showHeroStateLabel = false,
  showDevMissingMarker = import.meta.env.DEV,
}: AvatarStagePortraitProps) {
  const resolved = useMemo(
    () =>
      getResolvedAvatarStageAsset({
        themeId,
        gender,
        bodyStage,
        trackId,
      }),
    [themeId, gender, bodyStage, trackId],
  );

  const portrait = (
    <div className={`relative h-full w-full ${className}`}>
      <GameAssetImage
        variant="hero"
        src={resolved.path}
        alt={alt}
        fallbackCandidates={resolved.fallbackCandidates}
        status="unlocked"
        fit="hero"
        className="h-full w-full items-end bg-transparent"
        imageClassName={imageClassName}
      />
      {showDevMissingMarker && resolved.usedFallback && resolved.debugLabel ? (
        <p
          className="absolute left-1 top-1 z-40 max-w-[90%] rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-amber-200"
          data-testid="avatar-missing-marker"
        >
          {resolved.debugLabel}
        </p>
      ) : null}
    </div>
  );

  return (
    <HeroStateChrome
      themeId={themeId}
      heroState={heroState}
      showLabel={showHeroStateLabel}
      className="h-full w-full"
    >
      {portrait}
    </HeroStateChrome>
  );
}
