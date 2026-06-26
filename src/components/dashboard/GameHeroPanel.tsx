import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { getChapterMeta } from '../../constants/gameChapters';
import {
  getCompanionImageCandidates,
  getHeroStageImageCandidates,
} from '../../game/assetPaths';
import {
  getCompanionMeta,
  getHeroStageMeta,
} from '../../game/assetRegistry';
import { useGameHeroState } from '../../hooks/useGameHeroState';
import { getDayMoodPhrase, getLevelRankTitle } from '../../utils/dashboard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { LevelProgressCard } from './LevelProgressCard';
import { TodayStatusCard } from './TodayStatusCard';
import { GameAssetImage } from '../game/GameAssetImage';
import { DailyMobBadge } from '../game/DailyMobBadge';
import { ChapterBossBadge } from '../game/ChapterBossBadge';

type GameHeroPanelProps = {
  level: number;
  totalXp: number;
  todayPoints: number;
  todayCoins: number;
  availableCoins: number;
};

export function GameHeroPanel({
  level,
  totalXp,
  todayPoints,
  todayCoins,
  availableCoins,
}: GameHeroPanelProps) {
  const { isDarkFantasy } = useAppTheme();
  const game = useGameHeroState();
  const chapter = getChapterMeta(game.chapter);
  const stageMeta = getHeroStageMeta(game.profile.heroGender, game.stage);
  const companionMeta = getCompanionMeta(game.profile.activeCompanionId);
  const mood = getDayMoodPhrase(todayPoints);
  const rank = getLevelRankTitle(level);

  const shellClass = isDarkFantasy
    ? 'overflow-hidden rounded-3xl border border-[var(--app-border)] bg-gradient-to-br from-[#171329] via-[#111022] to-[#090812] p-5 shadow-[var(--app-shadow)] hero-glow md:p-6'
    : 'overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-md md:p-6';

  const statsDivider = isDarkFantasy
    ? 'border-[color-mix(in_srgb,var(--app-border)_55%,transparent)]'
    : 'border-amber-200/70';

  return (
    <section data-testid="game-hero-panel" className={shellClass}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-6">
        <div
          data-testid="game-character-scene"
          className="relative h-72 overflow-hidden rounded-2xl border border-[var(--app-border)] bg-gradient-to-b from-[var(--app-bg-soft)] via-[var(--app-card)] to-[color-mix(in_srgb,var(--app-primary)_10%,var(--app-bg))] sm:h-80"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center_bottom,color-mix(in_srgb,var(--app-primary)_18%,transparent),transparent_65%)]" />
          <div className="absolute bottom-[12%] left-1/2 h-6 w-[58%] -translate-x-1/2 rounded-[100%] bg-black/15 blur-md" />
          <div className="absolute bottom-[12%] left-[14%] h-4 w-[22%] rounded-[100%] bg-black/10 blur-sm" />

          <div className="absolute left-3 top-3 z-20 rounded-full bg-[var(--app-card)]/90 px-3 py-1 text-xs font-bold text-[var(--app-primary)] shadow-sm backdrop-blur-sm">
            Ур. {level}
          </div>
          <div className="absolute right-3 top-3 z-20 rounded-full bg-[var(--app-card)]/90 px-3 py-1 text-xs font-semibold text-[var(--app-text)] shadow-sm backdrop-blur-sm">
            Стадия {game.stage}/{HERO_STAGE_COUNT}
          </div>

          <div className="absolute bottom-0 left-1/2 z-10 h-[82%] w-[50%] -translate-x-1/2">
            <GameAssetImage
              variant="hero"
              src={stageMeta.image}
              alt={stageMeta.title}
              fallbackCandidates={getHeroStageImageCandidates(
                game.profile.heroGender,
                game.stage,
              ).slice(1)}
              status="current"
              className="h-full w-full"
              imageClassName="object-contain object-bottom"
            />
          </div>

          <div className="absolute bottom-1 left-3 z-20 h-[42%] w-[28%] sm:left-6">
            <GameAssetImage
              variant="companion"
              src={companionMeta.image}
              alt={companionMeta.title}
              fallbackCandidates={getCompanionImageCandidates(
                game.profile.activeCompanionId,
              ).slice(1)}
              status="unlocked"
              className="h-full w-full"
              imageClassName="object-contain object-bottom"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-primary)] opacity-80">
              Личная RPG
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[var(--app-text)] md:text-3xl">{mood}</h1>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{rank}</p>

            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-primary)]">
                Глава {chapter.chapter}: {chapter.title}
              </p>
              <p className="text-lg font-semibold text-[var(--app-text)]">{stageMeta.title}</p>
              <p className="text-sm text-[var(--app-text-muted)]">{stageMeta.description}</p>
            </div>

            {game.hasWeightPath ? (
              <div className="mt-3 space-y-1 text-xs text-[var(--app-text-muted)]">
                <p>
                  Стадия {game.stage}/{HERO_STAGE_COUNT} · Прогресс пути:{' '}
                  {Math.round(game.progressPercent)}%
                </p>
                {game.stage < HERO_STAGE_COUNT ? (
                  <p>До следующей стадии: {Math.round(game.stageProgress.progressToNextStage)}%</p>
                ) : (
                  <p className="font-medium text-[var(--app-primary)]">Финальная стадия открыта</p>
                )}
                <p className="text-[11px]">
                  Стадия считается по лучшему достигнутому весу — временные колебания не откатывают
                  героя.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--app-text-muted)]">
                Задай целевой вес в настройках и добавь замеры — откроется шкала стадий.
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--app-primary-soft)] px-3 py-1 text-sm font-semibold text-[var(--app-primary)]">
                <Coins size={14} />
                {availableCoins.toLocaleString('ru')} монет
              </span>
              {todayCoins > 0 && (
                <span className="text-xs text-[var(--app-text-muted)]">+{todayCoins} сегодня</span>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DailyMobBadge mobId={game.dailyMobId} />
            <ChapterBossBadge
              bossId={game.bossId}
              chapter={game.chapter}
              status={game.bossStatus}
            />
          </div>
        </div>
      </div>

      <div
        className={`mt-5 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-stretch sm:gap-0 ${statsDivider}`}
      >
        <LevelProgressCard totalXp={totalXp} integrated />
        <div
          className={`hidden w-px shrink-0 self-stretch sm:block ${
            isDarkFantasy ? 'bg-[var(--app-border)]/40' : 'bg-amber-200/80'
          }`}
        />
        <TodayStatusCard todayPoints={todayPoints} todayCoins={todayCoins} integrated />
      </div>

      <p className="mt-4 text-center text-xs text-[var(--app-text-muted)] lg:text-left">
        <Link to="/codex" data-testid="dashboard-codex-link" className="font-medium text-[var(--app-primary)] hover:underline">
          Кодекс: стадии, спутники, мобы, боссы, артефакты →
        </Link>
        {' · '}
        <Link to="/journey" className="font-medium text-[var(--app-primary)] hover:underline">
          Путь и главы →
        </Link>
      </p>
    </section>
  );
}
