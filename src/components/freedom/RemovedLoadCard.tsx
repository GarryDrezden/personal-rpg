import type { AppThemeId } from '../../types/theme';
import type { RemovedLoadResult } from '../../types/removedLoad';
import {
  getRemovedLoadThemeText,
  getRemovedLoadVisualThemeText,
} from '../../constants/removedLoadTexts';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';

type RemovedLoadCardProps = {
  result: RemovedLoadResult;
  themeId?: AppThemeId;
  compact?: boolean;
};

export function RemovedLoadCard({
  result,
  themeId = 'cozy',
  compact = false,
}: RemovedLoadCardProps) {
  const themeText = getRemovedLoadThemeText(themeId);

  if (result.removedKg <= 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-[var(--app-text)]">{themeText.emptyTitle}</h2>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">{themeText.emptyDescription}</p>
      </Card>
    );
  }

  const visual = result.nearestVisual;
  const visualTheme = visual ? getRemovedLoadVisualThemeText(visual.id, themeId) : null;

  return (
    <Card
      className={
        compact
          ? 'bg-[color-mix(in_srgb,var(--app-secondary)_8%,var(--app-card))]'
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--app-text)]">{themeText.cardTitle}</h2>
        </div>
        {!compact && (
          <Link
            to="/freedom"
            className="text-sm font-medium text-[var(--app-primary)] hover:underline"
          >
            Подробнее →
          </Link>
        )}
      </div>

      <p className="mt-3 text-3xl font-bold text-[var(--app-primary)]">
        {result.removedKg.toLocaleString('ru', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}{' '}
        кг
      </p>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">{themeText.mainDescription}</p>

      {visual && visualTheme ? (
        <div className="mt-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-3">
          <div className="flex items-start gap-2">
            <span className="text-2xl" aria-hidden>
              {visual.icon}
            </span>
            <div>
              <p className="font-medium text-[var(--app-text)]">{visualTheme.title}</p>
              <p className="text-sm text-[var(--app-text-muted)]">
                {themeText.visualPrefix} {visualTheme.description}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
