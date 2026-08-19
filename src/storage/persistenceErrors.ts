import { ApiError } from '../api/httpClient';
import { DATA_CONFLICT_MESSAGE } from './userDataConstants';

/** Server revision check used by PHP upsert and documented for KI-01 tests. */
export function isRevisionMismatch(
  expected: number | undefined,
  actual: number | undefined,
): boolean {
  return expected !== undefined && actual !== undefined && expected !== actual;
}

export function remapPersistenceError(error: unknown): never {
  if (error instanceof ApiError && error.status === 409) {
    throw new ApiError(DATA_CONFLICT_MESSAGE, 409, error.body);
  }
  throw error;
}
