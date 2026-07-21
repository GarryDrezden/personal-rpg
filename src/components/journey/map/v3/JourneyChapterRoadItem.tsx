import type { ReactNode } from 'react';
import type { AppThemeId } from '../../../../types/theme';
import type { JourneyStageProgress } from '../../../../types/journeyMap';
import { resolveJourneyStageText } from '../../../../types/journeyMap';
import { getJourneyMapStageConfig } from '../../../../constants/journeyMapConfig';
import { getIncompleteConditions } from '../../../../utils/journeyMapEngine';
import { JourneyBossMini } from '../JourneyBossMini';
import { JourneyChapterVignette } from './JourneyChapterVignette';

const STATUS_LABEL = {
  completed: 'Пройдено',
  current: 'Сейчас',
  locked: 'Впереди',
} as const;

type JourneyChapterRoadItemProps = {
  progress: JourneyStageProgress;
  themeId: AppThemeId;
  isSelected: boolean;
  onSelect: () => void;
  showMobileDetail?: boolean;
  mobileDetail?: ReactNode;
};

function formatRatio(current: number, target: number): string {
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  return `${fmt(current)} / ${fmt(target)}`;
}

export function JourneyChapterRoadItem({
  progress,
  themeId,
  isSelected,
  onSelect,
  showMobileDetail,
  mobileDetail,
}: JourneyChapterRoadItemProps) {
  const text = resolveJourneyStageText(progress.stage, themeId);
  const config = getJourneyMapStageConfig(progress.stage.id);
  const { status, progressPercent } = progress;
  const isCurrent = status === 'current';
  const isCompact = status === 'locked' || status === 'completed';
  const nextGoal = getIncompleteConditions(progress, 1)[0];

  return (
    <article
      data-chapter-id={progress.stage.id}
      className={`journey-v3-chapter journey-v3-chapter--${status} ${
        isSelected ? 'journey-v3-chapter--selected' : ''
      }${isCompact ? ' journey-v3-chapter--compact' : ''}`}
    >
      <button
        type="button"
        className="journey-v3-chapter__select"
        onClick={onSelect}
        aria-pressed={isSelected}
        aria-expanded={showMobileDetail}
      >
        <div className="journey-v3-chapter__body">
          <JourneyChapterVignette chapterNumber={progress.stage.order} status={status} />

          <div className="journey-v3-chapter__main">
            <div className="journey-v3-chapter__head">
              <span className={`journey-v3-chapter__status journey-v3-chapter__status--${status}`}>
                {STATUS_LABEL[status]}
              </span>
              {config.bossId ? (
                <span className="journey-v3-chapter__boss">
                  <JourneyBossMini
                    bossId={config.bossId}
                    status={status}
                    size={isCurrent ? 'xs' : 'xs'}
                  />
                </span>
              ) : null}
            </div>

            <h4 className="journey-v3-chapter__title">{text.title}</h4>

            {isCurrent ? (
              <>
                <p className="journey-v3-chapter__desc">{text.description}</p>

                <div className="journey-v3-chapter__progress">
                  <div className="journey-v3-chapter__progress-meta">
                    <span>До следующей главы</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="journey-v3-chapter__progress-track">
                    <span
                      className="journey-v3-chapter__progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {nextGoal ? (
                  <p className="journey-v3-chapter__next-goal">
                    <span className="journey-v3-chapter__goal-dot" aria-hidden />
                    <span className="journey-v3-chapter__next-goal-text">{nextGoal.condition.title}</span>
                    <span className="journey-v3-chapter__goal-ratio">
                      {formatRatio(nextGoal.current, nextGoal.target)}
                    </span>
                  </p>
                ) : null}
              </>
            ) : status === 'completed' ? (
              <p className="journey-v3-chapter__desc journey-v3-chapter__desc--single">
                {text.completedText}
              </p>
            ) : (
              <p className="journey-v3-chapter__desc journey-v3-chapter__desc--single">
                {text.description}
              </p>
            )}
          </div>
        </div>
      </button>

      {showMobileDetail && mobileDetail ? (
        <div className="journey-v3-chapter__mobile-detail">{mobileDetail}</div>
      ) : null}
    </article>
  );
}
