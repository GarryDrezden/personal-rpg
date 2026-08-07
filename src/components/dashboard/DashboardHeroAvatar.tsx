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
 * visible figure reads ~60–70% of scene height — via height + object-fit:contain,
 * not transform:scale.
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
      className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center px-3 pb-[5%] pt-[15%] sm:px-4 sm:pb-[6%] sm:pt-[12%] lg:px-5 lg:pb-[7%] lg:pt-[10%]"
    >
      <div
        data-testid="hero-scene-character"
        data-hero-state={heroState}
        data-body-stage={bodyStage}
        className="relative flex h-full w-full max-w-[min(100%,19rem)] items-end justify-center sm:max-w-[min(100%,25rem)] lg:max-w-[min(100%,32rem)] xl:max-w-[min(100%,36rem)]"
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
