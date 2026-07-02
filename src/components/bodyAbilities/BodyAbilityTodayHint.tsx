import { Link } from 'react-router-dom';
import type { BodyAbilityV1Hint } from '../../types/bodyAbilityV1';
import { useAppStore } from '../../store/appStore';
import { dismissBodyAbilityHint } from '../../game/bodyAbilities/bodyAbilityV1Engine';
import { useBodyAbilityV1Actions } from '../../hooks/useBodyAbilityV1Actions';
import { useState } from 'react';

type BodyAbilityTodayHintProps = {
  hint: BodyAbilityV1Hint;
};

export function BodyAbilityTodayHint({ hint }: BodyAbilityTodayHintProps) {
  const { settings, saveSettings } = useAppStore();
  const { unlockAbility } = useBodyAbilityV1Actions();
  const [busy, setBusy] = useState(false);

  const dismiss = async () => {
    setBusy(true);
    try {
      await saveSettings(dismissBodyAbilityHint(settings, hint.ability.id));
    } finally {
      setBusy(false);
    }
  };

  const unlock = async () => {
    setBusy(true);
    try {
      await unlockAbility(hint.ability, 'hint');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid="body-ability-today-hint"
      className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)]/80 px-4 py-3"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
        Способность тела
      </p>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">{hint.message}</p>
      <p className="mt-1 text-sm text-[var(--app-text)]">{hint.ability.title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void unlock()}
          className="rounded-lg bg-[var(--app-primary)] px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
        >
          Я заметил улучшение
        </button>
        <Link
          to="/growth/abilities"
          className="rounded-lg border border-[var(--app-border)] px-3 py-2 text-xs font-medium text-[var(--app-primary)]"
        >
          Все способности
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => void dismiss()}
          className="text-xs text-[var(--app-text-muted)] hover:underline disabled:opacity-50"
        >
          Скрыть подсказку
        </button>
      </div>
    </div>
  );
}
