import type { HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import {
  getHeroDeathImageCandidates,
  getHeroStageImageCandidates,
} from '../../game/assetPaths';
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

/** Слева: смерть на стадии 1, иначе следующая стадия (+1). Справа: предыдущая (−1). */
export function resolveCodexFlankStages(currentStage: HeroStageNumber): {
  showDeathLeft: boolean;
  leftStage: HeroStageNumber | null;
  rightStage: HeroStageNumber | null;
} {
  const showDeathLeft = currentStage === 1;
  const leftStage =
    !showDeathLeft && currentStage < HERO_STAGE_COUNT
      ? clampStage(currentStage + 1)
      : null;
  const rightStage =
    currentStage > 1
      ? clampStage(currentStage - 1)
      : currentStage === 1
        ? (2 as HeroStageNumber)
        : null;

  return { showDeathLeft, leftStage, rightStage };
}

type HeroSilhouetteProps = {
  gender: HeroGender;
  stage: HeroStageNumber;
  playerStage: HeroStageNumber;
  variant: 'death' | 'left' | 'current' | 'right';
};

function HeroSilhouette({ gender, stage, playerStage, variant }: HeroSilhouetteProps) {
  const meta = getHeroStageMeta(gender, stage);
  const status =
    variant === 'current'
      ? 'current'
      : variant === 'death' || variant === 'right'
        ? 'unlocked'
        : stage > playerStage
          ? 'locked'
          : 'unlocked';

  const wrapperClass =
    variant === 'current'
      ? 'relative z-20 h-[96%] w-[56%] max-w-[22rem] sm:max-w-[26rem] lg:max-w-[30rem]'
      : variant === 'death'
        ? 'absolute bottom-[6%] left-[1%] z-10 isolate hidden h-[86%] w-[40%] max-w-[15rem] opacity-[0.36] sm:block sm:left-[3%] sm:h-[90%] sm:max-w-[17rem] lg:max-w-[19rem]'
        : variant === 'left'
          ? 'absolute bottom-[7%] left-[2%] z-10 hidden h-[80%] w-[36%] max-w-[13rem] opacity-[0.4] sm:block sm:left-[4%] sm:h-[84%] sm:max-w-[15rem] lg:max-w-[17rem]'
          : 'absolute bottom-[7%] right-[2%] z-10 hidden h-[80%] w-[36%] max-w-[13rem] opacity-[0.4] sm:block sm:right-[4%] sm:h-[84%] sm:max-w-[15rem] lg:max-w-[17rem]';

  const imageScaleClass =
    variant === 'death'
      ? 'scale-[1.02] sm:scale-[1.04]'
      : variant === 'current'
        ? 'scale-[1.08] sm:scale-[1.12]'
        : 'scale-[1.02] sm:scale-[1.05]';

  const testId =
    variant === 'death'
      ? 'codex-hero-death'
      : variant === 'left'
        ? 'codex-hero-left'
        : variant === 'current'
          ? 'codex-hero-current'
          : 'codex-hero-right';

  const deathCandidates = variant === 'death' ? getHeroDeathImageCandidates(gender) : undefined;

  return (
    <div data-testid={testId} className={wrapperClass}>
        <GameAssetImage
          variant="hero"
          src={variant === 'death' ? deathCandidates?.[0] : meta.image}
          alt={variant === 'death' ? 'Смерть — предел 200 кг' : meta.title}
          fallbackCandidates={
            variant === 'death'
              ? deathCandidates?.slice(1)
              : getHeroStageImageCandidates(gender, stage).slice(1)
          }
          status={variant === 'current' ? 'current' : status}
          fit="hero"
          className="h-full w-full bg-transparent"
          imageClassName={
            variant === 'death'
              ? 'mix-blend-screen object-contain object-bottom brightness-[0.68] contrast-[0.9] saturate-[0.85]'
              : `${variant !== 'current' ? 'brightness-[0.68] contrast-[0.9] saturate-[0.85]' : ''} ${imageScaleClass}`.trim()
          }
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
      className="relative mx-auto w-full max-w-4xl px-2 pb-1 pt-4"
    >
      <div className="relative h-8">
        <div className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-stone-600/70" />

        <div
          className="absolute left-3 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-600/80 via-amber-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.55)] transition-[width] duration-500"
          style={{ width: `calc((100% - 1.5rem) * ${Math.min(100, Math.max(0, progressPercent)) / 100})` }}
        />

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

function StoneMarker({ className }: { className: string }) {
  return (
    <div
      className={`pointer-events-none absolute z-[12] rounded-[100%] border border-stone-600/35 bg-[radial-gradient(ellipse_at_50%_40%,#3a3530_0%,#1a1816_55%,#0a0908_100%)] shadow-[inset_0_2px_8px_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.5)] ${className}`}
    />
  );
}

export function CodexHeroProgressionScene({
  gender,
  currentStage,
  progressPercent,
  progressToNextStage,
}: CodexHeroProgressionSceneProps) {
  const { showDeathLeft, leftStage, rightStage } = resolveCodexFlankStages(currentStage);
  const currentMeta = getHeroStageMeta(gender, currentStage);

  return (
    <section
      data-testid="codex-hero-progression-scene"
      className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--app-border)_55%,#1a1528)] bg-gradient-to-b from-[#0a0812] via-[#12101c] to-[#08070f] shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
    >
      {/* Cavern atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,color-mix(in_srgb,var(--app-primary)_10%,transparent),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(40,50,70,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_45%,rgba(40,50,70,0.1),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,rgba(0,0,0,0.65),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Mist */}
      <div className="pointer-events-none absolute bottom-[18%] left-[8%] h-24 w-32 rounded-full bg-stone-400/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[22%] right-[10%] h-28 w-36 rounded-full bg-slate-400/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute left-[12%] top-[18%] h-16 w-16 rounded-full bg-stone-400/[0.04] blur-2xl" />

      <div className="relative px-3 pb-2 pt-4 sm:px-5 sm:pt-5">
        <div className="mb-2 text-center">
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

        <div className="relative mx-auto h-[22rem] max-w-5xl sm:h-[28rem] lg:h-[34rem]">
          {/* Spotlight on center hero */}
          <div className="pointer-events-none absolute inset-x-[12%] top-0 h-[82%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.14),transparent_65%)]" />

          {/* Side stone markers */}
          {(showDeathLeft || leftStage) && (
            <StoneMarker className="bottom-[6%] left-[6%] h-3 w-[28%] max-w-[9rem] sm:bottom-[7%] sm:left-[8%] sm:h-3.5 sm:max-w-[10rem]" />
          )}
          {rightStage && (
            <StoneMarker className="bottom-[6%] right-[6%] h-3 w-[28%] max-w-[9rem] sm:bottom-[7%] sm:right-[8%] sm:h-3.5 sm:max-w-[10rem]" />
          )}

          {/* Center pedestal */}
          <div className="pointer-events-none absolute bottom-[7%] left-1/2 z-[15] h-8 w-[48%] max-w-[15rem] -translate-x-1/2 rounded-[100%] border border-stone-500/45 bg-gradient-to-b from-stone-500/40 via-stone-700/50 to-stone-900/70 shadow-[0_6px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] sm:bottom-[8%] sm:h-9 sm:max-w-[17rem]" />
          <div className="pointer-events-none absolute bottom-[7%] left-1/2 z-[14] h-3 w-[58%] max-w-[19rem] -translate-x-1/2 rounded-[100%] bg-black/50 blur-md sm:bottom-[8%]" />

          <div className="relative flex h-full items-end justify-center">
            {showDeathLeft ? (
              <HeroSilhouette
                gender={gender}
                stage={1}
                playerStage={currentStage}
                variant="death"
              />
            ) : null}
            {leftStage ? (
              <HeroSilhouette
                gender={gender}
                stage={leftStage}
                playerStage={currentStage}
                variant="left"
              />
            ) : null}
            <HeroSilhouette
              gender={gender}
              stage={currentStage}
              playerStage={currentStage}
              variant="current"
            />
            {rightStage ? (
              <HeroSilhouette
                gender={gender}
                stage={rightStage}
                playerStage={currentStage}
                variant="right"
              />
            ) : null}
          </div>
        </div>

        <ProgressPath currentStage={currentStage} progressPercent={progressPercent} />
      </div>
    </section>
  );
}
