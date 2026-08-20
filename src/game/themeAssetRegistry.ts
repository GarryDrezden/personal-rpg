import type { AppThemeId } from '../types/theme';
import type {
  BossId,
  CompanionId,
  HeroGender,
  HeroStageNumber,
  MobId,
} from '../types/gameAssets';
import { gameAsset, GAME_ASSET_BASE_PATH, GAME_ASSET_VERSION } from './assetBase';
import { getAvatarVisualStage } from './avatar/avatarVisualStage';
import { getAvatarGenderPlaceholderPath } from '../constants/avatarAssetManifest';

/** Future themes reserved in docs; runtime uses AppThemeId today. */
export type ThemeBranchId = AppThemeId | 'forest_myth' | 'athlete_return';

export type ThemeAssetKind =
  | 'hero_avatar'
  | 'companion'
  | 'mob'
  | 'boss'
  | 'chapter_background'
  | 'home_zone'
  | 'home_exterior'
  | 'artifact'
  | 'ui_decoration'
  | 'scene_backdrop';

export type ThemeAssetRef = {
  themeId: AppThemeId;
  kind: ThemeAssetKind;
  entityId: string;
  stage?: number;
  path: string;
  /** Same-theme only — never cross darkFantasy ↔ cozy */
  fallbackPath?: string;
  placeholder: boolean;
};

const COZY_BASE = 'themes/cozy';

export function cozyThemeAsset(relativePath: string): string {
  return gameAsset(`${COZY_BASE}/${relativePath}`);
}

export function getCozyHeroPlaceholderPath(gender: HeroGender): string {
  return gameAsset(getAvatarGenderPlaceholderPath('cozy', gender));
}

export function getCozyCompanionPlaceholderPath(): string {
  return cozyThemeAsset('companions/placeholders/companion-placeholder.svg');
}

export function getCozyMobPlaceholderPath(): string {
  return cozyThemeAsset('mobs/placeholders/mob-placeholder.svg');
}

export function getCozyBossPlaceholderPath(): string {
  return cozyThemeAsset('bosses/placeholders/boss-placeholder.svg');
}

export function getCozyChapterPlaceholderPath(): string {
  return cozyThemeAsset('journey/chapters/placeholders/chapter-placeholder.svg');
}

export function getCozyHomeScenePlaceholderPath(): string {
  return cozyThemeAsset('home/placeholders/home-scene-placeholder.svg');
}

export function getCozyHeroStagePath(
  gender: HeroGender,
  stage: HeroStageNumber,
  ext: 'webp' | 'png' = 'webp',
): string {
  const visual = getAvatarVisualStage(stage);
  const n = String(visual).padStart(2, '0');
  return cozyThemeAsset(`avatars/${gender}/stage-${n}.${ext}`);
}

export function getCozyCompanionPath(id: CompanionId): string {
  return cozyThemeAsset(`companions/${id}.webp`);
}

export function getCozyMobPath(id: MobId): string {
  return cozyThemeAsset(`mobs/${id}.webp`);
}

export function getCozyBossPath(id: BossId): string {
  return cozyThemeAsset(`bosses/${id}.webp`);
}

export function getCozyChapterPath(chapterNumber: number): string {
  const n = String(chapterNumber).padStart(2, '0');
  return cozyThemeAsset(`journey/chapters/chapter-${n}.webp`);
}

export const COZY_SEASON_VIGNETTE_COUNT = 8;

/** Reusable Cozy chronicle vignettes (8 plates, mapped onto 13 seasons). */
export function getCozySeasonVignettePath(seasonIndex: number): string {
  const safe = Number.isFinite(seasonIndex) ? Math.max(1, Math.floor(seasonIndex)) : 1;
  const n = ((safe - 1) % COZY_SEASON_VIGNETTE_COUNT) + 1;
  return cozyThemeAsset(`ui/seasons/vignette-${String(n).padStart(2, '0')}.webp`);
}

/**
 * Resolve a theme-scoped asset. For cozy, never returns a darkFantasy path.
 * Missing final art → same-theme placeholder.
 */
export function getThemeAsset(params: {
  themeId: AppThemeId;
  kind: ThemeAssetKind;
  entityId: string;
  stage?: number;
  gender?: HeroGender;
}): ThemeAssetRef {
  const { themeId, kind, entityId, stage, gender } = params;

  if (themeId === 'cozy') {
    return resolveCozyAsset(kind, entityId, stage, gender);
  }

  return resolveDarkFantasyAsset(kind, entityId, stage, gender);
}

function resolveCozyAsset(
  kind: ThemeAssetKind,
  entityId: string,
  stage?: number,
  gender?: HeroGender,
): ThemeAssetRef {
  const g = gender ?? 'male';

  switch (kind) {
    case 'hero_avatar': {
      const st = (stage ?? 1) as HeroStageNumber;
      return {
        themeId: 'cozy',
        kind,
        entityId,
        stage: st,
        path: getCozyHeroStagePath(g, st),
        fallbackPath: getCozyHeroPlaceholderPath(g),
        placeholder: true,
      };
    }
    case 'companion':
      return {
        themeId: 'cozy',
        kind,
        entityId,
        path: getCozyCompanionPath(entityId as CompanionId),
        fallbackPath: getCozyCompanionPlaceholderPath(),
        placeholder: false,
      };
    case 'mob':
      return {
        themeId: 'cozy',
        kind,
        entityId,
        path: getCozyMobPath(entityId as MobId),
        fallbackPath: getCozyMobPlaceholderPath(),
        placeholder: false,
      };
    case 'boss':
      return {
        themeId: 'cozy',
        kind,
        entityId,
        path: getCozyBossPath(entityId as BossId),
        fallbackPath: getCozyBossPlaceholderPath(),
        placeholder: false,
      };
    case 'chapter_background':
      return {
        themeId: 'cozy',
        kind,
        entityId,
        path: getCozyChapterPath(Number(entityId) || 1),
        fallbackPath: getCozyChapterPlaceholderPath(),
        placeholder: false,
      };
    case 'home_zone':
    case 'home_exterior':
    case 'scene_backdrop': {
      const seasonVignette = kind === 'scene_backdrop' && /^\d+$/.test(entityId);
      return {
        themeId: 'cozy',
        kind,
        entityId,
        path: seasonVignette
          ? getCozySeasonVignettePath(Number(entityId))
          : getCozyHomeScenePlaceholderPath(),
        fallbackPath: getCozyHomeScenePlaceholderPath(),
        placeholder: !seasonVignette,
      };
    }
    default:
      return {
        themeId: 'cozy',
        kind,
        entityId,
        path: getCozyHomeScenePlaceholderPath(),
        fallbackPath: getCozyHomeScenePlaceholderPath(),
        placeholder: true,
      };
  }
}

function resolveDarkFantasyAsset(
  kind: ThemeAssetKind,
  entityId: string,
  stage?: number,
  gender?: HeroGender,
): ThemeAssetRef {
  // Legacy paths remain under /game-assets/* (migration TODO in wiki).
  const g = gender ?? 'male';
  const st = String(stage ?? 1).padStart(2, '0');
  const versioned = (p: string) =>
    `${GAME_ASSET_BASE_PATH}/${p}?v=${GAME_ASSET_VERSION}`;

  switch (kind) {
    case 'hero_avatar':
      return {
        themeId: 'darkFantasy',
        kind,
        entityId,
        stage,
        path: versioned(`heroes/${g}/variants/dark-fantasy/stage-${st}.webp`),
        fallbackPath: versioned(
          `themes/dark-fantasy/avatars/placeholders/${g}/stage-${st}.svg`,
        ),
        placeholder: false,
      };
    case 'companion':
      return {
        themeId: 'darkFantasy',
        kind,
        entityId,
        path: versioned(`companions/${entityId.replace(/_/g, '-')}.png`),
        placeholder: false,
      };
    case 'mob':
      return {
        themeId: 'darkFantasy',
        kind,
        entityId,
        path: versioned(`mobs/${entityId.replace(/_/g, '-')}.webp`),
        placeholder: false,
      };
    case 'boss':
      return {
        themeId: 'darkFantasy',
        kind,
        entityId,
        path: versioned(`bosses/${entityId.replace(/_/g, '-')}.png`),
        placeholder: false,
      };
    case 'chapter_background':
      return {
        themeId: 'darkFantasy',
        kind,
        entityId,
        path: versioned(`maps/chapters/chapter-${String(entityId).padStart(2, '0')}.webp`),
        placeholder: false,
      };
    default:
      return {
        themeId: 'darkFantasy',
        kind,
        entityId,
        path: versioned('scenes/hero-cliff-sunrise.webp'),
        placeholder: false,
      };
  }
}

/** Candidate list for <img onError> chains — cozy never includes darkFantasy paths. */
export function getThemeAssetCandidates(ref: ThemeAssetRef): string[] {
  const list = [ref.path];
  if (ref.fallbackPath && ref.fallbackPath !== ref.path) {
    list.push(ref.fallbackPath);
  }
  return list;
}
