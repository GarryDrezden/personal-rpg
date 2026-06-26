import type { DailyEntry, EnergyLevel } from '../../types';
import { CARD_ACCENT } from '../../constants/cardTheme';
import { Card } from '../ui/Card';
import { NumberInput } from '../ui/NumberInput';

const SLEEP_QUALITY: { value: EnergyLevel; label: string }[] = [
  { value: 1, label: 'Очень плохо' },
  { value: 2, label: 'Плохо' },
  { value: 3, label: 'Нормально' },
  { value: 4, label: 'Хорошо' },
  { value: 5, label: 'Отлично' },
];

type SleepDayCardProps = {
  entry: DailyEntry;
  onPatch: (partial: Partial<DailyEntry>) => void;
};

export function SleepDayCard({ entry, onPatch }: SleepDayCardProps) {
  return (
    <Card className={CARD_ACCENT.default} data-testid="sleep-day-card">
      <h2 className="mb-1 text-lg font-semibold text-[var(--app-text)]">Сон</h2>
      <p className="mb-4 text-sm text-[var(--app-text-muted)]">
        Сон — дополнительный фактор инерции. Если не заполнишь, день не считается хуже. Можно
        оставить пустым.
      </p>

      <div className="space-y-4">
        <NumberInput
          label="Часов сна"
          value={entry.sleepHours ?? null}
          onChange={(v) => onPatch({ sleepHours: v })}
          min={0}
          max={16}
          step={0.5}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Качество сна</p>
          <div className="flex flex-wrap gap-2">
            {SLEEP_QUALITY.map((q) => {
              const selected = entry.sleepQuality === q.value;
              return (
                <button
                  key={q.value}
                  type="button"
                  onClick={() =>
                    onPatch({
                      sleepQuality: selected ? null : q.value,
                    })
                  }
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                    selected
                      ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_12%,var(--app-card))] text-[var(--app-text)] ring-2 ring-[var(--app-primary)]/30'
                      : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text-muted)] hover:brightness-[1.03]'
                  }`}
                >
                  {q.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
