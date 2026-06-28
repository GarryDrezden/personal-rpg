import { httpClient } from './httpClient';

export interface AuthUser {
  id: string;
  login: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string | null;
  heroGender: 'male' | 'female' | 'neutral' | null;
  startWeight: number | null;
  targetWeight: number | null;
  height: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  themeId: string;
  nutritionTrackingMode: 'simple' | 'detailed';
  dailyCalorieLimit: number | null;
  activeCompanionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  user: AuthUser;
  profile: UserProfile;
  settings: UserSettings;
  authToken?: string;
}

export const authApi = {
  me: () => httpClient<AuthPayload>('/api/auth/me'),

  register: (login: string, password: string) =>
    httpClient<AuthPayload>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    }),

  login: (login: string, password: string) =>
    httpClient<AuthPayload>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    }),

  logout: () =>
    httpClient<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
};
