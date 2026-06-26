import type {
  ArtifactId,
  BossId,
  CompanionId,
  HeroGender,
  HeroStageNumber,
  MobId,
} from '../types/gameAssets';

/** Base path for drop-in game assets (no code changes needed) */
export const GAME_ASSET_BASE_PATH = '/game-assets';

export function gameAsset(path: string): string {
  return `${GAME_ASSET_BASE_PATH}/${path}`;
}

const warnedMissingAssets = new Set<string>();

/** Log missing asset once per src in dev */
export function warnMissingGameAsset(src: string): void {
  if (!import.meta.env.DEV || warnedMissingAssets.has(src)) return;
  warnedMissingAssets.add(src);
  console.warn(`Missing game asset: ${src}`);
}

export function getGameHeroStagePublicPath(gender: HeroGender, stage: HeroStageNumber): string {
  const n = String(stage).padStart(2, '0');
  return gameAsset(`heroes/${gender}/stage-${n}.png`);
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
  const fileMap: Record<BossId, string> = {
    misty_baron: 'misty-baron.png',
    resource_devourer: 'resource-devourer.png',
    divan_king: 'divan-king.png',
    lord_of_empty_day: 'lord-of-empty-day.png',
    chain_of_rollback: 'chain-of-rollback.png',
    night_feast_baron: 'night-feast-baron.png',
    promise_collector: 'promise-collector.png',
    old_form_guardian: 'old-form-guardian.png',
  };
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

export function getHeroStageImageCandidates(
  gender: HeroGender,
  stage: HeroStageNumber,
): string[] {
  return [getGameHeroStagePublicPath(gender, stage), getLegacyHeroStagePublicPath(gender, stage)];
}
