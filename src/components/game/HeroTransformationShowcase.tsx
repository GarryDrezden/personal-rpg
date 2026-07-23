import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Scale, Skull } from 'lucide-react';
import type { HeroGender, HeroStageMeta, HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { HERO_MILESTONE_STAGES } from '../../constants/heroMilestones';
import { getChapterMeta } from '../../constants/gameChapters';
import { getHeroStageMeta } from '../../game/assetRegistry';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useHeroDeathAssets, useHeroStageAssets } from '../../hooks/useHeroStageAssets';
import {
  isStageUnlocked,
  resolveMilestoneFlankStages,
} from '../../utils/heroTransformationShowcase';
import { GameAssetImage } from './GameAssetImage';

export type HeroTransformationShowcaseProps = {
  gender: HeroGender;
  currentStage: HeroStageNumber;
  stages: HeroStageMeta[];
  progressPercent: number;
  /** Последний замер веса — для бейджа на центральном герое */
  currentWeightKg?: number | null;
  onStageSelect?: (stage: HeroStageNumber) => void;
};

const DEATH_BADGE_CLASS =
  'absolute bottom-[14%] left-1/2 z-[2] flex -translate-x-1/2 items-center gap-1 rounded-full border border-red-800/50 bg-black/65 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300/90 backdrop-blur-sm';

const HERO_WEIGHT_BADGE_CLASS =
  'absolute bottom-[14%] left-1/2 z-[5] flex -translate-x-1/2 items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--app-primary)_55%,#000)] bg-black/65 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--app-primary)] backdrop-blur-sm';

function formatWeightKg(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded} кг` : `${rounded.toFixed(1)} кг`;
}

const MILESTONE_SET = new Set<number>(HERO_MILESTONE_STAGES);

/** Компактная сцена; аватары +35% от базовых размеров */
const SHOWCASE_H = 'h-[600px] sm:h-[640px] lg:h-[660px]';
/** Место под шкалу + подпись (чтобы текст не наезжал на трек) */
const HERO_ZONE_BOTTOM = 'bottom-[148px]';
const HERO_H = 'clamp(351px, 54vw, 479px)';
const HERO_W = 'min(92vw, 43rem)';
const HERO_BOTTOM = 'bottom-0';

const FLANK_H = 'clamp(270px, 46vw, 419px)';
const FLANK_MAX_W = 'max-w-[27rem] sm:max-w-[30rem] lg:max-w-[32rem]';
const MOBILE_FLANK_H = 'clamp(243px, 51vw, 351px)';

type GhostSide = 'left' | 'right';

type FlankFigureProps = {
  gender: HeroGender;
  stage: HeroStageNumber;
  side: GhostSide;
  playerStage: HeroStageNumber;
  /** Future ghosts read clearer than past */
  variant: 'past' | 'future';
};

function FlankFigure({ gender, stage, side, playerStage, variant }: FlankFigureProps) {
  const meta = getHeroStageMeta(gender, stage);
  const heroAssets = useHeroStageAssets(gender, stage);
  const locked = stage > playerStage;
  const testId =
    side === 'left' ? 'hero-transformation-left-ghost' : 'hero-transformation-right-ghost';

  const isFuture = variant === 'future';
  const opacity = locked
    ? isFuture
      ? 'opacity-[0.38]'
      : 'opacity-[0.30]'
    : isFuture
      ? 'opacity-[0.42]'
      : 'opacity-[0.36]';

  const posClass =
    side === 'left'
      ? 'left-[6%] sm:left-[8%] lg:left-[10%]'
      : 'right-[6%] sm:right-[8%] lg:right-[10%]';

  return (
    <div
      data-testid={testId}
      className={`pointer-events-none absolute ${HERO_BOTTOM} z-[2] hidden w-[42%] ${FLANK_MAX_W} sm:block ${posClass}`}
      style={{ height: FLANK_H }}
    >
      {/* Column vignette */}
      <div
        className={`pointer-events-none absolute -inset-x-6 -inset-y-4 z-0 rounded-full blur-2xl ${
          side === 'left' ? 'bg-red-950/20' : 'bg-sky-950/15'
        }`}
      />

      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-7 w-[82%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-lg" />
      <div className="pointer-events-none absolute bottom-1 left-1/2 z-0 h-3.5 w-[72%] -translate-x-1/2 rounded-[50%] border border-stone-600/30 bg-stone-900/35" />

      <div className={`relative z-[1] h-full w-full ${opacity}`}>
        <GameAssetImage
          variant="hero"
          src={heroAssets.src}
          alt={meta.title}
          fallbackCandidates={heroAssets.fallbackCandidates}
          status="unlocked"
          fit="hero"
          className="h-full w-full bg-transparent"
          imageClassName={`object-contain object-bottom ${
            isFuture
              ? 'brightness-[0.88] contrast-[0.96] saturate-[0.95]'
              : 'brightness-[0.82] contrast-[0.94] saturate-[0.9]'
          }`}
        />
      </div>

      {locked ? (
        <span className="absolute bottom-[16%] left-1/2 z-[2] flex -translate-x-1/2 items-center gap-1 rounded-full border border-amber-400/30 bg-black/50 px-2 py-0.5 text-[10px] font-medium text-amber-100/90 backdrop-blur-sm">
          <Lock size={10} aria-hidden />
          <span className="hidden sm:inline">Будущая форма</span>
        </span>
      ) : null}
    </div>
  );
}

type DeathEntityProps = {
  gender: HeroGender;
};

function DeathEntity({ gender }: DeathEntityProps) {
  const deathAssets = useHeroDeathAssets(gender);

  return (
    <div
      data-testid="hero-transformation-death-entity"
      className={`pointer-events-none absolute ${HERO_BOTTOM} left-[2%] z-[2] hidden w-[48%] ${FLANK_MAX_W} sm:block lg:left-[4%]`}
      style={{ height: FLANK_H }}
    >
      <div className="pointer-events-none absolute -inset-x-8 -inset-y-6 z-0 rounded-full bg-amber-950/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-8 w-[88%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-xl" />
      <div className="pointer-events-none absolute bottom-1 left-1/2 z-0 h-4 w-[76%] -translate-x-1/2 rounded-[50%] border border-stone-700/40 bg-black/50" />

      <div className="relative z-[1] h-full w-full opacity-[0.72]">
        <GameAssetImage
          variant="boss"
          src={deathAssets.src}
          alt="Смерть — предел 200 кг"
          fallbackCandidates={deathAssets.fallbackCandidates}
          status="unlocked"
          fit="hero"
          className="h-full w-full bg-transparent"
          imageClassName="object-contain object-bottom brightness-[0.92] saturate-[0.95]"
        />
      </div>

      <span className={DEATH_BADGE_CLASS}>
        <Skull size={11} aria-hidden />
        Смерть · 200 кг
      </span>
    </div>
  );
}

type StageTimelineProps = {
  gender: HeroGender;
  currentStage: HeroStageNumber;
  displayStage: HeroStageNumber;
  progressPercent: number;
  onStageNavigate: (stage: HeroStageNumber) => void;
};

function StageTimeline({
  gender,
  currentStage,
  displayStage,
  progressPercent,
  onStageNavigate,
}: StageTimelineProps) {
  const stageList = Array.from({ length: HERO_STAGE_COUNT }, (_, i) => (i + 1) as HeroStageNumber);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Partial<Record<HeroStageNumber, HTMLButtonElement | null>>>({});

  const scrollToStage = useCallback((stage: HeroStageNumber) => {
    const container = scrollRef.current;
    const dot = dotRefs.current[stage];
    if (!container || !dot) return;

    const containerRect = container.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();
    const offset =
      dotRect.left - containerRect.left - containerRect.width / 2 + dotRect.width / 2;
    container.scrollTo({ left: container.scrollLeft + offset, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToStage(displayStage);
  }, [displayStage, scrollToStage]);

  const navigateStage = useCallback(
    (direction: -1 | 1) => {
      const next = Math.min(
        HERO_STAGE_COUNT,
        Math.max(1, displayStage + direction),
      ) as HeroStageNumber;
      scrollToStage(next);
      onStageNavigate(next);
    },
    [displayStage, onStageNavigate, scrollToStage],
  );

  const handleTrackClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest('button[data-testid^="hero-stage-dot-"]')) {
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      navigateStage(event.clientX - rect.left > rect.width / 2 ? 1 : -1);
    },
    [navigateStage],
  );

  const handleDotClick = useCallback(
    (stage: HeroStageNumber) => {
      scrollToStage(stage);
      onStageNavigate(stage);
    },
    [onStageNavigate, scrollToStage],
  );

  const canGoPrev = displayStage > 1;
  const canGoNext = displayStage < HERO_STAGE_COUNT;

  return (
    <div
      data-testid="hero-stage-timeline"
      className="absolute bottom-[76px] left-1/2 z-[5] flex w-[94%] max-w-4xl -translate-x-1/2 items-center gap-1.5 sm:bottom-[80px] sm:gap-2"
    >
      <button
        type="button"
        data-testid="hero-stage-prev"
        aria-label="Предыдущая стадия"
        disabled={!canGoPrev}
        onClick={() => navigateStage(-1)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/35 bg-black/55 text-amber-200 shadow-[0_0_12px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-amber-300/60 hover:bg-black/70 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-amber-400/35 disabled:hover:bg-black/55"
      >
        <ChevronLeft size={22} strokeWidth={2.25} aria-hidden />
      </button>

      <div
        ref={scrollRef}
        data-testid="hero-stage-timeline-scroll"
        role="group"
        aria-label="Шкала стадий героя"
        onClick={handleTrackClick}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            navigateStage(-1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            navigateStage(1);
          }
        }}
        tabIndex={0}
        className="min-w-0 flex-1 cursor-pointer overflow-x-auto rounded-lg outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-amber-400/70 [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative min-w-[36rem] px-1">
          <div className="relative h-10">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-stone-800/90 shadow-inner" />

            <div
              className="pointer-events-none absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.65)] transition-[width] duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />

            <div className="relative flex h-full items-center justify-between">
              {stageList.map((stage) => {
                const unlocked = isStageUnlocked(stage, currentStage);
                const isCurrentMarker = stage === displayStage;
                const isPast = stage < currentStage;
                const isMilestone = MILESTONE_SET.has(stage);

                return (
                  <div
                    key={stage}
                    className="pointer-events-none flex h-10 w-0 flex-1 items-center justify-center"
                  >
                    <button
                      ref={(el) => {
                        dotRefs.current[stage] = el;
                      }}
                      type="button"
                      data-testid={`hero-stage-dot-${stage}`}
                      title={
                        unlocked
                          ? `Стадия ${stage}`
                          : `Откроется на ${getHeroStageMeta(gender, stage).progressPercent}%`
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDotClick(stage);
                      }}
                      className={`group pointer-events-auto relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 ${
                        unlocked ? 'cursor-pointer' : 'cursor-pointer'
                      }`}
                    >
                      {isCurrentMarker ? (
                        <div
                          data-testid="hero-stage-current-marker"
                          className="relative flex h-8 w-8 items-center justify-center"
                        >
                          <div className="absolute inset-0 scale-125 rounded-sm bg-amber-400/30 blur-lg" />
                          <div className="absolute h-7 w-7 rotate-45 rounded-sm border-2 border-amber-50/95 bg-gradient-to-br from-amber-100 via-amber-400 to-amber-600 shadow-[0_0_24px_rgba(251,191,36,0.9),0_0_48px_rgba(251,191,36,0.4)]" />
                          <span className="sr-only">Текущая стадия {stage}</span>
                        </div>
                      ) : (
                        <div
                          className={`rounded-full transition group-hover:scale-125 ${
                            isMilestone ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'
                          } ${
                            isPast
                              ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                              : unlocked
                                ? 'bg-amber-500/85 shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                                : 'border border-stone-500/75 bg-stone-950/95'
                          }`}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        data-testid="hero-stage-next"
        aria-label="Следующая стадия"
        disabled={!canGoNext}
        onClick={() => navigateStage(1)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/35 bg-black/55 text-amber-200 shadow-[0_0_12px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-amber-300/60 hover:bg-black/70 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-amber-400/35 disabled:hover:bg-black/55"
      >
        <ChevronRight size={22} strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}

type MobileGhostHeroProps = {
  gender: HeroGender;
  stage: HeroStageNumber;
  brightness: string;
};

function MobileGhostHero({ gender, stage, brightness }: MobileGhostHeroProps) {
  const heroAssets = useHeroStageAssets(gender, stage);

  return (
    <GameAssetImage
      variant="hero"
      src={heroAssets.src}
      alt=""
      fallbackCandidates={heroAssets.fallbackCandidates}
      fit="hero"
      className="h-full w-full"
      imageClassName={
        brightness === '0.55'
          ? 'object-contain object-bottom brightness-[0.55]'
          : 'object-contain object-bottom brightness-[0.65]'
      }
    />
  );
}

export function HeroTransformationShowcase({
  gender,
  currentStage,
  stages,
  progressPercent,
  currentWeightKg = null,
  onStageSelect,
}: HeroTransformationShowcaseProps) {
  const { isDarkFantasy } = useAppTheme();
  const [previewStage, setPreviewStage] = useState<HeroStageNumber | null>(null);
  const [browseStage, setBrowseStage] = useState<HeroStageNumber | null>(null);
  const [lockedHint, setLockedHint] = useState<string | null>(null);

  const displayStage = browseStage ?? previewStage ?? currentStage;
  const displayHeroAssets = useHeroStageAssets(gender, displayStage);
  const deathAssets = useHeroDeathAssets(gender);
  const displayMeta = useMemo(
    () => stages.find((s) => s.stage === displayStage) ?? getHeroStageMeta(gender, displayStage),
    [stages, displayStage, gender],
  );
  const chapter = getChapterMeta(displayMeta.chapter);
  const isPreview = displayStage !== currentStage;
  const displayUnlocked = isStageUnlocked(displayStage, currentStage);

  const flanks = useMemo(
    () => resolveMilestoneFlankStages(displayStage),
    [displayStage],
  );

  const handleStageSelect = useCallback(
    (stage: HeroStageNumber) => {
      if (!isStageUnlocked(stage, currentStage)) return;
      setLockedHint(null);
      if (stage === currentStage) {
        setPreviewStage(null);
      } else {
        setPreviewStage(stage);
      }
      onStageSelect?.(stage);
    },
    [currentStage, onStageSelect],
  );

  const handleTimelineNavigate = useCallback(
    (stage: HeroStageNumber) => {
      if (isStageUnlocked(stage, currentStage)) {
        setBrowseStage(null);
        handleStageSelect(stage);
        return;
      }
      setPreviewStage(null);
      setBrowseStage(stage);
      setLockedHint(
        `Стадия ${stage} откроется на ${getHeroStageMeta(gender, stage).progressPercent}% пути`,
      );
    },
    [currentStage, gender, handleStageSelect],
  );

  const darkBgStyle = isDarkFantasy
    ? {
        background: `
          radial-gradient(circle at 50% 28%, rgba(96, 165, 250, 0.16), transparent 32%),
          radial-gradient(circle at 50% 78%, rgba(250, 204, 21, 0.14), transparent 26%),
          radial-gradient(circle at 12% 55%, rgba(127, 29, 29, 0.22), transparent 36%),
          radial-gradient(circle at 88% 52%, rgba(56, 189, 248, 0.1), transparent 34%),
          radial-gradient(circle at 18% 50%, rgba(15, 23, 42, 0.9), transparent 42%),
          radial-gradient(circle at 82% 50%, rgba(15, 23, 42, 0.88), transparent 40%),
          linear-gradient(180deg, #04050e 0%, #0a1020 42%, #050508 100%)
        `,
      }
    : undefined;

  const cozyBgClass = !isDarkFantasy
    ? 'bg-gradient-to-b from-[color-mix(in_srgb,var(--app-primary)_8%,#faf8f5)] via-[var(--app-card)] to-[color-mix(in_srgb,var(--app-bg-soft)_90%,#ebe4da)]'
    : '';

  return (
    <section
      data-testid="hero-transformation-showcase"
      className={`relative overflow-hidden rounded-2xl border ${SHOWCASE_H} ${
        isDarkFantasy
          ? 'border-[color-mix(in_srgb,var(--app-border)_50%,#1a1528)] shadow-[0_12px_40px_rgba(0,0,0,0.55)]'
          : 'border-[var(--app-border)] shadow-[var(--app-shadow)]'
      } ${cozyBgClass}`}
      style={darkBgStyle}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_38%,rgba(0,0,0,0.58)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

      <p className="absolute left-1/2 top-2 z-[6] -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400/85">
        Путь трансформации героя
      </p>

      {isPreview ? (
        <span className="absolute right-2 top-2 z-[6] rounded-full border border-amber-400/35 bg-black/45 px-2 py-0.5 text-[10px] font-medium text-amber-300/90 backdrop-blur-sm sm:right-3">
          Просмотр стадии
        </span>
      ) : null}

      {/* Hero zone — заполняет пространство между заголовком и шкалой */}
      <div className={`absolute inset-x-0 top-6 ${HERO_ZONE_BOTTOM}`}>
        <div className="pointer-events-none absolute inset-x-[18%] top-0 h-full bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.12),transparent_58%)]" />

        <div className="pointer-events-none absolute bottom-0 left-1/2 z-[3] h-8 w-[min(320px,72%)] -translate-x-1/2 rounded-full bg-yellow-400/16 blur-xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-[3] h-6 w-[min(280px,64%)] -translate-x-1/2 rounded-[50%] border border-yellow-300/22 bg-gradient-to-b from-stone-600/28 to-black/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />

        {flanks.deathState ? <DeathEntity gender={gender} /> : null}
        {flanks.left && !flanks.deathState ? (
          <FlankFigure
            gender={gender}
            stage={flanks.left}
            side="left"
            playerStage={currentStage}
            variant="past"
          />
        ) : null}
        {flanks.right ? (
          <FlankFigure
            gender={gender}
            stage={flanks.right}
            side="right"
            playerStage={currentStage}
            variant="future"
          />
        ) : null}

        <div
          data-testid="hero-transformation-current-stage"
          className={`absolute left-1/2 z-[4] -translate-x-1/2 ${HERO_BOTTOM}`}
          style={{ height: HERO_H, width: HERO_W }}
        >
          <GameAssetImage
            variant="hero"
            src={displayHeroAssets.src}
            alt={displayMeta.title}
            fallbackCandidates={displayHeroAssets.fallbackCandidates}
            status={displayUnlocked ? 'current' : 'locked'}
            fit="hero"
            className="h-full w-full bg-transparent drop-shadow-[0_10px_32px_rgba(0,0,0,0.5)]"
            imageClassName="object-contain object-bottom"
          />
          {currentWeightKg !== null ? (
            <span className={HERO_WEIGHT_BADGE_CLASS} data-testid="hero-transformation-weight-badge">
              <Scale size={11} aria-hidden />
              {formatWeightKg(currentWeightKg)}
            </span>
          ) : null}
        </div>

        {flanks.deathState ? (
          <div
            className="pointer-events-none absolute bottom-0 left-[2%] z-[1] w-[42%] opacity-[0.45] sm:hidden"
            style={{ height: MOBILE_FLANK_H }}
            aria-hidden
          >
            <GameAssetImage
              variant="boss"
              src={deathAssets.src}
              alt=""
              fallbackCandidates={deathAssets.fallbackCandidates}
              status="unlocked"
              fit="hero"
              className="h-full w-full bg-transparent"
              imageClassName="object-contain object-bottom brightness-[0.9]"
            />
          </div>
        ) : flanks.left ? (
          <div
            className="pointer-events-none absolute bottom-0 left-[4%] z-[1] w-[38%] opacity-[0.12] sm:hidden"
            style={{ height: MOBILE_FLANK_H }}
            aria-hidden
          >
            <MobileGhostHero gender={gender} stage={flanks.left} brightness="0.55" />
          </div>
        ) : null}
        {flanks.right ? (
          <div
            className="pointer-events-none absolute bottom-0 right-[4%] z-[1] w-[38%] opacity-[0.14] sm:hidden"
            style={{ height: MOBILE_FLANK_H }}
            aria-hidden
          >
            <MobileGhostHero gender={gender} stage={flanks.right} brightness="0.65" />
          </div>
        ) : null}
      </div>

      <StageTimeline
        gender={gender}
        currentStage={currentStage}
        displayStage={displayStage}
        progressPercent={progressPercent}
        onStageNavigate={handleTimelineNavigate}
      />

      {lockedHint ? (
        <p
          data-testid="hero-stage-locked-hint"
          className="absolute bottom-[122px] left-1/2 z-[6] max-w-[90%] -translate-x-1/2 rounded-full border border-stone-500/35 bg-black/65 px-3 py-1 text-center text-[10px] text-stone-200 backdrop-blur-sm sm:bottom-[126px]"
        >
          {lockedHint}
        </p>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-[6] flex min-h-[68px] flex-col items-center justify-end px-3 pb-2 pt-1 text-center">
        <p className="text-sm font-bold leading-tight text-[var(--app-text)]">
          Стадия {displayStage}/{HERO_STAGE_COUNT} — {displayMeta.title}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-[var(--app-text-muted)]">
          Глава {chapter.chapter}: {chapter.title} · {Math.round(progressPercent)}% пути
          {isPreview || browseStage !== null ? ' · просмотр' : ''}
        </p>
        {isPreview || browseStage !== null ? (
          <button
            type="button"
            onClick={() => {
              setPreviewStage(null);
              setBrowseStage(null);
              setLockedHint(null);
            }}
            className="mt-0.5 text-[11px] font-semibold text-amber-400/90 underline-offset-2 hover:text-amber-300 hover:underline"
          >
            Вернуться к текущей
          </button>
        ) : null}
      </div>
    </section>
  );
}
