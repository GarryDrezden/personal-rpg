import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { useDerivedStats } from '../store/selectors';
import { todayISO } from '../utils/dates';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

type Tab = 'available' | 'purchased' | 'add';

export function RewardsPage() {
  const { rewards, dailyEntries, measurements, settings, purchaseReward, addReward } = useAppStore();
  const stats = useDerivedStats(dailyEntries, measurements, rewards, settings, todayISO());
  const [tab, setTab] = useState<Tab>('available');
  const [newReward, setNewReward] = useState({ title: '', description: '', cost: 100, category: 'Своё' });

  const available = rewards.filter((r) => !r.purchasedAt && !r.hidden);
  const purchased = rewards.filter((r) => r.purchasedAt);

  const handlePurchase = async (id: string, cost: number) => {
    if (stats.availablePoints < cost) {
      alert('Недостаточно очков');
      return;
    }
    if (!confirm('Купить эту награду?')) return;
    await purchaseReward(id);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReward.title.trim()) return;
    await addReward({ ...newReward, hidden: false });
    setNewReward({ title: '', description: '', cost: 100, category: 'Своё' });
    setTab('available');
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Награды</h1>
        <Badge variant="gold">{stats.availablePoints} очков</Badge>
      </header>

      <div className="flex gap-2 border-b border-rpg-border pb-2">
        {(['available', 'purchased', 'add'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === t ? 'bg-amber-100 text-amber-900' : 'text-rpg-muted hover:bg-stone-100'
            }`}
          >
            {t === 'available' ? 'Доступные' : t === 'purchased' ? 'Купленные' : 'Добавить'}
          </button>
        ))}
      </div>

      {tab === 'available' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {available.map((r) => (
            <Card key={r.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-sm text-rpg-muted mt-1">{r.description}</p>
                  <Badge variant="default">{r.category}</Badge>
                </div>
                <span className="text-gold font-bold">{r.cost}</span>
              </div>
              <button
                onClick={() => void handlePurchase(r.id, r.cost)}
                disabled={stats.availablePoints < r.cost}
                className="mt-3 w-full min-h-10 rounded-xl bg-gold text-white font-medium disabled:opacity-40 hover:bg-amber-600"
              >
                Купить
              </button>
            </Card>
          ))}
        </div>
      )}

      {tab === 'purchased' && (
        <div className="space-y-3">
          {purchased.length === 0 && <p className="text-rpg-muted">Пока нет купленных наград</p>}
          {purchased.map((r) => (
            <Card key={r.id} className="opacity-80">
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-rpg-muted">
                Куплено: {r.purchasedAt ? new Date(r.purchasedAt).toLocaleDateString('ru') : '—'} · {r.cost} оч.
              </p>
            </Card>
          ))}
        </div>
      )}

      {tab === 'add' && (
        <Card>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              value={newReward.title}
              onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
              placeholder="Название награды"
              className="w-full rounded-xl border border-rpg-border px-4 py-3"
              required
            />
            <textarea
              value={newReward.description}
              onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
              placeholder="Описание"
              className="w-full rounded-xl border border-rpg-border px-4 py-3"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={newReward.cost}
                onChange={(e) => setNewReward({ ...newReward, cost: Number(e.target.value) })}
                placeholder="Стоимость"
                className="rounded-xl border border-rpg-border px-4 py-3"
              />
              <input
                value={newReward.category}
                onChange={(e) => setNewReward({ ...newReward, category: e.target.value })}
                placeholder="Категория"
                className="rounded-xl border border-rpg-border px-4 py-3"
              />
            </div>
            <button type="submit" className="w-full min-h-12 rounded-xl bg-gold text-white font-semibold">
              Добавить награду
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}
