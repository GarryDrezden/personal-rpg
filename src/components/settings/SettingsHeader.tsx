import { Link } from 'react-router-dom';

type SettingsHeaderProps = {
  saving: boolean;
  onSave: () => void;
};

export function SettingsHeader({ saving, onSave }: SettingsHeaderProps) {
  return (
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
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-[var(--app-primary)] px-4 py-2 font-semibold text-slate-950 shadow-md transition hover:brightness-105 disabled:opacity-50"
      >
        {saving ? '…' : 'Сохранить'}
      </button>
    </header>
  );
}
