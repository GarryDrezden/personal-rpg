import { Link } from 'react-router-dom';
import { getWeekStatus } from '../../utils/points';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { CalendarDays } from 'lucide-react';

type WeeklyProgressCardProps = {
  weekTotal: number;
  weekPercent: number;
  weekGoal: number;
  gymCount: number;
  gymTarget: number;
};

export function WeeklyProgressCard({
  weekTotal,
  weekPercent,
  weekGoal,
  gymCount,
  gymTarget,
}: WeeklyProgressCardProps) {
  const cappedPercent = Math.min(100, weekPercent);

  return (
    <Card className="bg-gradient-to-br from-blue-50/80 to-white">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-blue-600" size={22} />
          <h2 className="text-lg font-semibold">Прогресс недели</h2>
        </div>
        <Link to="/week" className="text-sm font-medium text-gold hover:underline">
          Подробнее →
        </Link>
      </div>

      <div className="mb-2 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-stone-900">{weekTotal}</p>
          <p className="text-sm text-rpg-muted">очков из {weekGoal}</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
          {getWeekStatus(weekPercent)}
        </span>
      </div>

      <ProgressBar value={cappedPercent} color={cappedPercent >= 100 ? 'success' : 'gold'} />

      <p className="mt-3 text-sm text-rpg-muted">
        Зал: {gymCount}/{gymTarget} · {weekPercent}% недельной цели
      </p>
    </Card>
  );
}
