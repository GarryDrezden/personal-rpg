import type { ProgressPath } from '../../types/progressMap';
import {
  buildNearestGoal,
  countCompletedMilestones,
  formatPathCurrentValue,
  getMilestoneStatus,
} from '../../utils/progressMapEngine';
import { MilestoneNode } from './MilestoneNode';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

type ProgressPathCardProps = {
  path: ProgressPath;
};

const pathGradients: Record<ProgressPath['id'], string> = {
  weight: 'from-blue-50/80 via-white to-indigo-50/50',
  alcohol: 'from-sky-50/80 via-white to-cyan-50/50',
  steps: 'from-emerald-50/80 via-white to-green-50/50',
  gym: 'from-orange-50/80 via-white to-amber-50/50',
  measurements: 'from-violet-50/80 via-white to-purple-50/50',
};

export function ProgressPathCard({ path }: ProgressPathCardProps) {
  const completed = countCompletedMilestones(path);
  const total = path.milestones.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const nearest = buildNearestGoal(path);

  return (
    <Card className={`bg-gradient-to-br ${pathGradients[path.id]}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-2xl shadow-sm">
            {path.icon}
          </span>
          <div>
            <h3 className="text-lg font-bold text-stone-900">{path.title}</h3>
            <p className="text-sm text-rpg-muted">{path.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-rpg-muted">Сейчас</p>
          <p className="text-xl font-bold text-stone-900">{formatPathCurrentValue(path)}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-rpg-muted">
          <span>
            Пройдено точек: {completed}/{total}
          </span>
          <span>{percent}%</span>
        </div>
        <ProgressBar value={percent} color={percent >= 100 ? 'success' : 'gold'} className="h-2" />
      </div>

      {nearest ? (
        <p className="mb-4 rounded-xl border border-amber-200/70 bg-amber-50/60 px-3 py-2 text-sm text-amber-900">
          <span className="font-medium">Ближайшая цель:</span> {nearest.label}
        </p>
      ) : (
        <p className="mb-4 rounded-xl border border-emerald-200/70 bg-emerald-50/60 px-3 py-2 text-sm font-medium text-emerald-800">
          Все точки этого пути пройдены
        </p>
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
                        ? 'bg-emerald-400'
                        : path.currentValue >= milestone.value
                          ? 'bg-gradient-to-r from-emerald-400 to-stone-300'
                          : 'bg-stone-300'
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
