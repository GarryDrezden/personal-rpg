import { getEnergyLabel, getDayModeLabel, getEnergyRecommendation } from '../../constants/energy';
import { getStepsStatus } from '../../utils/stepsEngine';
import { useAppStore } from '../../store/appStore';
import { todayISO } from '../../utils/dates';
import { Card } from '../ui/Card';
import { EnergyDaySummary } from './EnergyDayCard';
import { Link } from 'react-router-dom';

export function DashboardEnergyCard() {
  const { dailyEntries, settings } = useAppStore();
  const today = todayISO();
  const entry = dailyEntries.find((e) => e.date === today);
  const recommendation = getEnergyRecommendation(entry?.energyLevel, entry?.dayMode);

  const stepsInfo = entry
    ? getStepsStatus({
        steps: entry.steps,
        settings,
        date: today,
        dayMode: entry.dayMode,
      })
    : null;

  return (
    <Card className="h-full border border-[var(--app-border)]">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          Ресурс и шаги
        </h2>
        <Link to="/today" className="text-xs font-medium text-[var(--app-primary)] hover:underline">
          Изменить →
        </Link>
      </div>

      <p className="mb-2 text-sm text-[var(--app-text)]">{recommendation}</p>

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-[var(--app-bg-soft)] px-2 py-1.5">
          <span className="text-[var(--app-text-muted)]">Ресурс: </span>
          <span className="font-medium text-[var(--app-text)]">
            {getEnergyLabel(entry?.energyLevel)}
          </span>
        </div>
        <div className="rounded-lg bg-[var(--app-bg-soft)] px-2 py-1.5">
          <span className="text-[var(--app-text-muted)]">Режим: </span>
          <span className="font-medium text-[var(--app-text)]">
            {getDayModeLabel(entry?.dayMode)}
          </span>
        </div>
      </div>

      {stepsInfo && entry?.steps != null && (
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-3 py-2">
          <p className="text-xs text-[var(--app-text-muted)]">Шаги сегодня</p>
          <p className="font-semibold text-[var(--app-text)]">
            {entry.steps.toLocaleString('ru')} — {stepsInfo.title}
          </p>
          {stepsInfo.stepsToNextTarget != null && stepsInfo.stepsToNextTarget > 0 && (
            <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">
              До {stepsInfo.nextTargetLabel} осталось {stepsInfo.stepsToNextTarget.toLocaleString('ru')}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

export { EnergyDaySummary };
