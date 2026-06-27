import type { HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { HERO_MILESTONE_STAGES } from '../../constants/heroMilestones';
import { getHeroStageMeta } from '../../game/assetRegistry';
import { ProgressBar } from '../ui/ProgressBar';

type HeroMilestoneTrackProps = {
  gender: HeroGender;
  currentStage: HeroStageNumber;
  progressPercent: number;
};

function getActiveMilestoneIndex(currentStage: HeroStageNumber): number {
  let index = 0;
  for (let i = 0; i < HERO_MILESTONE_STAGES.length; i += 1) {
    if (currentStage >= HERO_MILESTONE_STAGES[i]!) {
      index = i;
    }
  }
  return index;
}

export function HeroMilestoneTrack({
  gender,
  currentStage,
  progressPercent,
}: HeroMilestoneTrackProps) {
  const activeIndex = getActiveMilestoneIndex(currentStage);
  const activeMilestone = HERO_MILESTONE_STAGES[activeIndex]!;
  const activeMeta = getHeroStageMeta(gender, activeMilestone);

  return (
    <div data-testid="hero-milestone-track" className="mt-3 rounded-xl bg-[var(--app-bg-soft)] px-3 py-2.5">
      <div className="mb-2 flex items-center justify-between gap-2 text-xs text-[var(--app-text-muted)]">
        <span>
          Веха{' '}
          <span className="font-semibold text-[var(--app-text)]">{activeMeta.title}</span>
        </span>
        <span className="tabular-nums">
          Путь{' '}
          <span className="font-semibold text-[var(--app-primary)]">
            {Math.round(progressPercent)}%
          </span>
        </span>
      </div>

      <div className="relative mb-2 flex items-center justify-between">
        <div className="pointer-events-none absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-[var(--app-border)]" />
        <div
          className="pointer-events-none absolute left-2 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-[var(--app-primary)] transition-[width]"
          style={{
            width: `calc((100% - 1rem) * ${activeIndex / (HERO_MILESTONE_STAGES.length - 1)})`,
          }}
        />

        {HERO_MILESTONE_STAGES.map((stage, index) => {
          const isReached = currentStage >= stage;
          const isActive = index === activeIndex;

          return (
            <div
              key={stage}
              data-testid={`hero-milestone-${stage}`}
              className="relative z-10 flex flex-col items-center"
              title={getHeroStageMeta(gender, stage).title}
            >
              {isActive ? (
                <div className="flex h-4 w-4 rotate-45 items-center justify-center rounded-sm border border-amber-200/80 bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.55)]" />
              ) : (
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    isReached
                      ? 'bg-[var(--app-primary)] shadow-[0_0_6px_rgba(251,191,36,0.35)]'
                      : 'border border-[var(--app-border)] bg-[var(--app-card)]'
                  }`}
                />
              )}
              <span
                className={`mt-1 text-[10px] tabular-nums ${
                  isActive ? 'font-bold text-[var(--app-primary)]' : 'text-[var(--app-text-muted)]'
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      <ProgressBar value={progressPercent} color="gold" className="h-1.5" />
      <p className="mt-1.5 text-[11px] text-[var(--app-text-muted)]">
        Стадия {currentStage} · все 20 форм — в кодексе
      </p>
    </div>
  );
}
