import type { DailyEntry, DayMode, EnergyLevel } from '../../types';
import {
  DAY_MODES,
  ENERGY_LEVELS,
  shouldSuggestRecoveryMode,
} from '../../constants/energy';
import { CARD_ACCENT } from '../../constants/cardTheme';
import { Card } from '../ui/Card';

type EnergyDayCardProps = {
  entry: DailyEntry;
  onPatch: (partial: Partial<DailyEntry>) => void;
};

export function EnergyDayCard({ entry, onPatch }: EnergyDayCardProps) {
  const suggestMode = shouldSuggestRecoveryMode(entry.energyLevel);
  const currentMode = entry.dayMode ?? 'normal';

  return (
    <Card className={CARD_ACCENT.default}>
      <h2 className="mb-1 text-lg font-semibold text-[var(--app-text)]">Ресурс дня</h2>
      <p className="mb-4 text-sm text-[var(--app-text-muted)]">
        Как ты себя чувствуешь? Это не отменяет режим — только подсказывает темп.
      </p>

      <div className="flex flex-wrap gap-2">
        {ENERGY_LEVELS.map((level) => {
          const selected = entry.energyLevel === level.value;
          return (
            <button
              key={level.value}
              type="button"
              onClick={() =>
                onPatch({
                  energyLevel: selected ? null : level.value,
                })
              }
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                selected
                  ? `${level.chipClass} ring-2 ring-[var(--app-primary)]/40`
                  : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text-muted)] hover:brightness-[1.03]'
              }`}
            >
              <span className="mr-1">{level.emoji}</span>
              {level.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t border-[var(--app-border)] pt-5">
        <h3 className="mb-1 font-semibold text-[var(--app-text)]">Режим дня</h3>
        {suggestMode && currentMode === 'normal' && (
          <p className="mb-3 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-[var(--app-text)]">
            Низкий ресурс — можно выбрать «Восстановление» или «Минимальный» режим. Решение за тобой.
          </p>
        )}
        <div className="grid gap-2 sm:grid-cols-3">
          {DAY_MODES.map((mode) => {
            const selected = currentMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => onPatch({ dayMode: mode.value as DayMode })}
                className={`rounded-xl border px-3 py-3 text-left transition-all ${
                  selected
                    ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)] ring-1 ring-[var(--app-primary)]/30'
                    : 'border-[var(--app-border)] bg-[var(--app-card-strong)] hover:brightness-[1.03]'
                }`}
              >
                <p className="font-semibold text-[var(--app-text)]">{mode.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--app-text-muted)]">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

type EnergyDaySummaryProps = {
  energyLevel?: EnergyLevel | null;
  dayMode?: DayMode;
};

export function EnergyDaySummary({ energyLevel, dayMode }: EnergyDaySummaryProps) {
  const energy = ENERGY_LEVELS.find((e) => e.value === energyLevel);
  const mode = DAY_MODES.find((m) => m.value === (dayMode ?? 'normal'));

  return (
    <Card className="h-full border border-[var(--app-border)] bg-[var(--app-card)]">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
        Ресурс дня
      </h2>
      <div className="space-y-2 text-sm">
        <p className="text-[var(--app-text)]">
          {energy ? (
            <>
              <span className="mr-1">{energy.emoji}</span>
              {energy.label}
            </>
          ) : (
            <span className="text-[var(--app-text-muted)]">Не отмечен</span>
          )}
        </p>
        <p className="text-[var(--app-text-muted)]">
          Режим: <strong className="text-[var(--app-text)]">{mode?.label ?? 'Обычный'}</strong>
        </p>
      </div>
    </Card>
  );
}
