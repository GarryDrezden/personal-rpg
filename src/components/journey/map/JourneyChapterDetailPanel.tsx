import type { AppThemeId } from '../../../types/theme';
import type { JourneyStageProgress } from '../../../types/journeyMap';
import { resolveJourneyStageText } from '../../../types/journeyMap';
import { JourneyConditionRow } from '../JourneyConditionRow';
import { JourneyBossMini } from './JourneyBossMini';
import { getJourneyMapStageConfig } from '../../../constants/journeyMapConfig';

type JourneyChapterDetailPanelProps = {
  progress: JourneyStageProgress;
  themeId: AppThemeId;
  isCurrentChapter?: boolean;
};

const STATUS_LABEL = {
  completed: 'Пройдено',
  current: 'Сейчас',
  locked: 'Впереди',
} as const;

const BOSS_LABELS: Record<string, string> = {
  lord_of_empty_day: 'Владыка Пустого Дня',
  divan_king: 'Диванный король',
  misty_baron: 'Туманный барон',
  resource_devourer: 'Пожиратель ресурсов',
  old_form_guardian: 'Страж старой формы',
};

export function JourneyChapterDetailPanel({
  progress,
  themeId,
  isCurrentChapter,
}: JourneyChapterDetailPanelProps) {
  const text = resolveJourneyStageText(progress.stage, themeId);
  const config = getJourneyMapStageConfig(progress.stage.id);
  const { status, progressPercent } = progress;
  const isCurrent = status === 'current';
  const chapterBadge =
    isCurrent || isCurrentChapter ? 'Текущая глава' : 'Выбранная глава';

  return (
    <aside
      className={`journey-chapter-panel journey-chapter-panel--${status}`}
      data-testid="journey-chapter-detail-panel"
    >
      <div className="journey-chapter-panel__main">
        <span className="journey-chapter-panel__badge">{chapterBadge}</span>

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

        {config.bossId ? (
          <div className="journey-chapter-panel__boss-row">
            <div>
              <p className="journey-chapter-panel__boss-label">Босс главы</p>
              <p className="journey-chapter-panel__boss-name">
                {BOSS_LABELS[config.bossId] ?? 'Страж пути'}
              </p>
            </div>
            <JourneyBossMini bossId={config.bossId} status={status} size="md" />
          </div>
        ) : null}

        <div className="journey-chapter-panel__hint">
          <p className="journey-chapter-panel__hint-title">Что двигает путь</p>
          <p className="journey-chapter-panel__hint-text">{progress.stage.subtitle}</p>
        </div>

        <div className="journey-chapter-panel__conditions">
          {progress.conditions.map((cp) => (
            <JourneyConditionRow key={cp.condition.id} conditionProgress={cp} />
          ))}
        </div>
      </div>
    </aside>
  );
}
