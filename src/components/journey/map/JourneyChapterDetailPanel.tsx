import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import { resolveJourneyStageText } from '../../../types/journeyMap';
import { JourneyConditionRow } from '../JourneyConditionRow';
import { JourneyBossMini } from './JourneyBossMini';
import { getJourneyMapStageConfig } from '../../../constants/journeyMapConfig';

type JourneyChapterDetailPanelProps = {
  progress: JourneyStageProgress;
  themeId: AppThemeId;
};

const STATUS_LABEL = {
  completed: 'Пройдено',
  current: 'Сейчас',
  locked: 'Впереди',
} as const;

export function JourneyChapterDetailPanel({ progress, themeId }: JourneyChapterDetailPanelProps) {
  const text = resolveJourneyStageText(progress.stage, themeId);
  const config = getJourneyMapStageConfig(progress.stage.id);
  const { status, progressPercent } = progress;

  return (
    <div
      className={`journey-chapter-panel journey-chapter-panel--${status}`}
      data-testid="journey-chapter-detail-panel"
    >
      <div className="journey-chapter-panel__main">
        <div className="journey-chapter-panel__head">
          <span className="journey-chapter-panel__icon" aria-hidden>
            {progress.stage.icon}
          </span>
          <div className="journey-chapter-panel__copy">
            <span className="journey-chapter-panel__eyebrow">
              Глава {progress.stage.order} · {STATUS_LABEL[status]}
            </span>
            <h4 className="journey-chapter-panel__title">{text.title}</h4>
            <p className="journey-chapter-panel__description">{text.description}</p>
            {status === 'completed' ? (
              <p className="journey-chapter-panel__completed">{text.completedText}</p>
            ) : null}
          </div>
        </div>

        {status !== 'locked' ? (
          <div className="journey-chapter-panel__progress-block">
            <div className="journey-chapter-panel__progress-meta">
              <span>Прогресс главы</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="journey-chapter-panel__progress-track">
              <span
                className="journey-chapter-panel__progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="journey-chapter-panel__conditions">
          {progress.conditions.map((cp) => (
            <JourneyConditionRow key={cp.condition.id} conditionProgress={cp} />
          ))}
        </div>
      </div>

      {config.bossId ? (
        <aside className="journey-chapter-panel__aside">
          <p className="journey-chapter-panel__boss-label">Босс главы</p>
          <JourneyBossMini bossId={config.bossId} status={status} size="md" />
        </aside>
      ) : null}
    </div>
  );
}
