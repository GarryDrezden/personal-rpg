import manifestJson from '../../docs/assets/manifest.json';
import type { AssetManifestEntry, AssetManifestV2, AssetRegistryCategory } from './assetManifestTypes';
import { indexManifestByEntityId, indexManifestById } from './assetManifestValidation';
import { gameAsset } from './assetPaths';

const manifest = manifestJson as AssetManifestV2;

const byId = indexManifestById(manifest);
const byEntityId = indexManifestByEntityId(manifest);

/** Category → safe UI fallback when art file is missing */
const CATEGORY_PLACEHOLDER: Partial<Record<AssetRegistryCategory, string>> = {
  hero: '🧙',
  femaleHero: '🧙‍♀️',
  bodyStages: '✦',
  journeyChapters: '🗺️',
  companions: '🐾',
  dailyMobs: '👾',
  seasonBosses: '🌑',
  chapterBosses: '⚔️',
  actBosses: '👁️',
  campBase: '🔥',
  bodyAbilities: '✨',
  seasonRewards: '💎',
  plateauArtifacts: '⛰️',
  achievementBadges: '🏅',
  onboardingArt: '🌟',
  emptyStates: '📭',
  uiIcons: '◇',
};

export const ASSET_MANIFEST = manifest;

export function getAssetById(id: string): AssetManifestEntry | undefined {
  return byId.get(id);
}

export function getEntityAsset(relatedEntityId: string): AssetManifestEntry | undefined {
  return byEntityId.get(relatedEntityId);
}

/**
 * Returns manifest path when file is in-app/done, otherwise null.
 * UI should fall back to emoji/icon/glow — never a broken image src.
 */
export function getAssetPathOrNull(entry: AssetManifestEntry | undefined): string | null {
  if (!entry?.path) return null;
  if (entry.status === 'in-app' || entry.status === 'done') {
    return entry.path;
  }
  return null;
}

/** Versioned public URL when asset is in-app/done; null → UI fallback. */
export function getManifestAssetUrl(assetId: string): string | null {
  const path = getAssetPathOrNull(getAssetById(assetId));
  if (!path) return null;
  const relative = path.startsWith('/game-assets/')
    ? path.slice('/game-assets/'.length)
    : path.replace(/^\//, '');
  return gameAsset(relative);
}

export function getAssetPlaceholder(category: AssetRegistryCategory): string {
  return CATEGORY_PLACEHOLDER[category] ?? '✦';
}

export function getAssetsByCategory(category: AssetRegistryCategory): AssetManifestEntry[] {
  return manifest.assets.filter((a) => a.category === category);
}

export function getAssetsByPriority(priority: AssetManifestEntry['priority']): AssetManifestEntry[] {
  return manifest.assets.filter((a) => a.priority === priority);
}
