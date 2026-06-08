import { Link } from 'react-router-dom';
import { getDayMoodPhrase } from '../../utils/dashboard';
import { getDayStatus } from '../../utils/points';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

type TodayStatusCardProps = {
  todayPoints: number;
};

export function TodayStatusCard({ todayPoints }: TodayStatusCardProps) {
  const displayPoints = Math.max(0, todayPoints);

  return (
    <Card className="bg-gradient-to-br from-white to-amber-50/40">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-rpg-muted">Сегодняшний статус</p>
          <p className="mt-1 text-2xl font-bold text-gold">{displayPoints} очков</p>
          <p className="mt-1 text-sm text-stone-600">{getDayMoodPhrase(todayPoints)}</p>
        </div>
        <Badge variant={displayPoints >= 70 ? 'success' : displayPoints >= 40 ? 'default' : 'danger'}>
          {getDayStatus(todayPoints)}
        </Badge>
      </div>
      <Link
        to="/today"
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Открыть квесты дня →
      </Link>
    </Card>
  );
}
