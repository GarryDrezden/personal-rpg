import { useMemo, useState } from 'react';
import type {
  BodyAbilityBaselineEasy,
  BodyAbilityHiddenTopic,
  BodyAbilityInterest,
  BodyAbilityProfile,
  BodyPathType,
} from '../../types/bodyAbilityPersonal';
import {
  BODY_BASELINE_LABELS,
  BODY_HIDDEN_TOPIC_LABELS,
  BODY_INTEREST_LABELS,
  BODY_PATH_TYPE_LABELS,
  goalKgToBand,
} from '../../constants/bodyAbilityBank';

type BodyAbilityProfileSetupProps = {
  initial?: BodyAbilityProfile | null;
  initialGoalKg?: number | null;
  onComplete: (profile: BodyAbilityProfile) => void;
  onCancel?: () => void;
};

const PATH_OPTIONS = Object.keys(BODY_PATH_TYPE_LABELS) as BodyPathType[];
const INTEREST_OPTIONS = Object.keys(BODY_INTEREST_LABELS) as BodyAbilityInterest[];
const BASELINE_OPTIONS = Object.keys(BODY_BASELINE_LABELS) as BodyAbilityBaselineEasy[];
const HIDDEN_OPTIONS = Object.keys(BODY_HIDDEN_TOPIC_LABELS) as BodyAbilityHiddenTopic[];

function toggleIn<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-left text-sm transition ${
        active
          ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)] font-medium text-[var(--app-text)]'
          : 'border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)] hover:border-[var(--app-primary)]/50'
      }`}
    >
      {label}
    </button>
  );
}

export function BodyAbilityProfileSetup({
  initial,
  initialGoalKg,
  onComplete,
  onCancel,
}: BodyAbilityProfileSetupProps) {
  const [step, setStep] = useState(0);
  const [goalKg, setGoalKg] = useState<number>(
    initial?.goalKg ?? initialGoalKg ?? 15,
  );
  const [pathTypes, setPathTypes] = useState<BodyPathType[]>(
    initial?.pathTypes ?? ['control_return'],
  );
  const [interests, setInterests] = useState<BodyAbilityInterest[]>(
    initial?.interests ?? ['endurance', 'nutrition_control'],
  );
  const [baselineEasy, setBaselineEasy] = useState<BodyAbilityBaselineEasy[]>(
    initial?.baselineEasy ?? [],
  );
  const [hiddenTopics, setHiddenTopics] = useState<BodyAbilityHiddenTopic[]>(
    initial?.hiddenTopics ?? [],
  );

  const band = useMemo(() => goalKgToBand(goalKg), [goalKg]);

  const finish = () => {
    onComplete({
      goalKg,
      goalBand: band,
      pathTypes: pathTypes.length ? pathTypes : ['control_return'],
      interests: interests.length ? interests : ['confidence'],
      baselineEasy,
      hiddenTopics,
      configuredAt: new Date().toISOString(),
    });
  };

  return (
    <section
      data-testid="body-ability-profile-setup"
      className="space-y-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4 sm:p-5"
    >
      <header className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-gold)]">
          Карта тела · шаг {step + 1} из 5
        </p>
        <h2 className="text-xl font-bold text-[var(--app-text)]">Настрой карту способностей</h2>
        <p className="text-sm text-[var(--app-text-muted)]">
          Это нужно, чтобы карта была твоей, а не универсальной. Без стыда — всё можно изменить
          позже.
        </p>
      </header>

      {step === 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--app-text)]">
            На сколько кг хочешь похудеть?
          </p>
          <input
            type="number"
            min={1}
            max={200}
            value={goalKg}
            onChange={(e) => setGoalKg(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-3 py-2 text-base text-[var(--app-text)]"
            data-testid="body-ability-goal-kg"
          />
          <p className="text-xs text-[var(--app-text-muted)]">
            Диапазон цели: <span className="font-semibold text-[var(--app-text)]">{band}</span>
          </p>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--app-text)]">Какой тип пути тебе ближе?</p>
          <div className="flex flex-wrap gap-2">
            {PATH_OPTIONS.map((id) => (
              <Chip
                key={id}
                active={pathTypes.includes(id)}
                label={BODY_PATH_TYPE_LABELS[id]}
                onClick={() => setPathTypes((prev) => toggleIn(prev, id))}
              />
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--app-text)]">
            Какие изменения тебе реально интересны?
          </p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((id) => (
              <Chip
                key={id}
                active={interests.includes(id)}
                label={BODY_INTEREST_LABELS[id]}
                onClick={() => setInterests((prev) => toggleIn(prev, id))}
              />
            ))}
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--app-text)]">
            Что уже сейчас даётся нормально?
          </p>
          <p className="text-xs text-[var(--app-text-muted)]">
            Отмеченное не попадёт в карту как «достижение с нуля» — останутся более релевантные
            шаги.
          </p>
          <div className="flex flex-wrap gap-2">
            {BASELINE_OPTIONS.map((id) => (
              <Chip
                key={id}
                active={baselineEasy.includes(id)}
                label={BODY_BASELINE_LABELS[id]}
                onClick={() => setBaselineEasy((prev) => toggleIn(prev, id))}
              />
            ))}
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--app-text)]">Какие темы не показывать?</p>
          <div className="flex flex-wrap gap-2">
            {HIDDEN_OPTIONS.map((id) => (
              <Chip
                key={id}
                active={hiddenTopics.includes(id)}
                label={BODY_HIDDEN_TOPIC_LABELS[id]}
                onClick={() => setHiddenTopics((prev) => toggleIn(prev, id))}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex gap-2">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[var(--app-border)] px-3 py-2 text-sm text-[var(--app-text-muted)]"
            >
              Позже
            </button>
          ) : null}
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-xl border border-[var(--app-border)] px-3 py-2 text-sm text-[var(--app-text)]"
            >
              Назад
            </button>
          ) : null}
        </div>
        {step < 4 ? (
          <button
            type="button"
            data-testid="body-ability-setup-next"
            onClick={() => setStep((s) => s + 1)}
            className="rounded-xl bg-[var(--app-primary)] px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Дальше
          </button>
        ) : (
          <button
            type="button"
            data-testid="body-ability-setup-finish"
            onClick={finish}
            className="rounded-xl bg-[var(--app-primary)] px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Собрать карту
          </button>
        )}
      </div>
    </section>
  );
}
