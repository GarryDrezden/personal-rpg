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
    <Card className="bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Map className="text-indigo-600" size={22} />
          <h2 className="text-lg font-semibold">Ближайшая цель на карте</h2>
        </div>
        <Link to="/map" className="text-sm font-medium text-gold hover:underline">
          Карта →
        </Link>
      </div>

      {nearestGoal ? (
        <>
          <p className="text-sm text-rpg-muted">
            {nearestGoal.pathIcon} {nearestGoal.pathTitle}
          </p>
          <p className="mt-1 text-base font-semibold text-stone-900">{nearestGoal.label}</p>
        </>
      ) : (
        <p className="text-sm text-emerald-700 font-medium">
          Все цели на карте пройдены — маршрут завершён!
        </p>
      )}

      <p className="mt-3 text-xs text-rpg-muted">
        Пройдено точек: {completedMilestones}/{totalMilestones}
      </p>
    </Card>
  );
}
