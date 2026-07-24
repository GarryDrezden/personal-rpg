import type { CompanionId, HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { getHeroStageMeta } from '../../game/assetRegistry';
import { useHeroStageAssets } from '../../hooks/useHeroStageAssets';
import { GameAssetImage } from './GameAssetImage';
import { HeroCompanionOverlay } from './HeroCompanionOverlay';

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

  return (
    <div
      data-testid="game-journey-scene"
      className={`relative h-80 w-full overflow-hidden rounded-2xl border border-[var(--app-border)] bg-gradient-to-b from-[var(--app-bg-soft)] via-[var(--app-card)] to-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-bg))] sm:h-96 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center_bottom,color-mix(in_srgb,var(--app-primary)_18%,transparent),transparent_65%)]" />

      <div className="absolute bottom-[12%] left-1/2 h-6 w-[58%] -translate-x-1/2 rounded-[100%] bg-black/15 blur-md" />
      <div className="absolute bottom-[12%] left-[14%] h-4 w-[22%] rounded-[100%] bg-black/10 blur-sm" />

      <div className="absolute bottom-0 left-1/2 z-10 flex h-[82%] w-[72%] max-w-[20rem] -translate-x-1/2 items-end justify-center overflow-visible">
        <div className="relative h-full w-full max-w-[13rem]">
          <GameAssetImage
            variant="hero"
            src={heroAssets.src}
            alt={heroMeta.title}
            fallbackCandidates={heroAssets.fallbackCandidates}
            status="current"
            className="relative z-10 h-full w-full"
            imageClassName="object-contain object-bottom"
          />
          <HeroCompanionOverlay companionId={companionId} side="left" />
        </div>
      </div>
    </div>
  );
}
