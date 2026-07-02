import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
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
  ROUTE_MODE_OPTIONS,
} from '../types/onboarding';
import { resolveThemeId } from '../constants/themes';
import { applyThemeToDocument, setStoredThemeId } from '../utils/themeApply';
import { setActiveCompanionId } from '../game/gameAssetStorage';
import {
  getOnboardingStep,
  mergeOnboardingDraft,
  ONBOARDING_STEP_COUNT,
} from '../utils/onboardingState';
import { completeOnboardingFlow } from '../utils/onboardingComplete';
import { todayISO } from '../utils/dates';

const STEP_TITLES = [
  'Пробуждение ядра',
  'Стартовые данные',
  'Герой и стиль',
  'Спутник',
  'Первый маршрут',
];

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

  useEffect(() => {
    const themeId = resolveThemeId(draft.themeId ?? settings.themeId);
    setStoredThemeId(themeId);
    applyThemeToDocument(themeId);
  }, [draft.themeId, settings.themeId]);

  const persistProgress = useCallback(
    async (nextStep: number, nextDraft: OnboardingDraft) => {
      await saveSettings(
        mergeOnboardingDraft(
          { ...settings, onboardingStep: nextStep },
          nextDraft,
        ),
      );
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
        setError('Укажи стартовый вес, цель и рост — без этого маршрут не соберётся.');
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

  const goBack = () => {
    setStep((s) => Math.max(0, s - 1));
    setError(null);
  };

  const finish = async () => {
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
        e instanceof Error ? e.message : 'Не удалось завершить настройку маршрута.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const primaryCta = useMemo(() => {
    if (step === 0) return 'Начать путь';
    if (step === 2) return 'Создать героя';
    if (step === 3) return 'Продолжить путь';
    if (step === 4) return 'Продолжить путь';
    return 'Дальше';
  }, [step]);

  return (
    <div
      data-testid="start-route-page"
      className="min-h-screen bg-[var(--app-bg)] px-4 py-6 text-[var(--app-text)] sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
        <header className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--app-gold)]/30 bg-[var(--app-primary-soft)] shadow-[0_0_24px_rgba(250,204,21,0.12)]">
            <Sparkles className="h-6 w-6 text-[var(--app-gold)]" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-gold)]">
            Пробуждение ядра
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            {STEP_TITLES[step]}
          </h1>
          <div className="flex justify-center gap-2">
            {Array.from({ length: ONBOARDING_STEP_COUNT }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step
                    ? 'w-8 bg-[var(--app-gold)]'
                    : i < step
                      ? 'w-3 bg-[var(--app-gold)]/50'
                      : 'w-3 bg-[var(--app-border)]'
                }`}
              />
            ))}
          </div>
        </header>

        <section className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-card)]/90 p-5 shadow-[var(--app-shadow)] backdrop-blur-sm sm:p-6">
          {step === 0 && (
            <div className="space-y-4 text-[var(--app-text-muted)]">
              <p className="text-base leading-relaxed text-[var(--app-text)]">
                Это не гонка и не таблица штрафов. Personal RPG помогает удерживать путь
                день за днём: отмечать состояние, видеть прогресс и возвращаться завтра.
              </p>
              <p>
                Сейчас ядро пробуждается — мы соберём старт маршрута: тело, героя,
                спутника и первый фокус. Без давления и без идеального дня.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--app-text-muted)]">
                Эти цифры нужны, чтобы маршрут знал откуда старт. Темп выбираешь ты —
                игра не будет торопить.
              </p>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Стартовый вес, кг</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={30}
                  max={300}
                  step={0.1}
                  data-testid="onboarding-start-weight"
                  value={draft.startWeight ?? ''}
                  onChange={(e) =>
                    updateDraft({
                      startWeight: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Целевой вес, кг</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={30}
                  max={300}
                  step={0.1}
                  data-testid="onboarding-target-weight"
                  value={draft.targetWeight ?? ''}
                  onChange={(e) =>
                    updateDraft({
                      targetWeight: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Рост, см</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={120}
                  max={230}
                  data-testid="onboarding-height"
                  value={draft.height ?? ''}
                  onChange={(e) =>
                    updateDraft({
                      height: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3"
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <p className="text-sm text-[var(--app-text-muted)]">
                Герой будет меняться по мере пути. Вес — не единственный прогресс: движение,
                ресурс, контроль и свобода тела тоже считаются.
              </p>
              <div>
                <p className="mb-2 text-sm font-medium">Пол героя</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['male', 'female'] as HeroGender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      data-testid={`onboarding-hero-${g}`}
                      onClick={() => updateDraft({ heroGender: g })}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        draft.heroGender === g
                          ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)]'
                          : 'border-[var(--app-border)] bg-[var(--app-bg)]'
                      }`}
                    >
                      {g === 'male' ? 'Мужской герой' : 'Женский герой'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Визуальная тема</p>
                <ThemeSelector
                  value={resolveThemeId(draft.themeId)}
                  onChange={(themeId: AppThemeId) => updateDraft({ themeId })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--app-text-muted)]">
                Спутник не оценивает день — он помогает удерживать маршрут. Выбери того,
                кто рядом в начале пути.
              </p>
              <CompanionSelector
                value={(draft.companionId ?? 'golden_chinchilla_cat') as CompanionId}
                onChange={(companionId) => updateDraft({ companionId })}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium">Ритм маршрута</p>
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
                          : 'border-[var(--app-border)] bg-[var(--app-bg)]'
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
                <p className="mb-2 text-sm font-medium">Первый фокус</p>
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
                          : 'border-[var(--app-border)] bg-[var(--app-bg)]'
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
              <p className="rounded-xl border border-[var(--app-gold)]/25 bg-[var(--app-primary-soft)]/40 px-4 py-3 text-sm text-[var(--app-text)]">
                Маршрут открыт. Сегодня не нужно быть идеальным — достаточно удержать первый
                шаг.
              </p>
            </div>
          )}

          {error ? (
            <p className="mt-4 text-sm text-[var(--app-danger)]" role="alert">
              {error}
            </p>
          ) : null}
        </section>

        <div className="flex gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              disabled={submitting}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-[var(--app-border)] px-4 py-3 text-sm font-semibold"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Назад
            </button>
          ) : (
            <span className="flex-1" />
          )}

          {step < ONBOARDING_STEP_COUNT - 1 ? (
            <button
              type="button"
              data-testid="onboarding-next"
              onClick={() => void goNext()}
              disabled={submitting}
              className="btn-primary inline-flex flex-[2] items-center justify-center gap-1 rounded-xl px-4 py-3 text-sm font-semibold"
            >
              {primaryCta}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              data-testid="onboarding-finish"
              onClick={() => void finish()}
              disabled={submitting || !draft.firstFocus}
              className="btn-primary inline-flex flex-[2] items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? 'Открываем маршрут…' : 'Настроить маршрут'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
