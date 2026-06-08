import { useState } from 'react';
import type { WeeklyReport } from '../../types/weeklyReport';
import { WEEKLY_REPORT_STATUS_LABELS } from '../../types/weeklyReport';
import { formatReportForCopy } from '../../utils/weeklyReportEngine';
import { formatDateRu } from '../../utils/dates';
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
      return 'from-amber-50 via-white to-yellow-50 ring-amber-200/60';
    case 'strong':
      return 'from-emerald-50 via-white to-green-50 ring-emerald-200/50';
    case 'good':
      return 'from-sky-50 via-white to-blue-50 ring-sky-200/50';
    case 'weak':
      return 'from-stone-50 via-white to-slate-50 ring-stone-200/50';
    default:
      return 'from-orange-50 via-white to-amber-50 ring-orange-200/40';
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
    <Card className={`bg-gradient-to-br ring-1 ${cardAccent(report.status)}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rpg-muted">
            {formatDateRu(report.weekStart)} — {formatDateRu(report.weekEnd)}
          </p>
          <h2 className={`mt-1 font-bold text-stone-900 ${compact ? 'text-xl' : 'text-2xl'}`}>
            {report.summary}
          </h2>
        </div>
        <Badge variant={statusVariant(report.status)}>
          {WEEKLY_REPORT_STATUS_LABELS[report.status]}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-rpg-muted">
            {report.points} / {report.pointsGoal} XP
          </span>
          <span className="font-semibold">{report.pointsPercent}%</span>
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
        <ReportMetric
          icon="💧"
          label="Без алкоголя"
          value={`${report.noAlcoholDays}/7`}
        />
        <ReportMetric
          icon="🏋️"
          label="Зал"
          value={`${report.gymCount}/${report.gymTarget}`}
        />
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
        <p className="mt-4 text-sm text-rpg-muted">
          Лучший день:{' '}
          <span className="font-medium text-stone-800">
            {formatDateRu(report.bestDayDate)} · {report.bestDayPoints} XP
          </span>
        </p>
      )}

      {!compact && (
        <div className="mt-4 rounded-xl border border-rpg-border bg-white/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-rpg-muted">
            Совет недели
          </p>
          <p className="mt-1 text-sm text-stone-800">{report.advice}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => void handleCopy()}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rpg-border bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
      >
        {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
        {copied ? 'Скопировано' : 'Скопировать отчёт'}
      </button>
    </Card>
  );
}
