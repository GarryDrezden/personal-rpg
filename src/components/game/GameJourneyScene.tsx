import type { CompanionId, HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { getCompanionImageCandidates } from '../../game/assetPaths';
import { getCompanionMeta, getHeroStageMeta } from '../../game/assetRegistry';
import { useHeroStageAssets } from '../../hooks/useHeroStageAssets';
import { GameAssetImage } from './GameAssetImage';

type GameJourneySceneProps = {
  gender: HeroGender;
  stage: HeroStageNumber;
  companionId: CompanionId;
  className?: string;
};

export function GameJourneyScene({
  gender,
  stage,
  companionId,
  className = '',
}: GameJourneySceneProps) {
  const heroMeta = getHeroStageMeta(gender, stage);
  const heroAssets = useHeroStageAssets(gender, stage);
  const companionMeta = getCompanionMeta(companionId);

  return (
    <div
      data-testid="game-journey-scene"
      className={`relative h-80 w-full overflow-hidden rounded-2xl border border-[var(--app-border)] bg-gradient-to-b from-[var(--app-bg-soft)] via-[var(--app-card)] to-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-bg))] sm:h-96 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center_bottom,color-mix(in_srgb,var(--app-primary)_18%,transparent),transparent_65%)]" />

      <div className="absolute bottom-[12%] left-1/2 h-6 w-[58%] -translate-x-1/2 rounded-[100%] bg-black/15 blur-md" />
      <div className="absolute bottom-[12%] left-[14%] h-4 w-[22%] rounded-[100%] bg-black/10 blur-sm" />

      <div className="absolute bottom-0 left-1/2 z-10 h-[82%] w-[50%] -translate-x-1/2">
        <GameAssetImage
          variant="hero"
          src={heroAssets.src}
          alt={heroMeta.title}
          fallbackCandidates={heroAssets.fallbackCandidates}
          status="current"
          className="h-full w-full"
          imageClassName="object-contain object-bottom"
        />
      </div>

      <div className="absolute bottom-1 left-3 z-20 h-[42%] w-[28%] sm:left-6">
        <GameAssetImage
          variant="companion"
          src={companionMeta.image}
          alt={companionMeta.title}
          fallbackCandidates={getCompanionImageCandidates(companionId).slice(1)}
          status="unlocked"
          className="h-full w-full"
          imageClassName="object-contain object-bottom"
        />
      </div>
    </div>
  );
}
