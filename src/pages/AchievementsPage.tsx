import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { useAchievementStore } from '../store/achievementStore';
import { ACHIEVEMENTS, ACHIEVEMENT_BY_ID } from '../constants/achievements';
import { AchievementCard } from '../components/achievements/AchievementCard';
import {
  AchievementFilters,
  type StatusFilter,
} from '../components/achievements/AchievementFilters';
import { AchievementIcon } from '../components/achievements/AchievementIcon';
import { CARD_ACCENT, SURFACE_INSET } from '../constants/cardTheme';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { calcTotalEarnedXP } from '../utils/points';
import { getAchievementProgress } from '../utils/achievementEngine';
import type { AchievementCategory, AchievementTier } from '../types/achievements';
import { formatDateRu } from '../utils/dates';

export function AchievementsPage() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);

  const [category, setCategory] = useState<AchievementCategory | 'all'>('all');
  const [tier, setTier] = useState<AchievementTier | 'all'>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const totalXp = calcTotalEarnedXP(dailyEntries, measurements, settings);
  const progressList = useMemo(
    () =>
      getAchievementProgress({
        dailyEntries,
        measurements,
        settings,
        totalXp,
        unlockedAchievements,
      }),
    [dailyEntries, measurements, settings, totalXp, unlockedAchievements],
  );

  const unlockedMap = useMemo(
    () => new Map(unlockedAchievements.map((u) => [u.achievementId, u])),
    [unlockedAchievements],
  );
  const progressMap = useMemo(
    () => new Map(progressList.map((p) => [p.achievementId, p])),
    [progressList],
  );

  const filtered = ACHIEVEMENTS.filter((a) => {
    if (category !== 'all' && a.category !== category) return false;
    if (tier !== 'all' && a.tier !== tier) return false;
    const isUnlocked = unlockedMap.has(a.id);
    if (status === 'unlocked' && !isUnlocked) return false;
    if (status === 'locked' && isUnlocked) return false;
    return true;
  });

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const collectionPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const recent = [...unlockedAchievements]
    .sort((a, b) => b.unlockedAt.localeCompare(a.unlockedAt))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Достижения</h1>
        <p className="mt-1 text-sm text-rpg-muted">
          Коллекция наград за привычки, прогресс и возвращение в игру
        </p>
      </header>

      <Card className={CARD_ACCENT.primary}>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-3xl font-bold text-[var(--app-primary)]">
              {unlockedCount}
              <span className="text-lg text-[var(--app-text-muted)]"> / {totalCount}</span>
            </div>
            <p className="text-sm text-[var(--app-text-muted)]">Коллекция {collectionPercent}%</p>
          </div>
        </div>
        <ProgressBar value={collectionPercent} color="gold" />

        {recent.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {recent.map((u) => {
              const a = ACHIEVEMENT_BY_ID[u.achievementId];
              if (!a) return null;
              return (
                <div
                  key={u.achievementId}
                  className={`flex items-center gap-2 px-3 py-2 ${SURFACE_INSET}`}
                >
                  <AchievementIcon iconKey={a.iconKey} tier={a.tier} unlocked size="sm" />
                  <div>
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-rpg-muted">
                      {formatDateRu(u.unlockedAt, 'd MMM')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <AchievementFilters
        category={category}
        tier={tier}
        status={status}
        onCategoryChange={setCategory}
        onTierChange={setTier}
        onStatusChange={setStatus}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((a) => (
          <AchievementCard
            key={a.id}
            achievement={a}
            unlocked={unlockedMap.get(a.id)}
            progress={progressMap.get(a.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-rpg-muted">Нет достижений по выбранным фильтрам.</p>
      )}
    </div>
  );
}
