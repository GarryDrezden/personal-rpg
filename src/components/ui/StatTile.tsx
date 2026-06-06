interface StatTileProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function StatTile({ label, value, sub }: StatTileProps) {
  return (
    <div className="rounded-xl bg-white border border-rpg-border p-3 text-center">
      <div className="text-xs text-rpg-muted uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-xl font-bold text-stone-900">{value}</div>
      {sub && <div className="text-xs text-rpg-muted mt-0.5">{sub}</div>}
    </div>
  );
}
