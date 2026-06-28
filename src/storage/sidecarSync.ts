import { dataApi } from '../api/dataApi';
import { ACHIEVEMENTS_STORAGE_KEY } from '../store/achievementStorage';
import { COINS_STORAGE_KEY } from '../store/coinStorage';
import { MOMENTUM_STORAGE_KEY } from '../constants/momentum';
import { getStorageMode } from './storageClient';

/** Sync JSON sidecar data from server into localStorage for existing game modules. */
export async function hydrateLocalSidecarsFromRemote(): Promise<void> {
  if (getStorageMode() !== 'remote') return;
  const res = await dataApi.getAll();
  const { data } = res;

  if (data.achievements != null) {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(data.achievements));
  }
  if (data.coinTransactions != null) {
    localStorage.setItem(COINS_STORAGE_KEY, JSON.stringify(data.coinTransactions));
  }
  if (data.momentumHistory != null) {
    localStorage.setItem(MOMENTUM_STORAGE_KEY, JSON.stringify(data.momentumHistory));
  }
}

/** Persist localStorage sidecars to remote user_data (debounced callers use dataApi directly). */
export function collectLocalSidecarsForSave(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const achievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
  if (achievements) out.achievements = JSON.parse(achievements);
  const coins = localStorage.getItem(COINS_STORAGE_KEY);
  if (coins) out.coinTransactions = JSON.parse(coins);
  const momentum = localStorage.getItem(MOMENTUM_STORAGE_KEY);
  if (momentum) out.momentumHistory = JSON.parse(momentum);
  return out;
}
