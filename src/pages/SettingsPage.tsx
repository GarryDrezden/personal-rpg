import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { DEFAULT_POINT_SETTINGS } from '../constants/defaults';
import { DEFAULT_COIN_SETTINGS } from '../constants/coins';
import {
  AVATAR_STAGES,
  AVATAR_STAGE_COUNT,
  DEFAULT_AVATAR_SETTINGS,
  resolveAvatarSettings,
} from '../constants/avatar';
import type { CoinSettings, PointSettings, WeeklySettings } from '../types';
import type { NutritionTrackingMode } from '../types/nutrition';
import type { AvatarMode, AvatarStage } from '../types/avatar';
import type { AppThemeId } from '../types/theme';
import { generateId } from '../utils/generateId';
import { AvatarDisplay } from '../components/avatar/AvatarDisplay';
import {
  calcAutoAvatarStage,
  getAvatarImagePath,
  getWeightLossFromMeasurements,
} from '../utils/avatarEngine';
import { Card } from '../components/ui/Card';
import { NumberInput } from '../components/ui/NumberInput';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { InstantSettingRow } from '../components/settings/InstantSettingRow';
import { SettingsToc } from '../components/settings/SettingsToc';
import { HabitsEditor } from '../components/settings/HabitsEditor';
import { useAppTheme } from '../hooks/useAppTheme';
import { useAutosaveStatus } from '../hooks/useAutosaveStatus';
import { AutosaveStatus } from '../components/ui/AutosaveStatus';
import { DEFAULT_HABIT_CONFIG } from '../utils/habitConfig';
import { CompanionSelector } from '../components/game/CompanionSelector';
import { PwaInstallCard } from '../components/pwa/PwaInstallCard';
import { setActiveCompanionId } from '../game/gameAssetStorage';
import type { CompanionId, HeroGender, TransformationMode } from '../types/gameAssets';

export function SettingsPage() {
  const { settings, measurements, saveSettings } = useAppStore();
  const { themeId, setThemeId } = useAppTheme();
  const { status: themeSaveStatus, message: themeSaveMessage, showSaving: showThemeSaving, showSaved: showThemeSaved, showError: showThemeError } =
    useAutosaveStatus();
  const sleepTrackingEnabled = settings.enableSleepTracking ?? false;
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

  const handleThemeChange = useCallback(
    async (nextId: AppThemeId) => {
      if (nextId === themeId) return;
      showThemeSaving();
      try {
        await setThemeId(nextId);
        showThemeSaved('Тема сохранена');
      } catch {
        showThemeError('Не удалось сохранить тему');
      }
    },
    [themeId, setThemeId, showThemeSaving, showThemeSaved, showThemeError],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Настройки</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            <Link to="/faq" className="font-medium text-[var(--app-primary)] hover:underline">
              Как пользоваться приложением → FAQ
            </Link>
          </p>
        </div>
        <button
          onClick={() => void handleSave()}
          disabled={saving}
          className="rounded-xl bg-[var(--app-primary)] px-4 py-2 font-semibold text-slate-950 shadow-md transition hover:brightness-105 disabled:opacity-50"
        >
          {saving ? '…' : 'Сохранить'}
        </button>
      </header>

      <SettingsToc />

      <Card id="settings-theme" className="scroll-mt-28" data-testid="setting-row-theme">
        <h2 className="mb-2 font-semibold text-[var(--app-text)]">Внешний вид</h2>
        <p className="mb-4 text-sm text-[var(--app-text-muted)]">
          Выберите визуальную тему интерфейса. Настройка сохраняется автоматически.
        </p>
        <ThemeSelector value={themeId} onChange={(id) => void handleThemeChange(id)} />
        <AutosaveStatus
          status={themeSaveStatus}
          message={themeSaveMessage}
          data-testid="theme-autosave-status"
        />
      </Card>

      <div id="settings-pwa" className="scroll-mt-28">
        <PwaInstallCard />
      </div>

      <Card id="settings-experimental" className="scroll-mt-28">
        <h2 className="mb-2 font-semibold text-[var(--app-text)]">Экспериментальные функции</h2>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-4">
          <InstantSettingRow
            title="Учёт сна"
            description="Добавляет сон как необязательный фактор инерции. Если сон не заполнен, день не считается хуже."
            hint={
              sleepTrackingEnabled
                ? 'Поля сна появятся на странице дня.'
                : 'Старые данные сна останутся в записях, но поля будут скрыты.'
            }
            checked={sleepTrackingEnabled}
            onChange={async (next) => {
              await saveSettings({ ...settings, enableSleepTracking: next });
            }}
            testId="setting-row-sleep-tracking"
            toggleTestId="sleep-tracking-toggle"
            statusTestId="sleep-autosave-status"
            savedMessage={(next) =>
              next ? 'Учёт сна включён' : 'Учёт сна выключен'
            }
            errorMessage="Не удалось сохранить настройку сна"
          />
        </div>
      </Card>

      <Card id="settings-weight" className="scroll-mt-28">
        <h2 className="mb-4 font-semibold">Персонаж прогресса</h2>
        <div className="space-y-4">
          <NumberInput
            label="Целевой вес (кг)"
            value={local.targetWeight ?? local.weightGoal}
            onChange={(v) =>
              setLocal({
                ...local,
                weightGoal: v ?? 100,
                targetWeight: v ?? 100,
              })
            }
          />
          <p className="text-xs text-[var(--app-text-muted)]">
            Стадии героя (1–20) считаются по проценту пути от стартового веса к цели. Используется
            лучший достигнутый вес, чтобы временный скачок не откатывал визуальную стадию.
          </p>
        </div>
      </Card>

      <Card id="settings-game-hero" className="scroll-mt-28">
        <h2 className="mb-4 font-semibold">Игровой герой</h2>
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Пол персонажа</p>
            <div className="flex gap-2">
              {(['male', 'female'] as HeroGender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() =>
                    setLocal({
                      ...local,
                      heroGender: g,
                      gender: g,
                    })
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    (local.heroGender ?? local.gender) === g
                      ? 'bg-[var(--app-primary)] text-slate-950'
                      : 'border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)]'
                  }`}
                >
                  {g === 'male' ? 'Мужчина' : 'Женщина'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Режим трансформации</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'weight_loss' as TransformationMode, label: 'Похудение' },
                  { id: 'muscle_gain' as TransformationMode, label: 'Набор мышц (позже)' },
                  { id: 'recomposition' as TransformationMode, label: 'Рекомпозиция (позже)' },
                ] as const
              ).map((mode) => {
                const disabled = mode.id !== 'weight_loss';
                return (
                  <button
                    key={mode.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setLocal({ ...local, transformationMode: mode.id })}
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${
                      (local.transformationMode ?? 'weight_loss') === mode.id
                        ? 'bg-[var(--app-primary)] text-slate-950'
                        : 'border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)]'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Активный спутник</p>
            <CompanionSelector
              value={local.activeCompanionId ?? 'golden_chinchilla_cat'}
              onChange={(id: CompanionId) => {
                setActiveCompanionId(id);
                setLocal({ ...local, activeCompanionId: id });
              }}
              compact
            />
          </div>
        </div>
      </Card>

      <Card id="settings-avatar" className="scroll-mt-28">
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
                        : 'border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)]'
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
                        : 'border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)]'
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
            <p className="mb-2 text-sm font-medium">Ручной этап (1–{AVATAR_STAGE_COUNT})</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_STAGES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateAvatar({ manualStage: s })}
                  className={`h-10 w-10 rounded-xl border text-sm font-semibold transition-colors ${
                    avatarSettings.manualStage === s
                      ? 'border-gold bg-amber-100 text-amber-900'
                      : 'border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)]'
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {AVATAR_STAGES.map((stage) => (
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

      <Card id="settings-nutrition" className="scroll-mt-28">
        <h2 className="mb-2 font-semibold text-[var(--app-text)]">Учёт питания</h2>
        <p className="mb-4 text-xs text-[var(--app-text-muted)]">
          Можно вести систему без точных цифр. Честность важнее идеальности.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              {
                mode: 'disabled' as NutritionTrackingMode,
                title: 'Выключен',
                description: 'Питание не будет участвовать в квестах, очках и инерции.',
              },
              {
                mode: 'simple' as NutritionTrackingMode,
                title: 'Упрощённый',
                description: 'Отмечай день как лёгкий, средний или тяжёлый без точных цифр.',
              },
              {
                mode: 'precise' as NutritionTrackingMode,
                title: 'Точный',
                description:
                  'Вводи калории и лимит. Подходит, когда готов к более строгому контролю.',
              },
            ] as const
          ).map((opt) => {
            const active = (local.nutritionTrackingMode ?? 'simple') === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => setLocal({ ...local, nutritionTrackingMode: opt.mode })}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)]'
                    : 'border-[var(--app-border)] bg-[var(--app-card-strong)] hover:brightness-[1.03]'
                }`}
              >
                <p className="text-sm font-semibold text-[var(--app-text)]">{opt.title}</p>
                <p className="mt-1 text-xs text-[var(--app-text-muted)]">{opt.description}</p>
              </button>
            );
          })}
        </div>
        {(local.nutritionTrackingMode ?? 'simple') === 'precise' ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <NumberInput
              label="Дневной лимит калорий"
              value={local.dailyCalorieLimit ?? local.defaultCaloriesLimit}
              onChange={(v) =>
                setLocal({
                  ...local,
                  dailyCalorieLimit: v ?? local.defaultCaloriesLimit,
                })
              }
            />
          </div>
        ) : null}
      </Card>

      <Card id="settings-defaults" className="scroll-mt-28">
        <h2 className="font-semibold mb-4">Цели по умолчанию</h2>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Калории/день" value={local.defaultCaloriesLimit} onChange={(v) => setLocal({ ...local, defaultCaloriesLimit: v ?? 2500 })} />
          <NumberInput label="Минимум шагов" value={local.defaultStepsMinimum ?? 7000} onChange={(v) => setLocal({ ...local, defaultStepsMinimum: v ?? 7000 })} />
          <NumberInput label="Норма шагов" value={local.defaultStepsNormal ?? local.defaultStepsGoal} onChange={(v) => setLocal({ ...local, defaultStepsNormal: v ?? 11500, defaultStepsGoal: v ?? 11500 })} />
          <NumberInput label="Отлично шагов" value={local.defaultStepsExcellent ?? 14000} onChange={(v) => setLocal({ ...local, defaultStepsExcellent: v ?? 14000 })} />
          <NumberInput label="Зал/неделя" value={local.defaultGymTarget} onChange={(v) => setLocal({ ...local, defaultGymTarget: v ?? 2 })} />
          <NumberInput label="Очки/неделя" value={local.defaultWeeklyPointsGoal} onChange={(v) => setLocal({ ...local, defaultWeeklyPointsGoal: v ?? 500 })} />
        </div>
        <p className="mt-3 text-xs text-rpg-muted">
          Минимум удерживает день, норма даёт хороший бонус, «Отлично» — максимум очков.
        </p>
      </Card>

      <Card id="settings-weeks" className="scroll-mt-28">
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
              <NumberInput label="Мин. шагов" value={w.stepsMinimum ?? local.defaultStepsMinimum ?? 7000} onChange={(v) => updateWeek(w.id, { stepsMinimum: v ?? 7000 })} />
              <NumberInput label="Норма шагов" value={w.stepsNormal ?? w.stepsGoal} onChange={(v) => updateWeek(w.id, { stepsNormal: v ?? 11500, stepsGoal: v ?? 11500 })} />
              <NumberInput label="Отлично шагов" value={w.stepsExcellent ?? local.defaultStepsExcellent ?? 14000} onChange={(v) => updateWeek(w.id, { stepsExcellent: v ?? 14000 })} />
              <NumberInput label="Зал" value={w.gymTarget} onChange={(v) => updateWeek(w.id, { gymTarget: v ?? 2 })} />
              <NumberInput label="Очки" value={w.weeklyPointsGoal} onChange={(v) => updateWeek(w.id, { weeklyPointsGoal: v ?? 500 })} />
            </div>
          </div>
        ))}
      </Card>

      <Card id="settings-coins" className="scroll-mt-28">
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

      <Card id="settings-xp" className="scroll-mt-28">
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

      <Card id="settings-habits" className="scroll-mt-28">
        <h2 className="mb-4 font-semibold text-[var(--app-text)]">Второстепенные цели</h2>
        <HabitsEditor
          settings={local}
          onChange={(habitConfig) =>
            setLocal({
              ...local,
              habitConfig: habitConfig ?? DEFAULT_HABIT_CONFIG,
            })
          }
        />
      </Card>

      <Card id="settings-backup" className="scroll-mt-28">
        <h2 className="font-semibold mb-2">Бэкап</h2>
        <a
          href="/api/backup"
          download
          className="inline-block rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-4 py-3 text-sm font-medium text-[var(--app-text)] hover:brightness-[1.04]"
        >
          Скачать .sqlite
        </a>
      </Card>
    </div>
  );
}
