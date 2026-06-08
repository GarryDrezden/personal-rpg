import { useState } from 'react';
import type { WeeklyReport } from '../../types/weeklyReport';
import { WEEKLY_REPORT_STATUS_LABELS } from '../../types/weeklyReport';
import { formatReportForCopy } from '../../utils/weeklyReportEngine';
import { formatDateRu } from '../../utils/dates';
import { CARD_ACCENT, BTN_SECONDARY, SURFACE_INSET } from '../../constants/cardTheme';
import { ReportMetric } from './ReportMetric';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Copy, Check } from 'lucide-react';

type WeeklyReportCardProps = {
  report: WeeklyReport;
  compact?: boolean;
};

function statusVariant(
  status: WeeklyReport['status'],
): 'default' | 'success' | 'gold' | 'danger' {
  switch (status) {
    case 'perfect':
      return 'gold';
    case 'strong':
    case 'good':
      return 'success';
    case 'weak':
      return 'danger';
    default:
      return 'default';
  }
}

function cardAccent(status: WeeklyReport['status']): string {
  switch (status) {
    case 'perfect':
      return CARD_ACCENT.primary;
    case 'strong':
      return CARD_ACCENT.success;
    case 'good':
      return CARD_ACCENT.default;
    case 'weak':
      return CARD_ACCENT.danger;
    default:
      return CARD_ACCENT.warning;
  }
}

export function WeeklyReportCard({ report, compact = false }: WeeklyReportCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatReportForCopy(report));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Card className={cardAccent(report.status)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            {formatDateRu(report.weekStart)} — {formatDateRu(report.weekEnd)}
          </p>
          <h2 className={`mt-1 font-bold text-[var(--app-text)] ${compact ? 'text-xl' : 'text-2xl'}`}>
            {report.summary}
          </h2>
        </div>
        <Badge variant={statusVariant(report.status)}>
          {WEEKLY_REPORT_STATUS_LABELS[report.status]}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-[var(--app-text-muted)]">
            {report.points} / {report.pointsGoal} XP
          </span>
          <span className="font-semibold text-[var(--app-text)]">{report.pointsPercent}%</span>
        </div>
        <ProgressBar
          value={Math.min(150, report.pointsPercent)}
          max={150}
          color={report.pointsPercent >= 100 ? 'success' : 'gold'}
        />
      </div>

      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
        <ReportMetric icon="⚔️" label="XP недели" value={`${report.xpEarned}`} />
        <ReportMetric icon="🪙" label="Монеты" value={`${report.coinsEarned}`} />
        <ReportMetric
          icon="🍽️"
          label="Калории"
          value={`${report.caloriesInLimitDays}/7`}
          sub="дней в лимите"
        />
        <ReportMetric
          icon="👟"
          label="Шаги"
          value={`${report.stepsGoalDays}/7`}
          sub={`~${report.averageSteps.toLocaleString('ru')} / день`}
        />
        <ReportMetric icon="💧" label="Без алкоголя" value={`${report.noAlcoholDays}/7`} />
        <ReportMetric icon="🏋️" label="Зал" value={`${report.gymCount}/${report.gymTarget}`} />
        {report.weightChange !== undefined && (
          <ReportMetric
            icon="⚖️"
            label="Вес"
            value={`${report.weightChange > 0 ? '+' : ''}${report.weightChange} кг`}
            sub="за неделю"
          />
        )}
        {report.waistChange !== undefined && (
          <ReportMetric
            icon="📏"
            label="Талия"
            value={`${report.waistChange > 0 ? '+' : ''}${report.waistChange} см`}
            sub="за неделю"
          />
        )}
        <ReportMetric
          icon="🏆"
          label="Достижения"
          value={`${report.unlockedAchievementsCount}`}
          sub="за неделю"
        />
        <ReportMetric icon="⭐" label="Лучшая привычка" value={report.bestHabit} />
      </div>

      {report.bestDayDate && report.bestDayPoints !== undefined && !compact && (
        <p className="mt-4 text-sm text-[var(--app-text-muted)]">
          Лучший день:{' '}
          <span className="font-medium text-[var(--app-text)]">
            {formatDateRu(report.bestDayDate)} · {report.bestDayPoints} XP
          </span>
        </p>
      )}

      {!compact && (
        <div className={`mt-4 ${SURFACE_INSET} px-4 py-3`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            Совет недели
          </p>
          <p className="mt-1 text-sm text-[var(--app-text)]">{report.advice}</p>
        </div>
      )}

      <button type="button" onClick={() => void handleCopy()} className={`mt-4 inline-flex items-center gap-2 ${BTN_SECONDARY}`}>
        {copied ? <Check size={16} className="text-[var(--app-success)]" /> : <Copy size={16} />}
        {copied ? 'Скопировано' : 'Скопировать отчёт'}
      </button>
    </Card>
  );
}
