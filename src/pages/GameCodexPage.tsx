import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MOB_IDS } from '../types/gameAssets';
import { useGameHeroState } from '../hooks/useGameHeroState';
import { useAppStore } from '../store/appStore';
import { setActiveCompanionId } from '../game/gameAssetStorage';
import type { CompanionId } from '../types/gameAssets';
import { Card } from '../components/ui/Card';
import { HeroTransformationShowcase } from '../components/game/HeroTransformationShowcase';
import { CompanionSelector } from '../components/game/CompanionSelector';
import { DailyMobCard } from '../components/game/DailyMobCard';
import { ChapterBossCard } from '../components/game/ChapterBossCard';
import { ArtifactGrid } from '../components/game/ArtifactGrid';
import { GAME_CHAPTERS } from '../constants/gameChapters';
import { GAME_ASSET_REGISTRY, getBossMeta, getMobMeta } from '../game/assetRegistry';
import { calcWeightJourney } from '../utils/weightJourney';

export function GameCodexPage() {
  const { saveSettings, settings, measurements } = useAppStore();
  const game = useGameHeroState();

  const weightJourney = useMemo(
    () =>
      calcWeightJourney(
        measurements,
        game.profile.targetWeight ?? settings.weightGoal ?? settings.targetWeight ?? undefined,
      ),
    [measurements, game.profile.targetWeight, settings.weightGoal, settings.targetWeight],
  );

  const handleCompanionChange = async (id: CompanionId) => {
    setActiveCompanionId(id);
    await saveSettings({ ...settings, activeCompanionId: id });
  };

  return (
    <div className="space-y-8 pb-6" data-testid="game-codex-page">
      <header>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Кодекс пути</h1>
        <p className="mt-2 text-sm">
          <Link to="/" className="font-medium text-[var(--app-primary)] hover:underline">
            ← На главную
          </Link>
        </p>
      </header>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--app-text)]">Сцена трансформации</h2>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Путь формы — cinematic-экран прогресса героя.
          </p>
        </div>
        <HeroTransformationShowcase
          gender={game.profile.heroGender}
          currentStage={game.stage}
          stages={GAME_ASSET_REGISTRY.heroStages[game.profile.heroGender]}
          progressPercent={game.progressPercent}
          currentWeightKg={weightJourney.currentWeight}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--app-text)]">Спутники</h2>
        <CompanionSelector
          value={game.profile.activeCompanionId}
          onChange={(id) => void handleCompanionChange(id)}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--app-text)]">Мобы дня</h2>
        <DailyMobCard mobId={game.dailyMobId} />
        <div className="grid gap-3 sm:grid-cols-2">
          {MOB_IDS.map((id) => (
            <Card key={id} className="p-3">
              <p className="font-medium text-[var(--app-text)]">{getMobMeta(id).title}</p>
              <p className="text-xs text-[var(--app-text-muted)]">{getMobMeta(id).subtitle}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--app-text)]">Боссы глав</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {GAME_CHAPTERS.map((chapter) => {
            const boss = getBossMeta(chapter.bossId);
            const status =
              chapter.chapter < game.chapter
                ? 'defeated'
                : chapter.chapter === game.chapter
                  ? 'active'
                  : 'locked';
            return (
              <ChapterBossCard
                key={chapter.chapter}
                bossId={boss.id}
                chapter={chapter.chapter}
                status={status}
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--app-text)]">Артефакты</h2>
        <ArtifactGrid statuses={game.artifactStatuses} />
      </section>
    </div>
  );
}
