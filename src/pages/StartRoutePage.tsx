import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { UserProfile } from '../api/authApi';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../auth/useAuth';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { CompanionSelector } from '../components/game/CompanionSelector';
import type { AppThemeId } from '../types/theme';
import type { CompanionId, HeroGender } from '../types/gameAssets';
import type { OnboardingDraft } from '../types/onboarding';
import {
  FIRST_FOCUS_OPTIONS,
  ONBOARDING_STEP_COPY,
  ROUTE_MODE_OPTIONS,
} from '../types/onboarding';
import { resolveThemeId } from '../constants/themes';
import { applyThemeToDocument, setStoredThemeId } from '../utils/themeApply';
import { setActiveCompanionId } from '../game/gameAssetStorage';
import {
  getOnboardingStep,
  mergeOnboardingDraft,
  needsOnboarding,
  ONBOARDING_STEP_COUNT,
} from '../utils/onboardingState';
import { completeOnboardingFlow } from '../utils/onboardingComplete';
import { todayISO } from '../utils/dates';
import { ManifestArtScene } from '../components/game/ManifestArtScene';
import { ONBOARDING_CORE_AWAKENING_ASSET_ID } from '../game/manifestAssetUi';
import { getManifestAssetUrl } from '../game/assetManifest';

function draftFromSettings(
  settings: ReturnType<typeof useAppStore.getState>['settings'],
  profile: UserProfile | null,
): OnboardingDraft {
  const saved = settings.onboardingDraft ?? {};
  return {
    startWeight: saved.startWeight ?? profile?.startWeight ?? undefined,
    targetWeight:
      saved.targetWeight ??
      profile?.targetWeight ??
      settings.targetWeight ??
      undefined,
    height: saved.height ?? profile?.height ?? undefined,
    heroGender:
      saved.heroGender ??
      (profile?.heroGender === 'neutral' ? undefined : (profile?.heroGender as HeroGender | undefined)) ??
      settings.heroGender ??
      settings.gender,
    themeId: saved.themeId ?? resolveThemeId(settings.themeId),
    companionId:
      saved.companionId ?? settings.activeCompanionId ?? 'golden_chinchilla_cat',
    routeMode: saved.routeMode ?? settings.routeMode ?? 'normal',
    firstFocus: saved.firstFocus ?? settings.firstFocus,
  };
}

const inputClassName =
  'w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/25';

export function StartRoutePage() {
  const navigate = useNavigate();
  const { profile, refreshUser } = useAuth();
  const { settings, saveSettings, addMeasurement, measurements } = useAppStore();
  const [step, setStep] = useState(() => getOnboardingStep(settings));
  const [draft, setDraft] = useState<OnboardingDraft>(() =>
    draftFromSettings(settings, profile),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingStep, setSavingStep] = useState(false);

  const stepCopy = ONBOARDING_STEP_COPY[step];

  useEffect(() => {
    const themeId = resolveThemeId(draft.themeId ?? settings.themeId);
    setStoredThemeId(themeId);
    applyThemeToDocument(themeId);
  }, [draft.themeId, settings.themeId]);

  useEffect(() => {
    setStep(getOnboardingStep(settings));
    setDraft(draftFromSettings(settings, profile));
  }, [settings.onboardingStep, settings.onboardingDraft, profile, settings.onboardingCompleted]);

  const persistProgress = useCallback(
    async (nextStep: number, nextDraft: OnboardingDraft) => {
      setSavingStep(true);
      try {
        await saveSettings(
          mergeOnboardingDraft(
            { ...settings, onboardingStep: nextStep },
            nextDraft,
          ),
        );
      } finally {
        setSavingStep(false);
      }
    },
    [saveSettings, settings],
  );

  const updateDraft = (patch: Partial<OnboardingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    setError(null);
  };

  const goNext = async () => {
    if (step === 1) {
      if (!draft.startWeight || !draft.targetWeight || !draft.height) {
        setError('Отметь стартовую точку: вес сейчас, цель и рост.');
        return;
      }
      if (draft.targetWeight >= draft.startWeight) {
        setError('Целевой вес обычно меньше стартового. Проверь цифры без спешки.');
        return;
      }
    }
    if (step === 2 && !draft.heroGender) {
      setError('Выбери героя — персонаж начнёт путь вместе с тобой.');
      return;
    }

    const nextStep = Math.min(step + 1, ONBOARDING_STEP_COUNT - 1);
    const nextDraft = { ...draft };
    setStep(nextStep);
    try {
      await persistProgress(nextStep, nextDraft);
    } catch {
      setError('Не удалось сохранить прогресс. Попробуй ещё раз.');
    }
  };

  const goBack = async () => {
    const prev = Math.max(0, step - 1);
    setStep(prev);
    setError(null);
    try {
      await persistProgress(prev, draft);
    } catch {
      setError('Не удалось сохранить шаг. Попробуй ещё раз.');
    }
  };

  const finish = async () => {
    if (!draft.firstFocus) {
      setError('Выбери первый фокус — это мягкая подсказка, с чего начать путь.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const companionId = draft.companionId ?? 'golden_chinchilla_cat';
      setActiveCompanionId(companionId);

      const hasStartMeasurement = measurements.some(
        (m) => m.weight != null && m.date <= todayISO(),
      );

      await completeOnboardingFlow({
        draft,
        currentSettings: settings,
        saveSettings,
        refreshUser,
        seedStartMeasurement:
          draft.startWeight != null && !hasStartMeasurement
            ? async (weight) => {
                await addMeasurement({
                  date: todayISO(),
                  weight,
                  chest: null,
                  waist: null,
                  belly: null,
                  hips: null,
                  thigh: null,
                  biceps: null,
                  comment: 'Старт маршрута',
                });
              }
            : undefined,
      });

      navigate('/today', { replace: true, state: { routeOpened: true } });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Не удалось открыть маршрут. Попробуй ещё раз.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const primaryCta = useMemo(() => {
    if (step === 0) return 'Начать путь';
    if (step === 1) return 'Отметить старт';
    if (step === 2) return 'Создать героя';
    if (step === 3) return 'Позвать спутника';
    return 'Дальше';
  }, [step]);

  const finishDisabled = submitting || !draft.firstFocus;
  const onboardingArtSrc = getManifestAssetUrl(ONBOARDING_CORE_AWAKENING_ASSET_ID);

  if (!needsOnboarding(settings, profile)) {
    return <Navigate to="/today" replace />;
  }

  return (
    <div
      data-testid="start-route-page"
      className="relative min-h-screen overflow-x-hidden bg-[var(--app-bg)] text-[var(--app-text)]"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.07),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6 sm:max-w-lg sm:px-6 sm:py-10">
        <header className="shrink-0 space-y-3 text-center">
          {onboardingArtSrc && step === 0 ? (
            <ManifestArtScene
              assetId={ONBOARDING_CORE_AWAKENING_ASSET_ID}
              alt="Пробуждение ядра — руины и тлеющее ядро"
              layout="onboarding"
              testId="onboarding-art-scene"
              className="mx-auto w-full max-w-sm"
              imageLoading="eager"
            />
          ) : !onboardingArtSrc ? (
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)] shadow-[0_0_28px_rgba(250,204,21,0.14)]">
              <Sparkles className="h-7 w-7 text-[var(--app-gold)]" aria-hidden />
            </div>
          ) : null}
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-gold)]">
            Пробуждение ядра
          </p>
          <p className="text-xs text-[var(--app-text-muted)]">
            Шаг {step + 1} из {ONBOARDING_STEP_COUNT}
            {savingStep ? ' · сохраняем…' : null}
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{stepCopy.title}</h1>
          <p className="text-sm text-[var(--app-text-muted)]">{stepCopy.subtitle}</p>
          <div className="flex justify-center gap-1.5 pt-1" aria-hidden>
            {Array.from({ length: ONBOARDING_STEP_COUNT }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-9 bg-[var(--app-gold)] shadow-[0_0_10px_rgba(250,204,21,0.35)]'
                    : i < step
                      ? 'w-2.5 bg-[var(--app-gold)]/45'
                      : 'w-2.5 bg-[var(--app-border)]'
                }`}
              />
            ))}
          </div>
        </header>

        <section className="mt-5 flex-1 rounded-3xl border border-[var(--app-border)]/90 bg-[var(--app-card)]/95 p-5 shadow-[var(--app-shadow)] backdrop-blur-sm sm:p-6">
          <div className="space-y-3 text-sm leading-relaxed text-[var(--app-text-muted)]">
            <p className="text-[var(--app-text)]">{stepCopy.lead}</p>
            {step === 0 ? <p>{stepCopy.body}</p> : null}
          </div>

          {step === 1 ? (
            <div className="mt-5 space-y-4">
              <p className="text-sm text-[var(--app-text-muted)]">{stepCopy.body}</p>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--app-text)]">Сейчас, кг</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={30}
                  max={300}
                  step={0.1}
                  placeholder="Например, 92"
                  data-testid="onboarding-start-weight"
                  value={draft.startWeight ?? ''}
                  onChange={(e) =>
                    updateDraft({
                      startWeight: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className={inputClassName}
                />
                <span className="text-xs text-[var(--app-text-muted)]">Отправная точка маршрута</span>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--app-text)]">Цель, кг</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={30}
                  max={300}
                  step={0.1}
                  placeholder="Куда движемся"
                  data-testid="onboarding-target-weight"
                  value={draft.targetWeight ?? ''}
                  onChange={(e) =>
                    updateDraft({
                      targetWeight: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--app-text)]">Рост, см</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={120}
                  max={230}
                  placeholder="Для пропорций героя"
                  data-testid="onboarding-height"
                  value={draft.height ?? ''}
                  onChange={(e) =>
                    updateDraft({
                      height: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className={inputClassName}
                />
              </label>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mt-5 space-y-5">
              <p className="text-sm text-[var(--app-text-muted)]">{stepCopy.body}</p>
              <div>
                <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Герой</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['male', 'female'] as HeroGender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      data-testid={`onboarding-hero-${g}`}
                      onClick={() => updateDraft({ heroGender: g })}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                        draft.heroGender === g
                          ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)] shadow-[0_0_16px_rgba(167,139,250,0.12)]'
                          : 'border-[var(--app-border)] bg-[var(--app-bg)] hover:border-[var(--app-primary)]/40'
                      }`}
                    >
                      {g === 'male' ? 'Мужской' : 'Женский'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Атмосфера мира</p>
                <ThemeSelector
                  value={resolveThemeId(draft.themeId)}
                  onChange={(themeId: AppThemeId) => updateDraft({ themeId })}
                />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="mt-5 space-y-4">
              <p className="text-sm text-[var(--app-text-muted)]">{stepCopy.body}</p>
              <CompanionSelector
                compact
                value={(draft.companionId ?? 'golden_chinchilla_cat') as CompanionId}
                onChange={(companionId) => updateDraft({ companionId })}
              />
            </div>
          ) : null}

          {step === 4 ? (
            <div className="mt-5 space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Ритм маршрута</p>
                <div className="grid gap-2">
                  {ROUTE_MODE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      data-testid={`onboarding-route-${opt.id}`}
                      onClick={() => updateDraft({ routeMode: opt.id })}
                      className={`rounded-xl border px-4 py-3 text-left transition ${
                        (draft.routeMode ?? 'normal') === opt.id
                          ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)]'
                          : 'border-[var(--app-border)] bg-[var(--app-bg)] hover:border-[var(--app-primary)]/35'
                      }`}
                    >
                      <span className="block font-semibold">{opt.title}</span>
                      <span className="mt-0.5 block text-sm text-[var(--app-text-muted)]">
                        {opt.hint}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Первый фокус</p>
                <div className="grid gap-2">
                  {FIRST_FOCUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      data-testid={`onboarding-focus-${opt.id}`}
                      onClick={() => updateDraft({ firstFocus: opt.id })}
                      className={`rounded-xl border px-4 py-3 text-left transition ${
                        draft.firstFocus === opt.id
                          ? 'border-[var(--app-gold)] bg-[var(--app-primary-soft)]'
                          : 'border-[var(--app-border)] bg-[var(--app-bg)] hover:border-[var(--app-gold)]/35'
                      }`}
                    >
                      <span className="block font-semibold">{opt.title}</span>
                      <span className="mt-0.5 block text-sm text-[var(--app-text-muted)]">
                        {opt.hint}
                      </span>
                    </button>
                  ))}
                </div>
                {!draft.firstFocus ? (
                  <p className="mt-2 text-xs text-[var(--app-text-muted)]">
                    Выбери один фокус — это мягкая подсказка для первых дней.
                  </p>
                ) : null}
              </div>
              <p className="rounded-xl border border-[var(--app-gold)]/30 bg-[var(--app-primary-soft)]/50 px-4 py-3 text-sm text-[var(--app-text)]">
                {stepCopy.body}
              </p>
            </div>
          ) : null}

          {error ? (
            <p className="mt-4 text-sm text-[var(--app-danger)]" role="alert">
              {error}
            </p>
          ) : null}
        </section>

        <div className="sticky bottom-0 mt-5 w-full shrink-0 border-t border-[var(--app-border)]/60 bg-[var(--app-bg)]/95 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-sm sm:relative sm:border-0 sm:bg-transparent sm:pb-0 sm:pt-5 sm:backdrop-blur-none">
          {step === 0 ? (
            <button
              type="button"
              data-testid="onboarding-next"
              onClick={() => void goNext()}
              disabled={submitting || savingStep}
              className="btn-primary flex w-full items-center justify-center gap-1 rounded-xl px-4 py-3.5 text-sm font-semibold shadow-[0_0_20px_rgba(250,204,21,0.12)] disabled:opacity-50"
            >
              {primaryCta}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => void goBack()}
                disabled={submitting || savingStep}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3.5 text-sm font-semibold disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Назад
              </button>

              {step < ONBOARDING_STEP_COUNT - 1 ? (
                <button
                  type="button"
                  data-testid="onboarding-next"
                  onClick={() => void goNext()}
                  disabled={submitting || savingStep}
                  className="btn-primary inline-flex flex-1 items-center justify-center gap-1 rounded-xl px-4 py-3.5 text-sm font-semibold shadow-[0_0_20px_rgba(250,204,21,0.12)] disabled:opacity-50"
                >
                  {primaryCta}
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  data-testid="onboarding-finish"
                  onClick={() => void finish()}
                  disabled={finishDisabled || savingStep}
                  title={!draft.firstFocus ? 'Выбери первый фокус' : undefined}
                  className="btn-primary inline-flex flex-1 items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold shadow-[0_0_20px_rgba(250,204,21,0.12)] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {submitting ? 'Открываем маршрут…' : 'Настроить маршрут'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
