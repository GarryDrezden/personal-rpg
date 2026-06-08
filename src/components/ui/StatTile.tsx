interface StatTileProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function StatTile({ label, value, sub }: StatTileProps) {
  return (
    <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] p-3 text-center backdrop-blur-sm">
      <div className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">{label}</div>
      <div className="mt-1 text-xl font-bold text-[var(--app-text)]">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-[var(--app-text-muted)]">{sub}</div>}
    </div>
  );
}
