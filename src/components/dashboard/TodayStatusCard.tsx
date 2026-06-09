import { Link } from 'react-router-dom';
import { getDayMoodPhrase } from '../../utils/dashboard';
import { getDayStatus } from '../../utils/points';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

type TodayStatusCardProps = {
  todayPoints: number;
  todayCoins: number;
  embedded?: boolean;
};

export function TodayStatusCard({ todayPoints, todayCoins, embedded }: TodayStatusCardProps) {
  const displayXp = Math.max(0, todayPoints);

  return (
    <Card
      className={`bg-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-card))] ${embedded ? '!p-3' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-[var(--app-text-muted)] ${embedded ? 'text-xs' : 'text-sm'}`}>
            Сегодняшний статус
          </p>
          <p
            className={`font-bold text-[var(--app-primary)] ${embedded ? 'mt-0.5 text-xl' : 'mt-1 text-2xl'}`}
          >
            +{displayXp} XP
          </p>
          <p className={`text-[var(--app-text-muted)] ${embedded ? 'text-xs' : 'mt-0.5 text-sm'}`}>
            +{todayCoins} монет за день
          </p>
          {!embedded && (
            <p className="mt-1 text-sm text-[var(--app-text)]">{getDayMoodPhrase(todayPoints)}</p>
          )}
        </div>
        <Badge
          variant={displayXp >= 70 ? 'success' : displayXp >= 40 ? 'default' : 'danger'}
          className={embedded ? 'shrink-0 text-[10px]' : ''}
        >
          {getDayStatus(todayPoints)}
        </Badge>
      </div>
      <Link
        to="/today"
        className={`inline-flex w-full items-center justify-center rounded-xl bg-[var(--app-primary)] font-semibold text-slate-950 transition-opacity hover:brightness-105 ${
          embedded ? 'mt-3 px-3 py-2 text-xs' : 'mt-4 px-4 py-2.5 text-sm'
        }`}
      >
        Открыть квесты дня →
      </Link>
    </Card>
  );
}
