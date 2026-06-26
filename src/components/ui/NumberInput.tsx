interface NumberInputProps {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  min,
  max,
  step,
}: NumberInputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[var(--app-text)]">{label}</span>
      <input
        type="number"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? null : Number(v));
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-12 w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-4 text-lg text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-primary)_30%,transparent)] disabled:opacity-60"
      />
    </label>
  );
}
