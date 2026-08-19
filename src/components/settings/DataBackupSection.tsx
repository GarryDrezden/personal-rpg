import { useRef, useState } from 'react';
import { SettingsSection } from './SettingsSection';
import { SETTINGS_SECTION_IDS } from './settingsTocSections';
import { useAppStore } from '../../store/appStore';
import { dataApi } from '../../api/dataApi';
import { collectLocalSidecarsForSave } from '../../storage/sidecarSync';
import { restoreRemoteUserData } from '../../storage/remoteStorageClient';
import { getStorageMode } from '../../storage/storageClient';
import {
  backupToRestorePayload,
  exportUserBackup,
  prepareBackupForImport,
  stringifyUserBackup,
  summarizeUserData,
  BackupValidationError,
} from '../../storage/userDataCodec';
import type { UserDataSummary } from '../../types/userData';
import { ACHIEVEMENTS_STORAGE_KEY } from '../../store/achievementStorage';
import { COINS_STORAGE_KEY } from '../../store/coinStorage';
import { MOMENTUM_STORAGE_KEY } from '../../constants/momentum';

function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function backupFilename(prefix: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return `${prefix}-${day}.json`;
}

function SummaryList({ title, summary }: { title: string; summary: UserDataSummary }) {
  return (
    <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-3 text-sm">
      <p className="font-medium text-[var(--app-text)]">{title}</p>
      <ul className="mt-2 space-y-1 text-[var(--app-text-muted)]">
        {summary.exportedAt ? <li>Дата: {summary.exportedAt.slice(0, 10)}</li> : null}
        <li>Версия данных: {summary.dataSchemaVersion}</li>
        <li>Тема: {summary.themeId}</li>
        <li>Дней: {summary.dailyCount}</li>
        <li>Замеров: {summary.measurementCount}</li>
        {summary.profileName ? <li>Профиль: {summary.profileName}</li> : null}
      </ul>
    </div>
  );
}

export function DataBackupSection() {
  const dailyEntries = useAppStore((s) => s.dailyEntries);
  const measurements = useAppStore((s) => s.measurements);
  const rewards = useAppStore((s) => s.rewards);
  const bankDeposits = useAppStore((s) => s.bankDeposits);
  const settings = useAppStore((s) => s.settings);
  const init = useAppStore((s) => s.init);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    raw: string;
    incoming: UserDataSummary;
    current: UserDataSummary;
  } | null>(null);

  const currentAppData = { dailyEntries, measurements, rewards, bankDeposits, settings };

  const handleExport = async () => {
    setError(null);
    setBusy(true);
    try {
      let profile;
      try {
        const res = await dataApi.getAll();
        profile = {
          displayName: res.profile.displayName,
          heroGender: res.profile.heroGender,
          startWeight: res.profile.startWeight,
          targetWeight: res.profile.targetWeight,
          height: res.profile.height,
        };
      } catch {
        profile = undefined;
      }
      const backup = exportUserBackup({
        appData: currentAppData,
        extras: collectLocalSidecarsForSave(),
        profile,
      });
      downloadText(backupFilename('personal-rpg-backup'), stringifyUserBackup(backup));
    } catch {
      setError('Не удалось подготовить файл');
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const raw = await file.text();
      const prepared = prepareBackupForImport(raw);
      setPreview({
        raw,
        incoming: prepared.summary,
        current: summarizeUserData({
          dataSchemaVersion: settings.dataSchemaVersion ?? 1,
          dailyEntries,
          measurements,
          rewards,
          settings,
        profile: undefined,
        }),
      });
    } catch (err) {
      setPreview(null);
      setError(err instanceof BackupValidationError ? err.message : 'Не удалось прочитать файл');
    }
  };

  const handleCancel = () => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleRestore = async () => {
    if (!preview) return;
    if (getStorageMode() !== 'remote') {
      setError('Восстановление доступно только для аккаунта в сети');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const currentBackup = exportUserBackup({
        appData: currentAppData,
        extras: collectLocalSidecarsForSave(),
      });
      downloadText(backupFilename('personal-rpg-before-restore'), stringifyUserBackup(currentBackup));

      const prepared = prepareBackupForImport(preview.raw);
      const payload = backupToRestorePayload(prepared.backup);
      await restoreRemoteUserData({
        data: payload,
        profile: prepared.envelope.profile,
      });

      const extras = prepared.envelope.extras;
      if (extras.achievements != null) {
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(extras.achievements));
      }
      if (extras.coinTransactions != null) {
        localStorage.setItem(COINS_STORAGE_KEY, JSON.stringify(extras.coinTransactions));
      }
      if (extras.momentumHistory != null) {
        localStorage.setItem(MOMENTUM_STORAGE_KEY, JSON.stringify(extras.momentumHistory));
      }

      await init();
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось восстановить копию');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.backup}>
      <h2 className="mb-2 font-semibold">Данные и резервная копия</h2>
      <p className="mb-3 text-sm text-[var(--app-text-muted)]">
        Можно сохранить локальную копию прогресса или восстановить её позже.
      </p>
      <p className="mb-4 text-xs text-[var(--app-text-muted)]">
        Файл содержит ваши данные приложения. Храните его там, где вам удобно.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          data-testid="backup-export"
          disabled={busy}
          onClick={() => void handleExport()}
          className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-4 py-3 text-sm font-medium text-[var(--app-text)] hover:brightness-[1.04] disabled:opacity-50"
        >
          Экспортировать данные
        </button>
        <button
          type="button"
          data-testid="backup-import"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="rounded-xl border border-[var(--app-border)] px-4 py-3 text-sm font-medium text-[var(--app-text)] hover:brightness-[1.04] disabled:opacity-50"
        >
          Импортировать резервную копию
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          data-testid="backup-import-input"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>
      {error ? (
        <p className="mt-3 text-sm text-[var(--app-danger)]" data-testid="backup-error">
          {error}
        </p>
      ) : null}
      {preview ? (
        <div className="mt-4 space-y-3" data-testid="backup-preview">
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryList title="В файле" summary={preview.incoming} />
            <SummaryList title="Сейчас в приложении" summary={preview.current} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="backup-restore-confirm"
              disabled={busy}
              onClick={() => void handleRestore()}
              className="rounded-xl bg-[var(--app-primary)] px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
            >
              Восстановить эту копию
            </button>
            <button
              type="button"
              data-testid="backup-restore-cancel"
              disabled={busy}
              onClick={handleCancel}
              className="rounded-xl border border-[var(--app-border)] px-4 py-2 text-sm text-[var(--app-text-muted)]"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : null}
    </SettingsSection>
  );
}
