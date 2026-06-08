import { SURFACE_INSET } from '../../constants/cardTheme';

type ReportMetricProps = {
  icon: string;
  label: string;
  value: string;
  sub?: string;
};

export function ReportMetric({ icon, label, value, sub }: ReportMetricProps) {
  return (
    <div className={`${SURFACE_INSET} px-3 py-3`}>
      <div className="flex items-start gap-2">
        <span className="text-lg leading-none">{icon}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            {label}
          </p>
          <p className="mt-1 text-lg font-bold text-[var(--app-text)]">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
