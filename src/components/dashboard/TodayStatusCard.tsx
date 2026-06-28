import { Link } from 'react-router-dom';
import { getDayMoodPhrase } from '../../utils/dashboard';
import { getDayStatus } from '../../utils/points';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const INTEGRATED_PANEL =
  'flex min-h-[8.5rem] flex-1 flex-col justify-center px-3 py-2 sm:px-4 md:min-h-[9rem]';

type TodayStatusCardProps = {
  todayPoints: number;
  todayCoins: number;
  integrated?: boolean;
};

export function TodayStatusCard({ todayPoints, todayCoins, integrated }: TodayStatusCardProps) {
  const displayXp = Math.max(0, todayPoints);
  const status = getDayStatus(todayPoints);
  const badgeVariant = displayXp >= 70 ? 'success' : displayXp >= 40 ? 'default' : 'danger';

  const questLink = (
    <Link
      to="/today"
      className={`inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl bg-[var(--app-primary)] font-semibold text-slate-950 transition hover:brightness-105 ${
        integrated ? 'mt-3 px-3 py-2 text-sm' : 'mt-4 px-4 py-2.5 text-sm'
      }`}
    >
      Открыть квесты дня →
    </Link>
  );

  if (integrated) {
    return (
      <div className={INTEGRATED_PANEL}>
        <div className="flex items-center justify-between gap-3">
          <p className="whitespace-nowrap text-sm text-[var(--app-text-muted)]">Сегодняшний статус</p>
          <Badge variant={badgeVariant} className="shrink-0 whitespace-nowrap">
            {status}
          </Badge>
        </div>
        <p className="mt-1 whitespace-nowrap text-2xl font-bold tabular-nums text-[var(--app-primary)] md:text-3xl">
          +{displayXp} XP
        </p>
        <p className="mt-1 whitespace-nowrap text-sm text-[var(--app-text-muted)]">
          +{todayCoins} монет за день
        </p>
        {questLink}
      </div>
    );
  }

  return (
    <Card className="bg-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-card))]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[var(--app-text-muted)]">Сегодняшний статус</p>
          <p className="mt-1 text-2xl font-bold text-[var(--app-primary)]">+{displayXp} XP</p>
          <p className="mt-0.5 text-sm text-[var(--app-text-muted)]">+{todayCoins} монет за день</p>
          <p className="mt-1 text-sm text-[var(--app-text)]">{getDayMoodPhrase(todayPoints)}</p>
        </div>
        <Badge variant={badgeVariant}>{status}</Badge>
      </div>
      {questLink}
    </Card>
  );
}
