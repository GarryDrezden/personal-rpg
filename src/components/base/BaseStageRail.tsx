import type { BaseProgressionSnapshot } from '../../types/baseV1';
import { ProgressBar } from '../ui/ProgressBar';

type BaseStageRailProps = {
  snapshot: BaseProgressionSnapshot;
};

export function BaseStageRail({ snapshot }: BaseStageRailProps) {
  const { allStages, currentStage, baseScore } = snapshot;

  return (
    <div data-testid="base-stage-rail" className="space-y-3">
      {allStages.map((stage) => {
        const unlocked = baseScore >= stage.unlockScore;
        const isCurrent = stage.id === currentStage.id;
        const isPast = stage.level < currentStage.level;

        return (
          <article
            key={stage.id}
            className={`rounded-xl border px-4 py-3 transition-colors ${
              isCurrent
                ? 'border-[var(--app-gold)]/40 bg-[var(--app-primary-soft)]/40 shadow-[0_0_16px_rgba(250,204,21,0.08)]'
                : unlocked
                  ? 'border-[var(--app-border)] bg-[var(--app-card)]/70'
                  : 'border-dashed border-[var(--app-border)] bg-[var(--app-card)]/40 opacity-75'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                  unlocked ? 'bg-[var(--app-primary-soft)]' : 'bg-[var(--app-bg-soft)]'
                }`}
                aria-hidden
              >
                {stage.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--app-text)]">{stage.title}</h3>
                  {isCurrent ? (
                    <span className="rounded-full bg-[var(--app-gold)]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--app-gold)]">
                      Сейчас
                    </span>
                  ) : null}
                  {!unlocked ? (
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                      {stage.unlockScore} очков
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-[var(--app-text-muted)]">{stage.description}</p>
                <p className="mt-1 text-xs italic text-[var(--app-text-muted)]">{stage.flavorText}</p>
              </div>
            </div>
            {isCurrent && snapshot.nextStage ? (
              <div className="mt-3 pl-[52px]">
                <ProgressBar value={snapshot.progressPercent} max={100} />
                <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                  До «{snapshot.nextStage.title}»: {snapshot.progressToNext} очков маршрута
                </p>
              </div>
            ) : null}
            {isPast ? (
              <p className="mt-2 pl-[52px] text-xs text-[var(--app-success)]">Стадия удержана</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
