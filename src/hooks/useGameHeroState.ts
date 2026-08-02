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
  getBestWeightForWeightLoss,
  getNextStageProgress,
  getStartWeight,
} from '../game/heroProgressEngine';
import { resolveAvatarStageSnapshot } from '../game/avatar/avatarStageEngine';
import { GAME_ASSET_REGISTRY } from '../game/assetRegistry';

export function useGameHeroState() {
  const { measurements, settings, dailyEntries } = useAppStore();
  const today = todayISO();
  const profile = resolveGameProfile(settings);

  return useMemo(() => {
    const avatar = resolveAvatarStageSnapshot({
      dailyEntries,
      measurements,
      settings,
      today,
    });
    const startWeight = getStartWeight(measurements);
    const bestWeight = getBestWeightForWeightLoss(measurements);
    const stageProgress = getNextStageProgress({
      progressPercent: avatar.avatarProgress,
      currentStage: avatar.stage,
    });
    const bossId = getChapterBossId(avatar.chapter);
    const bossStatus = getBossChapterStatus({
      bossChapter: avatar.chapter,
      currentChapter: avatar.chapter,
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
          currentStage: avatar.stage,
          momentumValue: momentumSummary.currentValue,
        });
        return acc;
      },
      {} as Record<ArtifactId, AssetUnlockStatus>,
    );

    return {
      profile,
      startWeight,
      bestWeight,
      /** Composite avatar progress 0–100 (Avatar Stages v1). */
      progressPercent: avatar.avatarProgress,
      avatarProgress: avatar.avatarProgress,
      stage: avatar.stage,
      chapter: avatar.chapter,
      avatarSnapshot: avatar,
      stageProgress,
      bossId,
      bossStatus,
      dailyMobId,
      artifactStatuses,
      hasWeightPath: startWeight !== null && profile.targetWeight !== null,
      /** True when path is ready via weight target OR other avatar signals. */
      hasAvatarPath:
        (startWeight !== null && profile.targetWeight !== null) ||
        avatar.avatarProgress > 0,
    };
  }, [measurements, settings, dailyEntries, today]);
}
