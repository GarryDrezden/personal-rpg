import { useMemo, useState, useCallback } from 'react';
import { useAppStore, emptyDaily } from '../store/appStore';
import { useGameStats } from '../hooks/useGameStats';
import { formatDateFull, todayISO } from '../utils/dates';
import { useAchievementStore } from '../store/achievementStore';
import { ACHIEVEMENT_BY_ID } from '../constants/achievements';
import { getRecoveryState, shouldShowRecoveryCard } from '../utils/recoveryEngine';
import { GameHeroPanel } from '../components/dashboard/GameHeroPanel';
import { DailyQuestsCard } from '../components/dashboard/DailyQuestsCard';
import { CompactStatusGrid } from '../components/dashboard/CompactStatusGrid';
import { DashboardLinks } from '../components/dashboard/DashboardLinks';
import { NextBestActionCard } from '../components/freedom/NextBestActionCard';
import { RecoveryCard } from '../components/recovery/RecoveryCard';
import { MomentumHelpCard } from '../components/momentum/MomentumHelpCard';
import { getMomentumSummary } from '../utils/momentumEngine';
import { getDayMode } from '../utils/stepsEngine';
import {
  dismissMomentumHelp,
  isMomentumHelpDismissed,
} from '../utils/momentumSuggestionStorage';
import {
  calculateFreedomScore,
  hasFreedomScoreData,
} from '../utils/freedomScoreEngine';
import { getNextBestAction } from '../utils/nextBestActionEngine';
import { getJourneyMapSummary } from '../utils/journeyMapEngine';
import { getNextBodyAbilities } from '../utils/bodyAbilityEngine';
import { useAppTheme } from '../hooks/useAppTheme';
import { formatDateRu } from '../utils/dates';
import { hasAnyDailyData } from '../utils/achievementHelpers';

export function DashboardPage() {
  const { dailyEntries, measurements, settings, updateDaily } = useAppStore();
  const { themeId } = useAppTheme();
  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);
  const today = todayISO();
  const stats = useGameStats(today);

  const engineParams = useMemo(
    () => ({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );

  const showRecovery = useMemo(
    () =>
      shouldShowRecoveryCard({
        today,
        dailyEntries,
        settings,
        todayEntry: stats.todayEntry ?? null,
      }),
    [today, dailyEntries, settings, stats.todayEntry],
  );

  const freedomScore = useMemo(() => calculateFreedomScore(engineParams), [engineParams]);
  const freedomHasData = hasFreedomScoreData({ dailyEntries, measurements });

  const momentumSummary = useMemo(
    () => getMomentumSummary({ today, dailyEntries, settings }),
    [today, dailyEntries, settings],
  );
  const momentumHasData = dailyEntries.some((e) => hasAnyDailyData(e));

  const [momentumHelpDismissed, setMomentumHelpDismissed] = useState(() =>
    isMomentumHelpDismissed(today),
  );

  const showMomentumHelp =
    !momentumHelpDismissed &&
    getDayMode(stats.todayEntry?.dayMode) === 'normal' &&
    (momentumSummary.recoverySuggested || momentumSummary.minimalModeSuggested);

  const acceptMomentumRecovery = useCallback(async () => {
    const existingEntry = stats.todayEntry ?? emptyDaily(today);
    await updateDaily({
      ...existingEntry,
      date: today,
      dayMode: 'recovery',
      energyLevel: existingEntry.energyLevel ?? 2,
    });
  }, [stats.todayEntry, today, updateDaily]);

  const acceptMomentumMinimal = useCallback(async () => {
    const existingEntry = stats.todayEntry ?? emptyDaily(today);
    await updateDaily({
      ...existingEntry,
      date: today,
      dayMode: 'minimal',
      energyLevel: existingEntry.energyLevel ?? 2,
    });
  }, [stats.todayEntry, today, updateDaily]);

  const handleDismissMomentumHelp = useCallback(() => {
    dismissMomentumHelp(today);
    setMomentumHelpDismissed(true);
  }, [today]);

  const recoveryState = useMemo(
    () =>
      getRecoveryState({
        today,
        dailyEntries,
        settings,
        todayEntry: stats.todayEntry ?? null,
      }),
    [today, dailyEntries, settings, stats.todayEntry],
  );

  const journeySummary = useMemo(() => getJourneyMapSummary(engineParams), [engineParams]);

  const nextAbilities = useMemo(
    () => getNextBodyAbilities({ dailyEntries, measurements, settings, limit: 1 }),
    [dailyEntries, measurements, settings],
  );

  const nextBestAction = useMemo(
    () =>
      getNextBestAction({
        today,
        todayEntry: stats.todayEntry ?? null,
        dailyEntries,
        measurements,
        settings,
        recoveryState,
        nextBodyAbilities: nextAbilities,
        journeySummary,
        themeId,
      }),
    [
      today,
      stats.todayEntry,
      dailyEntries,
      measurements,
      settings,
      recoveryState,
      nextAbilities,
      journeySummary,
      themeId,
    ],
  );

  const latestUnlock = useMemo(() => {
    const recent = [...unlockedAchievements].sort((a, b) =>
      b.unlockedAt.localeCompare(a.unlockedAt),
    )[0];
    if (!recent) return null;
    const achievement = ACHIEVEMENT_BY_ID[recent.achievementId];
    if (!achievement) return null;
    return {
      title: achievement.title,
      subtitle: `Открыто ${formatDateRu(recent.unlockedAt)}`,
      href: '/achievements',
      linkLabel: 'Все достижения →',
    };
  }, [unlockedAchievements]);

  return (
    <div data-testid="dashboard-page" className="space-y-6 pb-2">
      <p className="text-sm text-rpg-muted lg:hidden">{formatDateFull(today)}</p>

      <GameHeroPanel
        level={stats.level.level}
        totalXp={stats.totalXP}
        todayPoints={stats.todayPoints}
        todayCoins={stats.coins.todayEarned}
        availableCoins={stats.coins.available}
      />

      {showMomentumHelp && (
        <MomentumHelpCard
          summary={momentumSummary}
          onSetRecoveryMode={() => void acceptMomentumRecovery()}
          onSetMinimalMode={() => void acceptMomentumMinimal()}
          onDismiss={handleDismissMomentumHelp}
        />
      )}

      {showRecovery && !showMomentumHelp ? (
        <RecoveryCard
          today={today}
          dailyEntries={dailyEntries}
          settings={settings}
          todayEntry={stats.todayEntry}
        />
      ) : null}

      <NextBestActionCard action={nextBestAction} />

      <DailyQuestsCard
        entry={stats.todayEntry}
        dailyEntries={dailyEntries}
        settings={settings}
        date={today}
      />

      <CompactStatusGrid
        momentum={momentumSummary}
        momentumHasData={momentumHasData}
        freedom={freedomScore}
        freedomHasData={freedomHasData}
        weekTotal={stats.weekTotal}
        weekPercent={stats.weekPercent}
        weekGoal={stats.weekly.weeklyPointsGoal}
        latestUnlock={latestUnlock}
      />

      <DashboardLinks />
    </div>
  );
}
