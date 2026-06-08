import { Link } from 'react-router-dom';
import type { UnlockedAchievement } from '../../types/achievements';
import { ACHIEVEMENT_BY_ID, getTierLabel } from '../../constants/achievements';
import { AchievementIcon } from './AchievementIcon';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { formatDateRu } from '../../utils/dates';

type RecentAchievementsProps = {
  unlocked: UnlockedAchievement[];
  totalCount: number;
};

export function RecentAchievements({ unlocked, totalCount }: RecentAchievementsProps) {
  const recent = [...unlocked]
    .sort((a, b) => b.unlockedAt.localeCompare(a.unlockedAt))
    .slice(0, 3);
  const unlockedCount = unlocked.length;
  const percent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--app-text)]">Достижения</h2>
        <Link to="/achievements" className="text-sm font-medium text-[var(--app-primary)] hover:underline">
          Все →
        </Link>
      </div>

      <p className="mb-2 text-sm text-[var(--app-text-muted)]">
        Получено {unlockedCount} из {totalCount} достижений
      </p>
      <ProgressBar value={percent} color="gold" className="mb-4" />

      {recent.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-4 text-center text-sm text-[var(--app-text-muted)]">
          Первые достижения появятся после внесения данных.
        </p>
      ) : (
        <div className="space-y-3">
          {recent.map((u) => {
            const a = ACHIEVEMENT_BY_ID[u.achievementId];
            if (!a) return null;
            return (
              <div
                key={u.achievementId}
                className="flex items-center gap-3 rounded-xl bg-[var(--app-bg-soft)] p-3"
              >
                <AchievementIcon iconKey={a.iconKey} tier={a.tier} unlocked size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-[var(--app-text)]">{a.title}</div>
                  <div className="text-xs text-[var(--app-text-muted)]">
                    {getTierLabel(a.tier)} · {formatDateRu(u.unlockedAt, 'd MMM')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
