import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import { resolveJourneyStageText } from '../../../types/journeyMap';

const STATUS_LABEL = {
  completed: 'Пройдено',
  current: 'Сейчас',
  locked: 'Впереди',
} as const;

type JourneyStageMarkerProps = {
  progress: JourneyStageProgress;
  themeId: AppThemeId;
  isSelected: boolean;
  onSelect?: () => void;
  style?: React.CSSProperties;
};

export function JourneyStageMarker({
  progress,
  themeId,
  isSelected,
  onSelect,
  style,
}: JourneyStageMarkerProps) {
  const text = resolveJourneyStageText(progress.stage, themeId);
  const { status, progressPercent } = progress;
  const isCurrent = status === 'current';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`journey-stage-marker ${
        onSelect ? 'journey-stage-marker--interactive' : ''
      } ${isSelected ? 'journey-stage-marker--selected' : ''} ${
        isCurrent ? 'journey-stage-marker--current' : ''
      } ${status === 'locked' ? 'journey-stage-marker--locked' : ''} ${
        status === 'completed' ? 'journey-stage-marker--completed' : ''
      }`}
      style={style}
      aria-pressed={isSelected}
      aria-label={`Глава ${progress.stage.order}: ${text.title}, ${STATUS_LABEL[status]}`}
    >
      <span className="journey-stage-marker__inner">
        <span className="journey-stage-marker__chapter">Гл. {progress.stage.order}</span>
        <span className="journey-stage-marker__title">{text.title}</span>
        <span className={`journey-stage-marker__status journey-stage-marker__status--${status}`}>
          {STATUS_LABEL[status]}
        </span>
        {status === 'current' ? (
          <span className="journey-stage-marker__progress">
            <span
              className="journey-stage-marker__progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </span>
        ) : null}
      </span>
    </button>
  );
}
