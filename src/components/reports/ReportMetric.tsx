type ReportMetricProps = {
  label: string;
  value: string;
  sub?: string;
  icon?: string;
};

export function ReportMetric({ label, value, sub, icon }: ReportMetricProps) {
  return (
    <div className="rounded-xl border border-rpg-border bg-white/80 px-3 py-3">
      <div className="flex items-start gap-2">
        {icon && <span className="text-lg leading-none">{icon}</span>}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-rpg-muted">
            {label}
          </p>
          <p className="mt-1 text-lg font-bold text-stone-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-rpg-muted">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
