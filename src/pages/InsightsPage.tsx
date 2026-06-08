import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { InsightCard } from '../components/insights/InsightCard';
import { Card } from '../components/ui/Card';
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
            <Lightbulb size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Аналитика</h1>
            <p className="text-rpg-muted">
              Локальные выводы из твоих данных — без облака и без AI
            </p>
          </div>
        </div>
      </header>

      {!enoughData && (
        <Card className="border-dashed border-teal-200 bg-teal-50/40 text-center">
          <p className="text-lg font-medium text-stone-800">Данных пока мало</p>
          <p className="mt-2 text-sm text-rpg-muted">
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
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  filter === f.id
                    ? 'border-gold bg-amber-100 text-amber-900'
                    : 'border-rpg-border bg-white text-rpg-muted hover:bg-stone-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <Card className="text-center">
              <p className="text-sm text-rpg-muted">
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
