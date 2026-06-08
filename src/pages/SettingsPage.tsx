import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { DEFAULT_POINT_SETTINGS } from '../constants/defaults';
import { DEFAULT_COIN_SETTINGS } from '../constants/coins';
import { DEFAULT_AVATAR_SETTINGS, resolveAvatarSettings } from '../constants/avatar';
import type { CoinSettings, PointSettings, WeeklySettings } from '../types';
import type { AvatarMode, AvatarStage } from '../types/avatar';
import { AvatarDisplay } from '../components/avatar/AvatarDisplay';
import {
  calcAutoAvatarStage,
  getAvatarImagePath,
  getWeightLossFromMeasurements,
} from '../utils/avatarEngine';
import { Card } from '../components/ui/Card';
import { NumberInput } from '../components/ui/NumberInput';

export function SettingsPage() {
  const { settings, measurements, saveSettings } = useAppStore();
  const [local, setLocal] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocal(settings);
  }, [settings]);

  const updatePoints = (key: keyof PointSettings, value: number) => {
    setLocal({
      ...local,
      pointSettings: { ...local.pointSettings, [key]: value },
    });
  };

  const coinSettings: CoinSettings = {
    ...DEFAULT_COIN_SETTINGS,
    ...local.coinSettings,
  };

  const updateCoins = (key: keyof CoinSettings, value: number) => {
    setLocal({
      ...local,
      coinSettings: { ...coinSettings, [key]: value },
    });
  };

  const addWeek = () => {
    const ws: WeeklySettings = {
      id: crypto.randomUUID(),
      weekStart: new Date().toISOString().slice(0, 10),
      caloriesLimit: local.defaultCaloriesLimit,
      stepsGoal: local.defaultStepsGoal,
      gymTarget: local.defaultGymTarget,
      weeklyPointsGoal: local.defaultWeeklyPointsGoal,
    };
    setLocal({ ...local, weeklySettings: [...local.weeklySettings, ws] });
  };

  const updateWeek = (id: string, partial: Partial<WeeklySettings>) => {
    setLocal({
      ...local,
      weeklySettings: local.weeklySettings.map((w) =>
        w.id === id ? { ...w, ...partial } : w,
      ),
    });
  };

  const removeWeek = (id: string) => {
    setLocal({
      ...local,
      weeklySettings: local.weeklySettings.filter((w) => w.id !== id),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings(local);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm('Сбросить баллы к значениям по умолчанию?')) return;
    setLocal({ ...local, pointSettings: { ...DEFAULT_POINT_SETTINGS } });
  };

  const handleResetCoins = () => {
    if (!confirm('Сбросить монеты к значениям по умолчанию?')) return;
    setLocal({ ...local, coinSettings: { ...DEFAULT_COIN_SETTINGS } });
  };

  const avatarSettings = resolveAvatarSettings(local);
  const { weightLossKg, hasWeightData } = getWeightLossFromMeasurements(measurements);
  const previewStage =
    avatarSettings.mode === 'manual'
      ? avatarSettings.manualStage
      : calcAutoAvatarStage(weightLossKg, avatarSettings.stageThresholdsKg);

  const updateAvatar = (patch: Partial<typeof avatarSettings>) => {
    const next = {
      ...avatarSettings,
      ...patch,
      stageThresholdsKg: {
        ...avatarSettings.stageThresholdsKg,
        ...patch.stageThresholdsKg,
      },
    };
    setLocal({
      ...local,
      gender: next.gender,
      avatarSettings: next,
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
    setLocal({
      ...local,
      gender: DEFAULT_AVATAR_SETTINGS.gender,
      avatarSettings: { ...DEFAULT_AVATAR_SETTINGS },
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Настройки</h1>
        <button
          onClick={() => void handleSave()}
          disabled={saving}
          className="rounded-xl bg-gold px-4 py-2 text-white font-medium disabled:opacity-50"
        >
          {saving ? '…' : 'Сохранить'}
        </button>
      </header>

      <Card>
        <h2 className="font-semibold mb-4">Персонаж прогресса</h2>
        <div className="space-y-4">
          <NumberInput
            label="Целевой вес (кг)"
            value={local.weightGoal}
            onChange={(v) => setLocal({ ...local, weightGoal: v ?? 100 })}
          />
          <p className="text-xs text-rpg-muted">
            Целевой вес используется в замерах и карте прогресса. Аватар меняется по снижению
            веса от первого замера — настройки ниже.
          </p>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Аватар</h2>
          <button onClick={handleResetAvatar} className="text-sm text-rpg-muted">
            Сбросить
          </button>
        </div>

        <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <AvatarDisplay
            stage={previewStage}
            gender={avatarSettings.gender}
            imagePath={getAvatarImagePath(avatarSettings.gender, previewStage)}
            weightLossKg={weightLossKg}
            hasWeightData={hasWeightData}
            compact
          />
          <div className="flex-1 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Тип аватара</p>
              <div className="flex gap-2">
                {(['male', 'female'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateAvatar({ gender: g })}
                    className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                      avatarSettings.gender === g
                        ? 'border-gold bg-amber-100 text-amber-900'
                        : 'border-rpg-border text-rpg-muted hover:bg-stone-50'
                    }`}
                  >
                    {g === 'male' ? 'Мужской' : 'Женский'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Режим стадии</p>
              <div className="flex gap-2">
                {(
                  [
                    { id: 'auto' as AvatarMode, label: 'Автоматически' },
                    { id: 'manual' as AvatarMode, label: 'Вручную' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => updateAvatar({ mode: m.id })}
                    className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                      avatarSettings.mode === m.id
                        ? 'border-gold bg-amber-100 text-amber-900'
                        : 'border-rpg-border text-rpg-muted hover:bg-stone-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {avatarSettings.mode === 'manual' && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">Ручной этап (1–7)</p>
            <div className="flex flex-wrap gap-2">
              {([1, 2, 3, 4, 5, 6, 7] as AvatarStage[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateAvatar({ manualStage: s })}
                  className={`h-10 w-10 rounded-xl border text-sm font-semibold transition-colors ${
                    avatarSettings.manualStage === s
                      ? 'border-gold bg-amber-100 text-amber-900'
                      : 'border-rpg-border text-rpg-muted hover:bg-stone-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-medium">Пороги стадий (кг сброшено)</p>
          <p className="mb-3 text-xs text-rpg-muted">
            В автоматическом режиме выбирается максимальная стадия, где сброс веса ≥ порога.
            Этап 1 всегда начинается с 0 кг.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {([1, 2, 3, 4, 5, 6, 7] as AvatarStage[]).map((stage) => (
              <NumberInput
                key={stage}
                label={`Этап ${stage}`}
                value={avatarSettings.stageThresholdsKg[stage]}
                onChange={(v) => updateAvatarThreshold(stage, v ?? 0)}
                disabled={stage === 1}
              />
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Цели по умолчанию</h2>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Калории/день" value={local.defaultCaloriesLimit} onChange={(v) => setLocal({ ...local, defaultCaloriesLimit: v ?? 2500 })} />
          <NumberInput label="Шаги/день" value={local.defaultStepsGoal} onChange={(v) => setLocal({ ...local, defaultStepsGoal: v ?? 8000 })} />
          <NumberInput label="Зал/неделя" value={local.defaultGymTarget} onChange={(v) => setLocal({ ...local, defaultGymTarget: v ?? 2 })} />
          <NumberInput label="Очки/неделя" value={local.defaultWeeklyPointsGoal} onChange={(v) => setLocal({ ...local, defaultWeeklyPointsGoal: v ?? 500 })} />
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Цели по неделям</h2>
          <button onClick={addWeek} className="text-sm text-gold font-medium">+ Неделя</button>
        </div>
        {local.weeklySettings.map((w) => (
          <div key={w.id} className="mb-4 rounded-xl border border-rpg-border p-3 space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">
                Начало недели
                <input type="date" value={w.weekStart} onChange={(e) => updateWeek(w.id, { weekStart: e.target.value })} className="ml-2 rounded border px-2 py-1" />
              </label>
              <button onClick={() => removeWeek(w.id)} className="text-danger text-sm">Удалить</button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <NumberInput label="Калории" value={w.caloriesLimit} onChange={(v) => updateWeek(w.id, { caloriesLimit: v ?? 2500 })} />
              <NumberInput label="Шаги" value={w.stepsGoal} onChange={(v) => updateWeek(w.id, { stepsGoal: v ?? 8000 })} />
              <NumberInput label="Зал" value={w.gymTarget} onChange={(v) => updateWeek(w.id, { gymTarget: v ?? 2 })} />
              <NumberInput label="Очки" value={w.weeklyPointsGoal} onChange={(v) => updateWeek(w.id, { weeklyPointsGoal: v ?? 500 })} />
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Монеты 🪙</h2>
          <button onClick={handleResetCoins} className="text-sm text-rpg-muted">
            Сбросить
          </button>
        </div>
        <p className="mb-4 text-xs text-rpg-muted">
          Награды за хорошие дни и недели. XP настраивается отдельно в блоке «Баллы».
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(coinSettings) as (keyof CoinSettings)[]).map((key) => (
            <NumberInput
              key={key}
              label={key}
              value={coinSettings[key]}
              onChange={(v) => updateCoins(key, v ?? 0)}
            />
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Баллы (XP)</h2>
          <button onClick={handleReset} className="text-sm text-rpg-muted">Сбросить</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(local.pointSettings) as (keyof PointSettings)[]).map((key) => (
            <NumberInput
              key={key}
              label={key}
              value={local.pointSettings[key]}
              onChange={(v) => updatePoints(key, v ?? 0)}
            />
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">Бэкап</h2>
        <a
          href="/api/backup"
          download
          className="inline-block rounded-xl border border-rpg-border px-4 py-3 text-sm font-medium hover:bg-stone-50"
        >
          Скачать .sqlite
        </a>
      </Card>
    </div>
  );
}
