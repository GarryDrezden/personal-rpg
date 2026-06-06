import { useEffect, useState, useCallback } from 'react';
import { useAppStore, emptyDaily } from '../store/appStore';
import { todayISO } from '../utils/dates';
import { calcDailyPoints, getWeeklySettingsForDate } from '../utils/points';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { NumberInput } from '../components/ui/NumberInput';
import { ToggleButton } from '../components/ui/ToggleButton';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import type { AlcoholStatus, DailyEntry } from '../types';

export function TodayPage() {
  const { dailyEntries, settings, updateDaily } = useAppStore();
  const today = todayISO();
  const existing = dailyEntries.find((e) => e.date === today);
  const [entry, setEntry] = useState<DailyEntry>(existing ?? emptyDaily(today));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) setEntry(existing);
  }, [existing]);

  const weekly = getWeeklySettingsForDate(today, settings);
  const points = calcDailyPoints(entry, settings);

  const save = useCallback(async (updated: DailyEntry) => {
    setSaving(true);
    try {
      await updateDaily(updated);
    } finally {
      setSaving(false);
    }
  }, [updateDaily]);

  const patch = (partial: Partial<DailyEntry>) => {
    const updated = { ...entry, ...partial };
    setEntry(updated);
    void save(updated);
  };

  const caloriesVariant =
    entry.calories === null ? 'neutral' :
    entry.calories <= weekly.caloriesLimit ? 'success' : 'danger';

  const stepsVariant =
    entry.steps === null ? 'neutral' :
    entry.steps >= weekly.stepsGoal ? 'success' : 'neutral';

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Сегодня</h1>
        <div className="text-right">
          <Badge variant="gold">{Math.max(0, points)} очков</Badge>
          {saving && <div className="text-xs text-rpg-muted">сохранение…</div>}
        </div>
      </header>

      <Card variant={caloriesVariant as 'success' | 'danger' | 'neutral'}>
        <NumberInput
          label={`Калории (лимит ${weekly.caloriesLimit})`}
          value={entry.calories}
          onChange={(v) => patch({ calories: v })}
        />
      </Card>

      <Card variant={stepsVariant as 'success' | 'neutral'}>
        <NumberInput
          label={`Шаги (цель ${weekly.stepsGoal})`}
          value={entry.steps}
          onChange={(v) => patch({ steps: v })}
        />
      </Card>

      <Card variant={entry.alcohol === 'heavy' ? 'danger' : entry.alcohol === 'none' ? 'success' : 'neutral'}>
        <SegmentedControl<AlcoholStatus>
          label="Алкоголь"
          value={entry.alcohol}
          options={[
            { value: 'none', label: 'Не пил' },
            { value: 'moderate', label: 'Умеренно' },
            { value: 'heavy', label: 'Много' },
          ]}
          onChange={(v) => patch({ alcohol: v })}
          getVariant={(v) => (v === 'none' ? 'success' : v === 'heavy' ? 'danger' : 'neutral')}
        />
      </Card>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <ToggleButton label="Зарядка" checked={entry.morningExercise} onChange={(v) => patch({ morningExercise: v })} />
        <ToggleButton label="Зал" checked={entry.gym} onChange={(v) => patch({ gym: v })} />
        <ToggleButton label="Дневник" checked={entry.journal} onChange={(v) => patch({ journal: v })} />
        <ToggleButton label="Готовка" checked={entry.cooking} onChange={(v) => patch({ cooking: v })} />
        <ToggleButton label="Ремонт" checked={entry.repair} onChange={(v) => patch({ repair: v })} />
        <ToggleButton label="Цветы" checked={entry.plants} onChange={(v) => patch({ plants: v })} />
        <ToggleButton label="Хобби" checked={entry.hobby} onChange={(v) => patch({ hobby: v })} />
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Комментарий дня</span>
        <textarea
          value={entry.comment}
          onChange={(e) => setEntry({ ...entry, comment: e.target.value })}
          onBlur={() => void save(entry)}
          rows={3}
          className="w-full rounded-xl border border-rpg-border bg-white px-4 py-3 focus:border-gold focus:outline-none"
          placeholder="Что получилось, что было сложно…"
        />
      </label>
    </div>
  );
}
