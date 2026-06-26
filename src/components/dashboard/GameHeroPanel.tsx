import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { getChapterMeta } from '../../constants/gameChapters';
import { getCompanionMeta, getHeroStageMeta } from '../../game/assetRegistry';
import { useGameHeroState } from '../../hooks/useGameHeroState';
import { getDayMoodPhrase, getLevelRankTitle } from '../../utils/dashboard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { LevelProgressCard } from './LevelProgressCard';
import { TodayStatusCard } from './TodayStatusCard';
import { HeroVisualArea } from './HeroVisualArea';
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
    ? 'overflow-hidden rounded-3xl border border-[var(--app-border)] bg-gradient-to-br from-[#171329] via-[#111022] to-[#090812] p-4 shadow-[var(--app-shadow)] hero-glow md:p-5'
    : 'overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 shadow-md md:p-5';

  const statsDivider = isDarkFantasy
    ? 'border-[color-mix(in_srgb,var(--app-border)_55%,transparent)]'
    : 'border-amber-200/70';

  return (
    <section data-testid="game-hero-panel" className={shellClass}>
      <div data-testid="game-character-scene" className="mb-4">
        <HeroVisualArea
          gender={game.profile.heroGender}
          stage={game.stage}
          companionId={game.profile.activeCompanionId}
          level={level}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-primary)] opacity-80">
            Личная RPG
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--app-text)] md:text-3xl">{mood}</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{rank}</p>

          <div className="mt-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-primary)]">
              Глава {chapter.chapter}: {chapter.title}
            </p>
            <p className="text-lg font-semibold text-[var(--app-text)]">{stageMeta.title}</p>
            <p className="text-sm text-[var(--app-text-muted)]">{stageMeta.description}</p>
          </div>

          <p className="mt-2 text-xs text-[var(--app-text-muted)]">
            Активный спутник:{' '}
            <span className="font-semibold text-[var(--app-text)]">{companionMeta.title}</span>
          </p>

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

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <DailyMobBadge mobId={game.dailyMobId} />
          <ChapterBossBadge
            bossId={game.bossId}
            chapter={game.chapter}
            status={game.bossStatus}
          />
        </div>
      </div>

      <div
        className={`mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-stretch sm:gap-0 ${statsDivider}`}
      >
        <LevelProgressCard totalXp={totalXp} integrated />
        <div
          className={`hidden w-px shrink-0 self-stretch sm:block ${
            isDarkFantasy ? 'bg-[var(--app-border)]/40' : 'bg-amber-200/80'
          }`}
        />
        <TodayStatusCard todayPoints={todayPoints} todayCoins={todayCoins} integrated />
      </div>

      <p className="mt-3 text-center text-xs text-[var(--app-text-muted)] lg:text-left">
        <Link
          to="/codex"
          data-testid="dashboard-codex-link"
          className="font-medium text-[var(--app-primary)] hover:underline"
        >
          Кодекс →
        </Link>
        {' · '}
        <Link to="/journey" className="font-medium text-[var(--app-primary)] hover:underline">
          Путь →
        </Link>
      </p>
    </section>
  );
}
