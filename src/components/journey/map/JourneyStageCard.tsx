import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import { resolveJourneyStageText } from '../../../types/journeyMap';
import type { JourneyCardSide } from '../../../constants/journeyMapConfig';
import { getCardTransform } from '../../../constants/journeyMapConfig';

type JourneyStageCardProps = {
  progress: JourneyStageProgress;
  themeId: AppThemeId;
  isSelected: boolean;
  onSelect?: () => void;
  variant: 'desktop' | 'mobile';
  cardSide?: JourneyCardSide;
  style?: React.CSSProperties;
};

const STATUS_LABEL = {
  completed: 'Пройдено',
  current: 'Сейчас',
  locked: 'Впереди',
} as const;

export function JourneyStageCard({
  progress,
  themeId,
  isSelected,
  onSelect,
  variant,
  cardSide = 'bottom',
  style,
}: JourneyStageCardProps) {
  const text = resolveJourneyStageText(progress.stage, themeId);
  const { status, progressPercent } = progress;
  const isCurrent = status === 'current';

  const transform =
    variant === 'desktop' ? getCardTransform(cardSide) : undefined;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`journey-stage-card journey-stage-card--${variant} ${
        onSelect ? 'journey-stage-card--interactive' : ''
      } ${isSelected ? 'journey-stage-card--selected' : ''} ${
        isCurrent ? 'journey-stage-card--current' : ''
      } ${status === 'locked' ? 'journey-stage-card--locked' : ''} ${
        status === 'completed' ? 'journey-stage-card--completed' : ''
      }`}
      style={variant === 'desktop' ? { ...style, transform } : style}
      aria-pressed={isSelected}
      aria-label={`Глава ${progress.stage.order}: ${text.title}, ${STATUS_LABEL[status]}`}
    >
      <span className="journey-stage-card__inner">
        <span className="journey-stage-card__chapter">Гл. {progress.stage.order}</span>
        <span className="journey-stage-card__title">{text.title}</span>
        {variant === 'desktop' ? (
          <span className="journey-stage-card__subtitle">{progress.stage.subtitle}</span>
        ) : null}
        <span
          className={`journey-stage-card__status journey-stage-card__status--${status}`}
        >
          {STATUS_LABEL[status]}
        </span>
        {status !== 'locked' ? (
          <span className="journey-stage-card__progress-track">
            <span
              className={`journey-stage-card__progress-fill journey-stage-card__progress-fill--${status}`}
              style={{ width: `${progressPercent}%` }}
            />
          </span>
        ) : null}
      </span>
    </button>
  );
}
