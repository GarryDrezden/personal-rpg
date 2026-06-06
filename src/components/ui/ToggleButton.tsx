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
          ? 'border-success bg-green-50 text-green-900'
          : 'border-rpg-border bg-white text-stone-600 hover:bg-stone-50'
      }`}
    >
      {checked ? '✓ ' : ''}{label}
    </button>
  );
}
