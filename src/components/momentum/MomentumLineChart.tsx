import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import type { MomentumTrendSummary } from '../../types/momentum';
import { formatDateRu } from '../../utils/dates';

type MomentumLineChartProps = {
  summary: MomentumTrendSummary;
  partialRange?: boolean;
};

type ChartRow = {
  date: string;
  label: string;
  value: number;
  delta: number;
};

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartRow }[];
}) {
  if (!active || !payload?.[0]) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-[var(--app-text)]">{row.label}</p>
      <p className="text-[var(--app-primary)]">
        Инерция: {row.value > 0 ? '+' : ''}
        {row.value}
      </p>
      <p className="text-[var(--app-text-muted)]">
        Δ дня: {row.delta > 0 ? '+' : ''}
        {row.delta}
      </p>
    </div>
  );
}

export default function MomentumLineChart({ summary, partialRange }: MomentumLineChartProps) {
  const data: ChartRow[] = summary.points.map((p) => ({
    date: p.date,
    label: formatDateRu(p.date, 'd MMM'),
    value: p.value,
    delta: p.delta,
  }));

  return (
    <div>
      {partialRange && (
        <p className="mb-3 text-xs text-[var(--app-text-muted)]">
          Данных меньше выбранного диапазона. Показываем всю доступную историю.
        </p>
      )}
      <p className="mb-3 text-xs text-[var(--app-text-muted)]">
        Средняя: {summary.averageValue > 0 ? '+' : ''}
        {summary.averageValue} · Δ {summary.totalDelta > 0 ? '+' : ''}
        {summary.totalDelta}
      </p>
      <div className="h-52 w-full sm:h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--app-text-muted)', fontSize: 10 }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              domain={[-100, 100]}
              tick={{ fill: 'var(--app-text-muted)', fontSize: 10 }}
              width={36}
            />
            <ReferenceLine y={0} stroke="var(--app-border)" strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} />
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
