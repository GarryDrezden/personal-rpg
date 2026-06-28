import type { JourneyStageProgress } from '../../../types/journeyMap';
import { resolveJourneyStageText } from '../../../types/journeyMap';
import type { JourneyNodeLayout } from '../../../constants/journeyMapLayout';
import { getLabelTransform } from '../../../constants/journeyMapLayout';

type JourneyMapLabelProps = {
  progress: JourneyStageProgress;
  layout: JourneyNodeLayout;
  isSelected: boolean;
  onSelect?: () => void;
};

const STATUS_LABEL = {
  completed: 'Пройдено',
  current: 'Сейчас',
  locked: 'Впереди',
} as const;

export function JourneyMapLabel({ progress, layout, isSelected, onSelect }: JourneyMapLabelProps) {
  const text = resolveJourneyStageText(progress.stage, 'darkFantasy');
  const { status, progressPercent } = progress;
  const isCurrent = status === 'current';

  const zIndex = isCurrent ? 30 : isSelected ? 25 : 20;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`journey-map-label absolute text-left transition-transform ${
        onSelect ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'
      } ${isSelected ? 'journey-map-label--selected' : ''} ${
        isCurrent ? 'journey-map-label--current' : ''
      } ${status === 'locked' ? 'journey-map-label--locked' : ''} ${
        status === 'completed' ? 'journey-map-label--completed' : ''
      }`}
      style={{
        left: `${layout.labelX}%`,
        top: `${layout.labelY}%`,
        transform: getLabelTransform(layout.labelPosition),
        zIndex,
      }}
      aria-pressed={isSelected}
      aria-label={`Глава ${progress.stage.order}: ${text.title}, ${STATUS_LABEL[status]}`}
    >
      <span className="journey-map-label__card block">
        <span className="journey-map-label__chapter">Гл. {progress.stage.order}</span>
        <span className="journey-map-label__title">{text.title}</span>
        <span
          className={`journey-map-label__status ${
            status === 'current'
              ? 'journey-map-label__status--current'
              : status === 'completed'
                ? 'journey-map-label__status--completed'
                : 'journey-map-label__status--locked'
          }`}
        >
          {STATUS_LABEL[status]}
        </span>
        {status !== 'locked' ? (
          <span className="journey-map-label__progress-track">
            <span
              className={`journey-map-label__progress-fill ${
                status === 'completed'
                  ? 'journey-map-label__progress-fill--completed'
                  : 'journey-map-label__progress-fill--current'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </span>
        ) : null}
      </span>
    </button>
  );
}
