import { Link } from 'react-router-dom';
import type { FreedomScoreResult } from '../../types/freedomScore';
import { getTopBreakdownItems } from '../../utils/freedomScoreEngine';
import { Card } from '../ui/Card';
import { Sparkles } from 'lucide-react';

type FreedomScoreCardProps = {
  result: FreedomScoreResult;
  compact?: boolean;
  hasData?: boolean;
};

export function FreedomScoreCard({
  result,
  compact = false,
  hasData = true,
}: FreedomScoreCardProps) {
  const topItems = getTopBreakdownItems(result.breakdown, compact ? 3 : 10);

  if (!hasData) {
    return (
      <Card>
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 shrink-0 text-[var(--app-primary)]" size={22} />
          <div>
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Свобода тела</h2>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Свобода тела пока только просыпается. Внеси вес, калории или шаги — и индекс начнёт
              собираться.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={
        compact
          ? 'bg-[color-mix(in_srgb,var(--app-primary)_6%,var(--app-card))]'
          : undefined
      }
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="text-2xl" aria-hidden>
            {result.level.icon}
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Свобода тела</h2>
            {!compact && (
              <p className="text-xs text-[var(--app-text-muted)]">
                Игровой индекс — не медицинская оценка
              </p>
            )}
          </div>
        </div>
        {!compact && (
          <Link
            to="/freedom"
            className="shrink-0 text-sm font-medium text-[var(--app-primary)] hover:underline"
          >
            Подробнее →
          </Link>
        )}
      </div>

      <div className="flex items-end gap-3">
        <p className="text-4xl font-bold text-[var(--app-primary)]">{result.score}%</p>
        <div className="mb-1">
          <p className="font-semibold text-[var(--app-text)]">Стадия: {result.title}</p>
          <p className="text-sm text-[var(--app-text-muted)]">{result.description}</p>
        </div>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
        <div
          className="h-full rounded-full bg-[var(--app-primary)] transition-all"
          style={{ width: `${result.score}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-[var(--app-text-muted)]">
        Тело постепенно возвращает движение, контроль и устойчивость.
      </p>

      {topItems.length > 0 && topItems.some((i) => i.points > 0) ? (
        <div className={`mt-4 ${compact ? 'space-y-1.5' : 'space-y-2'}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            {compact ? 'Главные вклады' : 'Вклад направлений'}
          </p>
          {topItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-[var(--app-text)]">{item.title}</span>
              <span className="shrink-0 font-medium text-[var(--app-primary)]">
                +{Math.round(item.points)}/{item.maxPoints}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {!compact && (
        <div className="mt-4 space-y-2 border-t border-[var(--app-border)] pt-4">
          {result.breakdown.map((item) => (
            <div key={item.id}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-[var(--app-text)]">{item.title}</span>
                <span className="text-[var(--app-text-muted)]">
                  {Math.round(item.points)}/{item.maxPoints} · {item.value}/{item.maxValue}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
                <div
                  className="h-full rounded-full bg-[var(--app-secondary)]"
                  style={{
                    width: `${item.maxPoints > 0 ? (item.points / item.maxPoints) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
