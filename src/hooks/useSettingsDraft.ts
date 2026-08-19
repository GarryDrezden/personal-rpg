import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { DEFAULT_POINT_SETTINGS } from '../constants/defaults';
import { DEFAULT_COIN_SETTINGS } from '../constants/coins';
import { DEFAULT_AVATAR_SETTINGS, resolveAvatarSettings } from '../constants/avatar';
import type { AppSettings, CoinSettings, PointSettings, WeeklySettings } from '../types';
import type { AvatarStage } from '../types/avatar';
import { generateId } from '../utils/generateId';
import { calcAutoAvatarStage, getWeightLossFromMeasurements } from '../utils/avatarEngine';

export function useSettingsDraft() {
  const { settings, measurements, saveSettings } = useAppStore();
  const [local, setLocal] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocal(settings);
  }, [settings]);

  const patchLocal = useCallback((patch: Partial<AppSettings>) => {
    setLocal((prev) => ({ ...prev, ...patch }));
  }, []);

  const updatePoints = (key: keyof PointSettings, value: number) => {
    setLocal((prev) => ({
      ...prev,
      pointSettings: { ...prev.pointSettings, [key]: value },
    }));
  };

  const coinSettings: CoinSettings = {
    ...DEFAULT_COIN_SETTINGS,
    ...local.coinSettings,
  };

  const updateCoins = (key: keyof CoinSettings, value: number) => {
    setLocal((prev) => ({
      ...prev,
      coinSettings: {
        ...DEFAULT_COIN_SETTINGS,
        ...prev.coinSettings,
        [key]: value,
      },
    }));
  };

  const addWeek = () => {
    const week: WeeklySettings = {
      id: generateId(),
      weekStart: new Date().toISOString().slice(0, 10),
      caloriesLimit: local.defaultCaloriesLimit,
      stepsGoal: local.defaultStepsNormal ?? local.defaultStepsGoal,
      stepsMinimum: local.defaultStepsMinimum,
      stepsNormal: local.defaultStepsNormal ?? local.defaultStepsGoal,
      stepsExcellent: local.defaultStepsExcellent,
      gymTarget: local.defaultGymTarget,
      weeklyPointsGoal: local.defaultWeeklyPointsGoal,
    };
    setLocal((prev) => ({ ...prev, weeklySettings: [...prev.weeklySettings, week] }));
  };

  const updateWeek = (id: string, partial: Partial<WeeklySettings>) => {
    setLocal((prev) => ({
      ...prev,
      weeklySettings: prev.weeklySettings.map((week) =>
        week.id === id ? { ...week, ...partial } : week,
      ),
    }));
  };

  const removeWeek = (id: string) => {
    setLocal((prev) => ({
      ...prev,
      weeklySettings: prev.weeklySettings.filter((week) => week.id !== id),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings({
        ...local,
        enableSleepTracking: settings.enableSleepTracking ?? false,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm('Сбросить баллы к значениям по умолчанию?')) return;
    setLocal((prev) => ({ ...prev, pointSettings: { ...DEFAULT_POINT_SETTINGS } }));
  };

  const handleResetCoins = () => {
    if (!confirm('Сбросить монеты к значениям по умолчанию?')) return;
    setLocal((prev) => ({ ...prev, coinSettings: { ...DEFAULT_COIN_SETTINGS } }));
  };

  const avatarSettings = resolveAvatarSettings(local);
  const { weightLossKg, hasWeightData } = getWeightLossFromMeasurements(measurements);
  const previewStage =
    avatarSettings.mode === 'manual'
      ? avatarSettings.manualStage
      : calcAutoAvatarStage(weightLossKg, avatarSettings.stageThresholdsKg);

  const updateAvatar = (patch: Partial<typeof avatarSettings>) => {
    setLocal((prev) => {
      const current = resolveAvatarSettings(prev);
      const next = {
        ...current,
        ...patch,
        stageThresholdsKg: {
          ...current.stageThresholdsKg,
          ...patch.stageThresholdsKg,
        },
      };
      return {
        ...prev,
        gender: next.gender,
        avatarSettings: next,
      };
    });
  };

  const updateAvatarThreshold = (stage: AvatarStage, value: number) => {
    if (stage === 1) return;
    updateAvatar({
      stageThresholdsKg: {
        ...avatarSettings.stageThresholdsKg,
        [stage]: value,
      },
    });
  };

  const handleResetAvatar = () => {
    if (!confirm('Сбросить настройки аватара к значениям по умолчанию?')) return;
    setLocal((prev) => ({
      ...prev,
      gender: DEFAULT_AVATAR_SETTINGS.gender,
      avatarSettings: { ...DEFAULT_AVATAR_SETTINGS },
    }));
  };

  return {
    local,
    saving,
    patchLocal,
    handleSave,
    handleReset,
    handleResetCoins,
    handleResetAvatar,
    addWeek,
    updateWeek,
    removeWeek,
    updatePoints,
    updateCoins,
    updateAvatar,
    updateAvatarThreshold,
    avatarSettings,
    previewStage,
    weightLossKg,
    hasWeightData,
    coinSettings,
  };
}

export type SettingsDraft = ReturnType<typeof useSettingsDraft>;
