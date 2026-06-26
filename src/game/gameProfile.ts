import type { AppSettings } from '../types';
import type { CompanionId, HeroGender, TransformationMode } from '../types/gameAssets';
import { getActiveCompanionId } from './gameAssetStorage';

export type GameProfile = {
  heroGender: HeroGender;
  transformationMode: TransformationMode;
  targetWeight: number | null;
  activeCompanionId: CompanionId;
};

export function resolveGameProfile(settings: AppSettings): GameProfile {
  return {
    heroGender: settings.heroGender ?? settings.gender,
    transformationMode: settings.transformationMode ?? 'weight_loss',
    targetWeight: settings.targetWeight ?? settings.weightGoal ?? null,
    activeCompanionId: settings.activeCompanionId ?? getActiveCompanionId(),
  };
}
