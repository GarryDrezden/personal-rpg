import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { useGameStats } from '../hooks/useGameStats';
import { formatDateFull, todayISO, weekStart } from '../utils/dates';
import { useAchievementStore } from '../store/achievementStore';
import { ACHIEVEMENTS } from '../constants/achievements';
import { getAvatarState } from '../utils/avatarEngine';
import { calcAllSkillProgress } from '../utils/skillEngine';
import { getWeeklyBoss } from '../utils/bossEngine';
import { CharacterHero } from '../components/dashboard/CharacterHero';
import { LevelProgressCard } from '../components/dashboard/LevelProgressCard';
import { TodayStatusCard } from '../components/dashboard/TodayStatusCard';
import { DailyQuestsCard } from '../components/dashboard/DailyQuestsCard';
import { WeeklyProgressCard } from '../components/dashboard/WeeklyProgressCard';
import { WeeklyBossCard } from '../components/boss/WeeklyBossCard';
import { RewardsBankCard } from '../components/dashboard/RewardsBankCard';
import { QuickStatsCard } from '../components/dashboard/QuickStatsCard';
import { SkillsOverviewCard } from '../components/skills/SkillsOverviewCard';
import { RecentAchievements } from '../components/achievements/RecentAchievements';
import { RecoveryCard } from '../components/recovery/RecoveryCard';
import { shouldShowRecoveryCard } from '../utils/recoveryEngine';
import { ProgressMapPreviewCard } from '../components/dashboard/ProgressMapPreviewCard';
import { getMapSummary, getProgressPaths } from '../utils/progressMapEngine';

export function DashboardPage() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);
  const today = todayISO();
  const stats = useGameStats(today);
  const avatar = useMemo(
    () => getAvatarState({ measurements, settings }),
    [measurements, settings],
  );

  const skills = useMemo(
    () => calcAllSkillProgress(dailyEntries, measurements, settings),
    [dailyEntries, measurements, settings],
  );

  const showRecovery = useMemo(
    () =>
      shouldShowRecoveryCard({
        today,
        dailyEntries,
        settings,
        todayEntry: stats.todayEntry,
      }),
    [today, dailyEntries, settings, stats.todayEntry],
  );

  const mapSummary = useMemo(() => {
    const paths = getProgressPaths({ dailyEntries, measurements, settings });
    return getMapSummary(paths);
  }, [dailyEntries, measurements, settings]);

  const weeklyBoss = useMemo(
    () =>
      getWeeklyBoss({
        weekStart: weekStart(today),
        dailyEntries,
        settings,
        measurements,
      }),
    [today, dailyEntries, settings, measurements],
  );

  return (
    <div className="space-y-5 pb-2">
      <p className="text-sm text-rpg-muted md:hidden">{formatDateFull(today)}</p>

      <CharacterHero
        level={stats.level.level}
        todayPoints={stats.todayPoints}
        todayCoins={stats.coins.todayEarned}
        availableCoins={stats.coins.available}
        avatar={avatar}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <LevelProgressCard totalXp={stats.totalXP} />
          <TodayStatusCard
            todayPoints={stats.todayPoints}
            todayCoins={stats.coins.todayEarned}
          />
          {showRecovery && (
            <RecoveryCard
              today={today}
              dailyEntries={dailyEntries}
              settings={settings}
              todayEntry={stats.todayEntry}
            />
          )}
          <DailyQuestsCard
            entry={stats.todayEntry}
            dailyEntries={dailyEntries}
            settings={settings}
            date={today}
          />
          <WeeklyProgressCard
            weekTotal={stats.weekTotal}
            weekPercent={stats.weekPercent}
            weekGoal={stats.weekly.weeklyPointsGoal}
            gymCount={stats.gymCount}
            gymTarget={stats.weekly.gymTarget}
          />
          <WeeklyBossCard boss={weeklyBoss} />
          <RewardsBankCard
            availableCoins={stats.coins.available}
            weekEarned={stats.coins.weekEarned}
            totalSpent={stats.coins.totalSpent}
            nearestAffordable={stats.nearestRewards.affordable}
            nearestUnaffordable={stats.nearestRewards.unaffordable}
          />
        </div>

        <div className="space-y-4">
          <QuickStatsCard
            streaks={stats.streaks}
            caloriesOkDays={stats.caloriesOkDays}
            noAlcoholDays={stats.noAlcoholDays}
            weight={stats.latest?.weight?.toFixed(1) ?? '—'}
            waist={stats.latest?.waist}
          />
          <SkillsOverviewCard skills={skills} />
          <ProgressMapPreviewCard
            nearestGoal={mapSummary.nearestGoal}
            completedMilestones={mapSummary.completedMilestones}
            totalMilestones={mapSummary.totalMilestones}
          />
          <RecentAchievements
            unlocked={unlockedAchievements}
            totalCount={ACHIEVEMENTS.length}
          />
        </div>
      </div>
    </div>
  );
}
