import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { UserProfile } from '../api/authApi';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../auth/useAuth';
import type { OnboardingDraft, OnboardingHeroGender } from '../types/onboarding';
import { ONBOARDING_STEP_COPY } from '../types/onboarding';
import { resolveThemeId } from '../constants/themes';
import { applyThemeToDocument, setStoredThemeId } from '../utils/themeApply';
import { setActiveCompanionId } from '../game/gameAssetStorage';
import {
  getOnboardingStep,
  mergeOnboardingDraft,
  needsOnboarding,
  ONBOARDING_STEP_COUNT,
  validateBodyGoalDraft,
} from '../utils/onboardingState';
import { completeOnboardingFlow } from '../utils/onboardingComplete';
import { applyOnboardingDraftDefaults } from '../utils/onboardingDefaults';
import {
  clearOnboardingDraftStorage,
  readOnboardingDraftFromStorage,
  writeOnboardingDraftToStorage,
} from '../utils/onboardingDraft';
import { todayISO } from '../utils/dates';
import { OnboardingShell } from '../components/onboarding/OnboardingShell';
import { OnboardingStepIntro } from '../components/onboarding/OnboardingStepIntro';
import { OnboardingStepHero } from '../components/onboarding/OnboardingStepHero';
import { OnboardingStepTheme } from '../components/onboarding/OnboardingStepTheme';
import { OnboardingStepBodyGoal } from '../components/onboarding/OnboardingStepBodyGoal';
import { OnboardingStepDailyRhythm } from '../components/onboarding/OnboardingStepDailyRhythm';
import { OnboardingStepCompanion } from '../components/onboarding/OnboardingStepCompanion';

function draftFromSettings(
  settings: ReturnType<typeof useAppStore.getState>['settings'],
  profile: UserProfile | null,
): OnboardingDraft {
  const saved = settings.onboardingDraft ?? {};
  const local = readOnboardingDraftFromStorage() ?? {};
  const profileGender = profile?.heroGender as OnboardingHeroGender | null | undefined;

  return applyOnboardingDraftDefaults({
    heroName: saved.heroName ?? local.heroName ?? profile?.displayName ?? undefined,
    startWeight: saved.startWeight ?? local.startWeight ?? profile?.startWeight ?? undefined,
    targetWeight:
      saved.targetWeight ??
      local.targetWeight ??
      profile?.targetWeight ??
      settings.targetWeight ??
      undefined,
    height: saved.height ?? local.height ?? profile?.height ?? undefined,
    heroGender:
      saved.heroGender ??
      local.heroGender ??
      profileGender ??
      settings.heroGender ??
      settings.gender,
    themeId: saved.themeId ?? local.themeId ?? resolveThemeId(settings.themeId),
    companionId:
      saved.companionId ??
      local.companionId ??
      settings.activeCompanionId ??
      'golden_chinchilla_cat',
    routeMode: saved.routeMode ?? local.routeMode ?? settings.routeMode ?? 'normal',
    firstFocus: saved.firstFocus ?? local.firstFocus ?? settings.firstFocus,
    stepsMinimum:
      saved.stepsMinimum ?? local.stepsMinimum ?? settings.defaultStepsMinimum,
    stepsNormal:
      saved.stepsNormal ??
      local.stepsNormal ??
      settings.defaultStepsNormal ??
      settings.defaultStepsGoal,
    stepsExcellent:
      saved.stepsExcellent ?? local.stepsExcellent ?? settings.defaultStepsExcellent,
    nutritionTrackingMode:
      saved.nutritionTrackingMode ??
      local.nutritionTrackingMode ??
      settings.nutritionTrackingMode,
    dailyCalorieLimit:
      saved.dailyCalorieLimit !== undefined
        ? saved.dailyCalorieLimit
        : (local.dailyCalorieLimit ?? settings.dailyCalorieLimit ?? null),
    alcoholTrackingEnabled:
      saved.alcoholTrackingEnabled ??
      local.alcoholTrackingEnabled ??
      settings.enableAlcoholTracking,
    sleepTrackingEnabled:
      saved.sleepTrackingEnabled ??
      local.sleepTrackingEnabled ??
      settings.enableSleepTracking,
    resourceTrackingEnabled:
      saved.resourceTrackingEnabled ??
      local.resourceTrackingEnabled ??
      settings.enableSleepTracking,
    physicalActivityEnabled:
      saved.physicalActivityEnabled ??
      local.physicalActivityEnabled ??
      settings.enablePhysicalActivityTracking,
  });
}

export function StartRoutePage() {
  const navigate = useNavigate();
  const { profile, refreshUser } = useAuth();
  const { settings, saveSettings, addMeasurement, measurements, dailyEntries } =
    useAppStore();
  const hasProgressData = dailyEntries.length > 0 || measurements.length > 0;

  const [step, setStep] = useState(() => getOnboardingStep(settings));
  const [draft, setDraft] = useState<OnboardingDraft>(() =>
    draftFromSettings(settings, profile),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingStep, setSavingStep] = useState(false);

  const stepCopy = ONBOARDING_STEP_COPY[step] ?? ONBOARDING_STEP_COPY[0]!;
  const themeId = resolveThemeId(draft.themeId ?? settings.themeId);

  useEffect(() => {
    setStoredThemeId(themeId);
    applyThemeToDocument(themeId);
  }, [themeId]);

  useEffect(() => {
    setStep(getOnboardingStep(settings));
    setDraft(draftFromSettings(settings, profile));
  }, [settings.onboardingStep, settings.onboardingDraft, profile, settings.onboardingCompleted]);

  useEffect(() => {
    writeOnboardingDraftToStorage(draft);
  }, [draft]);

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
    setDraft((prev) => applyOnboardingDraftDefaults({ ...prev, ...patch }));
    setError(null);
  };

  const goNext = async () => {
    if (step === 3) {
      const check = validateBodyGoalDraft(draft);
      if (!check.ok) {
        setError(check.message ?? 'Проверь данные тела.');
        return;
      }
    }
    if (step === 2 && !draft.themeId) {
      setError('Выбери мир кампании — Cozy или Dark Fantasy.');
      return;
    }

    const nextStep = Math.min(step + 1, ONBOARDING_STEP_COUNT - 1);
    const nextDraft = { ...draft };
    if (step === 1 && !nextDraft.heroGender) {
      nextDraft.heroGender = 'male';
    }
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
    const bodyCheck = validateBodyGoalDraft(draft);
    if (!bodyCheck.ok) {
      setError(bodyCheck.message ?? 'Проверь данные тела.');
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
        draft: {
          ...draft,
          heroGender: draft.heroGender ?? 'male',
          themeId,
          companionId,
        },
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

      clearOnboardingDraftStorage();
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
    if (step === 0) return 'Начать';
    if (step === ONBOARDING_STEP_COUNT - 1) return 'Перейти к первому дню';
    return 'Далее';
  }, [step]);

  if (!needsOnboarding(settings, profile, { hasProgressData })) {
    return <Navigate to="/today" replace />;
  }

  return (
    <OnboardingShell
      step={step}
      title={stepCopy.title}
      subtitle={stepCopy.subtitle}
      lead={stepCopy.lead}
      body={step === 0 || step === 3 || step === 4 ? stepCopy.body : undefined}
      showIntroArt={step === 0}
      saving={savingStep}
      error={error}
      primaryLabel={primaryCta}
      onNext={() => void goNext()}
      onBack={() => void goBack()}
      onFinish={() => void finish()}
      isLastStep={step === ONBOARDING_STEP_COUNT - 1}
      submitting={submitting}
    >
      {step === 0 ? <OnboardingStepIntro themeHint={draft.themeId ?? null} /> : null}
      {step === 1 ? <OnboardingStepHero draft={draft} onChange={updateDraft} /> : null}
      {step === 2 ? <OnboardingStepTheme draft={draft} onChange={updateDraft} /> : null}
      {step === 3 ? <OnboardingStepBodyGoal draft={draft} onChange={updateDraft} /> : null}
      {step === 4 ? (
        <OnboardingStepDailyRhythm draft={draft} onChange={updateDraft} />
      ) : null}
      {step === 5 ? (
        <OnboardingStepCompanion
          draft={draft}
          onChange={updateDraft}
          themeId={themeId}
        />
      ) : null}
    </OnboardingShell>
  );
}
