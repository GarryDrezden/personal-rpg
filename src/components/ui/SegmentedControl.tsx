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
      <span className="mb-2 block text-sm font-medium text-stone-700">{label}</span>
      <div className="flex flex-col gap-2 sm:flex-row">
        {options.map((opt) => {
          const selected = value === opt.value;
          const variant = getVariant?.(opt.value) ?? 'neutral';
          const colors = {
            success: selected ? 'border-success bg-green-50 text-green-900' : 'border-rpg-border bg-white',
            danger: selected ? 'border-danger bg-red-50 text-red-900' : 'border-rpg-border bg-white',
            neutral: selected ? 'border-gold bg-amber-50 text-amber-900' : 'border-rpg-border bg-white',
          };
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`min-h-12 flex-1 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors ${colors[variant]}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
