import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { useAppTheme } from '../hooks/useAppTheme';
import {
  getAllJourneyStageProgress,
  getJourneyMapSummary,
  hasAnyJourneyData,
  hasMinimalJourneyData,
} from '../utils/journeyMapEngine';
import { JourneyHeroCard } from '../components/journey/JourneyHeroCard';
import { CurrentJourneyStageCard } from '../components/journey/CurrentJourneyStageCard';
import { JourneyDevelopmentMap } from '../components/journey/JourneyDevelopmentMap';
import { JourneyConditionRow } from '../components/journey/JourneyConditionRow';
import { resolveJourneyStageText } from '../types/journeyMap';

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
  const selectedStage = stages.find((s) => s.stage.id === activeStageId) ?? summary.currentStage;

  const showCurrentStageCard =
    summary.currentStage && summary.currentStage.status !== 'locked';

  return (
    <div className="journey-page pb-4">
      <header className="journey-page__header mb-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Карта возвращения тела</h1>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          Это не просто путь к меньшему весу. Это маршрут возвращения движения, контроля и
          устойчивости.
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

      <section className="journey-map-shell mb-8">
        <JourneyDevelopmentMap
          stages={stages}
          themeId={themeId}
          selectedStageId={activeStageId}
          onSelectStage={setSelectedStageId}
        />
      </section>

      <div className="journey-page__below grid gap-6 md:grid-cols-2">
        <JourneyHeroCard summary={summary} themeId={themeId} />

        {showCurrentStageCard ? (
          <CurrentJourneyStageCard progress={summary.currentStage!} themeId={themeId} />
        ) : (
          <div className="hidden md:block" aria-hidden />
        )}
      </div>

      {selectedStage ? (
        <section className="journey-page__details">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
            Детали главы {selectedStage.stage.order}
          </h2>
          <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] p-4">
            {(() => {
              const text = resolveJourneyStageText(selectedStage.stage, themeId);
              return (
                <>
                  <div className="mb-4 flex items-start gap-3">
                    <span className="text-3xl">{selectedStage.stage.icon}</span>
                    <div>
                      <h3 className="font-semibold text-[var(--app-text)]">{text.title}</h3>
                      <p className="text-sm text-[var(--app-text-muted)]">{text.description}</p>
                      {selectedStage.status === 'completed' ? (
                        <p className="mt-2 text-sm text-emerald-500">{text.completedText}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedStage.conditions.map((cp) => (
                      <JourneyConditionRow key={cp.condition.id} conditionProgress={cp} />
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      ) : null}
    </div>
  );
}
