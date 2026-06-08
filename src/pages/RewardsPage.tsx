import { useMemo, useState } from 'react';

import { Trash2, PiggyBank, Coins } from 'lucide-react';

import { useAppStore } from '../store/appStore';

import { useAchievementStore } from '../store/achievementStore';

import { useCoinStore } from '../store/coinStore';

import { useGameStats } from '../hooks/useGameStats';

import { todayISO } from '../utils/dates';

import { totalBankBalance } from '../utils/bank';

import { buildCoinTransactionHistory } from '../utils/coinEngine';

import { Card } from '../components/ui/Card';

import { Badge } from '../components/ui/Badge';



type Tab = 'available' | 'purchased' | 'coins' | 'bank' | 'add';



export function RewardsPage() {

  const {

    rewards,

    bankDeposits,

    dailyEntries,

    measurements,

    settings,

    purchaseReward,

    addReward,

    deleteReward,

    addBankDeposit,

    deleteBankDeposit,

  } = useAppStore();

  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);

  const manualCoinTransactions = useCoinStore((s) => s.manualTransactions);

  const stats = useGameStats(todayISO());

  const [tab, setTab] = useState<Tab>('available');

  const [newReward, setNewReward] = useState({

    title: '',

    description: '',

    cost: 100,

    category: 'Своё',

  });

  const [deposit, setDeposit] = useState({ amount: '', comment: '' });



  const coinHistory = useMemo(

    () =>

      buildCoinTransactionHistory(

        dailyEntries,

        measurements,

        rewards,

        settings,

        unlockedAchievements,

        manualCoinTransactions,

      ),

    [

      dailyEntries,

      measurements,

      rewards,

      settings,

      unlockedAchievements,

      manualCoinTransactions,

    ],

  );



  const available = rewards.filter((r) => !r.purchasedAt && !r.hidden);

  const purchased = rewards.filter((r) => r.purchasedAt);

  const bankBalance = totalBankBalance(bankDeposits);



  const handlePurchase = async (id: string, cost: number) => {

    if (stats.coins.available < cost) {

      alert('Недостаточно монет');

      return;

    }

    if (!confirm('Купить эту награду за монеты?')) return;

    await purchaseReward(id);

  };



  const handleDeleteReward = async (id: string, title: string) => {

    if (!confirm(`Удалить награду «${title}»?`)) return;

    await deleteReward(id);

  };



  const handleAdd = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!newReward.title.trim()) return;

    await addReward({

      title: newReward.title.trim(),

      description: newReward.description,

      cost: Number(newReward.cost),

      category: newReward.category,

      hidden: false,

      moneyGoal: null,

    });

    setNewReward({ title: '', description: '', cost: 100, category: 'Своё' });

    setTab('available');

  };



  const handleDeposit = async (e: React.FormEvent) => {

    e.preventDefault();

    const amount = Number(deposit.amount);

    if (!amount || amount <= 0) return;

    await addBankDeposit({

      amount,

      date: todayISO(),

      comment: deposit.comment,

    });

    setDeposit({ amount: '', comment: '' });

  };



  return (

    <div className="space-y-6">

      <header className="flex flex-wrap items-center justify-between gap-3">

        <h1 className="text-2xl font-bold">Награды</h1>

        <div className="flex flex-col items-end gap-1">

          <Badge variant="gold">
            {stats.coins.available.toLocaleString('ru')} монет
          </Badge>

          <span className="text-xs text-rpg-muted">

            заработано {stats.coins.totalEarned.toLocaleString('ru')} · потрачено{' '}

            {stats.coins.totalSpent.toLocaleString('ru')}

          </span>

          <span className="text-sm text-rpg-muted flex items-center gap-1">

            <PiggyBank size={14} /> {bankBalance.toLocaleString('ru')} ₽ в копилке

          </span>

        </div>

      </header>



      <Card className="bg-gradient-to-br from-amber-50 to-white">

        <p className="text-sm text-rpg-muted">

          <strong className="text-stone-800">XP</strong> копится за всё время и не тратится — он

          растит уровень. <strong className="text-stone-800">Монеты</strong> начисляются за хорошие

          дни, недели и достижения — ими покупаются награды.

        </p>

      </Card>



      <div className="flex flex-wrap gap-2 border-b border-rpg-border pb-2">

        {(['available', 'purchased', 'coins', 'bank', 'add'] as Tab[]).map((t) => (

          <button

            key={t}

            onClick={() => setTab(t)}

            className={`rounded-lg px-4 py-2 text-sm font-medium ${

              tab === t ? 'bg-amber-100 text-amber-900' : 'text-rpg-muted hover:bg-stone-100'

            }`}

          >

            {t === 'available'

              ? 'Доступные'

              : t === 'purchased'

                ? 'Купленные'

                : t === 'coins'

                  ? 'Монеты'

                  : t === 'bank'

                    ? 'Копилка'

                    : 'Добавить'}

          </button>

        ))}

      </div>



      {tab === 'available' && (

        <div className="grid gap-3 sm:grid-cols-2">

          {available.length === 0 && (

            <p className="text-rpg-muted sm:col-span-2">Нет доступных наград</p>

          )}

          {available.map((r) => (

            <Card key={r.id}>

              <div className="flex justify-between items-start gap-2">

                <div className="min-w-0">

                  <h3 className="font-semibold">{r.title}</h3>

                  <p className="text-sm text-rpg-muted mt-1">{r.description}</p>

                  <Badge variant="default">{r.category}</Badge>

                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">

                  <span className="inline-flex items-center gap-1 text-gold font-bold">

                    <Coins size={14} />

                    {r.cost}

                  </span>

                  <button

                    type="button"

                    onClick={() => void handleDeleteReward(r.id, r.title)}

                    className="rounded-lg p-1.5 text-rpg-muted hover:bg-red-50 hover:text-danger"

                    title="Удалить"

                  >

                    <Trash2 size={16} />

                  </button>

                </div>

              </div>

              <button

                onClick={() => void handlePurchase(r.id, r.cost)}

                disabled={stats.coins.available < r.cost}

                className="mt-3 w-full min-h-10 rounded-xl bg-gold text-white font-medium disabled:opacity-40 hover:bg-amber-600"

              >

                Купить за {r.cost} монет

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

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="font-semibold">{r.title}</h3>

                  <p className="text-sm text-rpg-muted">

                    Куплено:{' '}

                    {r.purchasedAt ? new Date(r.purchasedAt).toLocaleDateString('ru') : '—'} ·{' '}

                    {r.cost} мон.

                  </p>

                </div>

                <button

                  type="button"

                  onClick={() => void handleDeleteReward(r.id, r.title)}

                  className="rounded-lg p-1.5 text-rpg-muted hover:bg-red-50 hover:text-danger"

                  title="Удалить"

                >

                  <Trash2 size={16} />

                </button>

              </div>

            </Card>

          ))}

        </div>

      )}



      {tab === 'coins' && (

        <div className="space-y-4">

          <div className="grid gap-3 sm:grid-cols-3">

            <Card>

              <p className="text-sm text-rpg-muted">Баланс</p>

              <p className="text-2xl font-bold text-gold">

                {stats.coins.available.toLocaleString('ru')}

              </p>

            </Card>

            <Card>

              <p className="text-sm text-rpg-muted">Заработано</p>

              <p className="text-2xl font-bold text-emerald-700">

                {stats.coins.totalEarned.toLocaleString('ru')}

              </p>

            </Card>

            <Card>

              <p className="text-sm text-rpg-muted">Потрачено</p>

              <p className="text-2xl font-bold text-stone-700">

                {stats.coins.totalSpent.toLocaleString('ru')}

              </p>

            </Card>

          </div>



          <div className="space-y-2">

            <h3 className="font-semibold">История операций</h3>

            {coinHistory.length === 0 && (

              <p className="text-sm text-rpg-muted">Монеты появятся после первых записей</p>

            )}

            {coinHistory.slice(0, 50).map((tx) => (

              <Card key={tx.id} className="flex items-center justify-between gap-3 py-3">

                <div className="min-w-0">

                  <div className="font-medium truncate">{tx.title}</div>

                  <div className="text-xs text-rpg-muted">

                    {new Date(tx.date).toLocaleDateString('ru')}

                    {tx.description ? ` · ${tx.description}` : ''}

                  </div>

                </div>

                <span

                  className={`shrink-0 font-bold ${

                    tx.amount >= 0 ? 'text-emerald-700' : 'text-red-600'

                  }`}

                >

                  {tx.amount >= 0 ? '+' : ''}

                  {tx.amount}

                </span>

              </Card>

            ))}

          </div>

        </div>

      )}



      {tab === 'bank' && (

        <div className="space-y-4">

          <Card className="bg-gradient-to-br from-emerald-50 to-white">

            <div className="text-sm text-rpg-muted">Баланс копилки</div>

            <div className="text-3xl font-bold text-emerald-700">

              {bankBalance.toLocaleString('ru')} ₽

            </div>

          </Card>



          <Card>

            <h3 className="mb-3 font-semibold">Пополнить</h3>

            <form onSubmit={handleDeposit} className="space-y-3">

              <div className="grid grid-cols-2 gap-3">

                <input

                  type="number"

                  min="1"

                  step="1"

                  value={deposit.amount}

                  onChange={(e) => setDeposit({ ...deposit, amount: e.target.value })}

                  placeholder="Сумма, ₽"

                  className="rounded-xl border border-rpg-border px-4 py-3"

                  required

                />

                <input

                  value={deposit.comment}

                  onChange={(e) => setDeposit({ ...deposit, comment: e.target.value })}

                  placeholder="Комментарий"

                  className="rounded-xl border border-rpg-border px-4 py-3"

                />

              </div>

              <button

                type="submit"

                className="w-full min-h-11 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"

              >

                Отложить на баланс

              </button>

            </form>

          </Card>



          <div className="space-y-2">

            <h3 className="font-semibold">История</h3>

            {bankDeposits.length === 0 && (

              <p className="text-sm text-rpg-muted">Пока нет пополнений</p>

            )}

            {bankDeposits.map((d) => (

              <Card key={d.id} className="flex items-center justify-between gap-3 py-3">

                <div className="text-sm">

                  <div className="font-medium text-emerald-700">

                    +{d.amount.toLocaleString('ru')} ₽

                  </div>

                  <div className="text-rpg-muted">

                    {new Date(d.date).toLocaleDateString('ru')}

                    {d.comment ? ` · ${d.comment}` : ''}

                  </div>

                </div>

                <button

                  type="button"

                  onClick={() => void deleteBankDeposit(d.id)}

                  className="rounded-lg p-1.5 text-rpg-muted hover:bg-red-50 hover:text-danger"

                  title="Удалить запись"

                >

                  <Trash2 size={16} />

                </button>

              </Card>

            ))}

          </div>

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

                placeholder="Стоимость в монетах"

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


