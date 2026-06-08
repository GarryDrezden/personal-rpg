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
    <Card className="bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/50">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="text-indigo-600" size={22} />
          <h2 className="text-lg font-semibold">Отчёт недели</h2>
        </div>
        <Link to="/reports" className="text-sm font-medium text-gold hover:underline">
          {monday && report ? 'Открыть отчёт →' : 'Отчёты →'}
        </Link>
      </div>

      {monday && report ? (
        <>
          <p className="text-xs text-rpg-muted">
            Итоги прошлой недели · {formatDateRu(report.weekStart)} —{' '}
            {formatDateRu(report.weekEnd)}
          </p>
          <p className="mt-2 text-sm font-medium text-stone-800">{report.summary}</p>
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
            <span className="text-sm text-rpg-muted">
              {report.points} XP · {report.coinsEarned} 🪙
            </span>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-rpg-muted">Текущий прогресс недели</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <span className="text-2xl font-bold">{currentWeekTotal}</span>
            <span className="text-sm text-rpg-muted">/ {currentWeekGoal} XP</span>
          </div>
          <ProgressBar
            value={currentWeekPercent}
            color={currentWeekPercent >= 100 ? 'success' : 'gold'}
            className="mt-2 h-2"
          />
          <p className="mt-1 text-xs text-rpg-muted">
            {currentWeekPercent}% · полный отчёт появится в понедельник
          </p>
        </>
      )}
    </Card>
  );
}
