import { Link } from 'react-router-dom';
import type { NearestMapGoal } from '../../types/progressMap';
import { Card } from '../ui/Card';
import { Map } from 'lucide-react';

type ProgressMapPreviewCardProps = {
  nearestGoal: NearestMapGoal | null;
  completedMilestones: number;
  totalMilestones: number;
};

export function ProgressMapPreviewCard({
  nearestGoal,
  completedMilestones,
  totalMilestones,
}: ProgressMapPreviewCardProps) {
  return (
    <Card className="bg-[color-mix(in_srgb,var(--app-secondary)_8%,var(--app-card))]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Map className="text-[var(--app-secondary)]" size={22} />
          <h2 className="text-lg font-semibold text-[var(--app-text)]">Ближайшая цель на карте</h2>
        </div>
        <Link to="/map" className="text-sm font-medium text-[var(--app-primary)] hover:underline">
          Карта →
        </Link>
      </div>

      {nearestGoal ? (
        <>
          <p className="text-sm text-[var(--app-text-muted)]">
            {nearestGoal.pathIcon} {nearestGoal.pathTitle}
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--app-text)]">{nearestGoal.label}</p>
        </>
      ) : (
        <p className="text-sm font-medium text-[var(--app-success)]">
          Все цели на карте пройдены — маршрут завершён!
        </p>
      )}

      <p className="mt-3 text-xs text-[var(--app-text-muted)]">
        Пройдено точек: {completedMilestones}/{totalMilestones}
      </p>
    </Card>
  );
}
