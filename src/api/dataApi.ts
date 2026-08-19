import type { UserProfile, UserSettings } from './authApi';
import { httpClient } from './httpClient';

export interface UserDataResponse {
  profile: UserProfile;
  settings: UserSettings;
  data: Record<string, unknown>;
  revisions?: Record<string, number>;
}

export const dataApi = {
  getAll: () => httpClient<UserDataResponse>('/api/data'),

  getType: (type: string) =>
    httpClient<{ type: string; payload: unknown; revision?: number }>(`/api/data/${type}`),

  putType: (type: string, payload: unknown, revision?: number) =>
    httpClient<{ type: string; payload: unknown; updatedAt: string; revision?: number }>(
      `/api/data/${type}`,
      {
        method: 'PUT',
        body: JSON.stringify(
          revision === undefined ? { payload } : { payload, revision },
        ),
      },
    ),

  putBulk: (data: Record<string, unknown>) =>
    httpClient<{ ok: boolean }>('/api/data', {
      method: 'PUT',
      body: JSON.stringify({ data }),
    }),

  restore: (body: {
    data: Record<string, unknown>;
    profile?: {
      displayName?: string | null;
      heroGender?: string | null;
      startWeight?: number | null;
      targetWeight?: number | null;
      height?: number | null;
    };
  }) =>
    httpClient<{ ok: boolean }>('/api/data/restore', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patchProfile: (patch: Partial<UserProfile>) =>
    httpClient<UserProfile>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  patchSettings: (patch: Partial<UserSettings>) =>
    httpClient<UserSettings>('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),
};
