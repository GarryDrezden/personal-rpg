import type { AppThemeId } from '../types/theme';
import type {
  ArtifactId,
  BossId,
  CompanionId,
  HeroGender,
  HeroStageNumber,
  MobId,
} from '../types/gameAssets';
import { getManifestAssetUrl } from './assetManifest';
import { getLegacyCodexBossManifestAssetId } from './manifestAssetUi';

/** Base path for drop-in game assets (no code changes needed) */
export const GAME_ASSET_BASE_PATH = '/game-assets';

/** Bump when replacing PNGs so browsers reload public assets */
export const GAME_ASSET_VERSION = '45';

/** Folder names under heroes/{gender}/variants/ */
export type HeroAssetVariantFolder = 'dark-fantasy' | 'light';

export function gameAsset(path: string): string {
  return `${GAME_ASSET_BASE_PATH}/${path}?v=${GAME_ASSET_VERSION}`;
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
): string {
  const n = String(stage).padStart(2, '0');
  return gameAsset(`heroes/${gender}/variants/${variant}/stage-${n}.png`);
}

/** Legacy root path — existing approved PNGs (unchanged on disk) */
export function getGameHeroStageLegacyPath(gender: HeroGender, stage: HeroStageNumber): string {
  const n = String(stage).padStart(2, '0');
  return gameAsset(`heroes/${gender}/stage-${n}.png`);
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

export function getCompanionImageCandidates(id: CompanionId): string[] {
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
    sofa_magnet: 'sofa-magnet.png',
    snack_chaos: 'snack-chaos.png',
    fog_of_fatigue: 'fog-of-fatigue.png',
    empty_day: 'empty-day.png',
    impulse_of_rollback: 'impulse-of-rollback.png',
    night_call: 'night-call.png',
    gray_heaviness: 'gray-heaviness.png',
    sweet_whisper: 'sweet-whisper.png',
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

const HERO_STAGE_ANCHORS: HeroStageNumber[] = [1, 2, 19, 20];

function uniquePaths(paths: string[]): string[] {
  const seen = new Set<string>();
  return paths.filter((path) => {
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });
}

function buildHeroStagePathsForStage(
  gender: HeroGender,
  stage: HeroStageNumber,
  themeId: AppThemeId,
): string[] {
  const variant = resolveHeroAssetVariant(themeId);
  const otherVariant: HeroAssetVariantFolder = variant === 'light' ? 'dark-fantasy' : 'light';

  const paths: string[] = [
    getGameHeroStageVariantPath(gender, stage, variant),
    getGameHeroStageLegacyPath(gender, stage),
    getGameHeroStageVariantPath(gender, stage, otherVariant),
  ];

  return uniquePaths(paths);
}

export function getHeroStageImageCandidates(
  gender: HeroGender,
  stage: HeroStageNumber,
  themeId: AppThemeId = 'darkFantasy',
): string[] {
  const primaryPaths = buildHeroStagePathsForStage(gender, stage, themeId);

  const anchorPaths = HERO_STAGE_ANCHORS.filter((s) => s !== stage)
    .sort((a, b) => Math.abs(a - stage) - Math.abs(b - stage))
    .flatMap((anchor) => buildHeroStagePathsForStage(gender, anchor, themeId));

  return uniquePaths([...primaryPaths, ...anchorPaths]);
}

export function getHeroStageImageSrc(
  gender: HeroGender,
  stage: HeroStageNumber,
  themeId: AppThemeId = 'darkFantasy',
): string {
  return getHeroStageImageCandidates(gender, stage, themeId)[0];
}

function buildHeroDeathPaths(gender: HeroGender, themeId: AppThemeId): string[] {
  const variant = resolveHeroAssetVariant(themeId);
  const otherVariant: HeroAssetVariantFolder = variant === 'light' ? 'dark-fantasy' : 'light';

  return uniquePaths([
    gameAsset(`heroes/${gender}/variants/${variant}/death.png`),
    gameAsset(`heroes/${gender}/death.png`),
    gameAsset(`heroes/${gender}/variants/${otherVariant}/death.png`),
  ]);
}

/** Силуэт «Смерти» (200 кг) — фигура в чёрной мантии с косой. */
export function getHeroDeathPublicPath(gender: HeroGender, themeId?: AppThemeId): string {
  if (themeId) {
    const variant = resolveHeroAssetVariant(themeId);
    return gameAsset(`heroes/${gender}/variants/${variant}/death.png`);
  }
  return gameAsset(`heroes/${gender}/death.png`);
}

export function getHeroDeathImageCandidates(
  gender: HeroGender,
  themeId: AppThemeId = 'darkFantasy',
): string[] {
  return buildHeroDeathPaths(gender, themeId);
}
