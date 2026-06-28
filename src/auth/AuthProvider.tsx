import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  authApi,
  type AuthPayload,
  type AuthUser,
  type UserProfile,
  type UserSettings,
} from '../api/authApi';
import { ApiError } from '../api/httpClient';
import { setStorageMode } from '../storage/storageClient';

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  settings: UserSettings | null;
  loading: boolean;
  authenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  applyAuthPayload: (payload: AuthPayload) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const applyAuthPayload = useCallback((payload: AuthPayload) => {
    setUser(payload.user);
    setProfile(payload.profile);
    setSettings(payload.settings);
    setStorageMode('remote');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const payload = await authApi.me();
      applyAuthPayload(payload);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setUser(null);
        setProfile(null);
        setSettings(null);
        setStorageMode('legacy');
        return;
      }
      throw e;
    }
  }, [applyAuthPayload]);

  useEffect(() => {
    void (async () => {
      try {
        await refreshUser();
      } catch {
        setUser(null);
        setProfile(null);
        setSettings(null);
        setStorageMode('legacy');
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshUser]);

  const login = useCallback(
    async (loginName: string, password: string) => {
      const payload = await authApi.login(loginName, password);
      applyAuthPayload(payload);
      const confirmed = await authApi.me();
      applyAuthPayload(confirmed);
    },
    [applyAuthPayload],
  );

  const register = useCallback(
    async (loginName: string, password: string) => {
      const payload = await authApi.register(loginName, password);
      applyAuthPayload(payload);
      const confirmed = await authApi.me();
      applyAuthPayload(confirmed);
    },
    [applyAuthPayload],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setProfile(null);
    setSettings(null);
    setStorageMode('legacy');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      settings,
      loading,
      authenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
      applyAuthPayload,
    }),
    [
      user,
      profile,
      settings,
      loading,
      login,
      register,
      logout,
      refreshUser,
      applyAuthPayload,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
