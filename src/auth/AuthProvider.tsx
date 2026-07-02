import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  authApi,
  type AuthPayload,
  type AuthUser,
  type UserProfile,
  type UserSettings,
} from '../api/authApi';
import { ApiError } from '../api/httpClient';
import { initAuthToken, setAuthToken } from '../api/authToken';
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
  refreshUser: () => Promise<boolean>;
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

  const refreshUser = useCallback(async (): Promise<boolean> => {
    try {
      const payload = await authApi.me();
      applyAuthPayload(payload);
      return true;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setUser(null);
        setProfile(null);
        setSettings(null);
        setAuthToken(null);
        setStorageMode('legacy');
        return false;
      }
      throw e;
    }
  }, [applyAuthPayload]);

  useEffect(() => {
    initAuthToken();
    void (async () => {
      try {
        await refreshUser();
      } catch {
        setUser(null);
        setProfile(null);
        setSettings(null);
        setAuthToken(null);
        setStorageMode('legacy');
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshUser]);

  const applyLoginPayload = useCallback((payload: AuthPayload) => {
    if (payload.authToken) {
      setAuthToken(payload.authToken);
    }
    applyAuthPayload(payload);
  }, [applyAuthPayload]);

  const login = useCallback(
    async (loginName: string, password: string) => {
      const payload = await authApi.login(loginName, password);
      applyLoginPayload(payload);
      if (!payload.authToken) {
        const confirmed = await authApi.me();
        applyLoginPayload(confirmed);
      }
    },
    [applyLoginPayload],
  );

  const register = useCallback(
    async (loginName: string, password: string) => {
      const payload = await authApi.register(loginName, password);
      applyLoginPayload(payload);
      if (!payload.authToken) {
        const confirmed = await authApi.me();
        applyLoginPayload(confirmed);
      }
    },
    [applyLoginPayload],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('[auth] logout request failed', e);
      }
    } finally {
      setUser(null);
      setProfile(null);
      setSettings(null);
      setAuthToken(null);
      setStorageMode('legacy');
    }
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
