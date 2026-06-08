interface ToggleButtonProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function ToggleButton({ label, checked, onChange }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`min-h-12 w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition-colors ${
        checked
          ? 'border-[var(--app-success)] bg-[color-mix(in_srgb,var(--app-success)_18%,var(--app-card-strong))] text-[var(--app-success)]'
          : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text)] hover:brightness-[1.04]'
      }`}
    >
      {checked ? '✓ ' : ''}
      {label}
    </button>
  );
}
