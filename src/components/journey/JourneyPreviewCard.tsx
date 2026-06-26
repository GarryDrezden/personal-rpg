import { Link } from 'react-router-dom';
import type { AppThemeId } from '../../types/theme';
import type { JourneyMapSummary } from '../../types/journeyMap';
import { resolveJourneyStageText } from '../../types/journeyMap';
import {
  formatJourneyConditionRemaining,
  getIncompleteConditions,
} from '../../utils/journeyMapEngine';
import { Card } from '../ui/Card';
import { Map } from 'lucide-react';

type JourneyPreviewCardProps = {
  summary: JourneyMapSummary;
  themeId?: AppThemeId;
  hasData: boolean;
  hasMinimalData: boolean;
};

export function JourneyPreviewCard({
  summary,
  themeId = 'cozy',
  hasData,
  hasMinimalData,
}: JourneyPreviewCardProps) {
  const { currentStage, completedStages, totalStages } = summary;

  return (
    <Card className="bg-[color-mix(in_srgb,var(--app-primary)_6%,var(--app-card))]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Map className="mt-0.5 shrink-0 text-[var(--app-primary)]" size={22} />
          <div>
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Текущая глава пути</h2>
            <p className="text-xs text-[var(--app-text-muted)]">
              {completedStages}/{totalStages} глав пройдено
            </p>
          </div>
        </div>
        <Link to="/journey" className="shrink-0 text-sm font-medium text-[var(--app-primary)] hover:underline">
          Открыть карту →
        </Link>
      </div>

      {!hasData ? (
        <p className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-3 text-sm text-[var(--app-text-muted)]">
          Карта пути почти готова. Внеси первый вес и калории, чтобы открыть первую главу.
        </p>
      ) : !hasMinimalData ? (
        <p className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-3 text-sm text-[var(--app-text-muted)]">
          Путь уже начался. Чем больше данных ты вносишь, тем точнее карта показывает следующую
          главу.
        </p>
      ) : currentStage ? (
        <>
          {(() => {
            const text = resolveJourneyStageText(currentStage.stage, themeId);
            const incomplete = getIncompleteConditions(currentStage, 3);
            const allComplete = completedStages === totalStages;

            return (
              <>
                <p className="text-sm text-[var(--app-text-muted)]">
                  {currentStage.stage.icon} Глава {currentStage.stage.order}
                </p>
                <p className="mt-1 text-base font-semibold text-[var(--app-text)]">{text.title}</p>
                <p className="mt-2 text-sm text-[var(--app-text-muted)]">
                  Прогресс главы: {currentStage.progressPercent}%
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
                  <div
                    className="h-full rounded-full bg-[var(--app-primary)]"
                    style={{ width: `${currentStage.progressPercent}%` }}
                  />
                </div>

                {!allComplete && incomplete.length > 0 ? (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                      До следующей главы
                    </p>
                    <ul className="space-y-1 text-sm text-[var(--app-text)]">
                      {incomplete.map((cp) => (
                        <li key={cp.condition.id} className="flex gap-2">
                          <span className="text-[var(--app-text-muted)]">—</span>
                          <span>{formatJourneyConditionRemaining(cp)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : allComplete ? (
                  <p className="mt-3 text-sm font-medium text-emerald-500">{text.completedText}</p>
                ) : null}
              </>
            );
          })()}
        </>
      ) : null}
    </Card>
  );
}
