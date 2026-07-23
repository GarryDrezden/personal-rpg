import type { ProgressPath } from '../../types/progressMap';
import {
  buildNearestGoal,
  countCompletedMilestones,
  formatPathCurrentValue,
  getMilestoneStatus,
} from '../../utils/progressMapEngine';
import { MilestoneNode } from './MilestoneNode';
import { ProgressBar } from '../ui/ProgressBar';

type ProgressPathCardProps = {
  path: ProgressPath;
};

export function ProgressPathCard({ path }: ProgressPathCardProps) {
  const completed = countCompletedMilestones(path);
  const total = path.milestones.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const nearest = buildNearestGoal(path);

  return (
    <section
      data-testid={`progress-path-${path.id}`}
      className="overflow-hidden rounded-2xl border border-violet-500/15 bg-gradient-to-br from-[#12101c]/95 via-[#0e0c16]/92 to-[#08070f]/95"
    >
      <div className="border-b border-violet-500/10 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-[#0e0c14]/85 text-xl"
            >
              {path.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--app-gold)]/70">
                Маршрут
              </p>
              <h3 className="truncate text-base font-semibold text-[var(--app-text)]">{path.title}</h3>
              <p className="mt-0.5 text-xs text-[var(--app-text-muted)]/75">{path.description}</p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]/60">
              Сейчас
            </p>
            <p className="text-lg font-bold text-[var(--app-gold)]">{formatPathCurrentValue(path)}</p>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]/55">
            <span>
              Точек: {completed}/{total}
            </span>
            <span>{percent}%</span>
          </div>
          <ProgressBar value={percent} color={percent >= 100 ? 'success' : 'gold'} className="h-1.5" />
        </div>

        {nearest ? (
          <p className="mt-2 text-xs text-[var(--app-text-muted)]/80">
            <span className="font-medium text-[var(--app-gold)]/90">Ближайшая цель:</span>{' '}
            {nearest.label}
          </p>
        ) : (
          <p className="mt-2 text-xs font-medium text-emerald-300/85">Все точки маршрута пройдены</p>
        )}
      </div>

      <ol className="space-y-0 px-4 py-3" aria-label={`Точки маршрута: ${path.title}`}>
        {path.milestones.map((milestone, index) => {
          const status = getMilestoneStatus(path.currentValue, milestone.value, path.milestones);
          return (
            <MilestoneNode
              key={milestone.id}
              milestone={milestone}
              status={status}
              isLast={index === path.milestones.length - 1}
            />
          );
        })}
      </ol>
    </section>
  );
}
