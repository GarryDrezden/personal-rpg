import { useMemo, useState, useCallback } from 'react';

import { useAppStore, emptyDaily } from '../store/appStore';

import { useGameStats } from '../hooks/useGameStats';

import { formatDateFull, todayISO } from '../utils/dates';

import { shouldShowRecoveryCard } from '../utils/recoveryEngine';

import { HeroScenePanel } from '../components/dashboard/HeroScenePanel';

import { RecoveryCompactPanel } from '../components/dashboard/RecoveryCompactPanel';

import { DashboardPrimaryCta } from '../components/dashboard/DashboardPrimaryCta';

import { DailyQuestsCompact } from '../components/dashboard/DailyQuestsCompact';

import { DashboardSummaryStrip } from '../components/dashboard/DashboardSummaryStrip';

import { getMomentumSummary } from '../utils/momentumEngine';

import { getDayMode } from '../utils/stepsEngine';

import {

  dismissMomentumHelp,

  isMomentumHelpDismissed,

} from '../utils/momentumSuggestionStorage';

import { getNextBestAction } from '../utils/nextBestActionEngine';

import { getJourneyMapSummary } from '../utils/journeyMapEngine';

import { getNextBodyAbilities } from '../utils/bodyAbilityEngine';

import { useAppTheme } from '../hooks/useAppTheme';

import { getRecoveryState } from '../utils/recoveryEngine';



export function DashboardPage() {

  const { dailyEntries, measurements, settings, updateDaily } = useAppStore();

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

      <p className="text-sm text-rpg-muted lg:hidden">{formatDateFull(today)}</p>



      <HeroScenePanel

        level={stats.level.level}

        totalXp={stats.totalXP}

        todayPoints={stats.todayPoints}

        todayCoins={stats.coins.todayEarned}

        availableCoins={stats.coins.available}

      />



      <DashboardPrimaryCta action={primaryAction} />



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



      <DashboardSummaryStrip />

    </div>

  );

}


