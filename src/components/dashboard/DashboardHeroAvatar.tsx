import { GameAssetImage } from '../game/GameAssetImage';
import { HeroStateChrome } from '../avatar/HeroStateChrome';
import type { AppThemeId } from '../../types/theme';
import type { HeroStageNumber } from '../../types/gameAssets';
import type { HeroStateLevel } from '../../types/avatarStages';

type DashboardHeroAvatarProps = {
  themeId: AppThemeId;
  bodyStage: HeroStageNumber;
  heroState: HeroStateLevel;
  src: string;
  fallbackCandidates: string[];
  alt: string;
};

/**
 * Dashboard hero silhouette layer (command-bridge + legacy scene panel).
 *
 * Stage canvases are 1536×2048 with large transparent padding (~48% body width,
 * ~81% body height). The image box fills the scene minus safe margins so the
 * visible figure reads ~60–70% of scene height with breathing room above the
 * floor — via height + object-fit:contain and inset padding, not transform:scale.
 */
export function DashboardHeroAvatar({
  themeId,
  bodyStage,
  heroState,
  src,
  fallbackCandidates,
  alt,
}: DashboardHeroAvatarProps) {
  return (
    <div
      data-testid="dashboard-hero-avatar-layer"
      className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center px-4 pb-[14%] pt-[18%] sm:px-5 sm:pb-[15%] sm:pt-[14%] lg:px-6 lg:pb-[16%] lg:pt-[12%]"
    >
      <div
        data-testid="hero-scene-character"
        data-hero-state={heroState}
        data-body-stage={bodyStage}
        className="relative flex h-full w-full max-w-[min(100%,21rem)] items-end justify-center sm:max-w-[min(100%,27rem)] lg:max-w-[min(100%,34rem)] xl:max-w-[min(100%,38rem)]"
      >
        <HeroStateChrome
          themeId={themeId}
          heroState={heroState}
          showLabel={false}
          showOverlay={false}
          className="relative h-full w-full"
        >
          <GameAssetImage
            variant="hero"
            src={src}
            alt={alt}
            fallbackCandidates={fallbackCandidates}
            status="unlocked"
            fit="hero"
            loading="eager"
            className="h-full w-full bg-transparent"
            imageClassName="drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
          />
        </HeroStateChrome>
      </div>
    </div>
  );
}
