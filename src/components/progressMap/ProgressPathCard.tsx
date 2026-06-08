import type { ProgressPath } from '../../types/progressMap';
import {
  buildNearestGoal,
  countCompletedMilestones,
  formatPathCurrentValue,
  getMilestoneStatus,
} from '../../utils/progressMapEngine';
import { GOAL_BANNER, GOAL_BANNER_SUCCESS } from '../../constants/cardTheme';
import { MilestoneNode } from './MilestoneNode';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

type ProgressPathCardProps = {
  path: ProgressPath;
};

const PATH_TINT: Record<ProgressPath['id'], string> = {
  weight: 'color-mix(in srgb, var(--app-secondary) 10%, var(--app-card))',
  alcohol: 'color-mix(in srgb, var(--app-success) 10%, var(--app-card))',
  steps: 'color-mix(in srgb, var(--app-success) 10%, var(--app-card))',
  gym: 'color-mix(in srgb, var(--app-warning) 10%, var(--app-card))',
  measurements: 'color-mix(in srgb, var(--app-secondary) 12%, var(--app-card))',
};

export function ProgressPathCard({ path }: ProgressPathCardProps) {
  const completed = countCompletedMilestones(path);
  const total = path.milestones.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const nearest = buildNearestGoal(path);

  return (
    <Card style={{ background: PATH_TINT[path.id] }}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-card-strong)] text-2xl shadow-sm">
            {path.icon}
          </span>
          <div>
            <h3 className="text-lg font-bold text-[var(--app-text)]">{path.title}</h3>
            <p className="text-sm text-[var(--app-text-muted)]">{path.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            Сейчас
          </p>
          <p className="text-xl font-bold text-[var(--app-text)]">{formatPathCurrentValue(path)}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]">
          <span>
            Пройдено точек: {completed}/{total}
          </span>
          <span>{percent}%</span>
        </div>
        <ProgressBar value={percent} color={percent >= 100 ? 'success' : 'gold'} className="h-2" />
      </div>

      {nearest ? (
        <p className={`mb-4 ${GOAL_BANNER}`}>
          <span className="font-medium text-[var(--app-primary)]">Ближайшая цель:</span> {nearest.label}
        </p>
      ) : (
        <p className={`mb-4 ${GOAL_BANNER_SUCCESS}`}>Все точки этого пути пройдены</p>
      )}

      <div className="relative overflow-x-auto pb-2">
        <div className="flex min-w-max items-start justify-between gap-2 px-1">
          {path.milestones.map((milestone, index) => {
            const status = getMilestoneStatus(path.currentValue, milestone.value, path.milestones);
            const isLast = index === path.milestones.length - 1;

            return (
              <div key={milestone.id} className="flex items-start">
                <MilestoneNode milestone={milestone} status={status} />
                {!isLast && (
                  <div
                    className={`mx-1 mt-5 h-0.5 w-6 shrink-0 sm:w-10 ${
                      path.currentValue >= path.milestones[index + 1]!.value
                        ? 'bg-[var(--app-success)]'
                        : path.currentValue >= milestone.value
                          ? 'bg-gradient-to-r from-[var(--app-success)] to-[var(--app-border)]'
                          : 'bg-[var(--app-border)]'
                    }`}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
