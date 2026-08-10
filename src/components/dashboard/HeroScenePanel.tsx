import { Link } from 'react-router-dom';
import { Coins, Flame } from 'lucide-react';
import { getChapterMeta } from '../../constants/gameChapters';
import { getThemeTerm } from '../../constants/themeTerms';
import { getCompanionMeta, getHeroStageMeta } from '../../game/assetRegistry';
import { getCompanionPresentation } from '../../game/themeEntityPresentation';
import { useGameHeroState } from '../../hooks/useGameHeroState';
import { useHeroStageAssets } from '../../hooks/useHeroStageAssets';
import { useAppStore } from '../../store/appStore';
import { getDayMoodPhrase, getLevelFromXp, getLevelRankTitle } from '../../utils/dashboard';
import { getPathSetupState } from '../../utils/dashboardPathSetup';
import { getDayStatus } from '../../utils/points';
import { useAppTheme } from '../../hooks/useAppTheme';
import { getHeroSceneBackdropPath } from '../../game/assetPaths';
import { DailyMobMiniCard } from '../game/DailyMobMiniCard';
import { ChapterBossMiniCard } from '../game/ChapterBossMiniCard';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { HeroMilestoneTrack } from './HeroMilestoneTrack';
import { DashboardPathEmptyState } from './DashboardPathEmptyState';
import { DashboardHeroAvatar } from './DashboardHeroAvatar';
import { useCompanionsVisible } from '../../hooks/useCompanionsVisible';

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
  const { themeId, isDarkFantasy, isCozy } = useAppTheme();
  const game = useGameHeroState();
  const { measurements, settings } = useAppStore();
  const companionsVisible = useCompanionsVisible();
  const pathSetup = getPathSetupState(measurements, settings, themeId);
  const chapter = getChapterMeta(game.chapter);
  const stageMeta = getHeroStageMeta(game.profile.heroGender, game.stage);
  const heroAssets = useHeroStageAssets(game.profile.heroGender, game.bodyStage, {
    heroState: game.heroState,
  });
  const companionMeta = getCompanionMeta(game.profile.activeCompanionId);
  const companionPresentation = getCompanionPresentation(
    themeId,
    game.profile.activeCompanionId,
    companionMeta,
  );
  const backdropSrc = getHeroSceneBackdropPath(themeId);
  const mood = getDayMoodPhrase(todayPoints, themeId);
  const rank = getLevelRankTitle(level, themeId);
  const xp = getLevelFromXp(totalXp);
  const dayStatus = getDayStatus(todayPoints);
  const displayXp = Math.max(0, todayPoints);
  const badgeVariant = displayXp >= 70 ? 'success' : displayXp >= 40 ? 'default' : 'danger';

  const nextStagePercent =
    game.hasWeightPath || game.hasAvatarPath
      ? Math.round(game.stageProgress.progressToNextStage)
      : 0;

  const showMilestones = pathSetup.kind === 'ready';

  const shellClass = isDarkFantasy
    ? 'overflow-hidden rounded-2xl border border-[var(--app-border)] bg-gradient-to-br from-[#171329] via-[#111022] to-[#090812] shadow-[var(--app-shadow)] hero-glow'
    : 'overflow-hidden rounded-2xl border border-[var(--app-border)] bg-gradient-to-br from-[#fff8ee] via-[#f7f0e4] to-[#e8efe4] shadow-[var(--app-shadow)]';

  const sceneBg = isCozy ? 'bg-[#efe4d2]' : 'bg-[#0c0a12]';

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

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[var(--app-text-muted)]">
          <span data-testid="dashboard-avatar-stage">
            Стадия тела: {game.bodyStage} из 20
          </span>
          <span className="text-[var(--app-border)]" aria-hidden>
            ·
          </span>
          <span data-testid="dashboard-hero-state" className="font-semibold text-[var(--app-primary)]">
            Состояние героя: {game.heroStateLabel}
          </span>
          <span className="text-[var(--app-border)]" aria-hidden>
            ·
          </span>
          <Link
            to="/freedom"
            className="font-medium text-[var(--app-primary)] hover:underline"
          >
            Почему изменилось →
          </Link>
        </div>

        {pathSetup.kind !== 'ready' ? (
          <DashboardPathEmptyState state={pathSetup} />
        ) : showMilestones ? (
          <HeroMilestoneTrack
            gender={game.profile.heroGender}
            currentStage={game.stage}
            progressPercent={game.progressPercent}
          />
        ) : null}

        {(showMilestones || game.hasAvatarPath) && game.bodyStage < 20 ? (
          <p className="mt-2 text-[11px] text-[var(--app-text-muted)]">
            До следующей стадии тела:{' '}
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
        <div className={`relative min-h-[26rem] overflow-hidden lg:min-h-[28rem] ${sceneBg}`}>
          {/* Hopeful cliff sunrise backdrop */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            data-testid="hero-scene-backdrop"
          >
            <img
              src={backdropSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
              loading="eager"
              decoding="async"
            />
            <div
              className={`absolute inset-0 ${
                isCozy
                  ? 'bg-gradient-to-b from-[#f1ebe0]/35 via-transparent to-[#efe4d2]/70'
                  : 'bg-gradient-to-b from-black/45 via-black/10 to-black/55'
              }`}
            />
            {!isCozy ? (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,transparent_20%,rgba(0,0,0,0.45)_100%)]" />
            ) : null}
            <div
              className={`absolute bottom-[7%] left-1/2 h-3 w-[48%] max-w-[14rem] -translate-x-1/2 rounded-[100%] blur-md ${
                isCozy ? 'bg-[#8b7355]/25' : 'bg-black/45'
              }`}
            />
          </div>

          <div
            className={`absolute left-2 top-2 z-20 rounded-full border border-[var(--app-border)] px-2.5 py-0.5 text-xs font-bold text-[var(--app-primary)] backdrop-blur-sm ${
              isCozy ? 'bg-[var(--app-card-strong)]/90' : 'bg-black/45'
            }`}
          >
            Ур. {level}
          </div>

          <DashboardHeroAvatar
            themeId={themeId}
            bodyStage={game.bodyStage}
            heroState={game.heroState}
            src={heroAssets.src}
            fallbackCandidates={heroAssets.fallbackCandidates}
            alt={stageMeta.title}
          />

          {companionsVisible ? (
            <div
              data-testid="hero-scene-companion"
              className={`absolute bottom-3 right-2 z-30 max-w-[7.5rem] rounded-lg border px-2 py-1.5 backdrop-blur-sm sm:bottom-4 sm:right-3 ${
                isCozy
                  ? 'border-[var(--app-border)] bg-[var(--app-card-strong)]/92'
                  : 'border-amber-400/35 bg-black/50'
              }`}
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-wide ${
                  isCozy ? 'text-[var(--app-garden)]' : 'text-amber-200/90'
                }`}
              >
                Спутник
              </p>
              <p
                className={`truncate text-[11px] font-semibold leading-tight ${
                  isCozy ? 'text-[var(--app-text)]' : 'text-amber-100'
                }`}
              >
                {companionPresentation.title}
              </p>
              <Link
                to="/today"
                className={`mt-0.5 block truncate text-[10px] font-medium hover:underline ${
                  isCozy
                    ? 'text-[var(--app-garden)] hover:brightness-110'
                    : 'text-amber-300/85 hover:text-amber-200'
                }`}
              >
                {getThemeTerm(themeId, 'quest')} →
              </Link>
            </div>
          ) : null}
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
