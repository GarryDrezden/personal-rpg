import {
  MEASUREMENT_METRICS,
  type MeasurementMetricKey,
} from '../../constants/measurementMetrics';

type MeasurementMetricSelectorProps = {
  value: MeasurementMetricKey;
  onChange: (metric: MeasurementMetricKey) => void;
};

export function MeasurementMetricSelector({
  value,
  onChange,
}: MeasurementMetricSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {MEASUREMENT_METRICS.map((metric) => {
        const active = metric.key === value;
        return (
            <button
              key={metric.key}
              type="button"
              data-testid={`measurement-metric-${metric.key}`}
              onClick={() => onChange(metric.key)}
            aria-pressed={active}
            className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_14%,var(--app-card))] text-[var(--app-text)]'
                : 'border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)] hover:border-[var(--app-primary)]/40 hover:text-[var(--app-text)]'
            }`}
          >
            <span className="mr-1" aria-hidden>
              {metric.icon}
            </span>
            {metric.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
