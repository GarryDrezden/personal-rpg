import { Link } from 'react-router-dom';
import type { WeeklyReport } from '../../types/weeklyReport';
import { WEEKLY_REPORT_STATUS_LABELS } from '../../types/weeklyReport';
import { formatDateRu, isMonday } from '../../utils/dates';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { FileText } from 'lucide-react';

type WeeklyReportPreviewCardProps = {
  today: string;
  report: WeeklyReport | null;
  currentWeekPercent: number;
  currentWeekTotal: number;
  currentWeekGoal: number;
};

export function WeeklyReportPreviewCard({
  today,
  report,
  currentWeekPercent,
  currentWeekTotal,
  currentWeekGoal,
}: WeeklyReportPreviewCardProps) {
  const monday = isMonday(today);

  return (
    <Card className="bg-[color-mix(in_srgb,var(--app-secondary)_8%,var(--app-card))]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="text-[var(--app-secondary)]" size={22} />
          <h2 className="text-lg font-semibold text-[var(--app-text)]">Отчёт недели</h2>
        </div>
        <Link to="/reports" className="text-sm font-medium text-[var(--app-primary)] hover:underline">
          {monday && report ? 'Открыть отчёт →' : 'Отчёты →'}
        </Link>
      </div>

      {monday && report ? (
        <>
          <p className="text-xs text-[var(--app-text-muted)]">
            Итоги прошлой недели · {formatDateRu(report.weekStart)} —{' '}
            {formatDateRu(report.weekEnd)}
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--app-text)]">{report.summary}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              variant={
                report.status === 'perfect' || report.status === 'strong'
                  ? 'success'
                  : report.status === 'weak'
                    ? 'danger'
                    : 'default'
              }
            >
              {WEEKLY_REPORT_STATUS_LABELS[report.status]}
            </Badge>
            <span className="text-sm text-[var(--app-text-muted)]">
              {report.points} XP · {report.coinsEarned} 🪙
            </span>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-[var(--app-text-muted)]">Текущий прогресс недели</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <span className="text-2xl font-bold text-[var(--app-text)]">{currentWeekTotal}</span>
            <span className="text-sm text-[var(--app-text-muted)]">/ {currentWeekGoal} XP</span>
          </div>
          <ProgressBar
            value={currentWeekPercent}
            color={currentWeekPercent >= 100 ? 'success' : 'gold'}
            className="mt-2 h-2"
          />
          <p className="mt-1 text-xs text-[var(--app-text-muted)]">
            {currentWeekPercent}% · полный отчёт появится в понедельник
          </p>
        </>
      )}
    </Card>
  );
}
