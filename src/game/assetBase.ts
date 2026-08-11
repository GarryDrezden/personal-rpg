/** Shared public asset URL helpers — kept tiny to avoid circular imports. */

export const GAME_ASSET_BASE_PATH = '/game-assets';

/** Bump when replacing public assets so browsers reload */
export const GAME_ASSET_VERSION = '66';

export function gameAsset(path: string): string {
  return `${GAME_ASSET_BASE_PATH}/${path}?v=${GAME_ASSET_VERSION}`;
}
