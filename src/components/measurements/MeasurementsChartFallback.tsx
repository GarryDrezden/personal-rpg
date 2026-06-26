import { Card } from '../ui/Card';

type MeasurementsChartFallbackProps = {
  title?: string;
};

export function MeasurementsChartFallback({
  title = 'График',
}: MeasurementsChartFallbackProps) {
  return (
    <Card>
      {title && <h2 className="mb-4 font-semibold text-[var(--app-text)]">{title}</h2>}
      <div className="flex h-48 items-center justify-center rounded-xl bg-[var(--app-bg-soft)]">
        <p className="text-sm text-[var(--app-text-muted)]">Загрузка графика…</p>
      </div>
    </Card>
  );
}
