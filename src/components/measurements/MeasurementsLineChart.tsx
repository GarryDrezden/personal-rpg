import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatDateRu } from '../../utils/dates';
import type { MeasurementEntry } from '../../types';
import {
  getMeasurementMetricConfig,
  type MeasurementMetricKey,
} from '../../constants/measurementMetrics';
import { getMeasurementChartColor } from '../../constants/measurementChartColors';
import type { MeasurementsChartMode } from '../../types/measurementsChart';

type MeasurementsLineChartProps = {
  measurements: MeasurementEntry[];
  mode?: MeasurementsChartMode;
  metric?: MeasurementMetricKey;
  metrics?: MeasurementMetricKey[];
  dualAxisMetrics?: MeasurementMetricKey[];
  title?: string;
};

type ChartRow = {
  date: string;
  label: string;
  [key: string]: string | number | null | undefined;
};

function MultiMetricTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      data-testid="measurements-chart-tooltip"
      className="rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-sm shadow-lg"
    >
      <p className="mb-1 font-medium text-[var(--app-text)]">{label}</p>
      <ul className="space-y-0.5">
        {payload
          .filter((p) => p.value !== null && p.value !== undefined)
          .map((p) => {
            const config = getMeasurementMetricConfig(p.dataKey as MeasurementMetricKey);
            return (
              <li key={p.dataKey} className="flex items-center gap-2 text-[var(--app-text-muted)]">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span>
                  {config.label}:{' '}
                  <span className="font-semibold text-[var(--app-text)]">
                    {p.value} {config.unit}
                  </span>
                </span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

function SingleTooltip({
  active,
  payload,
  label,
  unit,
  metricLabel,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  unit: string;
  metricLabel: string;
}) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-[var(--app-text)]">{label}</p>
      <p className="text-[var(--app-text-muted)]">{metricLabel}</p>
      <p className="font-semibold text-[var(--app-primary)]">
        {payload[0].value} {unit}
      </p>
    </div>
  );
}

function ChartLegend({
  keys,
  dualAxis = false,
}: {
  keys: MeasurementMetricKey[];
  dualAxis?: boolean;
}) {
  return (
    <ul
      data-testid="measurements-chart-legend"
      className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[var(--app-text-muted)]"
    >
      {keys.map((key, index) => {
        const config = getMeasurementMetricConfig(key);
        const label = dualAxis
          ? key === 'weight'
            ? 'Вес, кг'
            : `${config.label}, см`
          : config.shortLabel;
        return (
          <li key={key} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: getMeasurementChartColor(index) }}
            />
            {label}
          </li>
        );
      })}
    </ul>
  );
}

function countRowsWithMetrics(
  measurements: MeasurementEntry[],
  metrics: MeasurementMetricKey[],
): number {
  return measurements.filter((m) =>
    metrics.some((key) => m[key] !== null && m[key] !== undefined),
  ).length;
}

function buildMultiMetricData(
  measurements: MeasurementEntry[],
  metrics: MeasurementMetricKey[],
): ChartRow[] {
  const sorted = [...measurements].sort((a, b) => a.date.localeCompare(b.date));
  const rows: ChartRow[] = [];

  for (const m of sorted) {
    const hasAny = metrics.some((key) => m[key] !== null && m[key] !== undefined);
    if (!hasAny) continue;

    const row: ChartRow = {
      date: m.date,
      label: formatDateRu(m.date, 'd MMM'),
    };
    for (const key of metrics) {
      row[key] = m[key] ?? null;
    }
    rows.push(row);
  }

  return rows;
}

function countDualAxisRows(
  measurements: MeasurementEntry[],
  bodyMetrics: MeasurementMetricKey[],
): number {
  return measurements.filter((m) => {
    if (m.weight === null || m.weight === undefined) return false;
    return bodyMetrics.some((key) => m[key] !== null && m[key] !== undefined);
  }).length;
}

export default function MeasurementsLineChart({
  measurements,
  mode = 'single',
  metric = 'weight',
  metrics = [],
  dualAxisMetrics = ['waist'],
  title,
}: MeasurementsLineChartProps) {
  if (mode === 'dualAxis') {
    const bodyMetrics = dualAxisMetrics.filter(
      (key) => getMeasurementMetricConfig(key).group === 'body',
    );
    const allKeys: MeasurementMetricKey[] = ['weight', ...bodyMetrics];
    const chartTitle = title ?? 'Вес + замеры';

    if (bodyMetrics.length < 1) {
      return (
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-8 text-center">
          <p className="text-sm text-[var(--app-text-muted)]">
            Выбери хотя бы один замер в сантиметрах.
          </p>
        </div>
      );
    }

    if (measurements.filter((m) => m.weight !== null).length < 2) {
      return (
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-8 text-center">
          <p className="text-sm text-[var(--app-text-muted)]">
            Для режима «Вес + замеры» нужны записи с весом.
          </p>
        </div>
      );
    }

    const data = buildMultiMetricData(measurements, allKeys);

    if (countDualAxisRows(measurements, bodyMetrics) < 2) {
      return (
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-8 text-center">
          <p className="text-sm text-[var(--app-text-muted)]">
            Пока мало данных для сравнения веса и замеров. Добавь минимум два замера с весом и
            выбранными метриками.
          </p>
        </div>
      );
    }

    return (
      <div data-testid="measurements-dual-axis-chart-inner">
        <h2 className="mb-4 font-semibold text-[var(--app-text)]">{chartTitle}</h2>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
              <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--app-text-muted)', fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="left"
                domain={['auto', 'auto']}
                tick={{ fill: 'var(--app-text-muted)', fontSize: 11 }}
                width={44}
                unit=" кг"
                label={{
                  value: 'Вес, кг',
                  angle: -90,
                  position: 'insideLeft',
                  fill: 'var(--app-text-muted)',
                  fontSize: 10,
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={['auto', 'auto']}
                tick={{ fill: 'var(--app-text-muted)', fontSize: 11 }}
                width={44}
                unit=" см"
                label={{
                  value: 'Замеры, см',
                  angle: 90,
                  position: 'insideRight',
                  fill: 'var(--app-text-muted)',
                  fontSize: 10,
                }}
              />
              <Tooltip content={<MultiMetricTooltip />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weight"
                name="weight"
                stroke={getMeasurementChartColor(0)}
                strokeWidth={2}
                dot={{ r: 2, fill: getMeasurementChartColor(0) }}
                connectNulls
              />
              {bodyMetrics.map((key, index) => (
                <Line
                  key={key}
                  yAxisId="right"
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={getMeasurementChartColor(index + 1)}
                  strokeWidth={2}
                  dot={{ r: 2, fill: getMeasurementChartColor(index + 1) }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <ChartLegend keys={allKeys} dualAxis />
      </div>
    );
  }

  if (mode === 'overlay') {
    const overlayMetrics = metrics.filter(
      (key) => getMeasurementMetricConfig(key).group === 'body',
    );

    if (overlayMetrics.length < 1) {
      return (
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-8 text-center">
          <p className="text-sm text-[var(--app-text-muted)]">
            Выбери хотя бы одну метрику для сравнения.
          </p>
        </div>
      );
    }

    const data = buildMultiMetricData(measurements, overlayMetrics);
    const chartTitle = title ?? 'Сравнение замеров';

    if (countRowsWithMetrics(measurements, overlayMetrics) < 2) {
      return (
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-8 text-center">
          <p className="text-sm text-[var(--app-text-muted)]">
            Пока мало данных для сравнения. Добавь минимум два замера по выбранным метрикам.
          </p>
        </div>
      );
    }

    return (
      <div>
        <h2 className="mb-4 font-semibold text-[var(--app-text)]">{chartTitle}</h2>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--app-text-muted)', fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: 'var(--app-text-muted)', fontSize: 11 }}
                width={40}
                unit=" см"
              />
              <Tooltip content={<MultiMetricTooltip />} />
              <Legend wrapperStyle={{ display: 'none' }} />
              {overlayMetrics.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={getMeasurementChartColor(index)}
                  strokeWidth={2}
                  dot={{ r: 2, fill: getMeasurementChartColor(index) }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <ChartLegend keys={overlayMetrics} />
      </div>
    );
  }

  const metricConfig = getMeasurementMetricConfig(metric);
  const data = measurements
    .filter((m) => m[metric] !== null && m[metric] !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => ({
      date: m.date,
      label: formatDateRu(m.date, 'd MMM'),
      value: m[metric]!,
    }));

  const chartTitle = title ?? `Динамика: ${metricConfig.label}`;

  if (data.length < 2) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-8 text-center">
        <p className="text-sm text-[var(--app-text-muted)]">
          Пока мало данных по этой метрике. Добавь минимум два замера.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 font-semibold text-[var(--app-text)]">{chartTitle}</h2>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--app-text-muted)', fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: 'var(--app-text-muted)', fontSize: 11 }}
              width={40}
            />
            <Tooltip
              content={
                <SingleTooltip unit={metricConfig.unit} metricLabel={metricConfig.label} />
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--app-primary)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'var(--app-primary)' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
