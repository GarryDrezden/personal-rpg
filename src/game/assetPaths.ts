import type { AppThemeId } from '../types/theme';
import type {
  ArtifactId,
  BossId,
  CompanionId,
  HeroGender,
  HeroStageNumber,
  MobId,
} from '../types/gameAssets';
import { GAME_ASSET_BASE_PATH, GAME_ASSET_VERSION, gameAsset } from './assetBase';
import { getManifestAssetUrl } from './assetManifest';
import { getLegacyCodexBossManifestAssetId } from './manifestAssetUi';
import { getCozyCampRoomPath } from './cozyCampaignArt';
import {
  getCozyHeroPlaceholderPath,
  getThemeAsset,
  getThemeAssetCandidates,
} from './themeAssetRegistry';
import { getAvatarStageImageCandidates } from './avatar/avatarStageAssets';

export { GAME_ASSET_BASE_PATH, GAME_ASSET_VERSION, gameAsset };

/** Folder names under heroes/{gender}/variants/ */
export type HeroAssetVariantFolder = 'dark-fantasy' | 'light';

/** Dashboard hero scene backdrop — theme-aware */
export function getHeroSceneBackdropPath(themeId: AppThemeId = 'darkFantasy'): string {
  if (themeId === 'cozy') {
    return getCozyCampRoomPath();
  }
  return gameAsset('scenes/hero-cliff-sunrise.webp');
}

const warnedMissingAssets = new Set<string>();

/** Log missing asset once per src in dev */
export function warnMissingGameAsset(src: string): void {
  if (!import.meta.env.DEV || warnedMissingAssets.has(src)) return;
  warnedMissingAssets.add(src);
  console.warn(`Missing game asset: ${src}`);
}

export function resolveHeroAssetVariant(themeId: AppThemeId): HeroAssetVariantFolder {
  return themeId === 'cozy' ? 'light' : 'dark-fantasy';
}

export function getGameHeroStageVariantPath(
  gender: HeroGender,
  stage: HeroStageNumber,
  variant: HeroAssetVariantFolder,
  ext: 'webp' | 'png' = 'webp',
): string {
  const n = String(stage).padStart(2, '0');
  return gameAsset(`heroes/${gender}/variants/${variant}/stage-${n}.${ext}`);
}

/** Legacy root path — existing approved assets */
export function getGameHeroStageLegacyPath(
  gender: HeroGender,
  stage: HeroStageNumber,
  ext: 'webp' | 'png' = 'webp',
): string {
  const n = String(stage).padStart(2, '0');
  return gameAsset(`heroes/${gender}/stage-${n}.${ext}`);
}

/** @deprecated Use getGameHeroStageLegacyPath or themed variant paths */
export function getGameHeroStagePublicPath(
  gender: HeroGender,
  stage: HeroStageNumber,
  themeId?: AppThemeId,
): string {
  if (themeId) {
    return getGameHeroStageVariantPath(gender, stage, resolveHeroAssetVariant(themeId));
  }
  return getGameHeroStageLegacyPath(gender, stage);
}

/** Legacy male avatars from earlier generation */
export function getLegacyHeroStagePublicPath(gender: HeroGender, stage: HeroStageNumber): string {
  const n = String(stage).padStart(2, '0');
  return `/avatars/${gender}/stage-${n}.png`;
}

export function getCompanionPublicPath(id: CompanionId): string {
  const fileMap: Record<CompanionId, string> = {
    golden_chinchilla_cat: 'golden-chinchilla-cat.png',
    alabai: 'alabai.png',
    raven: 'raven.png',
    fox_cub: 'fox-cub.png',
  };
  return gameAsset(`companions/${fileMap[id]}`);
}

export function getCompanionImageCandidates(
  id: CompanionId,
  themeId: AppThemeId = 'darkFantasy',
): string[] {
  if (themeId === 'cozy') {
    const ref = getThemeAsset({ themeId: 'cozy', kind: 'companion', entityId: id });
    return getThemeAssetCandidates(ref);
  }
  const legacyPets: Record<CompanionId, string> = {
    golden_chinchilla_cat: '/images/pets/Cat.png',
    alabai: '/images/pets/Dog.png',
    raven: '/images/pets/Crow.png',
    fox_cub: '/images/pets/Fox.png',
  };
  return [getCompanionPublicPath(id), legacyPets[id]];
}

export function getMobPublicPath(id: MobId): string {
  const fileMap: Record<MobId, string> = {
    sofa_magnet: 'sofa-magnet.webp',
    snack_chaos: 'snack-chaos.webp',
    fog_of_fatigue: 'fog-of-fatigue.webp',
    empty_day: 'empty-day.webp',
    impulse_of_rollback: 'impulse-of-rollback.webp',
    night_call: 'night-call.webp',
    gray_heaviness: 'gray-heaviness.webp',
    sweet_whisper: 'sweet-whisper.webp',
  };
  return gameAsset(`mobs/${fileMap[id]}`);
}

export function getBossPublicPath(id: BossId): string {
  const manifestAssetId = getLegacyCodexBossManifestAssetId(id);
  if (manifestAssetId) {
    const manifestUrl = getManifestAssetUrl(manifestAssetId);
    if (manifestUrl) return manifestUrl;
  }

  const fileMap: Record<Exclude<BossId, 'lord_of_empty_day'>, string> = {
    misty_baron: 'misty-baron.png',
    resource_devourer: 'resource-devourer.png',
    divan_king: 'divan-king.png',
    chain_of_rollback: 'chain-of-rollback.png',
    night_feast_baron: 'night-feast-baron.png',
    promise_collector: 'promise-collector.png',
    old_form_guardian: 'old-form-guardian.png',
  };
  if (id === 'lord_of_empty_day') {
    return gameAsset('bosses/seasons/season-boss-01-empty-day-lord.webp');
  }
  return gameAsset(`bosses/${fileMap[id]}`);
}

export function getArtifactPublicPath(id: ArtifactId): string {
  const fileMap: Record<ArtifactId, string> = {
    beer_staff: 'beer-staff.png',
    clarity_crystal: 'clarity-crystal.png',
    recovery_shield: 'recovery-shield.png',
    return_shield: 'return-shield.png',
    step_boots: 'step-boots.png',
    iron_boots: 'iron-boots.png',
    control_compass: 'control-compass.png',
    journal_quill: 'journal-quill.png',
    stability_seal: 'stability-seal.png',
    momentum_core: 'momentum-core.png',
    body_key: 'body-key.png',
    boss_chain_fragment: 'boss-chain-fragment.png',
    night_lantern: 'night-lantern.png',
    resource_flask: 'resource-flask.png',
    golden_collar: 'golden-collar.png',
  };
  return gameAsset(`artifacts/${fileMap[id]}`);
}

function uniquePaths(paths: string[]): string[] {
  const seen = new Set<string>();
  return paths.filter((path) => {
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });
}

export function getHeroStageImageCandidates(
  gender: HeroGender,
  stage: HeroStageNumber,
  themeId: AppThemeId = 'darkFantasy',
): string[] {
  return getAvatarStageImageCandidates(gender, stage, themeId);
}

export function getHeroStageImageSrc(
  gender: HeroGender,
  stage: HeroStageNumber,
  themeId: AppThemeId = 'darkFantasy',
): string {
  return getHeroStageImageCandidates(gender, stage, themeId)[0];
}

function buildHeroDeathPaths(gender: HeroGender, themeId: AppThemeId): string[] {
  if (themeId === 'cozy') {
    return uniquePaths([getCozyHeroPlaceholderPath(gender)]);
  }

  const variant = resolveHeroAssetVariant(themeId);
  return uniquePaths([
    gameAsset(`heroes/${gender}/variants/${variant}/death.webp`),
    gameAsset(`heroes/${gender}/death.webp`),
    gameAsset(`heroes/${gender}/variants/${variant}/death.png`),
    gameAsset(`heroes/${gender}/death.png`),
  ]);
}

/** Силуэт «Смерти» (200 кг) — фигура в чёрной мантии с косой. */
export function getHeroDeathPublicPath(gender: HeroGender, themeId?: AppThemeId): string {
  if (themeId) {
    const variant = resolveHeroAssetVariant(themeId);
    return gameAsset(`heroes/${gender}/variants/${variant}/death.webp`);
  }
  return gameAsset(`heroes/${gender}/death.webp`);
}

export function getHeroDeathImageCandidates(
  gender: HeroGender,
  themeId: AppThemeId = 'darkFantasy',
): string[] {
  return buildHeroDeathPaths(gender, themeId);
}
