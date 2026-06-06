interface NumberInputProps {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
}

export function NumberInput({ label, value, onChange, placeholder }: NumberInputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-stone-700">{label}</span>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? null : Number(v));
        }}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-xl border border-rpg-border bg-white px-4 text-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
    </label>
  );
}
