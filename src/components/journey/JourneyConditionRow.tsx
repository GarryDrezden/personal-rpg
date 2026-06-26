import type { JourneyStageConditionProgress } from '../../types/journeyMap';
import { Check } from 'lucide-react';

type JourneyConditionRowProps = {
  conditionProgress: JourneyStageConditionProgress;
};

export function JourneyConditionRow({ conditionProgress }: JourneyConditionRowProps) {
  const { condition, current, target, completed, progressPercent } = conditionProgress;

  return (
    <div
      className={`rounded-xl border px-3 py-2.5 ${
        completed
          ? 'border-emerald-500/30 bg-emerald-500/10'
          : 'border-[var(--app-border)] bg-[var(--app-bg-soft)]'
      }`}
    >
      <div className="flex items-start gap-2">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
            completed
              ? 'bg-emerald-500 text-white'
              : 'border border-[var(--app-border)] bg-[var(--app-card)]'
          }`}
        >
          {completed ? <Check size={12} strokeWidth={3} /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium ${
              completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--app-text)]'
            }`}
          >
            {condition.title}
          </p>
          {!completed ? (
            <>
              <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">
                {formatValue(current, target, condition.type)}
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--app-card)]">
                <div
                  className="h-full rounded-full bg-[var(--app-secondary)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function formatValue(
  current: number,
  target: number,
  type: JourneyStageConditionProgress['condition']['type'],
): string {
  const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString('ru') : n.toFixed(1));

  switch (type) {
    case 'weight_loss_kg':
      return `${fmt(current)} / ${fmt(target)} кг`;
    case 'waist_loss_cm':
      return `${fmt(current)} / ${fmt(target)} см`;
    case 'steps_total':
      return `${fmt(current)} / ${fmt(target)} шагов`;
    case 'body_abilities_unlocked':
      return `${fmt(current)} / ${fmt(target)} способностей`;
    case 'gym_total':
      return `${fmt(current)} / ${fmt(target)} тренировок`;
    case 'weight_entry':
      return `${fmt(current)} / ${fmt(target)} замеров`;
    default:
      return `${fmt(current)} / ${fmt(target)}`;
  }
}
