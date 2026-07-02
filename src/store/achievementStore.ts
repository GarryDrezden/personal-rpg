import { create } from 'zustand';
import type { Achievement } from '../types/achievements';
import { checkNewAchievements } from '../utils/achievementEngine';
import type { AchievementEngineParams } from '../utils/achievementEngine';
import {
  loadUnlockedAchievements,
  mergeUnlocked,
  saveUnlockedAchievements,
} from './achievementStorage';
import { scheduleSidecarRemoteSave } from '../storage/sidecarSync';

interface AchievementState {
  unlockedAchievements: ReturnType<typeof loadUnlockedAchievements>;
  toastQueue: Achievement[];
  hydrated: boolean;
  hydrate: () => void;
  syncAchievements: (params: Omit<AchievementEngineParams, 'unlockedAchievements'>) => Achievement[];
  dismissToast: () => void;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlockedAchievements: [],
  toastQueue: [],
  hydrated: false,

  hydrate: () => {
    set({
      unlockedAchievements: loadUnlockedAchievements(),
      hydrated: true,
    });
  },

  syncAchievements: (params) => {
    const { unlockedAchievements } = get();
    const fullParams: AchievementEngineParams = {
      ...params,
      totalXp: params.totalXp,
      unlockedAchievements,
    };
    const newly = checkNewAchievements(fullParams);
    if (newly.length > 0) {
      const merged = mergeUnlocked(
        unlockedAchievements,
        newly.map((a) => a.id),
      );
      saveUnlockedAchievements(merged);
      scheduleSidecarRemoteSave();
      set((state) => ({
        unlockedAchievements: merged,
        toastQueue: [...state.toastQueue, ...newly],
      }));
    }
    return newly;
  },

  dismissToast: () => {
    set((state) => ({ toastQueue: state.toastQueue.slice(1) }));
  },
}));
