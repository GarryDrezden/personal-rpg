import type { MomentumDayResult, MomentumDailyFactor } from '../../types/momentum';
import { Card } from '../ui/Card';
import { useAppTheme } from '../../hooks/useAppTheme';
import {
  getSleepFactorThemeText,
  isSleepFactor,
} from '../../constants/momentumFactorTexts';
import { migrateMomentumFactorId } from '../../utils/momentumFactorMigration';

type MomentumFactorsCardProps = {
  result: MomentumDayResult | null;
};

function formatDelta(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

function isSleepMomentumFactor(f: MomentumDailyFactor): boolean {
  return f.source === 'sleep' || isSleepFactor(f.id);
}

function FactorRow({
  factor,
  themeId,
  tone,
}: {
  factor: MomentumDailyFactor;
  themeId: 'cozy' | 'darkFantasy';
  tone: 'positive' | 'negative';
}) {
  const normalizedId = migrateMomentumFactorId(factor.id);
  const themeText = isSleepMomentumFactor(factor)
    ? getSleepFactorThemeText(normalizedId, themeId)
    : null;
  const title = themeText?.title ?? factor.title;
  const explanation = themeText?.explanation ?? factor.explanation;
  const showSleepBadge = isSleepMomentumFactor(factor);

  const valueClass =
    tone === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-amber-700 dark:text-amber-400/90';

  return (
    <li className={`rounded-lg px-1 py-1.5 text-sm ${valueClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{formatDelta(factor.value)}</span>
            <span className="text-[var(--app-text)]">{title}</span>
            {showSleepBadge && (
              <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                Сон
              </span>
            )}
          </div>
          {explanation && (
            <p className="mt-1 text-xs leading-relaxed text-[var(--app-text-muted)]">
              {explanation}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export function MomentumFactorsCard({ result }: MomentumFactorsCardProps) {
  const { themeId } = useAppTheme();

  if (!result || result.factors.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-[var(--app-text)]">
          Сегодняшний вклад в инерцию
        </h2>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          Сегодня пока нет факторов инерции. Заполни калории, шаги или ясность дня.
        </p>
      </Card>
    );
  }

  const positive = result.factors.filter((f) => f.value > 0);
  const negative = result.factors.filter((f) => f.value < 0);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-[var(--app-text)]">
        Сегодняшний вклад в инерцию
      </h2>
      <p className="mt-1 text-2xl font-bold text-[var(--app-primary)]">
        {formatDelta(result.dailyDelta)}
      </p>

      {positive.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
            Что сработало
          </p>
          <ul className="mt-2 space-y-1">
            {positive.map((f) => (
              <FactorRow key={f.id} factor={f} themeId={themeId} tone="positive" />
            ))}
          </ul>
        </div>
      )}

      {negative.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
            Что сбило темп
          </p>
          <ul className="mt-2 space-y-1">
            {negative.map((f) => (
              <FactorRow key={f.id} factor={f} themeId={themeId} tone="negative" />
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 border-t border-[var(--app-border)] pt-3">
        <p className="text-sm text-[var(--app-text-muted)]">
          Итог дня:{' '}
          <span className="font-semibold text-[var(--app-text)]">
            {formatDelta(result.endValue)}
          </span>
        </p>
      </div>
    </Card>
  );
}
