import { useMemo, useState, useCallback } from 'react';

import { useAppStore, emptyDaily } from '../store/appStore';

import { useGameStats } from '../hooks/useGameStats';

import { formatDateFull, todayISO } from '../utils/dates';

import { shouldShowRecoveryCard } from '../utils/recoveryEngine';

import { HeroScenePanel } from '../components/dashboard/HeroScenePanel';

import { RecoveryCompactPanel } from '../components/dashboard/RecoveryCompactPanel';

import { DashboardPrimaryCta } from '../components/dashboard/DashboardPrimaryCta';

import { DailyQuestsCompact } from '../components/dashboard/DailyQuestsCompact';

import { DashboardResourceCompact } from '../components/rest/DashboardResourceCompact';
import { DashboardSummaryStrip } from '../components/dashboard/DashboardSummaryStrip';

import { getMomentumSummary } from '../utils/momentumEngine';

import { getDayMode } from '../utils/stepsEngine';

import {

  dismissMomentumHelp,

  isMomentumHelpDismissed,

} from '../utils/momentumSuggestionStorage';

import { getNextBestAction } from '../utils/nextBestActionEngine';

import { getJourneyMapSummary } from '../utils/journeyMapEngine';

import { getSeasonSnapshotWithRecap } from '../game/seasons/seasonEngine';

import { getPlateauSnapshot, setManualPlateauActive } from '../game/plateau/plateauEngine';
import { getBaseProgressionSnapshot } from '../game/base/baseProgressionEngine';
import { getBossCampaignSnapshot } from '../game/bosses/bossCampaignEngine';
import { CampaignProgressDashboardSection } from '../components/dashboard/CampaignProgressDashboardSection';
import { getNextBodyAbilities } from '../utils/bodyAbilityEngine';
import { getBodyAbilityV1Summary } from '../game/bodyAbilities/bodyAbilityV1Engine';
import { useAchievementStore } from '../store/achievementStore';

import { useAppTheme } from '../hooks/useAppTheme';

import { getRecoveryState } from '../utils/recoveryEngine';

import { useAuth } from '../auth/useAuth';
import { needsOnboarding } from '../utils/onboardingState';

import { Link } from 'react-router-dom';



export function DashboardPage() {

  const { dailyEntries, measurements, settings, updateDaily, saveSettings } = useAppStore();

  const { profile } = useAuth();
  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);
  const showStartRouteBanner = needsOnboarding(settings, profile);

  const { themeId } = useAppTheme();

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



  const momentumSummary = useMemo(

    () => getMomentumSummary({ today, dailyEntries, settings }),

    [today, dailyEntries, settings],

  );



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

  const seasonSnapshot = useMemo(
    () => getSeasonSnapshotWithRecap({ settings, dailyEntries, today }),
    [settings, dailyEntries, today],
  );

  const bodyAbilitySummary = useMemo(
    () => getBodyAbilityV1Summary({ settings, dailyEntries, measurements }),
    [settings, dailyEntries, measurements],
  );

  const plateauSnapshot = useMemo(
    () => getPlateauSnapshot({ dailyEntries, measurements, settings, today }),
    [dailyEntries, measurements, settings, today],
  );

  const handleTogglePlateauManual = useCallback(async () => {
    await saveSettings(setManualPlateauActive(settings, !plateauSnapshot.manualActive));
  }, [saveSettings, settings, plateauSnapshot.manualActive]);

  const baseSnapshot = useMemo(
    () =>
      getBaseProgressionSnapshot({
        dailyEntries,
        measurements,
        settings,
        today,
        unlockedAchievementIds: unlockedAchievements.map((a) => a.achievementId),
      }),
    [dailyEntries, measurements, settings, today, unlockedAchievements],
  );

  const bossSnapshot = useMemo(
    () =>
      getBossCampaignSnapshot({
        dailyEntries,
        measurements,
        settings,
        today,
        baseScore: baseSnapshot.baseScore,
      }),
    [dailyEntries, measurements, settings, today, baseSnapshot.baseScore],
  );

  const nextAbilities = useMemo(

    () => getNextBodyAbilities({ dailyEntries, measurements, settings, limit: 1 }),

    [dailyEntries, measurements, settings],

  );



  const primaryAction = useMemo(

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

    <div data-testid="dashboard-page" className="space-y-3 pb-2">

      {showStartRouteBanner ? (
        <div className="rounded-xl border border-[var(--app-gold)]/25 bg-[var(--app-card)]/70 px-4 py-3 text-sm text-[var(--app-text-muted)]">
          Кампания ждёт первого ритма —{' '}
          <Link to="/start" className="font-medium text-[var(--app-gold)] hover:underline">
            продолжить пробуждение ядра
          </Link>
          .
        </div>
      ) : null}

      <p className="text-sm text-rpg-muted lg:hidden">{formatDateFull(today)}</p>



      <HeroScenePanel

        level={stats.level.level}

        totalXp={stats.totalXP}

        todayPoints={stats.todayPoints}

        todayCoins={stats.coins.todayEarned}

        availableCoins={stats.coins.available}

      />



      <DashboardPrimaryCta action={primaryAction} />

      <DashboardResourceCompact entry={stats.todayEntry} />

      {showMomentumHelp ? (

        <RecoveryCompactPanel

          variant="momentum"

          summary={momentumSummary}

          onSetRecoveryMode={() => void acceptMomentumRecovery()}

          onSetMinimalMode={() => void acceptMomentumMinimal()}

          onDismiss={handleDismissMomentumHelp}

        />

      ) : showRecovery ? (

        <RecoveryCompactPanel

          variant="recovery"

          today={today}

          dailyEntries={dailyEntries}

          settings={settings}

          todayEntry={stats.todayEntry}

        />

      ) : null}



      <DailyQuestsCompact

        entry={stats.todayEntry}

        dailyEntries={dailyEntries}

        settings={settings}

        date={today}

      />

      <CampaignProgressDashboardSection
        season={seasonSnapshot}
        bodyAbilitySummary={bodyAbilitySummary}
        plateauSnapshot={plateauSnapshot}
        baseSnapshot={baseSnapshot}
        bossSnapshot={bossSnapshot}
        onTogglePlateauManual={() => void handleTogglePlateauManual()}
      />

      <DashboardSummaryStrip />

    </div>

  );

}


