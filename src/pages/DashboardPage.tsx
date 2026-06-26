import { useMemo, useState, useCallback } from 'react';

import { useAppStore, emptyDaily } from '../store/appStore';

import { useGameStats } from '../hooks/useGameStats';

import { formatDateFull, isMonday, todayISO, weekStart } from '../utils/dates';

import { useAchievementStore } from '../store/achievementStore';

import { useCoinStore } from '../store/coinStore';

import { ACHIEVEMENTS } from '../constants/achievements';

import { getAvatarState } from '../utils/avatarEngine';

import { calcAllSkillProgress } from '../utils/skillEngine';

import { getWeeklyBoss } from '../utils/bossEngine';

import { getRecoveryState } from '../utils/recoveryEngine';

import { CharacterHero } from '../components/dashboard/CharacterHero';
import { DashboardGamePanel } from '../components/game/DashboardGamePanel';

import { WeeklyProgressCard } from '../components/dashboard/WeeklyProgressCard';

import { WeeklyBossCard } from '../components/boss/WeeklyBossCard';

import { RewardsBankCard } from '../components/dashboard/RewardsBankCard';

import { QuickStatsCard } from '../components/dashboard/QuickStatsCard';

import { SkillsOverviewCard } from '../components/skills/SkillsOverviewCard';

import { RecentAchievements } from '../components/achievements/RecentAchievements';

import { RecoveryCard } from '../components/recovery/RecoveryCard';

import { DashboardEnergyCard } from '../components/energy/DashboardEnergyCard';

import { shouldShowRecoveryCard } from '../utils/recoveryEngine';

import { ProgressMapPreviewCard } from '../components/dashboard/ProgressMapPreviewCard';

import { getMapSummary, getProgressPaths } from '../utils/progressMapEngine';

import { WeeklyReportPreviewCard } from '../components/dashboard/WeeklyReportPreviewCard';

import { generateWeeklyReport, previousWeekStart } from '../utils/weeklyReportEngine';

import { InsightPreviewCard } from '../components/dashboard/InsightPreviewCard';

import { NextBodyAbilityCard } from '../components/bodyAbilities/NextBodyAbilityCard';

import { JourneyPreviewCard } from '../components/journey/JourneyPreviewCard';

import { FreedomScoreCard } from '../components/freedom/FreedomScoreCard';

import { NextBestActionCard } from '../components/freedom/NextBestActionCard';

import { RemovedLoadCard } from '../components/freedom/RemovedLoadCard';

import { PlateauCard } from '../components/freedom/PlateauCard';

import { WeeklyStoryCard } from '../components/weekly/WeeklyStoryCard';

import { useAppTheme } from '../hooks/useAppTheme';

import {

  getNextBodyAbilities,

  getBodyAbilityStats,

} from '../utils/bodyAbilityEngine';

import {

  getJourneyMapSummary,

  hasAnyJourneyData,

  hasMinimalJourneyData,

} from '../utils/journeyMapEngine';

import {

  calculateFreedomScore,

  hasFreedomScoreData,

} from '../utils/freedomScoreEngine';

import { calculateRemovedLoad } from '../utils/removedLoadEngine';

import { getNextBestAction } from '../utils/nextBestActionEngine';

import { detectPlateau } from '../utils/plateauEngine';

import { generateWeeklyStoryReport } from '../utils/weeklyStoryEngine';

import { MomentumCard } from '../components/momentum/MomentumCard';

import { MomentumHelpCard } from '../components/momentum/MomentumHelpCard';

import { getMomentumSummary } from '../utils/momentumEngine';

import { getDayMode } from '../utils/stepsEngine';

import { hasAnyDailyData } from '../utils/achievementHelpers';

import {
  dismissMomentumHelp,
  isMomentumHelpDismissed,
} from '../utils/momentumSuggestionStorage';

import {

  generateInsights,

  getTopInsight,

  hasEnoughDataForInsights,

} from '../utils/insightEngine';



function SectionLabel({ children }: { children: string }) {

  return (

    <h2 className="col-span-full text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">

      {children}

    </h2>

  );

}



export function DashboardPage() {

  const { dailyEntries, measurements, settings, updateDaily } = useAppStore();

  const { themeId } = useAppTheme();

  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);

  const coinTransactions = useCoinStore((s) => s.transactions);

  const today = todayISO();

  const stats = useGameStats(today);

  const avatar = useMemo(

    () => getAvatarState({ measurements, settings }),

    [measurements, settings],

  );



  const engineParams = useMemo(

    () => ({ dailyEntries, measurements, settings }),

    [dailyEntries, measurements, settings],

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

        todayEntry: stats.todayEntry ?? null,

      }),

    [today, dailyEntries, settings, stats.todayEntry],

  );



  const mapSummary = useMemo(() => {

    const paths = getProgressPaths({ dailyEntries, measurements, settings });

    return getMapSummary(paths);

  }, [dailyEntries, measurements, settings]);



  const topInsight = useMemo(() => {

    const list = generateInsights({ dailyEntries, measurements, settings });

    return getTopInsight(list);

  }, [dailyEntries, measurements, settings]);



  const enoughInsightData = hasEnoughDataForInsights(dailyEntries);



  const lastWeekReport = useMemo(() => {

    if (!isMonday(today)) return null;

    return generateWeeklyReport({

      weekStart: previousWeekStart(today),

      dailyEntries,

      measurements,

      settings,

      unlockedAchievements,

      coinTransactions,

    });

  }, [today, dailyEntries, measurements, settings, unlockedAchievements, coinTransactions]);



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



  const nextAbilities = useMemo(

    () => getNextBodyAbilities({ dailyEntries, measurements, settings, limit: 3 }),

    [dailyEntries, measurements, settings],

  );



  const bodyAbilityStats = useMemo(

    () => getBodyAbilityStats({ dailyEntries, measurements, settings }),

    [dailyEntries, measurements, settings],

  );



  const journeySummary = useMemo(

    () => getJourneyMapSummary(engineParams),

    [engineParams],

  );



  const journeyHasData = hasAnyJourneyData({ dailyEntries, measurements });

  const journeyHasMinimalData = hasMinimalJourneyData({ dailyEntries, measurements });



  const freedomScore = useMemo(() => calculateFreedomScore(engineParams), [engineParams]);

  const freedomHasData = hasFreedomScoreData({ dailyEntries, measurements });

  const removedLoad = useMemo(() => calculateRemovedLoad(measurements), [measurements]);

  const plateau = useMemo(() => detectPlateau(engineParams), [engineParams]);

  const weeklyStory = useMemo(

    () => generateWeeklyStoryReport({ weekStart: weekStart(today), today, ...engineParams }),

    [today, engineParams],

  );

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



  return (

    <div className="space-y-6 pb-2">

      <p className="text-sm text-rpg-muted lg:hidden">{formatDateFull(today)}</p>



      <CharacterHero

        level={stats.level.level}

        totalXp={stats.totalXP}

        todayPoints={stats.todayPoints}

        todayCoins={stats.coins.todayEarned}

        availableCoins={stats.coins.available}

        avatar={avatar}

      />



      <DashboardGamePanel />



      <div className="grid gap-4 md:grid-cols-2">

        <FreedomScoreCard result={freedomScore} compact hasData={freedomHasData} />

        <MomentumCard summary={momentumSummary} compact hasData={momentumHasData} />

        <NextBestActionCard action={nextBestAction} />

        <JourneyPreviewCard

          summary={journeySummary}

          themeId={themeId}

          hasData={journeyHasData}

          hasMinimalData={journeyHasMinimalData}

        />

        <NextBodyAbilityCard

          abilities={nextAbilities}

          themeId={themeId}

          unlockedCount={bodyAbilityStats.unlocked}

          totalCount={bodyAbilityStats.total}

        />

        <RemovedLoadCard result={removedLoad} themeId={themeId} compact />

        <PlateauCard result={plateau} />

        <WeeklyStoryCard report={weeklyStory} compact />

      </div>



      {showMomentumHelp && (
        <MomentumHelpCard
          summary={momentumSummary}
          onSetRecoveryMode={() => void acceptMomentumRecovery()}
          onSetMinimalMode={() => void acceptMomentumMinimal()}
          onDismiss={handleDismissMomentumHelp}
        />
      )}



      <div className="grid items-stretch gap-4 md:grid-cols-2">

        <SectionLabel>Неделя</SectionLabel>



        <WeeklyProgressCard

          weekTotal={stats.weekTotal}

          weekPercent={stats.weekPercent}

          weekGoal={stats.weekly.weeklyPointsGoal}

          gymCount={stats.gymCount}

          gymTarget={stats.weekly.gymTarget}

        />

        <QuickStatsCard

          streaks={stats.streaks}

          caloriesOkDays={stats.caloriesOkDays}

          noAlcoholDays={stats.noAlcoholDays}

          weight={stats.latest?.weight?.toFixed(1) ?? '—'}

          waist={stats.latest?.waist}

        />

        <WeeklyBossCard boss={weeklyBoss} />

        <WeeklyReportPreviewCard

          today={today}

          report={lastWeekReport}

          currentWeekPercent={stats.weekPercent}

          currentWeekTotal={stats.weekTotal}

          currentWeekGoal={stats.weekly.weeklyPointsGoal}

        />

        <RewardsBankCard

          availableCoins={stats.coins.available}

          weekEarned={stats.coins.weekEarned}

          totalSpent={stats.coins.totalSpent}

          nearestAffordable={stats.nearestRewards.affordable}

          nearestUnaffordable={stats.nearestRewards.unaffordable}

        />

        <SkillsOverviewCard skills={skills} />



        <SectionLabel>Прогресс</SectionLabel>



        <ProgressMapPreviewCard

          nearestGoal={mapSummary.nearestGoal}

          completedMilestones={mapSummary.completedMilestones}

          totalMilestones={mapSummary.totalMilestones}

        />

        <InsightPreviewCard insight={topInsight} hasEnoughData={enoughInsightData} />

        <DashboardEnergyCard />

        {showRecovery ? (

          <RecoveryCard

            today={today}

            dailyEntries={dailyEntries}

            settings={settings}

            todayEntry={stats.todayEntry}

          />

        ) : null}

        <RecentAchievements

          unlocked={unlockedAchievements}

          totalCount={ACHIEVEMENTS.length}

        />

      </div>

    </div>

  );

}


