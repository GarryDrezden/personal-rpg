import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { todayISO, formatDateRu, isMonday } from '../utils/dates';
import { getDelta, sortMeasurementsByDate } from '../utils/measurements';
import {
  getStoredDualAxisMetrics,
  getStoredOverlayMetrics,
  resolveInitialChartMode,
  resolveInitialDualAxisMetrics,
  resolveInitialMeasurementMetric,
  resolveInitialOverlayMetrics,
  setStoredChartMode,
  setStoredDualAxisMetrics,
  setStoredMeasurementMetric,
  setStoredOverlayMetrics,
} from '../utils/measurementMetricStorage';
import {
  getMeasurementMetricConfig,
  type MeasurementMetricKey,
} from '../constants/measurementMetrics';
import type { MeasurementsChartMode } from '../types/measurementsChart';
import { Card } from '../components/ui/Card';
import { NumberInput } from '../components/ui/NumberInput';
import { StatTile } from '../components/ui/StatTile';
import { MeasurementsChartFallback } from '../components/measurements/MeasurementsChartFallback';
import { MeasurementMetricSelector } from '../components/measurements/MeasurementMetricSelector';
import { MeasurementOverlayMetricSelector } from '../components/measurements/MeasurementOverlayMetricSelector';
import { MeasurementDualAxisMetricSelector } from '../components/measurements/MeasurementDualAxisMetricSelector';
import type { MeasurementEntry } from '../types';

const MeasurementsLineChart = lazy(() => import('../components/measurements/MeasurementsLineChart'));

export function MeasurementsPage() {
  const { measurements, addMeasurement, settings } = useAppStore();
  const sorted = sortMeasurementsByDate(measurements);
  const weightDelta = getDelta(measurements, 'weight');
  const waistDelta = getDelta(measurements, 'waist');
  const today = todayISO();

  const [chartMode, setChartMode] = useState<MeasurementsChartMode>(resolveInitialChartMode);
  const [selectedMetric, setSelectedMetric] = useState<MeasurementMetricKey>(
    resolveInitialMeasurementMetric,
  );
  const [selectedOverlayMetrics, setSelectedOverlayMetrics] = useState<MeasurementMetricKey[]>(
    () => getStoredOverlayMetrics() ?? resolveInitialOverlayMetrics(),
  );
  const [dualAxisMetrics, setDualAxisMetrics] = useState<MeasurementMetricKey[]>(
    () => getStoredDualAxisMetrics() ?? resolveInitialDualAxisMetrics(),
  );
  const [form, setForm] = useState<Omit<MeasurementEntry, 'id'>>({
    date: today,
    weight: null,
    chest: null,
    waist: null,
    belly: null,
    hips: null,
    thigh: null,
    biceps: null,
    comment: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStoredMeasurementMetric(selectedMetric);
  }, [selectedMetric]);

  useEffect(() => {
    setStoredChartMode(chartMode);
  }, [chartMode]);

  useEffect(() => {
    setStoredOverlayMetrics(selectedOverlayMetrics);
  }, [selectedOverlayMetrics]);

  useEffect(() => {
    setStoredDualAxisMetrics(dualAxisMetrics);
  }, [dualAxisMetrics]);

  const metricConfig = getMeasurementMetricConfig(selectedMetric);
  const singleDataCount = useMemo(
    () => sorted.filter((m) => m[selectedMetric] !== null && m[selectedMetric] !== undefined).length,
    [sorted, selectedMetric],
  );
  const overlayDataCount = useMemo(
    () =>
      sorted.filter((m) =>
        selectedOverlayMetrics.some((key) => m[key] !== null && m[key] !== undefined),
      ).length,
    [sorted, selectedOverlayMetrics],
  );
  const dualAxisDataCount = useMemo(() => {
    return sorted.filter((m) => {
      if (m.weight === null || m.weight === undefined) return false;
      return dualAxisMetrics.some((key) => m[key] !== null && m[key] !== undefined);
    }).length;
  }, [sorted, dualAxisMetrics]);

  const chartTitle =
    chartMode === 'single'
      ? `Динамика: ${metricConfig.label}`
      : chartMode === 'overlay'
        ? 'Сравнение замеров (см)'
        : 'Вес + замеры';

  const canRenderChart =
    chartMode === 'single'
      ? singleDataCount >= 2
      : chartMode === 'overlay'
        ? selectedOverlayMetrics.length >= 1 && overlayDataCount >= 2
        : dualAxisMetrics.length >= 1 &&
          sorted.filter((m) => m.weight !== null).length >= 2 &&
          dualAxisDataCount >= 2;

  const emptyMessage =
    chartMode === 'single'
      ? 'Пока мало данных по этой метрике. Добавь минимум два замера.'
      : chartMode === 'overlay'
        ? selectedOverlayMetrics.length < 1
          ? 'Выбери хотя бы одну метрику для сравнения.'
          : 'Пока мало данных для сравнения. Добавь минимум два замера по выбранным метрикам.'
        : dualAxisMetrics.length < 1
          ? 'Выбери хотя бы один замер в сантиметрах.'
          : sorted.filter((m) => m.weight !== null).length < 2
            ? 'Для режима «Вес + замеры» нужны записи с весом.'
            : 'Пока мало данных для сравнения веса и замеров. Добавь минимум два замера с весом и выбранными метриками.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addMeasurement(form);
      setForm({
        ...form,
        weight: null,
        chest: null,
        waist: null,
        belly: null,
        hips: null,
        thigh: null,
        biceps: null,
        comment: '',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Замеры</h1>
        {isMonday(today) && (
          <p className="text-success mt-1 text-sm">
            Сегодня понедельник — +{settings.pointSettings.measurementsMondayBonus} XP и бонусные
            монеты за замеры
          </p>
        )}
      </header>

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="Вес"
          value={weightDelta.fromPrevious ? `${weightDelta.fromPrevious.to} кг` : '—'}
          sub={
            weightDelta.fromStart
              ? `от старта: ${weightDelta.fromStart.diff > 0 ? '+' : ''}${weightDelta.fromStart.diff.toFixed(1)}`
              : undefined
          }
        />
        <StatTile
          label="Талия"
          value={waistDelta.fromPrevious ? `${waistDelta.fromPrevious.to} см` : '—'}
          sub={
            waistDelta.fromStart
              ? `от старта: ${waistDelta.fromStart.diff > 0 ? '+' : ''}${waistDelta.fromStart.diff.toFixed(1)}`
              : undefined
          }
        />
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">Новый замер</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm">
            Дата
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full rounded-xl border border-rpg-border px-3 py-2"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Вес" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />
            <NumberInput label="Талия" value={form.waist} onChange={(v) => setForm({ ...form, waist: v })} />
            <NumberInput label="Грудь" value={form.chest} onChange={(v) => setForm({ ...form, chest: v })} />
            <NumberInput label="Живот" value={form.belly} onChange={(v) => setForm({ ...form, belly: v })} />
            <NumberInput label="Ягодицы" value={form.hips} onChange={(v) => setForm({ ...form, hips: v })} />
            <NumberInput label="Бедро" value={form.thigh} onChange={(v) => setForm({ ...form, thigh: v })} />
            <NumberInput label="Бицепс" value={form.biceps} onChange={(v) => setForm({ ...form, biceps: v })} />
          </div>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Комментарий"
            className="w-full rounded-xl border border-rpg-border px-3 py-2"
            rows={2}
          />
          <button
            type="submit"
            disabled={saving}
            className="min-h-12 w-full rounded-xl bg-gold font-semibold text-slate-950 hover:bg-amber-600 disabled:opacity-50"
          >
            {saving ? 'Сохранение…' : 'Сохранить замер'}
          </button>
        </form>
      </Card>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-[var(--app-text)]">График замеров</h2>
          <div
            className="flex flex-wrap rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-1"
            role="group"
            aria-label="Режим графика"
          >
            <button
              type="button"
              data-testid="measurements-chart-mode-single"
              aria-pressed={chartMode === 'single'}
              onClick={() => setChartMode('single')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                chartMode === 'single'
                  ? 'bg-[var(--app-card-strong)] text-[var(--app-text)] shadow-sm'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              Одна метрика
            </button>
            <button
              type="button"
              data-testid="measurements-chart-mode-overlay"
              aria-pressed={chartMode === 'overlay'}
              onClick={() => setChartMode('overlay')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                chartMode === 'overlay'
                  ? 'bg-[var(--app-card-strong)] text-[var(--app-text)] shadow-sm'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              Сравнение
            </button>
            <button
              type="button"
              data-testid="measurements-chart-mode-dualAxis"
              aria-pressed={chartMode === 'dualAxis'}
              onClick={() => setChartMode('dualAxis')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                chartMode === 'dualAxis'
                  ? 'bg-[var(--app-card-strong)] text-[var(--app-text)] shadow-sm'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              Вес + замеры
              <span className="rounded-full border border-[var(--app-border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]">
                эксп.
              </span>
            </button>
          </div>
        </div>

        {chartMode === 'single' && (
          <MeasurementMetricSelector value={selectedMetric} onChange={setSelectedMetric} />
        )}
        {chartMode === 'overlay' && (
          <MeasurementOverlayMetricSelector
            selectedMetrics={selectedOverlayMetrics}
            onChange={setSelectedOverlayMetrics}
            allowedGroup="body"
          />
        )}
        {chartMode === 'dualAxis' && (
          <MeasurementDualAxisMetricSelector
            selectedMetrics={dualAxisMetrics}
            onChange={setDualAxisMetrics}
          />
        )}

        {!canRenderChart ? (
          <p className="mt-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-8 text-center text-sm text-[var(--app-text-muted)]">
            {emptyMessage}
          </p>
        ) : (
          <div
            className="mt-4"
            data-testid={
              chartMode === 'dualAxis'
                ? 'measurements-dual-axis-chart'
                : chartMode === 'overlay'
                  ? 'measurements-overlay-chart'
                  : 'measurements-single-chart'
            }
          >
            <Suspense fallback={<MeasurementsChartFallback title={chartTitle} />}>
              <MeasurementsLineChart
                measurements={sorted}
                mode={chartMode}
                metric={selectedMetric}
                metrics={selectedOverlayMetrics}
                dualAxisMetrics={dualAxisMetrics}
                title={chartTitle}
              />
            </Suspense>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">История</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-rpg-muted border-b text-left">
                <th className="py-2 pr-2">Дата</th>
                <th className="py-2 pr-2">Вес</th>
                <th className="py-2 pr-2">Талия</th>
                <th className="py-2">Δ вес</th>
              </tr>
            </thead>
            <tbody>
              {[...sorted].reverse().map((m, i, arr) => {
                const prev = arr[i + 1];
                const diff = prev?.weight && m.weight ? (m.weight - prev.weight).toFixed(1) : '—';
                return (
                  <tr key={m.id} className="border-rpg-border/50 border-b">
                    <td className="py-2 pr-2">{formatDateRu(m.date)}</td>
                    <td className="py-2 pr-2">{m.weight ?? '—'}</td>
                    <td className="py-2 pr-2">{m.waist ?? '—'}</td>
                    <td className="py-2">{diff}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
