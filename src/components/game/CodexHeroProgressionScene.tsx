import type { HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { getHeroStageImageCandidates } from '../../game/assetPaths';
import { getHeroStageMeta } from '../../game/assetRegistry';
import { GameAssetImage } from './GameAssetImage';

type CodexHeroProgressionSceneProps = {
  gender: HeroGender;
  currentStage: HeroStageNumber;
  progressPercent: number;
  progressToNextStage: number;
};

function clampStage(stage: number): HeroStageNumber {
  return Math.min(HERO_STAGE_COUNT, Math.max(1, stage)) as HeroStageNumber;
}

type HeroSilhouetteProps = {
  gender: HeroGender;
  stage: HeroStageNumber;
  playerStage: HeroStageNumber;
  variant: 'past' | 'current' | 'future';
};

function HeroSilhouette({ gender, stage, playerStage, variant }: HeroSilhouetteProps) {
  const meta = getHeroStageMeta(gender, stage);
  const status =
    variant === 'current'
      ? 'current'
      : stage > playerStage
        ? 'locked'
        : 'unlocked';

  const wrapperClass =
    variant === 'current'
      ? 'relative z-20 h-[88%] w-[46%] max-w-[13rem] sm:max-w-[15rem] lg:max-w-[17rem]'
      : variant === 'past'
        ? 'absolute bottom-[14%] left-[4%] z-10 hidden h-[62%] w-[30%] max-w-[9rem] opacity-[0.38] sm:block sm:left-[6%] sm:h-[68%] sm:max-w-[10rem]'
        : 'absolute bottom-[14%] right-[4%] z-10 hidden h-[62%] w-[30%] max-w-[9rem] opacity-[0.38] sm:block sm:right-[6%] sm:h-[68%] sm:max-w-[10rem]';

  const testId =
    variant === 'past'
      ? 'codex-hero-past'
      : variant === 'current'
        ? 'codex-hero-current'
        : 'codex-hero-future';

  return (
    <div data-testid={testId} className={wrapperClass}>
      <GameAssetImage
        variant="hero"
        src={meta.image}
        alt={meta.title}
        fallbackCandidates={getHeroStageImageCandidates(gender, stage).slice(1)}
        status={variant === 'current' ? 'current' : status}
        fit="hero"
        className="h-full w-full bg-transparent"
        imageClassName={variant !== 'current' ? 'brightness-[0.72] contrast-[0.92]' : undefined}
      />
    </div>
  );
}

type ProgressPathProps = {
  currentStage: HeroStageNumber;
  progressPercent: number;
};

function ProgressPath({ currentStage, progressPercent }: ProgressPathProps) {
  const stages = Array.from({ length: HERO_STAGE_COUNT }, (_, i) => (i + 1) as HeroStageNumber);

  return (
    <div
      data-testid="codex-hero-progress-path"
      className="relative mx-auto w-full max-w-3xl px-2 pb-1 pt-4"
    >
      <div className="relative h-8">
        {/* Base track */}
        <div className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-stone-600/70" />

        {/* Glowing fill */}
        <div
          className="absolute left-3 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-600/80 via-amber-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.55)] transition-[width] duration-500"
          style={{ width: `calc((100% - 1.5rem) * ${Math.min(100, Math.max(0, progressPercent)) / 100})` }}
        />

        {/* Nodes */}
        <div className="relative flex items-center justify-between">
          {stages.map((stage) => {
            const isPast = stage < currentStage;
            const isCurrent = stage === currentStage;
            const isFuture = stage > currentStage;

            return (
              <div
                key={stage}
                data-testid={`codex-progress-node-${stage}`}
                className="relative flex h-8 w-0 flex-1 items-center justify-center"
                title={`Стадия ${stage}`}
              >
                {isCurrent ? (
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-5 w-5 rotate-45 rounded-sm border border-amber-200/80 bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_14px_rgba(251,191,36,0.75)]" />
                    <span className="sr-only">Текущая стадия {stage}</span>
                  </div>
                ) : (
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isPast
                        ? 'bg-amber-500/90 shadow-[0_0_6px_rgba(251,191,36,0.45)]'
                        : isFuture
                          ? 'border border-stone-500/80 bg-stone-800/90'
                          : ''
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-1 text-center text-[11px] text-stone-400/90">
        Стадия {currentStage} из {HERO_STAGE_COUNT} · {Math.round(progressPercent)}% пути
      </p>
    </div>
  );
}

export function CodexHeroProgressionScene({
  gender,
  currentStage,
  progressPercent,
  progressToNextStage,
}: CodexHeroProgressionSceneProps) {
  const pastStage = clampStage(currentStage - 1);
  const futureStage = clampStage(currentStage + 1);
  const currentMeta = getHeroStageMeta(gender, currentStage);

  const showPast = currentStage > 1;
  const showFuture = currentStage < HERO_STAGE_COUNT;

  return (
    <section
      data-testid="codex-hero-progression-scene"
      className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--app-border)_55%,#1a1528)] bg-gradient-to-b from-[#0a0812] via-[#12101c] to-[#08070f] shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
    >
      {/* Cavern atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_srgb,var(--app-primary)_14%,transparent),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_85%,color-mix(in_srgb,#000_55%,transparent),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Mist particles */}
      <div className="pointer-events-none absolute left-[12%] top-[18%] h-16 w-16 rounded-full bg-stone-400/[0.04] blur-2xl" />
      <div className="pointer-events-none absolute right-[18%] top-[28%] h-20 w-20 rounded-full bg-amber-500/[0.05] blur-3xl" />

      <div className="relative px-3 pb-2 pt-4 sm:px-5 sm:pt-5">
        <div className="mb-1 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-400/85">
            Трансформация героя
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--app-text)] sm:text-lg">
            {currentMeta.title}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs leading-snug text-[var(--app-text-muted)]">
            {currentMeta.description}
          </p>
          {currentStage < HERO_STAGE_COUNT ? (
            <p className="mt-1 text-[11px] text-amber-300/75">
              До следующей формы: {Math.round(progressToNextStage)}%
            </p>
          ) : (
            <p className="mt-1 text-[11px] font-medium text-emerald-400/90">Финальная форма достигнута</p>
          )}
        </div>

        {/* Three-hero stage */}
        <div className="relative mx-auto h-[17.5rem] max-w-2xl sm:h-[20rem] lg:h-[22rem]">
          {/* Spotlight on center */}
          <div className="pointer-events-none absolute inset-x-[18%] top-0 h-[72%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.11),transparent_68%)]" />

          {/* Pedestal */}
          <div className="pointer-events-none absolute bottom-[10%] left-1/2 z-[15] h-5 w-[42%] max-w-[11rem] -translate-x-1/2 rounded-[100%] border border-stone-600/40 bg-gradient-to-b from-stone-600/35 to-stone-900/60 shadow-[0_4px_20px_rgba(0,0,0,0.55)] sm:bottom-[11%] sm:h-6 sm:max-w-[13rem]" />
          <div className="pointer-events-none absolute bottom-[10%] left-1/2 z-[14] h-2 w-[52%] max-w-[14rem] -translate-x-1/2 rounded-[100%] bg-black/45 blur-md sm:bottom-[11%]" />

          <div className="relative flex h-full items-end justify-center">
            {showPast ? (
              <HeroSilhouette
                gender={gender}
                stage={pastStage}
                playerStage={currentStage}
                variant="past"
              />
            ) : null}
            <HeroSilhouette
              gender={gender}
              stage={currentStage}
              playerStage={currentStage}
              variant="current"
            />
            {showFuture ? (
              <HeroSilhouette
                gender={gender}
                stage={futureStage}
                playerStage={currentStage}
                variant="future"
              />
            ) : null}
          </div>
        </div>

        <ProgressPath currentStage={currentStage} progressPercent={progressPercent} />
      </div>
    </section>
  );
}
