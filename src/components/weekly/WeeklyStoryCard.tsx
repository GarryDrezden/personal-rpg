import type { WeeklyStoryReport } from '../../types/weeklyStory';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';

type WeeklyStoryCardProps = {
  report: WeeklyStoryReport;
  compact?: boolean;
};

const TYPE_EMOJI: Record<WeeklyStoryReport['type'], string> = {
  empty_week: '🌫️',
  breakthrough_week: '🚀',
  holding_week: '🛡️',
  recovery_week: '🔋',
  clarity_week: '💧',
  movement_week: '👟',
  chaos_week: '🌀',
};

export function WeeklyStoryCard({ report, compact = false }: WeeklyStoryCardProps) {
  const emoji = TYPE_EMOJI[report.type];

  return (
    <Card
      className={
        compact
          ? 'bg-[color-mix(in_srgb,var(--app-secondary)_6%,var(--app-card))]'
          : undefined
      }
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="text-2xl" aria-hidden>
            {emoji}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
              История недели
            </p>
            <h2 className="text-lg font-bold text-[var(--app-text)]">{report.title}</h2>
            <p className="text-sm text-[var(--app-primary)]">{report.subtitle}</p>
          </div>
        </div>
        {compact && (
          <Link to="/week" className="shrink-0 text-sm font-medium text-[var(--app-primary)] hover:underline">
            Неделя →
          </Link>
        )}
      </div>

      <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{report.summary}</p>

      {report.momentumDelta !== undefined && (
        <p className="mt-2 text-sm text-[var(--app-text)]">
          Инерция недели:{' '}
          <span className="font-semibold text-[var(--app-primary)]">
            {report.momentumDelta > 0 ? '+' : ''}
            {report.momentumDelta}
          </span>
          {report.momentumSummaryText && (
            <span className="text-[var(--app-text-muted)]"> — {report.momentumSummaryText}</span>
          )}
        </p>
      )}

      {!compact && report.highlights.length > 0 ? (
        <ul className="mt-4 space-y-1 text-sm text-[var(--app-text)]">
          {report.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-[var(--app-primary)]">•</span>
              {h}
            </li>
          ))}
        </ul>
      ) : null}

      {report.gains.length > 0 ? (
        <div className={`flex flex-wrap gap-2 ${compact ? 'mt-3' : 'mt-4'}`}>
          {report.gains.map((g) => (
            <span
              key={g.label}
              className="rounded-full bg-[var(--app-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--app-text)]"
            >
              {g.icon} {g.label}: {g.value.toLocaleString('ru')}
            </span>
          ))}
        </div>
      ) : null}

      <p className={`text-sm font-medium text-[var(--app-text)] ${compact ? 'mt-3' : 'mt-4'}`}>
        Фокус: <span className="font-normal text-[var(--app-text-muted)]">{report.nextFocus}</span>
      </p>
    </Card>
  );
}
