import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { BODY_ABILITY_BANK_VERSION } from '../../constants/bodyAbilityBank';
import { useAppStore } from '../../store/appStore';
import {
  getPersonalBodyAbilitiesState,
  isBodyAbilityProfileConfigured,
  regenerateBodyAbilityMap,
} from '../../utils/bodyAbilityPersonalEngine';

export function BodyAbilityMapSettingsCard() {
  const { settings, saveSettings } = useAppStore();
  const [regenBusy, setRegenBusy] = useState(false);
  const configured = isBodyAbilityProfileConfigured(settings);
  const personal = getPersonalBodyAbilitiesState(settings);
  const version =
    personal.generatedFromVersion ??
    personal.abilityBankVersion ??
    BODY_ABILITY_BANK_VERSION;

  const handleRegenerate = async () => {
    if (!personal.profile) return;
    const ok = window.confirm(
      'Открытые достижения сохранятся. Остальная карта будет собрана заново под текущие ответы.',
    );
    if (!ok) return;
    setRegenBusy(true);
    try {
      await saveSettings(regenerateBodyAbilityMap(settings, personal.profile));
    } finally {
      setRegenBusy(false);
    }
  };

  return (
    <Card id="settings-body-map" className="scroll-mt-28" data-testid="setting-row-body-map">
      <h2 className="mb-2 font-semibold text-[var(--app-text)]">Карта тела</h2>
      <p className="mb-3 text-sm text-[var(--app-text-muted)]">
        Настрой карту тела: цель, интересы и то, что уже даётся нормально. Игра пересоберёт сетку
        под твой путь.
      </p>
      <div className="mb-4 space-y-1 text-sm text-[var(--app-text)]">
        <p>
          Статус:{' '}
          <span className="font-medium" data-testid="body-map-settings-status">
            {configured ? 'Настроена' : 'Не настроена'}
          </span>
        </p>
        {configured ? (
          <p className="text-[var(--app-text-muted)]">
            {personal.selectedAbilityIds.length} достижений в карте
          </p>
        ) : null}
        <p className="text-xs text-[var(--app-text-muted)]">Банк: {version}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          to="/freedom?setup=1"
          className="rounded-xl bg-[var(--app-primary)] px-4 py-2 text-sm font-semibold text-slate-950"
          data-testid="body-map-settings-setup"
        >
          {configured ? 'Изменить ответы' : 'Настроить карту тела'}
        </Link>
        {configured ? (
          <button
            type="button"
            disabled={regenBusy}
            onClick={() => void handleRegenerate()}
            className="rounded-xl border border-[var(--app-border)] px-4 py-2 text-sm text-[var(--app-text-muted)]"
            data-testid="body-map-settings-regenerate"
          >
            Пересобрать карту
          </button>
        ) : null}
      </div>
    </Card>
  );
}
