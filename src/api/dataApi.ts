import type { UserProfile, UserSettings } from './authApi';
import { httpClient } from './httpClient';

export interface UserDataResponse {
  profile: UserProfile;
  settings: UserSettings;
  data: Record<string, unknown>;
}

export const dataApi = {
  getAll: () => httpClient<UserDataResponse>('/api/data'),

  getType: (type: string) =>
    httpClient<{ type: string; payload: unknown }>(`/api/data/${type}`),

  putType: (type: string, payload: unknown) =>
    httpClient<{ type: string; payload: unknown; updatedAt: string }>(
      `/api/data/${type}`,
      {
        method: 'PUT',
        body: JSON.stringify({ payload }),
      },
    ),

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
