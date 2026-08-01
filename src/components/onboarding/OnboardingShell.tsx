import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ManifestArtScene } from '../game/ManifestArtScene';
import { ONBOARDING_CORE_AWAKENING_ASSET_ID } from '../../game/manifestAssetUi';
import { getManifestAssetUrl } from '../../game/assetManifest';
import { OnboardingProgress } from './OnboardingProgress';
import { ONBOARDING_STEP_COUNT } from '../../utils/onboardingState';

type OnboardingShellProps = {
  step: number;
  title: string;
  subtitle: string;
  lead: string;
  body?: string;
  showIntroArt?: boolean;
  saving?: boolean;
  error?: string | null;
  primaryLabel: string;
  onNext: () => void;
  onBack?: () => void;
  onFinish?: () => void;
  isLastStep?: boolean;
  primaryDisabled?: boolean;
  submitting?: boolean;
  children?: ReactNode;
};

export function OnboardingShell({
  step,
  title,
  subtitle,
  lead,
  body,
  showIntroArt,
  saving,
  error,
  primaryLabel,
  onNext,
  onBack,
  onFinish,
  isLastStep,
  primaryDisabled,
  submitting,
  children,
}: OnboardingShellProps) {
  const onboardingArtSrc = getManifestAssetUrl(ONBOARDING_CORE_AWAKENING_ASSET_ID);

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
          {showIntroArt && onboardingArtSrc ? (
            <ManifestArtScene
              assetId={ONBOARDING_CORE_AWAKENING_ASSET_ID}
              alt="Пробуждение ядра — руины и тлеющее ядро"
              layout="onboarding"
              testId="onboarding-art-scene"
              className="mx-auto w-full max-w-sm"
              imageLoading="eager"
            />
          ) : showIntroArt && !onboardingArtSrc ? (
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)] shadow-[0_0_28px_rgba(250,204,21,0.14)]">
              <Sparkles className="h-7 w-7 text-[var(--app-gold)]" aria-hidden />
            </div>
          ) : null}
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-gold)]">
            Пробуждение ядра
          </p>
          <OnboardingProgress step={step} saving={saving} />
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
          <p className="text-sm text-[var(--app-text-muted)]">{subtitle}</p>
        </header>

        <section className="mt-5 flex-1 rounded-3xl border border-[var(--app-border)]/90 bg-[var(--app-card)]/95 p-5 shadow-[var(--app-shadow)] backdrop-blur-sm sm:p-6">
          <div className="space-y-3 text-sm leading-relaxed text-[var(--app-text-muted)]">
            <p className="text-[var(--app-text)]">{lead}</p>
            {body ? <p>{body}</p> : null}
          </div>
          {children}
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
              onClick={onNext}
              disabled={submitting || saving || primaryDisabled}
              className="btn-primary flex w-full items-center justify-center gap-1 rounded-xl px-4 py-3.5 text-sm font-semibold shadow-[0_0_20px_rgba(250,204,21,0.12)] disabled:opacity-50"
            >
              {primaryLabel}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={onBack}
                disabled={submitting || saving}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3.5 text-sm font-semibold disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Назад
              </button>

              {isLastStep || step >= ONBOARDING_STEP_COUNT - 1 ? (
                <button
                  type="button"
                  data-testid="onboarding-finish"
                  onClick={onFinish}
                  disabled={submitting || saving || primaryDisabled}
                  className="btn-primary inline-flex flex-1 items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold shadow-[0_0_20px_rgba(250,204,21,0.12)] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {submitting ? 'Открываем маршрут…' : primaryLabel}
                </button>
              ) : (
                <button
                  type="button"
                  data-testid="onboarding-next"
                  onClick={onNext}
                  disabled={submitting || saving || primaryDisabled}
                  className="btn-primary inline-flex flex-1 items-center justify-center gap-1 rounded-xl px-4 py-3.5 text-sm font-semibold shadow-[0_0_20px_rgba(250,204,21,0.12)] disabled:opacity-50"
                >
                  {primaryLabel}
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
