import type { CSSProperties } from 'react';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import { getJourneyMapStageConfig } from '../../../constants/journeyMapConfig';

const STATUS_LABEL = {
  completed: 'Пройдено',
  current: 'Сейчас',
  locked: 'Впереди',
} as const;

type JourneyStagePinProps = {
  progress: JourneyStageProgress;
  isSelected: boolean;
  onSelect?: () => void;
  style?: CSSProperties;
};

export function JourneyStagePin({
  progress,
  isSelected,
  onSelect,
  style,
}: JourneyStagePinProps) {
  const config = getJourneyMapStageConfig(progress.stage.id);
  const { status } = progress;
  const isCurrent = status === 'current';
  const showStatus = status === 'current' || status === 'completed';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`journey-stage-pin ${
        onSelect ? 'journey-stage-pin--interactive' : ''
      } ${isSelected ? 'journey-stage-pin--selected' : ''} ${
        isCurrent ? 'journey-stage-pin--current' : ''
      } ${status === 'locked' ? 'journey-stage-pin--locked' : ''} ${
        status === 'completed' ? 'journey-stage-pin--completed' : ''
      }`}
      style={style}
      aria-pressed={isSelected}
      aria-label={`Глава ${progress.stage.order}: ${config.shortTitle}, ${STATUS_LABEL[status]}`}
    >
      <span className="journey-stage-pin__inner">
        <span className="journey-stage-pin__chapter">Гл. {progress.stage.order}</span>
        <span className="journey-stage-pin__title">{config.shortTitle}</span>
        {showStatus ? (
          <span className={`journey-stage-pin__badge journey-stage-pin__badge--${status}`}>
            {STATUS_LABEL[status]}
          </span>
        ) : null}
      </span>
    </button>
  );
}
