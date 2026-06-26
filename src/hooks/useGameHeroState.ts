import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { todayISO } from '../utils/dates';
import { getMomentumSummary } from '../utils/momentumEngine';
import type { ArtifactId, AssetUnlockStatus } from '../types/gameAssets';
import { getChapterBossId, getBossChapterStatus } from '../game/assetRegistry';
import { getArtifactUnlockStatus } from '../game/artifactUnlockEngine';
import { getOrCreateDailyMob } from '../game/dailyMobEngine';
import { resolveGameProfile } from '../game/gameProfile';
import {
  getNextStageProgress,
  resolveHeroProgressFromMeasurements,
} from '../game/heroProgressEngine';
import { GAME_ASSET_REGISTRY } from '../game/assetRegistry';

export function useGameHeroState() {
  const { measurements, settings, dailyEntries } = useAppStore();
  const today = todayISO();
  const profile = resolveGameProfile(settings);

  return useMemo(() => {
    const progress = resolveHeroProgressFromMeasurements(measurements, profile.targetWeight);
    const stageProgress = getNextStageProgress({
      progressPercent: progress.progressPercent,
      currentStage: progress.stage,
    });
    const bossId = getChapterBossId(progress.chapter);
    const bossStatus = getBossChapterStatus({
      bossChapter: progress.chapter,
      currentChapter: progress.chapter,
    });
    const dailyMobId = getOrCreateDailyMob(today);
    const momentumSummary = getMomentumSummary({ today, dailyEntries, settings });

    const artifactStatuses = Object.keys(GAME_ASSET_REGISTRY.artifacts).reduce(
      (acc, id) => {
        const artifactId = id as ArtifactId;
        acc[artifactId] = getArtifactUnlockStatus({
          artifactId,
          dailyEntries,
          measurements,
          currentStage: progress.stage,
          momentumValue: momentumSummary.currentValue,
        });
        return acc;
      },
      {} as Record<ArtifactId, AssetUnlockStatus>,
    );

    return {
      profile,
      ...progress,
      stageProgress,
      bossId,
      bossStatus,
      dailyMobId,
      artifactStatuses,
      hasWeightPath: progress.startWeight !== null && profile.targetWeight !== null,
    };
  }, [measurements, settings, dailyEntries, today]);
}
