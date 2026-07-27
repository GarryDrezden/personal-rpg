import { Link } from 'react-router-dom';
import { Coins, Flame } from 'lucide-react';
import { getChapterMeta } from '../../constants/gameChapters';
import { getCompanionImageCandidates, getHeroSceneBackdropPath } from '../../game/assetPaths';
import { getCompanionMeta, getHeroStageMeta } from '../../game/assetRegistry';
import { useGameHeroState } from '../../hooks/useGameHeroState';
import { useHeroStageAssets } from '../../hooks/useHeroStageAssets';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAppStore } from '../../store/appStore';
import { getDayMoodPhrase, getLevelFromXp, getLevelRankTitle } from '../../utils/dashboard';
import { getPathSetupState } from '../../utils/dashboardPathSetup';
import { getDayStatus } from '../../utils/points';
import type { DailyEntry } from '../../types';
import type { CompanionId } from '../../types/gameAssets';
import type { NextBestAction } from '../../types/nextBestAction';
import type { MomentumSummary } from '../../types/momentum';
import { GameAssetImage } from '../game/GameAssetImage';
import { ChapterBossMiniCard } from '../game/ChapterBossMiniCard';
import { DailyMobMiniCard } from '../game/DailyMobMiniCard';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { HeroMilestoneTrack } from './HeroMilestoneTrack';
import { DashboardPathEmptyState } from './DashboardPathEmptyState';
import { DashboardPrimaryCta } from './DashboardPrimaryCta';
import { DailyQuestsCompact } from './DailyQuestsCompact';
import { DashboardResourceCompact } from '../rest/DashboardResourceCompact';
import { RecoveryCompactPanel } from './RecoveryCompactPanel';

const HERO_HEIGHT = '22rem';

type DashboardCommandBridgeProps = {
  level: number;
  totalXp: number;
  todayPoints: number;
  todayCoins: number;
  availableCoins: number;
  primaryAction: NextBestAction;
  todayEntry: DailyEntry | undefined;
  today: string;
  showMomentumHelp: boolean;
  showRecovery: boolean;
  momentumSummary: MomentumSummary;
  onAcceptMomentumRecovery: () => void;
  onAcceptMomentumMinimal: () => void;
  onDismissMomentumHelp: () => void;
};

function CompanionStatusChip({ companionId }: { companionId: CompanionId }) {
  const meta = getCompanionMeta(companionId);
  const candidates = getCompanionImageCandidates(companionId);

  return (
    <Link
      to="/settings"
      data-testid="companion-status-chip"
      className="inline-flex max-w-[11rem] items-center gap-2.5 rounded-2xl border border-amber-400/40 bg-black/55 py-1.5 pl-1.5 pr-3 shadow-[0_4px_16px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-amber-300/60 hover:bg-black/65 sm:max-w-[13rem]"
    >
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-amber-900/30 to-black/50 ring-1 ring-amber-400/25 sm:h-16 sm:w-16">
        <GameAssetImage
          variant="companion"
          src={meta.image}
          alt=""
          fallbackCandidates={candidates.slice(1)}
          status="unlocked"
          fit="companion"
          className="h-full w-full bg-transparent"
          imageClassName="object-contain object-bottom scale-110"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-amber-200/85">
          Спутник
        </span>
        <span className="block truncate text-sm font-bold leading-tight text-amber-50">
          {meta.title}
        </span>
      </span>
    </Link>
  );
}

export function DashboardCommandBridge({
  level,
  totalXp,
  todayPoints,
  todayCoins,
  availableCoins,
  primaryAction,
  todayEntry,
  today,
  showMomentumHelp,
  showRecovery,
  momentumSummary,
  onAcceptMomentumRecovery,
  onAcceptMomentumMinimal,
  onDismissMomentumHelp,
}: DashboardCommandBridgeProps) {
  const { isDarkFantasy } = useAppTheme();
  const game = useGameHeroState();
  const { measurements, settings, dailyEntries } = useAppStore();
  const pathSetup = getPathSetupState(measurements, settings);
  const chapter = getChapterMeta(game.chapter);
  const stageMeta = getHeroStageMeta(game.profile.heroGender, game.stage);
  const heroAssets = useHeroStageAssets(game.profile.heroGender, game.stage);
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
  const backdropSrc = getHeroSceneBackdropPath();

  const shellClass = isDarkFantasy
    ? 'overflow-hidden rounded-2xl border border-[var(--app-border)] bg-gradient-to-br from-[#171329] via-[#111022] to-[#090812] shadow-[var(--app-shadow)] hero-glow'
    : 'overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-md';

  return (
    <section data-testid="dashboard-command-bridge" className={shellClass}>
      {/* Slim journey header */}
      <div className="border-b border-[color-mix(in_srgb,var(--app-border)_40%,transparent)] px-3 py-2.5 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex shrink-0 items-center rounded-md bg-[var(--app-primary-soft)] px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--app-primary)]">
              Глава {chapter.chapter}
            </span>
            <h1 className="min-w-0 text-base font-bold leading-tight text-[var(--app-text)] sm:text-lg">
              {stageMeta.title}
            </h1>
            <span className="hidden text-sm text-[var(--app-text-muted)] sm:inline">
              · {mood} · {rank}
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--app-border)_60%,transparent)] bg-black/20 px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--app-primary)]">
            <Coins size={13} />
            {availableCoins.toLocaleString('ru')}
          </span>
        </div>

        {pathSetup.kind !== 'ready' ? (
          <div className="mt-2">
            <DashboardPathEmptyState state={pathSetup} />
          </div>
        ) : showMilestones ? (
          <div className="mt-2">
            <HeroMilestoneTrack
              gender={game.profile.heroGender}
              currentStage={game.stage}
              progressPercent={game.progressPercent}
            />
            {game.stage < 20 ? (
              <p className="mt-1 text-[11px] text-[var(--app-text-muted)]">
                До следующей стадии:{' '}
                <span className="font-semibold tabular-nums text-[var(--app-primary)]">
                  {nextStagePercent}%
                </span>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Command bridge: threats | hero | day */}
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(11rem,0.95fr)_minmax(0,1.35fr)_minmax(14rem,1.05fr)]">
        {/* Left — threats */}
        <div
          data-testid="command-bridge-threats"
          className="flex flex-col gap-2.5 border-b border-[color-mix(in_srgb,var(--app-border)_40%,transparent)] p-2.5 sm:p-3 lg:border-b-0 lg:border-r"
        >
          <ChapterBossMiniCard
            bossId={game.bossId}
            chapter={game.chapter}
            status={game.bossStatus}
            layout="portrait"
          />
          <DailyMobMiniCard mobId={game.dailyMobId} layout="portrait" />
        </div>

        {/* Center — hero scene */}
        <div
          data-testid="command-bridge-hero"
          className="relative min-h-[22rem] overflow-hidden border-b border-[color-mix(in_srgb,var(--app-border)_40%,transparent)] bg-[#0c0a12] lg:min-h-[28rem] lg:border-b-0 lg:border-r"
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <img
              src={backdropSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
            <div className="absolute bottom-[7%] left-1/2 h-3 w-[42%] max-w-[11rem] -translate-x-1/2 rounded-[100%] bg-black/45 blur-md" />
          </div>

          <div className="absolute left-2 top-2 z-20 rounded-full border border-[var(--app-border)] bg-black/45 px-2.5 py-0.5 text-xs font-bold text-[var(--app-primary)] backdrop-blur-sm">
            Ур. {level}
          </div>

          <div className="absolute right-2 top-2 z-20">
            <CompanionStatusChip companionId={game.profile.activeCompanionId} />
          </div>

          <div className="relative z-10 flex h-full min-h-[22rem] items-end justify-center px-2 pb-3 pt-10 lg:min-h-[28rem]">
            <div
              data-testid="hero-scene-character"
              className="relative flex w-full max-w-[16rem] items-end justify-center sm:max-w-[18rem]"
              style={{ height: HERO_HEIGHT, maxHeight: 'calc(100% - 2rem)' }}
            >
              <GameAssetImage
                variant="hero"
                src={heroAssets.src}
                alt={stageMeta.title}
                fallbackCandidates={heroAssets.fallbackCandidates}
                status="unlocked"
                fit="hero"
                className="relative z-10 h-full w-full items-end bg-transparent"
                imageClassName="drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
        </div>

        {/* Right — day actions */}
        <div
          data-testid="command-bridge-day"
          className="flex flex-col gap-2.5 p-2.5 sm:p-3"
        >
          <DashboardPrimaryCta action={primaryAction} />
          <DashboardResourceCompact entry={todayEntry} />
          {showMomentumHelp ? (
            <RecoveryCompactPanel
              variant="momentum"
              summary={momentumSummary}
              onSetRecoveryMode={() => void onAcceptMomentumRecovery()}
              onSetMinimalMode={() => void onAcceptMomentumMinimal()}
              onDismiss={onDismissMomentumHelp}
            />
          ) : showRecovery ? (
            <RecoveryCompactPanel
              variant="recovery"
              today={today}
              dailyEntries={dailyEntries}
              settings={settings}
              todayEntry={todayEntry}
            />
          ) : null}
          <DailyQuestsCompact
            entry={todayEntry}
            dailyEntries={dailyEntries}
            settings={settings}
            date={today}
          />
        </div>
      </div>

      {/* HUD strip */}
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
