import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { useCoinStore } from '../store/coinStore';
import { useAchievementStore } from '../store/achievementStore';
import { WeeklyReportCard } from '../components/reports/WeeklyReportCard';
import { Card } from '../components/ui/Card';
import { FILTER_ACTIVE_GOLD, FILTER_IDLE } from '../constants/cardTheme';
import {
  generateAllWeeklyReports,
  generateWeeklyReport,
  previousWeekStart,
} from '../utils/weeklyReportEngine';
import { formatDateRu, isMonday, todayISO, weekDays, weekStart } from '../utils/dates';
import { FileText } from 'lucide-react';

export function WeeklyReportsPage() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const coinTransactions = useCoinStore((s) => s.transactions);
  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);
  const today = todayISO();

  const reports = useMemo(
    () =>
      generateAllWeeklyReports({
        dailyEntries,
        measurements,
        settings,
        unlockedAchievements,
        coinTransactions,
      }),
    [dailyEntries, measurements, settings, unlockedAchievements, coinTransactions],
  );

  const defaultWeek = useMemo(() => {
    if (isMonday(today)) return previousWeekStart(today);
    return weekStart(today);
  }, [today]);

  const [selectedWeek, setSelectedWeek] = useState(defaultWeek);

  const selectedReport = useMemo(() => {
    const found = reports.find((r) => r.weekStart === selectedWeek);
    if (found) return found;
    return generateWeeklyReport({
      weekStart: selectedWeek,
      dailyEntries,
      measurements,
      settings,
      unlockedAchievements,
      coinTransactions,
    });
  }, [
    reports,
    selectedWeek,
    dailyEntries,
    measurements,
    settings,
    unlockedAchievements,
    coinTransactions,
  ]);

  const weekOptions = useMemo(() => {
    const fromReports = reports.map((r) => r.weekStart);
    if (!fromReports.includes(selectedWeek)) {
      return [selectedWeek, ...fromReports].sort().reverse();
    }
    return fromReports;
  }, [reports, selectedWeek]);

  return (
    <div className="space-y-6 pb-8">
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-card-strong)] text-[var(--app-secondary)]">
            <FileText size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Еженедельные отчёты</h1>
            <p className="text-[var(--app-text-muted)]">
              Итоги недели: очки, привычки, достижения и советы
            </p>
          </div>
        </div>
      </header>

      {reports.length === 0 ? (
        <Card className="border-dashed text-center">
          <p className="text-lg font-medium text-[var(--app-text)]">Отчётов пока нет</p>
          <p className="mt-2 text-sm text-[var(--app-text-muted)]">
            Начни вносить данные за дни — первая неделя появится в списке автоматически.
          </p>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {weekOptions.map((ws) => (
              <button
                key={ws}
                type="button"
                onClick={() => setSelectedWeek(ws)}
                className={selectedWeek === ws ? FILTER_ACTIVE_GOLD : FILTER_IDLE}
              >
                {formatDateRu(ws)} —{' '}
                {formatDateRu(
                  reports.find((r) => r.weekStart === ws)?.weekEnd ?? weekDays(ws)[6]!,
                )}
              </button>
            ))}
          </div>

          <WeeklyReportCard report={selectedReport} />
        </>
      )}
    </div>
  );
}
