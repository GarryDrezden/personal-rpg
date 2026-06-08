import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { InsightCard } from '../components/insights/InsightCard';
import { Card } from '../components/ui/Card';
import { FILTER_ACTIVE_GOLD, FILTER_IDLE } from '../constants/cardTheme';
import type { InsightFilter } from '../types/insights';
import {
  countDaysWithData,
  filterInsights,
  generateInsights,
  hasEnoughDataForInsights,
} from '../utils/insightEngine';
import { Lightbulb } from 'lucide-react';

const FILTERS: { id: InsightFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'positive', label: 'Позитивные' },
  { id: 'warning', label: 'Предупреждения' },
  { id: 'suggestion', label: 'Советы' },
];

export function InsightsPage() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const [filter, setFilter] = useState<InsightFilter>('all');

  const insights = useMemo(
    () => generateInsights({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );

  const filtered = useMemo(() => filterInsights(insights, filter), [insights, filter]);
  const enoughData = hasEnoughDataForInsights(dailyEntries);
  const daysCount = countDaysWithData(dailyEntries);

  return (
    <div className="space-y-6 pb-8">
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-card-strong)] text-[var(--app-success)]">
            <Lightbulb size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Аналитика</h1>
            <p className="text-[var(--app-text-muted)]">
              Локальные выводы из твоих данных — без облака и без AI
            </p>
          </div>
        </div>
      </header>

      {!enoughData && (
        <Card className="border-dashed text-center">
          <p className="text-lg font-medium text-[var(--app-text)]">Данных пока мало</p>
          <p className="mt-2 text-sm text-[var(--app-text-muted)]">
            Нужно хотя бы 7 дней данных, чтобы появились первые выводы. Сейчас: {daysCount}{' '}
            {daysCount === 1 ? 'день' : daysCount < 5 ? 'дня' : 'дней'}.
          </p>
        </Card>
      )}

      {enoughData && (
        <>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={filter === f.id ? FILTER_ACTIVE_GOLD : FILTER_IDLE}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <Card className="text-center">
              <p className="text-sm text-[var(--app-text-muted)]">
                В этой категории пока нет выводов — попробуй фильтр «Все».
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <InsightCard key={item.id} insight={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
