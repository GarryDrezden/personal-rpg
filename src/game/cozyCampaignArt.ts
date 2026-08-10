import { cozyThemeAsset } from './themeAssetRegistry';

/** Cozy Campaign Batch C1 — Dashboard parity art (theme-scoped, never DF). */

export function getCozySeasonRewardPath(seasonIndex: number): string | null {
  if (seasonIndex === 1) {
    return cozyThemeAsset('artifacts/season-01-hearth-lantern.webp');
  }
  return null;
}

/** Canonical cozy shelter = interior room that develops over time. */
export function getCozyCampRoomPath(): string {
  return cozyThemeAsset('home/interior/room-stage-01.webp');
}

export function getCozySeasonObstaclePath(seasonIndex: number): string | null {
  if (seasonIndex === 1) {
    return cozyThemeAsset('bosses/season-obstacle-01-empty-day.webp');
  }
  return null;
}
