import { useEffect, useMemo, useState } from 'react';
import type { AppSettings } from '../../types';
import type {
  BuiltinHabitId,
  CustomHabitDefinition,
  HabitCardColorId,
  HabitConfig,
  SecondaryQuestCategory,
} from '../../types/habits';
import { BUILTIN_HABITS } from '../../constants/builtinHabits';
import {
  HABIT_COLOR_OPTIONS,
  getHabitCardColorClass,
  getHabitColorSwatchClass,
} from '../../constants/habitColors';
import { generateId } from '../../utils/generateId';
import { HABIT_ICON_OPTIONS } from '../../constants/habitIcons';
import { DEFAULT_HABIT_CONFIG, resolveHabitConfig } from '../../utils/habitConfig';
import { NumberInput } from '../ui/NumberInput';

type HabitsEditorProps = {
  settings: AppSettings;
  onChange: (habitConfig: HabitConfig) => void;
};

type EditorRow =
  | { kind: 'builtin'; id: BuiltinHabitId }
  | { kind: 'custom'; habit: CustomHabitDefinition };

type RowKey = `builtin:${BuiltinHabitId}` | `custom:${string}`;

function rowKey(row: EditorRow): RowKey {
  return row.kind === 'builtin' ? `builtin:${row.id}` : `custom:${row.habit.id}`;
}

function ensureConfig(settings: AppSettings): HabitConfig {
  return resolveHabitConfig(settings);
}

export function HabitsEditor({ settings, onChange }: HabitsEditorProps) {
  const config = ensureConfig(settings);
  const [selectedKey, setSelectedKey] = useState<RowKey | ''>('');

  const update = (patch: Partial<HabitConfig>) => {
    onChange({ ...config, ...patch });
  };

  const rows: EditorRow[] = useMemo(
    () => [
      ...BUILTIN_HABITS.filter((h) => !config.hiddenBuiltinIds.includes(h.id)).map((h) => ({
        kind: 'builtin' as const,
        id: h.id,
      })),
      ...config.customHabits.map((h) => ({ kind: 'custom' as const, habit: h })),
    ],
    [config.hiddenBuiltinIds, config.customHabits],
  );

  const rowLabels = useMemo(() => {
    const map = new Map<RowKey, string>();
    for (const row of rows) {
      if (row.kind === 'builtin') {
        const template = BUILTIN_HABITS.find((h) => h.id === row.id)!;
        const override = config.builtinOverrides[row.id];
        const title = override?.title ?? template.title;
        map.set(rowKey(row), `${template.icon} ${title}`);
      } else {
        map.set(rowKey(row), `${row.habit.icon} ${row.habit.title}`);
      }
    }
    return map;
  }, [rows, config.builtinOverrides]);

  useEffect(() => {
    if (rows.length === 0) {
      setSelectedKey('');
      return;
    }
    const keys = rows.map(rowKey);
    if (!selectedKey || !keys.includes(selectedKey as RowKey)) {
      setSelectedKey(keys[0]!);
    }
  }, [rows, selectedKey]);

  const selectedRow = rows.find((r) => rowKey(r) === selectedKey);

  const hideBuiltin = (id: BuiltinHabitId) => {
    update({
      hiddenBuiltinIds: [...config.hiddenBuiltinIds, id],
      builtinOverrides: Object.fromEntries(
        Object.entries(config.builtinOverrides).filter(([key]) => key !== id),
      ) as HabitConfig['builtinOverrides'],
    });
  };

  const restoreBuiltin = (id: BuiltinHabitId) => {
    update({
      hiddenBuiltinIds: config.hiddenBuiltinIds.filter((x) => x !== id),
    });
    setSelectedKey(`builtin:${id}`);
  };

  const updateBuiltinOverride = (
    id: BuiltinHabitId,
    patch: Partial<NonNullable<HabitConfig['builtinOverrides'][BuiltinHabitId]>>,
  ) => {
    update({
      builtinOverrides: {
        ...config.builtinOverrides,
        [id]: { ...config.builtinOverrides[id], ...patch },
      },
    });
  };

  const updateCustom = (id: string, patch: Partial<CustomHabitDefinition>) => {
    update({
      customHabits: config.customHabits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    });
  };

  const removeCustom = (id: string) => {
    update({ customHabits: config.customHabits.filter((h) => h.id !== id) });
  };

  const addCustom = () => {
    const habit: CustomHabitDefinition = {
      id: generateId(),
      title: 'Новая цель',
      description: '',
      category: 'bonus',
      icon: '🧘',
      cardColor: 'teal',
      points: 10,
    };
    update({ customHabits: [...config.customHabits, habit] });
    setSelectedKey(`custom:${habit.id}`);
  };

  const hiddenBuiltins = BUILTIN_HABITS.filter((h) => config.hiddenBuiltinIds.includes(h.id));

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--app-text-muted)]">
        Выбери цель из списка, чтобы изменить название, иконку, цвет и XP. Стандартные можно скрыть,
        свои — добавить.
      </p>

      {rows.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="min-w-0 flex-1">
            <span className="mb-1 block text-sm font-medium text-[var(--app-text)]">
              Редактируемая цель
            </span>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value as RowKey)}
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2.5 text-[var(--app-text)]"
            >
              {rows.map((row) => {
                const key = rowKey(row);
                const isCustom = row.kind === 'custom';
                return (
                  <option key={key} value={key}>
                    {rowLabels.get(key)}
                    {isCustom ? ' (своя)' : ' (стандартная)'}
                  </option>
                );
              })}
            </select>
          </label>
          <button
            type="button"
            onClick={addCustom}
            className="shrink-0 rounded-xl border border-dashed border-[var(--app-border)] px-4 py-2.5 text-sm font-medium text-[var(--app-primary)] hover:bg-[var(--app-bg-soft)] sm:mt-6"
          >
            + Своя цель
          </button>
        </div>
      )}

      {rows.length === 0 && (
        <p className="rounded-xl border border-dashed border-[var(--app-border)] px-4 py-3 text-sm text-[var(--app-text-muted)]">
          Нет активных второстепенных целей. Добавь свою или верни стандартную из списка ниже.
        </p>
      )}

      {selectedRow?.kind === 'builtin' && (() => {
        const template = BUILTIN_HABITS.find((h) => h.id === selectedRow.id)!;
        const override = config.builtinOverrides[selectedRow.id] ?? {};
        return (
          <HabitRowEditor
            badge="Стандартная"
            title={override.title ?? template.title}
            description={override.description ?? template.description}
            icon={override.icon ?? template.icon}
            cardColor={override.cardColor ?? template.cardColor}
            points={override.points ?? settings.pointSettings[template.pointKey]}
            category={template.category}
            onTitle={(v) => updateBuiltinOverride(selectedRow.id, { title: v })}
            onDescription={(v) => updateBuiltinOverride(selectedRow.id, { description: v })}
            onIcon={(v) => updateBuiltinOverride(selectedRow.id, { icon: v })}
            onColor={(v) => updateBuiltinOverride(selectedRow.id, { cardColor: v })}
            onPoints={(v) => updateBuiltinOverride(selectedRow.id, { points: v })}
            onCategory={() => {}}
            categoryLocked
            onRemove={() => hideBuiltin(selectedRow.id)}
            removeLabel="Скрыть"
          />
        );
      })()}

      {selectedRow?.kind === 'custom' && (
        <HabitRowEditor
          badge="Своя"
          title={selectedRow.habit.title}
          description={selectedRow.habit.description}
          icon={selectedRow.habit.icon}
          cardColor={selectedRow.habit.cardColor}
          points={selectedRow.habit.points}
          category={selectedRow.habit.category}
          onTitle={(v) => updateCustom(selectedRow.habit.id, { title: v })}
          onDescription={(v) => updateCustom(selectedRow.habit.id, { description: v })}
          onIcon={(v) => updateCustom(selectedRow.habit.id, { icon: v })}
          onColor={(v) => updateCustom(selectedRow.habit.id, { cardColor: v })}
          onPoints={(v) => updateCustom(selectedRow.habit.id, { points: v })}
          onCategory={(v) => updateCustom(selectedRow.habit.id, { category: v })}
          onRemove={() => removeCustom(selectedRow.habit.id)}
          removeLabel="Удалить"
        />
      )}

      {rows.length === 0 && (
        <button
          type="button"
          onClick={addCustom}
          className="w-full rounded-xl border border-dashed border-[var(--app-border)] px-4 py-3 text-sm font-medium text-[var(--app-primary)] hover:bg-[var(--app-bg-soft)]"
        >
          + Добавить свою цель
        </button>
      )}

      {hiddenBuiltins.length > 0 && (
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            Скрытые стандартные
          </p>
          <div className="flex flex-wrap gap-2">
            {hiddenBuiltins.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => restoreBuiltin(h.id)}
                className="rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-1.5 text-sm hover:brightness-[1.04]"
              >
                {h.icon} {h.title} — вернуть
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type HabitRowEditorProps = {
  badge: string;
  title: string;
  description: string;
  icon: string;
  cardColor: HabitCardColorId;
  points: number;
  category: SecondaryQuestCategory;
  categoryLocked?: boolean;
  onTitle: (v: string) => void;
  onDescription: (v: string) => void;
  onIcon: (v: string) => void;
  onColor: (v: HabitCardColorId) => void;
  onPoints: (v: number) => void;
  onCategory: (v: SecondaryQuestCategory) => void;
  onRemove: () => void;
  removeLabel: string;
};

function HabitRowEditor({
  badge,
  title,
  description,
  icon,
  cardColor,
  points,
  category,
  categoryLocked,
  onTitle,
  onDescription,
  onIcon,
  onColor,
  onPoints,
  onCategory,
  onRemove,
  removeLabel,
}: HabitRowEditorProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--app-border)] p-4 ${getHabitCardColorClass(cardColor)}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-[var(--app-card-strong)] px-2 py-0.5 text-xs font-medium text-[var(--app-text-muted)]">
          {badge} · {category === 'medium' ? 'Средняя' : 'Бонусная'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-[var(--app-danger)] hover:underline"
        >
          {removeLabel}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-[var(--app-text)]">Название</span>
          <input
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-[var(--app-text)]"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-[var(--app-text)]">Описание</span>
          <input
            value={description}
            onChange={(e) => onDescription(e.target.value)}
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-[var(--app-text)]"
          />
        </label>
        <NumberInput label="XP за выполнение" value={points} onChange={(v) => onPoints(v ?? 0)} />
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--app-text)]">Иконка</span>
          <select
            value={icon}
            onChange={(e) => onIcon(e.target.value)}
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-lg text-[var(--app-text)]"
          >
            {HABIT_ICON_OPTIONS.map((emoji) => (
              <option key={emoji} value={emoji}>
                {emoji}
              </option>
            ))}
          </select>
        </label>
        {!categoryLocked && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[var(--app-text)]">Раздел</span>
            <select
              value={category}
              onChange={(e) => onCategory(e.target.value as SecondaryQuestCategory)}
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-[var(--app-text)]"
            >
              <option value="medium">Средние квесты</option>
              <option value="bonus">Бонусные квесты</option>
            </select>
          </label>
        )}
        <label className={`block ${categoryLocked ? 'sm:col-span-2' : ''}`}>
          <span className="mb-1 block text-sm font-medium text-[var(--app-text)]">Цвет карточки</span>
          <select
            value={cardColor}
            onChange={(e) => onColor(e.target.value as HabitCardColorId)}
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-[var(--app-text)]"
          >
            {HABIT_COLOR_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-[var(--app-text-muted)]">
        <span>Превью:</span>
        <span
          className={`inline-flex items-center gap-2 rounded-xl border border-[var(--app-border)] px-3 py-1.5 ${getHabitCardColorClass(cardColor)}`}
        >
          <span className="text-lg">{icon}</span>
          <span className="font-medium text-[var(--app-text)]">{title || '—'}</span>
          <span className={`h-3 w-3 rounded-full ${getHabitColorSwatchClass(cardColor)}`} />
        </span>
      </div>
    </div>
  );
}

export { DEFAULT_HABIT_CONFIG };
