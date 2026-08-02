import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import {
  BODY_DIFFICULTY_LABELS,
  BODY_INTEREST_LABELS,
  BODY_PATH_TYPE_LABELS,
  BODY_UNLOCK_MODE_LABELS,
} from '../../constants/bodyAbilityBank';
import { getThemedBodyAbilityPresentation } from '../../game/bodyAbilityThemePresentation';
import {
  applyBodyAbilityProfile,
  getPersonalAbilityItems,
  getPersonalBodyAbilitiesState,
  getPersonalBodyAbilitySummary,
  isBodyAbilityProfileConfigured,
  manuallyUnlockPersonalAbility,
  respondToSuggestedAbility,
  syncPersonalBodyAbilityProgress,
} from '../../utils/bodyAbilityPersonalEngine';
import { resolveTargetWeight } from '../../game/gameProfile';
import { getStartWeight } from '../../game/heroProgressEngine';
import { BodyAbilityProfileSetup } from './BodyAbilityProfileSetup';
import type { BodyAbilityProfile } from '../../types/bodyAbilityPersonal';

type BodyAbilityPersonalGridProps = {
  embedded?: boolean;
};

const STATUS_LABEL: Record<string, string> = {
  locked: 'Закрыто',
  suggested: 'Проверь себя',
  unlocked: 'Открыто',
  hidden: 'Скрыто',
};

export function BodyAbilityPersonalGrid({ embedded = false }: BodyAbilityPersonalGridProps) {
  const { settings, dailyEntries, measurements, saveSettings } = useAppStore();
  const { themeId, isCozy } = useAppTheme();
  const [setupOpen, setSetupOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const configured = isBodyAbilityProfileConfigured(settings);
  const personal = getPersonalBodyAbilitiesState(settings);
  const summary = useMemo(() => getPersonalBodyAbilitySummary(settings), [settings]);

  useEffect(() => {
    if (!configured) return;
    const next = syncPersonalBodyAbilityProgress({
      settings,
      dailyEntries,
      measurements,
    });
    if (next !== settings) {
      void saveSettings(next);
    }
    // Only re-sync when underlying data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional data-driven sync
  }, [configured, dailyEntries, measurements, settings.bodyAbilityState?.personal?.generatedAt]);

  const items = useMemo(
    () => getPersonalAbilityItems(settings).filter((i) => i.user.status !== 'hidden'),
    [settings],
  );

  const suggested = items.filter((i) => i.user.status === 'suggested');

  const startWeight = getStartWeight(measurements);
  const target = resolveTargetWeight(settings);
  const inferredGoalKg =
    startWeight != null && target != null && startWeight > target
      ? Math.round(startWeight - target)
      : personal.profile?.goalKg ?? null;

  const saveProfile = async (profile: BodyAbilityProfile) => {
    const next = applyBodyAbilityProfile(settings, profile);
    await saveSettings(next);
    setSetupOpen(false);
  };

  const ensureSynced = async () => {
    const next = syncPersonalBodyAbilityProgress({
      settings,
      dailyEntries,
      measurements,
    });
    if (next !== settings) await saveSettings(next);
    return next;
  };

  const onSuggestResponse = async (
    abilityId: string,
    response: 'yes' | 'not_yet' | 'irrelevant',
  ) => {
    setBusyId(abilityId);
    try {
      const base = await ensureSynced();
      await saveSettings(respondToSuggestedAbility(base, abilityId, response));
    } finally {
      setBusyId(null);
    }
  };

  const onManualUnlock = async (abilityId: string) => {
    setBusyId(abilityId);
    try {
      const base = await ensureSynced();
      await saveSettings(manuallyUnlockPersonalAbility(base, abilityId));
    } finally {
      setBusyId(null);
    }
  };

  if (!configured || setupOpen) {
    return (
      <div className="space-y-4" data-testid="body-ability-personal-root">
        {!configured ? (
          <p className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-3 text-sm text-[var(--app-text-muted)]">
            Настрой карту тела, чтобы игра показывала подходящие именно тебе изменения.
          </p>
        ) : null}
        <BodyAbilityProfileSetup
          initial={personal.profile}
          initialGoalKg={inferredGoalKg}
          onComplete={(p) => void saveProfile(p)}
          onCancel={configured ? () => setSetupOpen(false) : undefined}
        />
      </div>
    );
  }

  const profile = personal.profile!;

  return (
    <div className="space-y-6" data-testid="body-ability-personal-root">
      <header className={`space-y-2${embedded ? '' : ''}`}>
        {!embedded ? (
          <>
            <h2 className="text-xl font-bold text-[var(--app-text)]">Свобода тела</h2>
            <p className="max-w-2xl text-sm text-[var(--app-text-muted)]">
              Вес может стоять, но тело всё равно может возвращать возможности.
            </p>
          </>
        ) : (
          <h2 className="text-lg font-semibold text-[var(--app-text)]">Персональная карта тела</h2>
        )}
      </header>

      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
              Профиль карты
            </p>
            <p className="text-sm text-[var(--app-text)]">
              Цель: −{profile.goalKg ?? '?'} кг · {profile.goalBand}
            </p>
            <p className="text-xs text-[var(--app-text-muted)]">
              Путь:{' '}
              {profile.pathTypes.map((p) => BODY_PATH_TYPE_LABELS[p]).join(', ') || '—'}
            </p>
            <p className="text-xs text-[var(--app-text-muted)]">
              Интересы:{' '}
              {profile.interests
                .slice(0, 4)
                .map((i) => BODY_INTEREST_LABELS[i])
                .join(', ')}
              {profile.interests.length > 4 ? '…' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSetupOpen(true)}
            className="rounded-xl border border-[var(--app-border)] px-3 py-2 text-xs font-semibold text-[var(--app-primary)]"
            data-testid="body-ability-reconfigure"
          >
            Настроить карту
          </button>
        </div>
        <p className="mt-3 text-sm font-medium text-[var(--app-text)]">
          Открыто {summary.unlockedCount} / {summary.selectedCount}
        </p>
        <p className="mt-1 text-xs text-[var(--app-text-muted)]">{summary.progressLine}</p>
      </section>

      {suggested.length > 0 ? (
        <section className="space-y-3" data-testid="body-ability-suggested">
          <h3 className="text-sm font-semibold text-[var(--app-text)]">Кажется, это могло измениться</h3>
          {suggested.map(({ definition, user }) => {
            const presentation = getThemedBodyAbilityPresentation(
              themeId,
              definition.id,
              definition,
            );
            return (
              <div
                key={definition.id}
                className="rounded-xl border border-[var(--app-primary)]/30 bg-[var(--app-primary-soft)]/25 p-3"
              >
                <p className="text-sm font-semibold text-[var(--app-text)]">
                  {presentation.icon} {presentation.title}
                </p>
                <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                  {presentation.description}
                </p>
                <p className="mt-1 text-xs italic text-[var(--app-text-muted)]">
                  {presentation.flavor}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busyId === definition.id}
                    onClick={() => void onSuggestResponse(definition.id, 'yes')}
                    className="rounded-lg bg-[var(--app-primary)] px-3 py-1.5 text-xs font-semibold text-slate-950"
                  >
                    Да, стало легче
                  </button>
                  <button
                    type="button"
                    disabled={busyId === definition.id}
                    onClick={() => void onSuggestResponse(definition.id, 'not_yet')}
                    className="rounded-lg border border-[var(--app-border)] px-3 py-1.5 text-xs text-[var(--app-text)]"
                  >
                    Пока нет
                  </button>
                  <button
                    type="button"
                    disabled={busyId === definition.id}
                    onClick={() => void onSuggestResponse(definition.id, 'irrelevant')}
                    className="rounded-lg border border-[var(--app-border)] px-3 py-1.5 text-xs text-[var(--app-text-muted)]"
                  >
                    Неактуально
                  </button>
                </div>
                {user.suggestedAt ? (
                  <p className="mt-2 text-[10px] text-[var(--app-text-muted)]">Предложено системой</p>
                ) : null}
              </div>
            );
          })}
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--app-text)]">Твоя сетка</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map(({ definition, user }) => {
            const presentation = getThemedBodyAbilityPresentation(
              themeId,
              definition.id,
              definition,
            );
            const canManual =
              definition.unlockMode !== 'auto' &&
              (user.status === 'locked' || user.status === 'suggested');

            return (
              <article
                key={definition.id}
                data-testid={`body-ability-card-${definition.id}`}
                className={`rounded-xl border p-3 ${
                  user.status === 'unlocked'
                    ? isCozy
                      ? 'border-[var(--app-garden)]/40 bg-[var(--app-card)]'
                      : 'border-emerald-500/30 bg-[var(--app-card)]'
                    : 'border-[var(--app-border)] bg-[var(--app-bg-soft)]/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--app-text)]">
                    <span aria-hidden>{presentation.icon} </span>
                    {presentation.title}
                  </p>
                  <span className="shrink-0 rounded-md bg-[var(--app-card-strong)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                    {STATUS_LABEL[user.status]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                  {presentation.description}
                </p>
                <p className="mt-1 text-[11px] text-[var(--app-text-muted)]">
                  {BODY_INTEREST_LABELS[definition.category]} ·{' '}
                  {BODY_DIFFICULTY_LABELS[definition.difficulty]} ·{' '}
                  {BODY_UNLOCK_MODE_LABELS[definition.unlockMode]}
                </p>
                <p className="mt-1 text-[11px] italic text-[var(--app-text-muted)]">
                  {presentation.flavor}
                </p>
                {canManual ? (
                  <button
                    type="button"
                    disabled={busyId === definition.id}
                    onClick={() => void onManualUnlock(definition.id)}
                    className="mt-3 rounded-lg border border-[var(--app-border)] px-3 py-1.5 text-xs font-medium text-[var(--app-primary)]"
                  >
                    Я заметил это изменение
                  </button>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
