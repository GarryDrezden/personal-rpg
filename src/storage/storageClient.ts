import type { DataRepository } from '../store/repository';
import { apiRepository } from '../store/apiRepository';
import { remoteRepository } from './remoteStorageClient';

export type StorageMode = 'remote' | 'legacy';

let mode: StorageMode = 'legacy';

export function setStorageMode(next: StorageMode) {
  mode = next;
  if (next === 'remote') {
    remoteRepository.resetCache();
  }
}

export function getStorageMode(): StorageMode {
  return mode;
}

export function getRepository(): DataRepository {
  return mode === 'remote' ? remoteRepository : apiRepository;
}
