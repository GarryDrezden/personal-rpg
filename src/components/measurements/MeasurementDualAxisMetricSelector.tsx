import {
  BODY_MEASUREMENT_METRICS,
  getMeasurementMetricConfig,
  type MeasurementMetricKey,
} from '../../constants/measurementMetrics';
import { MAX_DUAL_AXIS_BODY_METRICS } from '../../utils/measurementMetricStorage';

type MeasurementDualAxisMetricSelectorProps = {
  selectedMetrics: MeasurementMetricKey[];
  onChange: (metrics: MeasurementMetricKey[]) => void;
};

export function MeasurementDualAxisMetricSelector({
  selectedMetrics,
  onChange,
}: MeasurementDualAxisMetricSelectorProps) {
  const toggleMetric = (key: MeasurementMetricKey) => {
    const config = getMeasurementMetricConfig(key);
    if (config.group !== 'body') return;

    const isSelected = selectedMetrics.includes(key);

    if (isSelected) {
      if (selectedMetrics.length <= 1) return;
      onChange(selectedMetrics.filter((m) => m !== key));
      return;
    }

    if (selectedMetrics.length >= MAX_DUAL_AXIS_BODY_METRICS) return;
    onChange([...selectedMetrics, key]);
  };

  return (
    <div data-testid="measurements-dual-axis-selector">
      <p className="mb-2 text-xs text-[var(--app-text-muted)]">
        Вес показывается по левой оси в кг, замеры — по правой оси в см.
      </p>
      <p className="mb-2 text-xs text-[var(--app-text-muted)]">
        Вес всегда включён. Выбери 1–4 замера в сантиметрах.
      </p>
      <div className="flex flex-wrap gap-2">
        <span
          data-testid="dual-axis-metric-weight"
          className="inline-flex items-center rounded-xl border border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_14%,var(--app-card))] px-3 py-2 text-sm font-medium text-[var(--app-text)]"
        >
          ⚖️ Вес (кг)
        </span>
        {BODY_MEASUREMENT_METRICS.map((metric) => {
          const selected = selectedMetrics.includes(metric.key);
          const atMax = !selected && selectedMetrics.length >= MAX_DUAL_AXIS_BODY_METRICS;
          return (
            <button
              key={metric.key}
              type="button"
              data-testid={`dual-axis-metric-${metric.key}`}
              onClick={() => toggleMetric(metric.key)}
              aria-pressed={selected}
              disabled={atMax}
              className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                selected
                  ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_14%,var(--app-card))] text-[var(--app-text)]'
                  : atMax
                    ? 'cursor-not-allowed border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)] opacity-50'
                    : 'border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)] hover:border-[var(--app-primary)]/40 hover:text-[var(--app-text)]'
              }`}
            >
              <span className="mr-1" aria-hidden>
                {selected ? '☑' : '☐'}
              </span>
              {metric.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
