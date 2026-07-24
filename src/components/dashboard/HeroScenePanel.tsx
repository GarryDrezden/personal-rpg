import { Link } from 'react-router-dom';
import { Coins, Flame } from 'lucide-react';
import { getChapterMeta } from '../../constants/gameChapters';
import { getCompanionMeta, getHeroStageMeta } from '../../game/assetRegistry';
import { useGameHeroState } from '../../hooks/useGameHeroState';
import { useHeroStageAssets } from '../../hooks/useHeroStageAssets';
import { useAppStore } from '../../store/appStore';
import { getDayMoodPhrase, getLevelFromXp, getLevelRankTitle } from '../../utils/dashboard';
import { getPathSetupState } from '../../utils/dashboardPathSetup';
import { getDayStatus } from '../../utils/points';
import { useAppTheme } from '../../hooks/useAppTheme';
import { GameAssetImage } from '../game/GameAssetImage';
import { HeroCompanionOverlay } from '../game/HeroCompanionOverlay';
import { DailyMobMiniCard } from '../game/DailyMobMiniCard';
import { ChapterBossMiniCard } from '../game/ChapterBossMiniCard';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { HeroMilestoneTrack } from './HeroMilestoneTrack';
import { DashboardPathEmptyState } from './DashboardPathEmptyState';

/** ≈ 3× GameSceneBannerCard min-h (7.25rem) + 2× gap между карточками справа */
const DASHBOARD_HERO_HEIGHT = '23rem';

type HeroScenePanelProps = {
  level: number;
  totalXp: number;
  todayPoints: number;
  todayCoins: number;
  availableCoins: number;
};

export function HeroScenePanel({
  level,
  totalXp,
  todayPoints,
  todayCoins,
  availableCoins,
}: HeroScenePanelProps) {
  const { isDarkFantasy } = useAppTheme();
  const game = useGameHeroState();
  const { measurements, settings } = useAppStore();
  const pathSetup = getPathSetupState(measurements, settings);
  const chapter = getChapterMeta(game.chapter);
  const stageMeta = getHeroStageMeta(game.profile.heroGender, game.stage);
  const heroAssets = useHeroStageAssets(game.profile.heroGender, game.stage);
  const companionMeta = getCompanionMeta(game.profile.activeCompanionId);
  const mood = getDayMoodPhrase(todayPoints);
  const rank = getLevelRankTitle(level);
  const xp = getLevelFromXp(totalXp);
  const dayStatus = getDayStatus(todayPoints);
  const displayXp = Math.max(0, todayPoints);
  const badgeVariant = displayXp >= 70 ? 'success' : displayXp >= 40 ? 'default' : 'danger';

  const nextStagePercent = game.hasWeightPath
    ? Math.round(game.stageProgress.progressToNextStage)
    : 0;

  const showMilestones = pathSetup.kind === 'ready';

  const shellClass = isDarkFantasy
    ? 'overflow-hidden rounded-2xl border border-[var(--app-border)] bg-gradient-to-br from-[#171329] via-[#111022] to-[#090812] shadow-[var(--app-shadow)] hero-glow'
    : 'overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-md';

  const sceneBg = isDarkFantasy
    ? 'bg-gradient-to-b from-[#12101c] via-[#161228] to-[#0c0a12]'
    : 'bg-gradient-to-b from-[color-mix(in_srgb,var(--app-primary)_6%,#1a1520)] via-[#1e1a28] to-[#14121c]';

  return (
    <section
      data-testid="dashboard-hero-scene-panel"
      className={shellClass}
    >
      {/* Journey context — верхний блок */}
      <div className="border-b border-[color-mix(in_srgb,var(--app-border)_40%,transparent)] px-3 py-3 sm:px-4 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex shrink-0 items-center rounded-md bg-[var(--app-primary-soft)] px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--app-primary)]">
            Глава {chapter.chapter}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--app-border)_60%,transparent)] bg-black/20 px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--app-primary)]">
            <Coins size={13} />
            {availableCoins.toLocaleString('ru')}
          </span>
        </div>

        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[var(--app-text-muted)]">
          {chapter.title}
        </p>

        <div className="mt-1 flex items-start justify-between gap-3">
          <h1 className="min-w-0 text-lg font-bold leading-tight text-[var(--app-text)] sm:text-xl">
            {stageMeta.title}
          </h1>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--app-text-muted)]">
          <span>{mood}</span>
          <span className="text-[var(--app-border)]" aria-hidden>
            ·
          </span>
          <span className="font-medium text-[var(--app-text)]">{rank}</span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--app-text-muted)]">
          {stageMeta.description}
        </p>

        {pathSetup.kind !== 'ready' ? (
          <DashboardPathEmptyState state={pathSetup} />
        ) : showMilestones ? (
          <HeroMilestoneTrack
            gender={game.profile.heroGender}
            currentStage={game.stage}
            progressPercent={game.progressPercent}
          />
        ) : null}

        {showMilestones && game.stage < 20 ? (
          <p className="mt-2 text-[11px] text-[var(--app-text-muted)]">
            До следующей стадии:{' '}
            <span className="font-semibold tabular-nums text-[var(--app-primary)]">
              {nextStagePercent}%
            </span>
          </p>
        ) : null}
      </div>

      {/*
        Герой — минимум половина ширины на desktop; баннеры босса и моба — правая колонка.
      */}
      <div className="grid min-h-0 grid-cols-1 lg:grid-cols-2">
        {/* Hero + compact companion overlay */}
        <div className={`relative min-h-[24rem] overflow-hidden lg:min-h-[25rem] ${sceneBg}`}>
          {/* Stylized cavern backdrop — CSS only, no heavy image */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            data-testid="hero-scene-backdrop"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(90,110,160,0.18),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(0,0,0,0.72),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_45%,rgba(45,55,85,0.22),transparent_42%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_40%,rgba(40,50,75,0.18),transparent_40%)]" />
            {/* Distant pillar silhouettes */}
            <div className="absolute bottom-[12%] left-[2%] h-[78%] w-[11%] -skew-x-2 rounded-t-[40%] bg-gradient-to-t from-[#0a0910] via-[#151320]/90 to-transparent opacity-70" />
            <div className="absolute bottom-[10%] left-[9%] h-[62%] w-[7%] skew-x-1 rounded-t-[45%] bg-gradient-to-t from-[#0b0a12] via-[#12101a]/75 to-transparent opacity-55" />
            <div className="absolute bottom-[10%] right-[3%] h-[74%] w-[10%] skew-x-2 rounded-t-[40%] bg-gradient-to-t from-[#0a0910] via-[#151320]/88 to-transparent opacity-65" />
            <div className="absolute bottom-[12%] right-[11%] h-[55%] w-[6%] -skew-x-1 rounded-t-[45%] bg-gradient-to-t from-[#0b0a12] via-[#12101a]/70 to-transparent opacity-50" />
            {/* Soft mist */}
            <div className="absolute bottom-[16%] left-[12%] h-20 w-28 rounded-full bg-slate-400/[0.06] blur-3xl" />
            <div className="absolute bottom-[20%] right-[14%] h-24 w-32 rounded-full bg-stone-300/[0.05] blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
            {/* Stone pedestal under hero */}
            <div className="absolute bottom-[4%] left-1/2 z-[5] h-7 w-[52%] max-w-[13rem] -translate-x-1/2 rounded-[100%] border border-stone-500/40 bg-gradient-to-b from-stone-500/35 via-stone-700/45 to-stone-950/80 shadow-[0_6px_20px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)]" />
            <div className="absolute bottom-[4%] left-1/2 z-[4] h-2.5 w-[62%] max-w-[15rem] -translate-x-1/2 rounded-[100%] bg-black/45 blur-md" />
            <div className="absolute bottom-[5.5%] left-1/2 z-[6] h-px w-[28%] max-w-[7rem] -translate-x-1/2 bg-amber-300/25" />
          </div>

          <div className="absolute left-2 top-2 z-20 rounded-full border border-[var(--app-border)] bg-black/45 px-2.5 py-0.5 text-xs font-bold text-[var(--app-primary)] backdrop-blur-sm">
            Ур. {level}
          </div>

          <div className="relative z-10 flex h-full min-h-[24rem] items-end justify-center overflow-visible px-2 pb-2 pt-4 lg:min-h-[25rem] lg:px-4 lg:pb-3 lg:pt-5">
            <div
              data-testid="hero-scene-character"
              className="relative z-10 flex w-full max-w-[20rem] items-end justify-center overflow-visible bg-transparent sm:max-w-[22rem] lg:max-w-[24rem]"
              style={{ height: DASHBOARD_HERO_HEIGHT, maxHeight: 'calc(100% - 1.5rem)' }}
            >
              <div className="relative h-full w-full max-w-[12.5rem] sm:max-w-[13.5rem] lg:max-w-[14.5rem]">
                <GameAssetImage
                  variant="hero"
                  src={heroAssets.src}
                  alt={stageMeta.title}
                  fallbackCandidates={heroAssets.fallbackCandidates}
                  status="unlocked"
                  fit="hero"
                  className="relative z-10 h-full w-full items-end bg-transparent"
                  imageClassName=""
                />
                <HeroCompanionOverlay
                  companionId={game.profile.activeCompanionId}
                  side="left"
                />
              </div>
            </div>

            <div
              data-testid="hero-scene-companion"
              className="absolute bottom-3 right-2 z-30 max-w-[7.5rem] rounded-lg border border-amber-400/35 bg-black/50 px-2 py-1.5 backdrop-blur-sm sm:bottom-4 sm:right-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-200/90">
                Спутник
              </p>
              <p className="truncate text-[11px] font-semibold leading-tight text-amber-100">
                {companionMeta.title}
              </p>
              <Link
                to="/today"
                className="mt-0.5 block truncate text-[10px] font-medium text-amber-300/85 hover:text-amber-200 hover:underline"
              >
                Квесты дня →
              </Link>
            </div>
          </div>
        </div>

        {/* Boss + Mob — правая колонка (≤ половины ширины) */}
        <div className="flex flex-col justify-center gap-2.5 border-t border-[color-mix(in_srgb,var(--app-border)_40%,transparent)] p-2.5 sm:p-3 lg:border-t-0 lg:border-l lg:p-3">
          <ChapterBossMiniCard
            bossId={game.bossId}
            chapter={game.chapter}
            status={game.bossStatus}
          />
          <DailyMobMiniCard mobId={game.dailyMobId} />
        </div>
      </div>

      {/* Game HUD — unchanged weight */}
      <div
        className={`flex flex-col gap-2 border-t px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2 sm:px-4 ${
          isDarkFantasy
            ? 'border-[color-mix(in_srgb,var(--app-border)_50%,transparent)] bg-black/25'
            : 'border-amber-200/60 bg-amber-50/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">Уровень</span>
          <span className="text-2xl font-bold tabular-nums leading-none text-[var(--app-primary)]">
            {level}
          </span>
          <span className="hidden items-center gap-1 rounded-lg bg-black/20 px-2 py-1 text-xs font-semibold tabular-nums sm:inline-flex">
            <Flame size={14} className="text-[var(--app-warning)]" />
            {totalXp.toLocaleString('ru')} XP
          </span>
        </div>

        <div className="min-w-[10rem] flex-1">
          <div className="mb-0.5 flex justify-between text-[10px] text-[var(--app-text-muted)] sm:text-xs">
            <span>До ур. {level + 1}</span>
            <span className="tabular-nums">
              {xp.currentLevelXp.toLocaleString('ru')} / {xp.nextLevelXp.toLocaleString('ru')}
            </span>
          </div>
          <ProgressBar value={xp.progressToNextLevel} color="gold" className="h-1.5 sm:h-2" />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="text-sm">
            <span className="font-bold tabular-nums text-[var(--app-primary)]">+{displayXp} XP</span>
            <span className="ml-1.5 text-xs text-[var(--app-text-muted)]">· +{todayCoins} 🪙</span>
          </div>
          <Badge variant={badgeVariant} className="shrink-0 text-xs">
            {dayStatus}
          </Badge>
        </div>
      </div>
    </section>
  );
}
