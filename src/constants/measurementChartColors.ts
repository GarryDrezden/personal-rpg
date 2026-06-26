/** Recharts stroke colors — CSS variables defined in index.css */
export const MEASUREMENT_CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const;

export function getMeasurementChartColor(index: number): string {
  return MEASUREMENT_CHART_COLORS[index % MEASUREMENT_CHART_COLORS.length]!;
}
