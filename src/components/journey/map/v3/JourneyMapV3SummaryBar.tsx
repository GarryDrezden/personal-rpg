import type { JourneyMapSummary, JourneyStageProgress } from '../../../../types/journeyMap';
import { resolveJourneyStageText } from '../../../../types/journeyMap';
import type { AppThemeId } from '../../../../types/theme';
import { getIncompleteConditions } from '../../../../utils/journeyMapEngine';

type JourneyMapV3SummaryBarProps = {
  summary: JourneyMapSummary;
  currentProgress: JourneyStageProgress | undefined;
  themeId: AppThemeId;
};

export function JourneyMapV3SummaryBar({
  summary,
  currentProgress,
  themeId,
}: JourneyMapV3SummaryBarProps) {
  const currentText = currentProgress
    ? resolveJourneyStageText(currentProgress.stage, themeId)
    : null;
  const nextGoal = currentProgress ? getIncompleteConditions(currentProgress, 1)[0] : null;

  return (
    <div className="journey-v3-summary" data-testid="journey-v3-summary-bar">
      <div className="journey-v3-summary__item">
        <span className="journey-v3-summary__label">Текущая глава</span>
        <span className="journey-v3-summary__value">
          {currentProgress ? `Глава ${currentProgress.stage.order}` : '—'}
        </span>
        {currentText ? (
          <span className="journey-v3-summary__hint">{currentText.title}</span>
        ) : null}
      </div>

      <div className="journey-v3-summary__item">
        <span className="journey-v3-summary__label">Пройдено</span>
        <span className="journey-v3-summary__value">
          {summary.completedStages} / {summary.totalStages}
        </span>
        <span className="journey-v3-summary__hint">глав маршрута</span>
      </div>

      <div className="journey-v3-summary__item journey-v3-summary__item--progress">
        <span className="journey-v3-summary__label">Общий прогресс</span>
        <span className="journey-v3-summary__value journey-v3-summary__value--gold">
          {summary.overallProgressPercent}%
        </span>
        <div className="journey-v3-summary__track">
          <span
            className="journey-v3-summary__fill"
            style={{ width: `${summary.overallProgressPercent}%` }}
          />
        </div>
      </div>

      <div className="journey-v3-summary__item journey-v3-summary__item--goal">
        <span className="journey-v3-summary__label">Следующий шаг</span>
        <span className="journey-v3-summary__value journey-v3-summary__value--sm">
          {nextGoal?.condition.title ?? currentText?.subtitle ?? 'Продолжай вносить данные'}
        </span>
      </div>
    </div>
  );
}
