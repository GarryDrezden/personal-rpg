import type { FreedomScoreLevelId } from '../types/freedomScore';
import type { FreedomLevelUnlock } from '../types/freedomUnlock';
import type { CoinTransaction } from '../types/currency';
import { todayISO } from './dates';
import {
  freedomLevelRelatedId,
  isFreedomLevelSeen,
  markFreedomLevelSeen,
} from './freedomUnlockStorage';
import { addXpTransactionOnce, hasXpTransaction } from './xpTransactionStorage';

export function grantFreedomLevelRewards(
  unlock: FreedomLevelUnlock,
  addCoinOnce: (tx: CoinTransaction) => boolean,
): { xpGranted: boolean; coinsGranted: boolean } {
  const relatedId = freedomLevelRelatedId(unlock.levelId);
  const now = new Date().toISOString();

  const xpGranted = addXpTransactionOnce({
    id: `xp-${relatedId}`,
    source: 'freedom_level',
    relatedId,
    amount: unlock.xpReward,
    title: `${unlock.description}: +${unlock.xpReward} XP`,
    createdAt: now,
  });

  const coinsGranted = addCoinOnce({
    id: `coin-${relatedId}`,
    type: 'bonus',
    source: 'freedom_level',
    amount: unlock.coinReward,
    title: `Новая стадия свободы: ${unlock.description}`,
    description: unlock.unlockText,
    date: todayISO(),
    relatedId,
  });

  return { xpGranted, coinsGranted };
}

export function confirmFreedomLevelUnlock(
  unlock: FreedomLevelUnlock,
  addCoinOnce: (tx: CoinTransaction) => boolean,
): void {
  if (!isFreedomLevelSeen(unlock.levelId)) {
    grantFreedomLevelRewards(unlock, addCoinOnce);
    markFreedomLevelSeen(unlock.levelId);
  }
}

export function hasFreedomLevelRewards(levelId: FreedomScoreLevelId): boolean {
  const relatedId = freedomLevelRelatedId(levelId);
  return isFreedomLevelSeen(levelId) || hasXpTransaction(relatedId);
}
