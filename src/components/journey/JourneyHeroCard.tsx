import type { AppThemeId } from '../../types/theme';
import type { JourneyMapSummary } from '../../types/journeyMap';
import { resolveJourneyStageText } from '../../types/journeyMap';
import { Card } from '../ui/Card';
import { Map } from 'lucide-react';

type JourneyHeroCardProps = {
  summary: JourneyMapSummary;
  themeId?: AppThemeId;
};

export function JourneyHeroCard({ summary, themeId = 'cozy' }: JourneyHeroCardProps) {
  const { currentStage, nextStage, completedStages, totalStages, overallProgressPercent } =
    summary;
  const isDark = themeId === 'darkFantasy';

  const currentText = currentStage
    ? resolveJourneyStageText(currentStage.stage, themeId)
    : null;

  const allComplete = completedStages === totalStages && totalStages > 0;

  return (
    <Card
      className={`overflow-hidden ${
        isDark
          ? 'border-violet-500/30 bg-[color-mix(in_srgb,var(--app-secondary)_12%,var(--app-card))] shadow-[var(--app-glow)]'
          : 'border-[color-mix(in_srgb,var(--app-primary)_25%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-primary)_6%,var(--app-card))]'
      }`}
    >
      <div className="flex items-start gap-3">
        <Map className="mt-1 shrink-0 text-[var(--app-primary)]" size={28} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
            Текущая глава
          </p>
          {currentText && currentStage ? (
            <>
              <h2 className="mt-1 text-xl font-bold text-[var(--app-text)]">
                {currentStage.stage.icon} Глава {currentStage.stage.order}: {currentText.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--app-text-muted)]">{currentText.subtitle}</p>
            </>
          ) : (
            <h2 className="mt-1 text-xl font-bold text-[var(--app-text)]">Карта пути</h2>
          )}

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]">
              <span>Общий прогресс маршрута</span>
              <span>
                {completedStages}/{totalStages} глав · {overallProgressPercent}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
              <div
                className="h-full rounded-full bg-[var(--app-primary)] transition-all"
                style={{ width: `${overallProgressPercent}%` }}
              />
            </div>
          </div>

          {allComplete && currentText ? (
            <p className="mt-3 text-sm font-medium text-emerald-500">{currentText.completedText}</p>
          ) : null}

          {!allComplete && nextStage ? (
            <p className="mt-3 text-xs text-[var(--app-text-muted)]">
              Следующая глава: {nextStage.stage.icon} {nextStage.stage.title}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
