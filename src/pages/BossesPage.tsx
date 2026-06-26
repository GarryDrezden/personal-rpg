import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { todayISO } from '../utils/dates';
import { getBossCatalog } from '../utils/bossCatalog';
import { countDefeatedBosses, getBossHistory } from '../utils/bossEngine';
import { BossCatalogCard } from '../components/boss/BossCatalogCard';
import { Card } from '../components/ui/Card';
import { Skull } from 'lucide-react';

export function BossesPage() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const today = todayISO();

  const catalog = useMemo(
    () => getBossCatalog({ dailyEntries, measurements, settings, today }),
    [dailyEntries, measurements, settings, today],
  );

  const history = useMemo(
    () => getBossHistory(dailyEntries, settings, measurements),
    [dailyEntries, settings, measurements],
  );

  const defeatedTypes = catalog.filter(
    (c) => c.status === 'defeated' || c.status === 'perfect',
  ).length;
  const pending = catalog.filter((c) => c.status === 'pending');
  const active = catalog.find((c) => c.status === 'active');

  const sorted = useMemo(() => {
    const order = { active: 0, failed: 1, pending: 2, defeated: 3, perfect: 4 };
    return [...catalog].sort((a, b) => order[a.status] - order[b.status]);
  }, [catalog]);

  return (
    <div className="space-y-6 pb-8">
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--app-danger)_15%,var(--app-card))] text-[var(--app-danger)]">
            <Skull size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Бестиарий боссов</h1>
            <p className="text-[var(--app-text-muted)]">
              Все недельные противники — кого уже победили и кого ждёт впереди
            </p>
          </div>
        </div>
      </header>

      <Card className="bg-[color-mix(in_srgb,var(--app-danger)_8%,var(--app-card))]">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">Побеждено типов</p>
            <p className="text-2xl font-bold text-[var(--app-text)]">
              {defeatedTypes} / {catalog.length}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">Недель с боями</p>
            <p className="text-2xl font-bold text-[var(--app-text)]">{history.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">Побед за всё время</p>
            <p className="text-2xl font-bold text-[var(--app-text)]">{countDefeatedBosses(history)}</p>
          </div>
        </div>
        {active && (
          <p className="mt-4 text-sm text-[var(--app-text)]">
            Сейчас в бою: <strong>{active.activeBoss?.title}</strong>
          </p>
        )}
        {pending.length > 0 && (
          <p className="mt-2 text-sm text-[var(--app-text-muted)]">
            Ещё не встречались: {pending.length} босс(ов) — они появятся в будущих неделях.
          </p>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((entry) => (
          <BossCatalogCard key={entry.templateId} entry={entry} />
        ))}
      </div>
    </div>
  );
}
