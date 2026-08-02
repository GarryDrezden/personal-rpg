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
import {
  getHeroStateLabel,
  resolveAvatarStageSnapshot,
} from '../game/avatar/avatarStageEngine';
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
      progressPercent: avatar.bodyProgress,
      currentStage: avatar.bodyStage,
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
          currentStage: avatar.bodyStage,
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
      /** Body silhouette progress — drives art stage. */
      progressPercent: avatar.bodyProgress,
      bodyProgress: avatar.bodyProgress,
      heroStateProgress: avatar.heroStateProgress,
      avatarProgress: avatar.avatarProgress,
      /** Body stage 1–20 (asset key). */
      stage: avatar.bodyStage,
      bodyStage: avatar.bodyStage,
      heroState: avatar.heroState,
      heroStateLabel: getHeroStateLabel(avatar.heroState),
      chapter: avatar.chapter,
      avatarSnapshot: avatar,
      stageProgress,
      bossId,
      bossStatus,
      dailyMobId,
      artifactStatuses,
      hasWeightPath: startWeight !== null && profile.targetWeight !== null,
      hasAvatarPath:
        (startWeight !== null && profile.targetWeight !== null) ||
        avatar.bodyProgress > 0 ||
        avatar.heroStateProgress > 0,
    };
  }, [measurements, settings, dailyEntries, today]);
}
