import { cozyThemeAsset } from './themeAssetRegistry';

/** Cozy Campaign art — Dashboard parity + household obstacle cutouts. */

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

const SEASON_OBSTACLE: Record<number, string> = {
  1: 'bosses/season-obstacle-01-empty-day.webp',
  2: 'bosses/season-obstacle-02-laundry-blob.webp',
  3: 'bosses/season-obstacle-03-crumb-chaos.webp',
};

export function getCozySeasonObstaclePath(seasonIndex: number): string | null {
  const rel = SEASON_OBSTACLE[seasonIndex];
  return rel ? cozyThemeAsset(rel) : null;
}
