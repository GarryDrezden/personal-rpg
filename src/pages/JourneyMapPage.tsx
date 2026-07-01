import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { useAppTheme } from '../hooks/useAppTheme';
import {
  getAllJourneyStageProgress,
  getJourneyMapSummary,
  hasAnyJourneyData,
  hasMinimalJourneyData,
} from '../utils/journeyMapEngine';
import { JourneyDevelopmentMap } from '../components/journey/JourneyDevelopmentMap';
import { JourneyMapV3SummaryBar } from '../components/journey/map/v3/JourneyMapV3SummaryBar';

export function JourneyMapPage() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const { themeId } = useAppTheme();

  const engineParams = useMemo(
    () => ({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );

  const summary = useMemo(() => getJourneyMapSummary(engineParams), [engineParams]);
  const stages = useMemo(() => getAllJourneyStageProgress(engineParams), [engineParams]);

  const hasData = hasAnyJourneyData({ dailyEntries, measurements });
  const hasMinimalData = hasMinimalJourneyData({ dailyEntries, measurements });

  const defaultSelected =
    summary.currentStage?.stage.id ?? stages[0]?.stage.id ?? undefined;
  const [selectedStageId, setSelectedStageId] = useState<string | undefined>(undefined);

  const activeStageId = selectedStageId ?? defaultSelected;

  const currentProgress = useMemo(() => {
    if (summary.currentStage) return summary.currentStage;
    return stages.find((s) => s.status === 'current') ?? stages[0];
  }, [summary.currentStage, stages]);

  return (
    <div className="journey-page pb-6">
      <header className="journey-page__header mb-5">
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Карта возвращения тела</h1>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          Хроника пути героя: от пробуждения ядра до великого перерождения — глава за главой,
          без спешки и без стыда.
        </p>
      </header>

      {!hasData ? (
        <p className="mb-6 rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-6 text-center text-sm text-[var(--app-text-muted)]">
          Карта пути пока спит. Внеси первый вес, калории или шаги — и первая глава откроется.
        </p>
      ) : !hasMinimalData ? (
        <p className="mb-6 rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-4 text-center text-sm text-[var(--app-text-muted)]">
          Путь уже начался. Чем больше данных ты вносишь, тем точнее карта показывает следующую
          главу.
        </p>
      ) : null}

      {hasData ? (
        <JourneyMapV3SummaryBar
          summary={summary}
          currentProgress={currentProgress}
          themeId={themeId}
        />
      ) : null}

      <section className="journey-map-shell">
        <JourneyDevelopmentMap
          stages={stages}
          themeId={themeId}
          selectedStageId={activeStageId}
          onSelectStage={setSelectedStageId}
        />
      </section>
    </div>
  );
}
