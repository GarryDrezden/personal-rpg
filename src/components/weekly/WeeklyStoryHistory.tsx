import { Link } from 'react-router-dom';
import type { WeeklyStoryReport } from '../../types/weeklyStory';
import { formatDateRu, weekDays } from '../../utils/dates';
import { Card } from '../ui/Card';

type WeeklyStoryHistoryProps = {
  reports: WeeklyStoryReport[];
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

export function WeeklyStoryHistory({ reports, compact = false }: WeeklyStoryHistoryProps) {
  const visible = compact ? reports.slice(0, 4) : reports.slice(0, 12);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--app-text)]">История недель</h2>
        {compact && reports.length > 0 ? (
          <Link
            to="/reports"
            className="text-sm font-medium text-[var(--app-primary)] hover:underline"
          >
            Открыть все отчёты →
          </Link>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-[var(--app-text-muted)]">
            История недель пока пуста. Заполни несколько дней — и приложение начнёт собирать
            главы твоего пути.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((report) => {
            const days = weekDays(report.weekStart);
            const emoji = TYPE_EMOJI[report.type];

            return (
              <Card key={report.weekStart} className="bg-[var(--app-bg-soft)]">
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden>
                    {emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[var(--app-text-muted)]">
                      {formatDateRu(days[0]!)} — {formatDateRu(days[6]!)}
                    </p>
                    <h3 className="font-semibold text-[var(--app-text)]">{report.title}</h3>
                    <p className="text-sm text-[var(--app-primary)]">{report.subtitle}</p>
                    {!compact ? (
                      <p className="mt-2 text-sm text-[var(--app-text-muted)]">{report.summary}</p>
                    ) : null}
                    {report.highlights.length > 0 ? (
                      <ul className="mt-2 space-y-0.5 text-xs text-[var(--app-text)]">
                        {report.highlights.slice(0, compact ? 2 : 3).map((h) => (
                          <li key={h}>• {h}</li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="mt-2 text-xs text-[var(--app-text-muted)]">
                      Фокус: {report.nextFocus}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
