interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'gold' | 'success' | 'danger';
}

const colors = {
  gold: 'bg-gold',
  success: 'bg-success',
  danger: 'bg-danger',
};

export function ProgressBar({ value, max = 100, className = '', color = 'gold' }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-stone-200 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${colors[color]}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
