import { ApiError } from '../api/httpClient';
import { DATA_CONFLICT_MESSAGE, SAVE_FAILED_MESSAGE } from './userDataConstants';

/** Server revision check used by PHP upsert and documented for KI-01 tests. */
export function isRevisionMismatch(
  expected: number | undefined,
  actual: number | undefined,
): boolean {
  return expected !== undefined && actual !== undefined && expected !== actual;
}

export function mapPersistenceError(error: unknown): unknown {
  if (error instanceof ApiError && error.status === 409) {
    return new ApiError(DATA_CONFLICT_MESSAGE, 409, error.body);
  }
  if (
    error instanceof ApiError &&
    /SQLSTATE|Unknown column|42S22/i.test(error.message)
  ) {
    return new ApiError(SAVE_FAILED_MESSAGE, error.status, error.body);
  }
  return error;
}

export function remapPersistenceError(error: unknown): never {
  throw mapPersistenceError(error);
}
