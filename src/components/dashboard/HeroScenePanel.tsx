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
    ? 'bg-gradient-to-b from-[#12101c] via-[#161422] to-[color-mix(in_srgb,var(--app-primary)_12%,#0c0b12)]'
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
        <div className={`relative min-h-[24rem] lg:min-h-[25rem] ${sceneBg}`}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,color-mix(in_srgb,var(--app-primary)_22%,transparent),transparent_55%)]" />

          <div className="absolute left-2 top-2 z-20 rounded-full border border-[var(--app-border)] bg-black/45 px-2.5 py-0.5 text-xs font-bold text-[var(--app-primary)] backdrop-blur-sm">
            Ур. {level}
          </div>

          <div className="relative flex h-full min-h-[24rem] items-end justify-center px-2 pb-2 pt-4 lg:min-h-[25rem] lg:px-4 lg:pb-3 lg:pt-5">
            <div className="pointer-events-none absolute inset-x-[18%] bottom-3 h-3 rounded-[100%] bg-black/35 blur-md" />
            <div className="pointer-events-none absolute inset-x-[22%] bottom-2.5 h-1 rounded-full bg-[color-mix(in_srgb,var(--app-primary)_28%,transparent)] opacity-55" />

            <div
              data-testid="hero-scene-character"
              className="relative z-10 flex w-full max-w-[13.5rem] items-end justify-center overflow-visible bg-transparent sm:max-w-[14.5rem] lg:max-w-[15.5rem]"
              style={{ height: DASHBOARD_HERO_HEIGHT, maxHeight: 'calc(100% - 1.5rem)' }}
            >
              <GameAssetImage
                variant="hero"
                src={heroAssets.src}
                alt={stageMeta.title}
                fallbackCandidates={heroAssets.fallbackCandidates}
                status="unlocked"
                fit="hero"
                className="relative z-10 h-full w-full items-end bg-transparent"
              />
              <HeroCompanionOverlay
                companionId={game.profile.activeCompanionId}
                side="left"
              />
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
