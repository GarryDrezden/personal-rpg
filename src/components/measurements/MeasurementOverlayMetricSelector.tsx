import {
  BODY_MEASUREMENT_METRICS,
  getMeasurementMetricConfig,
  type MeasurementMetricGroup,
  type MeasurementMetricKey,
} from '../../constants/measurementMetrics';

const MAX_OVERLAY_METRICS = 5;

type MeasurementOverlayMetricSelectorProps = {
  selectedMetrics: MeasurementMetricKey[];
  onChange: (metrics: MeasurementMetricKey[]) => void;
  allowedGroup?: MeasurementMetricGroup;
};

export function MeasurementOverlayMetricSelector({
  selectedMetrics,
  onChange,
  allowedGroup = 'body',
}: MeasurementOverlayMetricSelectorProps) {
  const metrics =
    allowedGroup === 'body' ? BODY_MEASUREMENT_METRICS : BODY_MEASUREMENT_METRICS;

  const toggleMetric = (key: MeasurementMetricKey) => {
    const config = getMeasurementMetricConfig(key);
    if (config.group !== allowedGroup) return;

    const isSelected = selectedMetrics.includes(key);

    if (isSelected) {
      if (selectedMetrics.length <= 1) return;
      onChange(selectedMetrics.filter((m) => m !== key));
      return;
    }

    if (selectedMetrics.length >= MAX_OVERLAY_METRICS) return;
    onChange([...selectedMetrics, key]);
  };

  return (
    <div data-testid="measurements-overlay-selector">
      <p className="mb-2 text-xs text-[var(--app-text-muted)]">
        Для сравнения можно выбрать несколько метрик с одинаковыми единицами. Вес показывается
        отдельно, чтобы график оставался читаемым.
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {metrics.map((metric) => {
          const selected = selectedMetrics.includes(metric.key);
          const atMax = !selected && selectedMetrics.length >= MAX_OVERLAY_METRICS;
          return (
            <button
              key={metric.key}
              type="button"
              data-testid={`measurement-metric-${metric.key}`}
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
              <span className="mr-1" aria-hidden>
                {metric.icon}
              </span>
              {metric.shortLabel}
            </button>
          );
        })}
      </div>
      {selectedMetrics.length >= MAX_OVERLAY_METRICS && (
        <p className="mt-2 text-xs text-[var(--app-text-muted)]">
          Максимум {MAX_OVERLAY_METRICS} метрик для сравнения.
        </p>
      )}
    </div>
  );
}
