import type { DailyEntry, PhysicalActivityDuration, PhysicalActivityLevel } from '../../types';
import {
  PHYSICAL_ACTIVITY_DURATION_OPTIONS,
  PHYSICAL_ACTIVITY_LEVEL_OPTIONS,
  PHYSICAL_ACTIVITY_NOTE_PLACEHOLDER,
  PHYSICAL_ACTIVITY_XP,
} from '../../constants/physicalActivity';
import { getMovementCredit } from '../../utils/movementCreditEngine';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../ui/Card';
import type { AppSettings } from '../../types';

type PhysicalActivityDayCardProps = {
  entry: DailyEntry;
  settings: AppSettings;
  onPatch: (partial: Partial<DailyEntry>) => void;
};

const LEVEL_ACTIVE: Record<PhysicalActivityLevel, string> = {
  none: 'border-[var(--app-border)] bg-[var(--app-bg-soft)] text-[var(--app-text-muted)]',
  light:
    'border-emerald-400/45 bg-[color-mix(in_srgb,var(--app-success)_12%,var(--app-card))] text-[var(--app-success)]',
  medium:
    'border-amber-400/45 bg-[color-mix(in_srgb,var(--app-warning)_12%,var(--app-card))] text-[var(--app-text)]',
  heavy:
    'border-orange-700/45 bg-[color-mix(in_srgb,#7c2d12_16%,var(--app-card))] text-orange-200',
};

export function PhysicalActivityDayCard({
  entry,
  settings,
  onPatch,
}: PhysicalActivityDayCardProps) {
  const { isDarkFantasy } = useAppTheme();
  const level = entry.physicalActivityLevel ?? null;
  const showDetails = level === 'light' || level === 'medium' || level === 'heavy';
  const credit = getMovementCredit(entry, settings);
  const xpPreview =
    level === 'light'
      ? PHYSICAL_ACTIVITY_XP.light
      : level === 'medium'
        ? PHYSICAL_ACTIVITY_XP.medium
        : level === 'heavy'
          ? PHYSICAL_ACTIVITY_XP.heavy
          : 0;
  const xpBonus =
    showDetails && entry.physicalActivityDuration === '6h_plus'
      ? PHYSICAL_ACTIVITY_XP.duration6hPlus
      : 0;

  const selectLevel = (next: PhysicalActivityLevel) => {
    if (next === 'none') {
      onPatch({
        physicalActivityLevel: 'none',
        physicalActivityDuration: null,
        physicalActivityNote: null,
      });
      return;
    }
    onPatch({
      physicalActivityLevel: next,
      physicalActivityDuration: entry.physicalActivityDuration ?? null,
    });
  };

  return (
    <Card
      data-testid="physical-activity-day-card"
      className={
        isDarkFantasy
          ? 'border-[color-mix(in_srgb,var(--app-primary)_25%,var(--app-border))]'
          : ''
      }
    >
      <h2 className="text-base font-semibold text-[var(--app-text)]">Физическая активность</h2>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">
        Если шагов мало, но тело сегодня работало — отметь это здесь.
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {PHYSICAL_ACTIVITY_LEVEL_OPTIONS.map((opt) => {
          const active = level === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => selectLevel(opt.value)}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                active
                  ? LEVEL_ACTIVE[opt.value]
                  : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text)] hover:brightness-[1.03]'
              }`}
            >
              <p className="text-sm font-semibold">{opt.label}</p>
              <p className="mt-1 text-xs opacity-85">{opt.hint}</p>
            </button>
          );
        })}
      </div>

      {showDetails ? (
        <div className="mt-4 space-y-3">
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Длительность</p>
            <div className="flex flex-wrap gap-2">
              {PHYSICAL_ACTIVITY_DURATION_OPTIONS.map((opt) => {
                const active = entry.physicalActivityDuration === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      onPatch({
                        physicalActivityDuration: active
                          ? null
                          : (opt.value as PhysicalActivityDuration),
                      })
                    }
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      active
                        ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)] text-[var(--app-primary)]'
                        : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text)] hover:brightness-[1.03]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--app-text)]">
              Комментарий <span className="font-normal text-[var(--app-text-muted)]">(необязательно)</span>
            </span>
            <input
              type="text"
              value={entry.physicalActivityNote ?? ''}
              onChange={(e) => onPatch({ physicalActivityNote: e.target.value || null })}
              placeholder={PHYSICAL_ACTIVITY_NOTE_PLACEHOLDER}
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2.5 text-sm text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]"
            />
          </label>
        </div>
      ) : null}

      {showDetails && credit.holdsMinimumMovement ? (
        <p className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-[var(--app-success)]">
          {credit.label}
        </p>
      ) : null}

      {showDetails && xpPreview > 0 ? (
        <p className="mt-2 text-xs text-[var(--app-text-muted)]">
          Опыт за физическую активность: +{xpPreview + xpBonus} XP (Тело)
        </p>
      ) : null}

      {showDetails && credit.suggestion ? (
        <p className="mt-2 text-xs text-[var(--app-text-muted)]">{credit.suggestion}</p>
      ) : null}
    </Card>
  );
}
