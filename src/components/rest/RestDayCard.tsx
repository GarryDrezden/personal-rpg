import type { CognitiveBreakLevel, DailyEntry, SleepQuality } from '../../types';
import { ENERGY_LEVELS, shouldSuggestRecoveryMode, DAY_MODES } from '../../constants/energy';
import {
  COGNITIVE_BREAK_OPTIONS,
  REST_DAY_COPY,
  SLEEP_QUALITY_OPTIONS,
} from '../../constants/resourceRest';
import { getDailyResource } from '../../utils/resourceEngine';
import { CARD_ACCENT } from '../../constants/cardTheme';
import { Card } from '../ui/Card';

type RestDayCardProps = {
  entry: DailyEntry;
  onPatch: (partial: Partial<DailyEntry>) => void;
};

function toggleSleep(
  current: DailyEntry['sleepQuality'],
  next: SleepQuality,
): SleepQuality | null {
  const normalized =
    current === 'poor' || current === 'ok' || current === 'good' ? current : null;
  return normalized === next ? null : next;
}

export function RestDayCard({ entry, onPatch }: RestDayCardProps) {
  const resource = getDailyResource(entry);
  const suggestMode = shouldSuggestRecoveryMode(entry.energyLevel);
  const currentMode = entry.dayMode ?? 'normal';

  const sleepValue =
    entry.sleepQuality === 'poor' || entry.sleepQuality === 'ok' || entry.sleepQuality === 'good'
      ? entry.sleepQuality
      : null;

  return (
    <Card className={CARD_ACCENT.default} data-testid="rest-day-card">
      <h2 className="mb-1 text-lg font-semibold text-[var(--app-text)]">{REST_DAY_COPY.title}</h2>
      <p className="mb-1 text-sm text-[var(--app-text-muted)]">{REST_DAY_COPY.lead}</p>
      <p className="mb-4 text-xs text-[var(--app-text-muted)]">{REST_DAY_COPY.hint}</p>

      {resource.suggestion ? (
        <p
          className={`mb-4 rounded-xl border px-3 py-2 text-sm ${
            resource.level === 'low'
              ? 'border-amber-400/30 bg-amber-500/10 text-[var(--app-text)]'
              : resource.level === 'high'
                ? 'border-emerald-400/30 bg-emerald-500/10 text-[var(--app-text)]'
                : 'border-[var(--app-border)] bg-[var(--app-bg-soft)] text-[var(--app-text-muted)]'
          }`}
        >
          {resource.suggestion}
        </p>
      ) : null}

      <div className="space-y-5">
        <section>
          <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Сон</p>
          <div className="flex flex-wrap gap-2">
            {SLEEP_QUALITY_OPTIONS.map((opt) => {
              const selected = sleepValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onPatch({ sleepQuality: toggleSleep(entry.sleepQuality, opt.value) })}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                    selected
                      ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_12%,var(--app-card))] text-[var(--app-text)] ring-2 ring-[var(--app-primary)]/30'
                      : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text-muted)] hover:brightness-[1.03]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Разгрузка головы</p>
          <div className="flex flex-wrap gap-2">
            {COGNITIVE_BREAK_OPTIONS.map((opt) => {
              const selected = (entry.cognitiveBreaks ?? null) === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onPatch({
                      cognitiveBreaks: selected ? null : (opt.value as CognitiveBreakLevel),
                    })
                  }
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                    selected
                      ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_12%,var(--app-card))] text-[var(--app-text)] ring-2 ring-[var(--app-primary)]/30'
                      : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text-muted)] hover:brightness-[1.03]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Энергия</p>
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
                  className={`min-w-[2.5rem] rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                    selected
                      ? `${level.chipClass} ring-2 ring-[var(--app-primary)]/40`
                      : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text-muted)] hover:brightness-[1.03]'
                  }`}
                  title={level.label}
                >
                  {level.value}
                </button>
              );
            })}
          </div>
        </section>

        {suggestMode && currentMode === 'normal' ? (
          <section className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] p-3">
            <p className="mb-2 text-xs text-[var(--app-text-muted)]">
              Ресурс низкий — можно переключить режим без стыда:
            </p>
            <div className="flex flex-wrap gap-2">
              {DAY_MODES.filter((m) => m.value !== 'normal').map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => onPatch({ dayMode: mode.value })}
                  className="rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-1.5 text-xs font-medium text-[var(--app-text)] hover:border-[var(--app-primary)]/40"
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Card>
  );
}
