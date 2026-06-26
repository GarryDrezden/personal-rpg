import type { StepsBarColor } from '../../utils/stepsEngine';
import { ProgressBar } from '../ui/ProgressBar';

const COLOR_MAP: Record<StepsBarColor, 'success' | 'gold' | 'danger' | undefined> = {
  muted: undefined,
  rose: 'danger',
  amber: 'gold',
  emerald: 'success',
  gold: 'gold',
};

type StepsProgressBarProps = {
  value: number;
  color: StepsBarColor;
  className?: string;
  markers?: { percent: number; label: string }[];
};

export function StepsProgressBar({
  value,
  color,
  className = 'h-2.5',
  markers,
}: StepsProgressBarProps) {
  return (
    <div className="space-y-1">
      <ProgressBar value={value} color={COLOR_MAP[color]} className={className} />
      {markers && markers.length > 0 && (
        <div className="relative h-4 text-[10px] text-[var(--app-text-muted)]">
          {markers.map((m) => (
            <span
              key={m.label}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${Math.min(98, Math.max(2, m.percent))}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
