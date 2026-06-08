import { Link } from 'react-router-dom';
import { getDayMoodPhrase } from '../../utils/dashboard';
import { getDayStatus } from '../../utils/points';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

type TodayStatusCardProps = {
  todayPoints: number;
  todayCoins: number;
};

export function TodayStatusCard({ todayPoints, todayCoins }: TodayStatusCardProps) {
  const displayXp = Math.max(0, todayPoints);

  return (
    <Card className="bg-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-card))]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--app-text-muted)]">Сегодняшний статус</p>
          <p className="mt-1 text-2xl font-bold text-[var(--app-primary)]">+{displayXp} XP</p>
          <p className="mt-0.5 text-sm text-[var(--app-text-muted)]">
            +{todayCoins} монет за день
          </p>
          <p className="mt-1 text-sm text-[var(--app-text)]">{getDayMoodPhrase(todayPoints)}</p>
        </div>
        <Badge variant={displayXp >= 70 ? 'success' : displayXp >= 40 ? 'default' : 'danger'}>
          {getDayStatus(todayPoints)}
        </Badge>
      </div>
      <Link
        to="/today"
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[var(--app-primary)] px-4 py-2.5 text-sm font-semibold text-slate-950 transition-opacity hover:brightness-105"
      >
        Открыть квесты дня →
      </Link>
    </Card>
  );
}
