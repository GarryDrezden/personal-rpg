import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { DEFAULT_POINT_SETTINGS } from '../constants/defaults';
import type { PointSettings, WeeklySettings } from '../types';
import { Card } from '../components/ui/Card';
import { NumberInput } from '../components/ui/NumberInput';

export function SettingsPage() {
  const { settings, saveSettings } = useAppStore();
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
            Путь считается от пика веса до этой цели. При небольшом сбросе (напр. 75→65 кг)
            персонаж начнёт с 3-й стадии с конца и дойдёт до финальной картинки.
          </p>
          <div className="flex gap-2">
            {(['male', 'female'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setLocal({ ...local, gender: g })}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                  local.gender === g
                    ? 'border-gold bg-amber-100 text-amber-900'
                    : 'border-rpg-border text-rpg-muted hover:bg-stone-50'
                }`}
              >
                {g === 'male' ? 'Мужской' : 'Женский'}
              </button>
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
          <h2 className="font-semibold">Баллы</h2>
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
