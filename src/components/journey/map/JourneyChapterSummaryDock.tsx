import type { AppThemeId } from '../../../types/theme';
import type {
  JourneyMapSummary,
  JourneyStageConditionProgress,
  JourneyStageProgress,
} from '../../../types/journeyMap';
import { resolveJourneyStageText } from '../../../types/journeyMap';
import { getIncompleteConditions } from '../../../utils/journeyMapEngine';

type JourneyChapterSummaryDockProps = {
  progress: JourneyStageProgress;
  summary: JourneyMapSummary;
  themeId: AppThemeId;
};

const STATUS_LABEL = {
  completed: 'пройдено',
  current: 'сейчас',
  locked: 'впереди',
} as const;

function formatGoalRatio(cp: JourneyStageConditionProgress): string {
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  return `${fmt(cp.current)} / ${fmt(cp.target)}`;
}

function GoalItem({ cp }: { cp: JourneyStageConditionProgress }) {
  return (
    <li
      className={`journey-summary-dock__goal ${
        cp.completed ? 'journey-summary-dock__goal--done' : ''
      }`}
    >
      <span className="journey-summary-dock__goal-dot" aria-hidden />
      <span className="journey-summary-dock__goal-body">
        <span className="journey-summary-dock__goal-title">{cp.condition.title}</span>
        <span className="journey-summary-dock__goal-ratio">{formatGoalRatio(cp)}</span>
      </span>
    </li>
  );
}

export function JourneyChapterSummaryDock({
  progress,
  summary,
  themeId,
}: JourneyChapterSummaryDockProps) {
  const text = resolveJourneyStageText(progress.stage, themeId);
  const { status, progressPercent } = progress;
  const goals = getIncompleteConditions(progress, 3);
  const chapterProgressLabel =
    status === 'completed'
      ? 'Прогресс главы'
      : status === 'current'
        ? 'До следующей главы'
        : 'Прогресс главы';

  const themeClass =
    themeId === 'darkFantasy'
      ? 'journey-summary-dock--fantasy'
      : 'journey-summary-dock--cozy';

  return (
    <div
      className={`journey-summary-dock ${themeClass} journey-summary-dock--${status}`}
      data-testid="journey-chapter-summary-dock"
    >
      <div className="journey-summary-dock__inner">
        <section className="journey-summary-dock__context" aria-label="Контекст главы">
          <span className="journey-summary-dock__badge">Текущая глава</span>
          <p className="journey-summary-dock__chapter">Глава {progress.stage.order}</p>
          <h3 className="journey-summary-dock__title">{text.title}</h3>
          <p className="journey-summary-dock__description">{text.description}</p>
          <p className="journey-summary-dock__status">
            Статус: <span>{STATUS_LABEL[status]}</span>
          </p>
        </section>

        <section className="journey-summary-dock__progress" aria-label="Прогресс">
          <div className="journey-summary-dock__progress-block">
            <div className="journey-summary-dock__progress-meta">
              <span>{chapterProgressLabel}</span>
              <span className="journey-summary-dock__percent">{progressPercent}%</span>
            </div>
            <div className="journey-summary-dock__progress-track journey-summary-dock__progress-track--main">
              <span
                className="journey-summary-dock__progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="journey-summary-dock__progress-block journey-summary-dock__progress-block--route">
            <div className="journey-summary-dock__progress-meta journey-summary-dock__progress-meta--route">
              <span>Общий прогресс маршрута</span>
              <span className="journey-summary-dock__route-stats">
                {summary.completedStages} / {summary.totalStages} глав ·{' '}
                {summary.overallProgressPercent}%
              </span>
            </div>
            <div className="journey-summary-dock__progress-track journey-summary-dock__progress-track--route">
              <span
                className="journey-summary-dock__progress-fill journey-summary-dock__progress-fill--route"
                style={{ width: `${summary.overallProgressPercent}%` }}
              />
            </div>
          </div>
        </section>

        <section className="journey-summary-dock__goals" aria-label="Что двигает путь">
          <p className="journey-summary-dock__goals-title">Что двигает путь</p>
          {status === 'completed' ? (
            <p className="journey-summary-dock__completed">{text.completedText}</p>
          ) : status === 'locked' ? (
            <p className="journey-summary-dock__locked-hint">
              Глава откроется, когда завершишь предыдущий этап.
            </p>
          ) : goals.length > 0 ? (
            <ul className="journey-summary-dock__goal-list">
              {goals.map((cp) => (
                <GoalItem key={cp.condition.id} cp={cp} />
              ))}
            </ul>
          ) : (
            <p className="journey-summary-dock__locked-hint">Все условия главы выполнены.</p>
          )}
        </section>
      </div>
    </div>
  );
}
