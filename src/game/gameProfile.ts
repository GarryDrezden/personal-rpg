import type { AppSettings } from '../types';
import type { CompanionId, HeroGender, TransformationMode } from '../types/gameAssets';
import { getActiveCompanionId } from './gameAssetStorage';

export type GameProfile = {
  heroGender: HeroGender;
  transformationMode: TransformationMode;
  targetWeight: number | null;
  activeCompanionId: CompanionId;
};

export function resolveTargetWeight(
  settings: Pick<AppSettings, 'targetWeight' | 'weightGoal'>,
): number | null {
  const raw = settings.targetWeight ?? settings.weightGoal;
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== 'number' || !Number.isFinite(raw) || raw <= 0) return null;
  return raw;
}

export function resolveGameProfile(settings: AppSettings): GameProfile {
  return {
    heroGender: settings.heroGender ?? settings.gender,
    transformationMode: settings.transformationMode ?? 'weight_loss',
    targetWeight: resolveTargetWeight(settings),
    activeCompanionId: settings.activeCompanionId ?? getActiveCompanionId(),
  };
}
