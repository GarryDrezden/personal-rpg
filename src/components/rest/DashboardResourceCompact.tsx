import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import {
  getCognitiveBreakLabel,
  getSleepQualityLabel,
  RESOURCE_LEVEL_LABELS,
} from '../../constants/resourceRest';
import { getDailyResource, normalizeSleepQuality } from '../../utils/resourceEngine';
import type { DailyEntry } from '../../types';

type DashboardResourceCompactProps = {
  entry: DailyEntry | null | undefined;
};

export function DashboardResourceCompact({ entry }: DashboardResourceCompactProps) {
  if (!entry) {
    return (
      <Card className="border border-[var(--app-border)] px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
              Ресурс сегодня
            </p>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">Отметь восстановление в дне →</p>
          </div>
          <Link to="/today" className="text-xs font-medium text-[var(--app-primary)] hover:underline">
            Открыть
          </Link>
        </div>
      </Card>
    );
  }

  const resource = getDailyResource(entry);
  const sleep = normalizeSleepQuality(entry.sleepQuality);
  const cognitive = entry.cognitiveBreaks;

  return (
    <Card className="border border-[var(--app-border)] px-4 py-3" data-testid="dashboard-resource-compact">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          Ресурс сегодня
        </p>
        <Link to="/today" className="text-xs font-medium text-[var(--app-primary)] hover:underline">
          Изменить →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:grid-cols-4">
        <div>
          <span className="text-[var(--app-text-muted)]">Уровень: </span>
          <span className="font-semibold text-[var(--app-text)]">
            {RESOURCE_LEVEL_LABELS[resource.level]}
          </span>
        </div>
        <div>
          <span className="text-[var(--app-text-muted)]">Сон: </span>
          <span className="font-medium text-[var(--app-text)]">{getSleepQualityLabel(sleep)}</span>
        </div>
        <div>
          <span className="text-[var(--app-text-muted)]">Голова: </span>
          <span className="font-medium text-[var(--app-text)]">
            {getCognitiveBreakLabel(cognitive)}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[var(--app-text-muted)]">Ход дня: </span>
          <span className="font-medium text-[var(--app-text)]">
            {resource.suggestion?.replace(/\.$/, '') ?? 'Отметь сон или перерыв'}
          </span>
        </div>
      </div>
    </Card>
  );
}
