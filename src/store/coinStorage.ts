import type { CoinTransaction } from '../types/currency';

export const COINS_STORAGE_KEY = 'personal-rpg-coin-transactions';

export function loadCoinTransactions(): CoinTransaction[] {
  try {
    const raw = localStorage.getItem(COINS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CoinTransaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCoinTransactions(items: CoinTransaction[]): void {
  localStorage.setItem(COINS_STORAGE_KEY, JSON.stringify(items));
}

export function appendCoinTransaction(tx: CoinTransaction): CoinTransaction[] {
  const items = loadCoinTransactions();
  const next = [...items, tx];
  saveCoinTransactions(next);
  return next;
}
