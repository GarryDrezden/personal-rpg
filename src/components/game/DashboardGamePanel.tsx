import { Link } from 'react-router-dom';
import { useGameHeroState } from '../../hooks/useGameHeroState';
import { Card } from '../ui/Card';
import { HeroStageCard } from './HeroStageCard';
import { CompanionCard } from './CompanionCard';
import { DailyMobCard } from './DailyMobCard';
import { ChapterBossCard } from './ChapterBossCard';
import { GameJourneyScene } from './GameJourneyScene';

type DashboardGamePanelProps = {
  compact?: boolean;
};

export function DashboardGamePanel({ compact = true }: DashboardGamePanelProps) {
  const game = useGameHeroState();

  return (
    <section className="space-y-4">
      <HeroStageCard
        gender={game.profile.heroGender}
        stage={game.stage}
        progressPercent={game.progressPercent}
        progressToNextStage={game.stageProgress.progressToNextStage}
        hasWeightPath={game.hasWeightPath}
        compact={compact}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <CompanionCard
          companionId={game.profile.activeCompanionId}
          selected
          compact
        />
        <DailyMobCard mobId={game.dailyMobId} compact />
        <ChapterBossCard
          bossId={game.bossId}
          chapter={game.chapter}
          status={game.bossStatus}
          compact
        />
        <Card className="p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
            Сцена пути
          </p>
          <GameJourneyScene
            gender={game.profile.heroGender}
            stage={game.stage}
            companionId={game.profile.activeCompanionId}
          />
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/codex"
          className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-2 text-sm font-medium text-[var(--app-primary)] hover:border-[var(--app-primary)]/40"
        >
          Открыть кодекс →
        </Link>
      </div>
    </section>
  );
}
