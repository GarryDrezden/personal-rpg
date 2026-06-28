import { Link } from 'react-router-dom';
import type { AppSettings, DailyEntry } from '../../types';
import type { NutritionLevel } from '../../types/nutrition';
import {
  getEffectiveCalorieLimit,
  getNutritionStatus,
  getNutritionStatusLabel,
  getTrackingMode,
} from '../../utils/nutritionEngine';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../ui/Card';
import { NumberInput } from '../ui/NumberInput';

type NutritionDayCardProps = {
  entry: DailyEntry;
  settings: AppSettings;
  date: string;
  onPatch: (partial: Partial<DailyEntry>) => void;
};

const SIMPLE_OPTIONS: {
  level: NutritionLevel;
  title: string;
  hint: string;
  activeClass: string;
}[] = [
  {
    level: 'light',
    title: 'Лёгкий день',
    hint: 'Ел в рамках, без сильного перебора',
    activeClass:
      'border-emerald-400/50 bg-[color-mix(in_srgb,var(--app-success)_14%,var(--app-card))] text-[var(--app-success)]',
  },
  {
    level: 'medium',
    title: 'Средний день',
    hint: 'Были лишние калории, но день удержан',
    activeClass:
      'border-amber-400/45 bg-[color-mix(in_srgb,var(--app-warning)_12%,var(--app-card))] text-[var(--app-text)]',
  },
  {
    level: 'heavy',
    title: 'Тяжёлый день',
    hint: 'Был большой перебор или хаос питания',
    activeClass:
      'border-orange-700/45 bg-[color-mix(in_srgb,#7c2d12_18%,var(--app-card))] text-orange-200',
  },
];

export function NutritionDayCard({ entry, settings, date, onPatch }: NutritionDayCardProps) {
  const { isDarkFantasy } = useAppTheme();
  const mode = getTrackingMode(settings);

  if (mode === 'disabled') return null;

  const status = getNutritionStatus({ entry, settings });
  const limit = getEffectiveCalorieLimit(settings, date);

  return (
    <Card
      data-testid="nutrition-day-card"
      className={
        isDarkFantasy
          ? 'border-[color-mix(in_srgb,var(--app-primary)_25%,var(--app-border))]'
          : ''
      }
    >
      <h2 className="text-base font-semibold text-[var(--app-text)]">Питание сегодня</h2>

      {mode === 'simple' ? (
        <>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Можно без цифр. Просто отметь день честно.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {SIMPLE_OPTIONS.map((opt) => {
              const active = entry.nutritionLevel === opt.level;
              return (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() =>
                    onPatch({
                      nutritionLevel: opt.level,
                      calories: null,
                    })
                  }
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    active
                      ? opt.activeClass
                      : 'border-[var(--app-border)] bg-[var(--app-card-strong)] text-[var(--app-text)] hover:brightness-[1.03]'
                  }`}
                >
                  <p className="text-sm font-semibold">{opt.title}</p>
                  <p className="mt-1 text-xs opacity-85">{opt.hint}</p>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Внеси калории. Система оценит день мягко, без наказаний.
          </p>
          <div className="mt-3 space-y-3">
            {limit ? (
              <NumberInput
                label={`Съедено калорий (лимит ${limit} ккал)`}
                value={entry.calories}
                onChange={(v) =>
                  onPatch({
                    calories: v,
                    nutritionLevel: null,
                  })
                }
              />
            ) : (
              <p className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-3 py-2 text-sm text-[var(--app-text-muted)]">
                Задай лимит в настройках, чтобы система могла оценить день.
              </p>
            )}
            {entry.calories !== null && entry.calories !== undefined ? (
              <p className="text-sm font-medium text-[var(--app-primary)]">
                Статус: {getNutritionStatusLabel(status)}
              </p>
            ) : null}
            <Link
              to="/settings#settings-nutrition"
              className="inline-block text-xs font-medium text-[var(--app-primary)] hover:underline"
            >
              Изменить лимит в настройках →
            </Link>
          </div>
        </>
      )}
    </Card>
  );
}
