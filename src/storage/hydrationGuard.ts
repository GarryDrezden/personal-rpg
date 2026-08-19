import { SAVE_BEFORE_HYDRATION_MESSAGE } from './userDataConstants';

export type HydrationStatus = 'pending' | 'ready' | 'failed';

export function isHydrationReady(status: HydrationStatus): boolean {
  return status === 'ready';
}

export function assertHydrationReady(status: HydrationStatus): void {
  if (!isHydrationReady(status)) {
    throw new Error(SAVE_BEFORE_HYDRATION_MESSAGE);
  }
}
