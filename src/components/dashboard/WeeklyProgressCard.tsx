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
    <Card className="bg-[color-mix(in_srgb,var(--app-secondary)_8%,var(--app-card))]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-[var(--app-secondary)]" size={22} />
          <h2 className="text-lg font-semibold text-[var(--app-text)]">Прогресс недели</h2>
        </div>
        <Link to="/week" className="text-sm font-medium text-[var(--app-primary)] hover:underline">
          Подробнее →
        </Link>
      </div>

      <div className="mb-2 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-[var(--app-text)]">{weekTotal}</p>
          <p className="text-sm text-[var(--app-text-muted)]">XP из {weekGoal}</p>
        </div>
        <span className="rounded-full bg-[color-mix(in_srgb,var(--app-secondary)_14%,var(--app-card-strong))] px-3 py-1 text-sm font-semibold text-[var(--app-secondary)]">
          {getWeekStatus(weekPercent)}
        </span>
      </div>

      <ProgressBar value={cappedPercent} color={cappedPercent >= 100 ? 'success' : 'gold'} />

      <p className="mt-3 text-sm text-[var(--app-text-muted)]">
        Зал: {gymCount}/{gymTarget} · {weekPercent}% недельной цели
      </p>
    </Card>
  );
}
