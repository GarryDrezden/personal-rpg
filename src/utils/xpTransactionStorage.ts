import type { XpTransaction } from '../types/xpTransactions';

const STORAGE_KEY = 'personal-rpg-xp-transactions';

function readAll(): XpTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as XpTransaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: XpTransaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getXpTransactions(): XpTransaction[] {
  return readAll();
}

export function addXpTransactionOnce(transaction: XpTransaction): boolean {
  const existing = readAll();
  if (existing.some((t) => t.relatedId === transaction.relatedId)) {
    return false;
  }
  writeAll([...existing, transaction]);
  return true;
}

export function getBonusXpTotal(): number {
  return readAll().reduce((sum, t) => sum + t.amount, 0);
}

export function hasXpTransaction(relatedId: string): boolean {
  return readAll().some((t) => t.relatedId === relatedId);
}
