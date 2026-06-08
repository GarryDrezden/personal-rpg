import { useAppStore } from '../store/appStore';
import { useDerivedStats } from '../store/selectors';
import { todayISO, formatDateFull } from '../utils/dates';
import { useAchievementStore } from '../store/achievementStore';
import { ACHIEVEMENTS } from '../constants/achievements';
import { calcWeightJourney } from '../utils/weightJourney';
import { CharacterHero } from '../components/dashboard/CharacterHero';
import { LevelProgressCard } from '../components/dashboard/LevelProgressCard';
import { TodayStatusCard } from '../components/dashboard/TodayStatusCard';
import { DailyQuestsCard } from '../components/dashboard/DailyQuestsCard';
import { WeeklyProgressCard } from '../components/dashboard/WeeklyProgressCard';
import { RewardsBankCard } from '../components/dashboard/RewardsBankCard';
import { QuickStatsCard } from '../components/dashboard/QuickStatsCard';
import { RecentAchievements } from '../components/achievements/RecentAchievements';

export function DashboardPage() {
  const { dailyEntries, measurements, rewards, settings } = useAppStore();
  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);
  const today = todayISO();
  const stats = useDerivedStats(dailyEntries, measurements, rewards, settings, today);
  const weightJourney = calcWeightJourney(measurements, settings.weightGoal);

  return (
    <div className="space-y-5 pb-2">
      <p className="text-sm text-rpg-muted md:hidden">{formatDateFull(today)}</p>

      <CharacterHero
        level={stats.level.level}
        todayPoints={stats.todayPoints}
        gender={settings.gender}
        journey={weightJourney}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <LevelProgressCard totalXp={stats.totalXP} />
        <TodayStatusCard todayPoints={stats.todayPoints} />
      </div>

      <DailyQuestsCard entry={stats.todayEntry} weekly={stats.weekly} />

      <WeeklyProgressCard
        weekTotal={stats.weekTotal}
        weekPercent={stats.weekPercent}
        weekGoal={stats.weekly.weeklyPointsGoal}
        gymCount={stats.gymCount}
        gymTarget={stats.weekly.gymTarget}
      />

      <RewardsBankCard availablePoints={stats.availablePoints} />

      <RecentAchievements
        unlocked={unlockedAchievements}
        totalCount={ACHIEVEMENTS.length}
      />

      <QuickStatsCard
        streaks={stats.streaks}
        caloriesOkDays={stats.caloriesOkDays}
        noAlcoholDays={stats.noAlcoholDays}
        weight={stats.latest?.weight?.toFixed(1) ?? '—'}
        waist={stats.latest?.waist}
      />
    </div>
  );
}
