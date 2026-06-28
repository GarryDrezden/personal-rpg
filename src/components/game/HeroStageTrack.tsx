import type { HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { getHeroStageMeta } from '../../game/assetRegistry';
import { useHeroStageAssets } from '../../hooks/useHeroStageAssets';
import { GameAssetImage } from './GameAssetImage';

type HeroStageTrackItemProps = {
  gender: HeroGender;
  stage: HeroStageNumber;
  status: 'current' | 'unlocked' | 'locked';
};

function HeroStageTrackItem({ gender, stage, status }: HeroStageTrackItemProps) {
  const meta = getHeroStageMeta(gender, stage);
  const heroAssets = useHeroStageAssets(gender, stage);

  return (
    <div
      data-testid={`hero-stage-${stage}`}
      className={`rounded-xl border p-2 ${
        status === 'current'
          ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_10%,var(--app-card))]'
          : 'border-[var(--app-border)] bg-[var(--app-card)]'
      }`}
    >
      <div className="relative mx-auto h-48 w-[7.8rem] overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)]">
        <GameAssetImage
          variant="hero"
          src={heroAssets.src}
          alt={meta.title}
          fallbackCandidates={heroAssets.fallbackCandidates}
          status={status}
          className="h-full w-full"
          imageClassName="object-contain object-bottom"
        />
      </div>
      <p className="mt-2 truncate text-center text-xs font-medium text-[var(--app-text)]">
        {stage}. {meta.title}
      </p>
      {status === 'locked' && (
        <p className="mt-0.5 text-center text-[10px] text-[var(--app-text-muted)]">
          Откроется на {meta.progressPercent}%
        </p>
      )}
    </div>
  );
}

type HeroStageTrackProps = {
  gender: HeroGender;
  currentStage: HeroStageNumber;
};

export function HeroStageTrack({ gender, currentStage }: HeroStageTrackProps) {
  return (
    <div data-testid="hero-stage-track" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: HERO_STAGE_COUNT }, (_, i) => {
        const stage = (i + 1) as HeroStageNumber;
        const status =
          stage === currentStage ? 'current' : stage < currentStage ? 'unlocked' : 'locked';

        return <HeroStageTrackItem key={stage} gender={gender} stage={stage} status={status} />;
      })}
    </div>
  );
}
