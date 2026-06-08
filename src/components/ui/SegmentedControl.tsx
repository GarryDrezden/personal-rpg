interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T | null;
  options: Option<T>[];
  onChange: (v: T) => void;
  getVariant?: (v: T) => 'success' | 'danger' | 'neutral';
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  getVariant,
}: SegmentedControlProps<T>) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-[var(--app-text)]">{label}</span>
      <div className="flex flex-col gap-2 sm:flex-row">
        {options.map((opt) => {
          const selected = value === opt.value;
          const variant = getVariant?.(opt.value) ?? 'neutral';
          const selectedColors = {
            success:
              'border-[var(--app-success)] bg-[color-mix(in_srgb,var(--app-success)_18%,var(--app-card-strong))] text-[var(--app-success)]',
            danger:
              'border-[var(--app-danger)] bg-[color-mix(in_srgb,var(--app-danger)_18%,var(--app-card-strong))] text-[var(--app-danger)]',
            neutral:
              'border-[var(--app-primary)] bg-[var(--app-primary-soft)] text-[var(--app-primary)]',
          };
          const idleColor =
            'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text)] hover:brightness-[1.04]';
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`min-h-12 flex-1 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors ${
                selected ? selectedColors[variant] : idleColor
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
