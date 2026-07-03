import { useState } from 'react';
import {
  Coins,
  Gift,
  PiggyBank,
  Plus,
  ScrollText,
  Sparkles,
  Trash2,
  Wallet,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useGameStats } from '../hooks/useGameStats';
import { todayISO } from '../utils/dates';
import { totalBankBalance } from '../utils/bank';
import type { Reward } from '../types';

type Tab = 'available' | 'purchased' | 'coins' | 'bank' | 'add';

const TAB_LABELS: Record<Tab, string> = {
  available: 'Доступные',
  purchased: 'Купленные',
  coins: 'Монеты',
  bank: 'Копилка',
  add: 'Добавить',
};

const TREASURY_PANEL =
  'relative overflow-hidden rounded-2xl border border-[var(--app-gold)]/20 bg-gradient-to-br from-[#18120a]/40 via-[#14101f]/95 to-[#08070f]';
const TREASURY_CARD =
  'relative overflow-hidden rounded-2xl border border-violet-500/15 bg-gradient-to-br from-[#12101c]/95 via-[#0e0c16]/92 to-[#08070f]/95';
const INPUT_CLASS =
  'w-full rounded-xl border border-violet-500/20 bg-[#0e0c14]/80 px-4 py-3 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]/45 focus:border-[var(--app-gold)]/35 focus:outline-none';

function TreasuryEmptyState({
  title,
  text,
  icon: Icon = Gift,
}: {
  title: string;
  text: string;
  icon?: typeof Gift;
}) {
  return (
    <div
      className={`${TREASURY_CARD} col-span-full flex flex-col items-center px-6 py-10 text-center sm:col-span-2`}
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--app-gold)]/25 bg-[#14101c]/80 shadow-[0_0_24px_rgba(212,165,55,0.08)]"
        aria-hidden
      >
        <Icon className="h-7 w-7 text-[var(--app-gold)]/70" strokeWidth={1.35} />
      </div>
      <h3 className="text-base font-semibold text-[var(--app-text)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--app-text-muted)]/75">
        {text}
      </p>
    </div>
  );
}

function CoinAmount({ value, className = '' }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Coins className="h-4 w-4 shrink-0 text-[var(--app-gold)]/85" strokeWidth={1.5} />
      <span>{value.toLocaleString('ru')}</span>
    </span>
  );
}

export function RewardsPage({ embedded = false }: { embedded?: boolean }) {
  const {
    rewards,
    bankDeposits,
    purchaseReward,
    addReward,
    deleteReward,
    addBankDeposit,
    deleteBankDeposit,
  } = useAppStore();
  const stats = useGameStats(todayISO());
  const [tab, setTab] = useState<Tab>('available');
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    cost: 100,
    category: 'Своё',
  });
  const [deposit, setDeposit] = useState({ amount: '', comment: '' });

  const available = rewards.filter((r) => !r.purchasedAt && !r.hidden);
  const purchased = rewards.filter((r) => r.purchasedAt);
  const bankBalance = totalBankBalance(bankDeposits);
  const coinHistory = stats.coins.transactions;
  const purchaseHistory = coinHistory.filter((tx) => tx.type === 'spent');

  const handlePurchase = async (id: string, cost: number) => {
    if (stats.coins.available < cost) {
      alert('Не хватает монет');
      return;
    }
    if (!confirm(`Обменять ${cost} монет на награду?`)) return;
    try {
      await purchaseReward(id);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Не хватает монет');
    }
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

  const renderRewardCard = (r: Reward, mode: 'available' | 'purchased') => {
    const canBuy = stats.coins.available >= r.cost;
    const missing = r.cost - stats.coins.available;

    return (
      <article
        key={r.id}
        className={`${TREASURY_CARD} p-4 shadow-[0_0_20px_rgba(212,165,55,0.04)] ${
          mode === 'purchased' ? 'opacity-90' : ''
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--app-gold)]/15 to-transparent" />
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--app-gold)]/25 bg-[#14101c]/90 shadow-[0_0_16px_rgba(212,165,55,0.1)]">
            <Gift className="h-5 w-5 text-[var(--app-gold)]/80" strokeWidth={1.35} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--app-text)]">{r.title}</h3>
                {r.description ? (
                  <p className="mt-1 text-sm leading-snug text-[var(--app-text-muted)]/75">
                    {r.description}
                  </p>
                ) : null}
                <span className="mt-2 inline-block rounded-full border border-violet-500/20 bg-[#14101c]/60 px-2 py-0.5 text-[10px] font-medium text-violet-200/55">
                  {r.category}
                </span>
              </div>
              <div className="shrink-0 text-right">
                <CoinAmount
                  value={r.cost}
                  className="text-base font-bold text-[var(--app-gold)]"
                />
              </div>
            </div>

            {mode === 'purchased' ? (
              <p className="mt-3 text-xs text-[var(--app-text-muted)]/65">
                Получено{' '}
                {r.purchasedAt ? new Date(r.purchasedAt).toLocaleDateString('ru') : '—'} ·{' '}
                <CoinAmount value={r.cost} className="text-xs font-medium" />
              </p>
            ) : null}

            <div className="mt-3 flex gap-2">
              {mode === 'available' ? (
                <button
                  type="button"
                  onClick={() => void handlePurchase(r.id, r.cost)}
                  disabled={!canBuy}
                  className="min-h-10 flex-1 rounded-xl border border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)]/40 px-4 py-2 text-sm font-semibold text-[var(--app-text)] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {canBuy ? `Обменять ${r.cost} монет` : `Ещё ${missing} монет до награды`}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleDeleteReward(r.id, r.title)}
                  className="rounded-xl border border-violet-500/15 p-2 text-[var(--app-text-muted)]/60 hover:border-red-400/25 hover:text-red-300/80"
                  title="Удалить из истории"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-6" data-testid="growth-rewards-page">
      <header
        className={
          embedded
            ? `${TREASURY_PANEL} px-4 py-5 sm:px-6 sm:py-6`
            : `${TREASURY_PANEL} px-5 py-6 sm:px-8`
        }
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(212,165,55,0.12),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_100%,rgba(88,28,135,0.1),transparent_50%)]"
          aria-hidden
        />
        <div className="relative space-y-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--app-gold)]/85">
              Лавка наград
            </p>
            <h1 className="mt-1.5 text-xl font-bold text-[var(--app-text)] sm:text-2xl">
              Награды героя
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
              Монеты превращаются в маленькие разрешённые радости. XP растит героя, а монеты
              открывают лавку наград.
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--app-gold)]/20 bg-[#0e0c14]/50 px-4 py-3">
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/70">
                <Coins className="h-3.5 w-3.5 text-[var(--app-gold)]/80" />
                Монеты в лавке
              </dt>
              <dd className="mt-1.5 text-2xl font-bold text-[var(--app-gold)] sm:text-3xl">
                {stats.coins.available.toLocaleString('ru')}
              </dd>
              <dd className="mt-1 text-xs text-[var(--app-text-muted)]/60">
                за неделю +{stats.coins.weekEarned} · обменяно {stats.coins.totalSpent}
              </dd>
            </div>
            <div className="rounded-xl border border-emerald-400/15 bg-[#0e0c14]/50 px-4 py-3">
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/70">
                <PiggyBank className="h-3.5 w-3.5 text-emerald-300/70" />
                Копилка маршрута
              </dt>
              <dd className="mt-1.5 text-2xl font-bold text-emerald-300/90 sm:text-3xl">
                {bankBalance.toLocaleString('ru')} ₽
              </dd>
              <dd className="mt-1 text-xs text-[var(--app-text-muted)]/60">
                Отложенные радости и цели вне лавки
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <section className={`${TREASURY_CARD} px-4 py-3.5 sm:px-5`}>
        <p className="flex items-start gap-2 text-sm leading-relaxed text-[var(--app-text-muted)]/80">
          <Sparkles
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--app-gold)]/70"
            strokeWidth={1.5}
          />
          <span>
            <strong className="font-medium text-[var(--app-text)]">Опыт</strong> не расходуется — он
            усиливает героя.{' '}
            <strong className="font-medium text-[var(--app-gold)]/90">Монеты</strong> нужны для
            лавки наград.
          </span>
        </p>
      </section>

      <nav
        className="flex flex-wrap gap-1.5 rounded-2xl border border-violet-500/15 bg-[#0a0810]/60 p-1.5"
        aria-label="Разделы лавки наград"
      >
        {(['available', 'purchased', 'coins', 'bank', 'add'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
              tab === t
                ? 'border border-[var(--app-gold)]/30 bg-[var(--app-primary-soft)]/35 text-[var(--app-gold)] shadow-[0_0_16px_rgba(212,165,55,0.08)]'
                : 'border border-transparent text-[var(--app-text-muted)]/70 hover:bg-[#14101c]/60 hover:text-[var(--app-text-muted)]'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </nav>

      {tab === 'available' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {available.length === 0 ? (
            <TreasuryEmptyState
              title="Лавка пока пуста"
              text="Награды появятся, когда ты добавишь первые цели или накопишь больше монет. Маршрут удерживается — и сокровищница тоже наполняется."
            />
          ) : (
            available.map((r) => renderRewardCard(r, 'available'))
          )}
        </div>
      )}

      {tab === 'purchased' && (
        <div className="space-y-3">
          {purchased.length === 0 ? (
            <TreasuryEmptyState
              title="Сокровищница ждёт первый обмен"
              text="Когда маршрут принесёт достаточно монет, здесь появятся разрешённые радости, которые ты уже забрал из лавки."
              icon={Sparkles}
            />
          ) : (
            purchased.map((r) => renderRewardCard(r, 'purchased'))
          )}
        </div>
      )}

      {tab === 'coins' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className={`${TREASURY_CARD} p-4`}>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/65">
                В лавке
              </p>
              <p className="mt-1.5 text-2xl font-bold text-[var(--app-gold)]">
                <CoinAmount value={stats.coins.available} />
              </p>
            </div>
            <div className={`${TREASURY_CARD} p-4`}>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/65">
                Заработано на маршруте
              </p>
              <p className="mt-1.5 text-2xl font-bold text-emerald-300/85">
                <CoinAmount value={stats.coins.totalEarned} />
              </p>
            </div>
            <div className={`${TREASURY_CARD} p-4`}>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/65">
                Обменяно в лавке
              </p>
              <p className="mt-1.5 text-2xl font-bold text-[var(--app-text)]">
                <CoinAmount value={stats.coins.totalSpent} />
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
              <Wallet className="h-4 w-4 text-[var(--app-gold)]/70" />
              История обменов
            </h3>
            {purchaseHistory.length === 0 ? (
              <p className="text-sm text-[var(--app-text-muted)]/65">
                Обменов пока нет — монеты копятся по мере маршрута.
              </p>
            ) : (
              purchaseHistory.map((tx) => (
                <div
                  key={tx.id}
                  className={`${TREASURY_CARD} flex items-center justify-between gap-3 px-4 py-3`}
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-[var(--app-text)]">{tx.title}</div>
                    <div className="text-xs text-[var(--app-text-muted)]/60">
                      {new Date(tx.date).toLocaleDateString('ru')}
                    </div>
                  </div>
                  <span className="shrink-0 font-bold text-red-300/80">−{tx.amount}</span>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
              <ScrollText className="h-4 w-4 text-[var(--app-gold)]/70" />
              Журнал монет
            </h3>
            {coinHistory.length === 0 ? (
              <p className="text-sm text-[var(--app-text-muted)]/65">
                Монеты появятся после первых записей на маршруте.
              </p>
            ) : (
              coinHistory.slice(0, 80).map((tx) => (
                <div
                  key={`${tx.id}-${tx.relatedId}`}
                  className={`${TREASURY_CARD} flex items-center justify-between gap-3 px-4 py-3`}
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-[var(--app-text)]">{tx.title}</div>
                    <div className="text-xs text-[var(--app-text-muted)]/60">
                      {new Date(tx.date).toLocaleDateString('ru')}
                      {tx.description ? ` · ${tx.description}` : ''}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 font-bold ${
                      tx.amount >= 0 ? 'text-emerald-300/85' : 'text-red-300/80'
                    }`}
                  >
                    {tx.amount >= 0 ? '+' : ''}
                    {tx.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'bank' && (
        <div className="space-y-4">
          <div className={`${TREASURY_PANEL} px-5 py-5`}>
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(52,211,153,0.08),transparent_55%)]"
              aria-hidden
            />
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/65">
                Баланс копилки
              </p>
              <p className="mt-1 text-3xl font-bold text-emerald-300/90">
                {bankBalance.toLocaleString('ru')} ₽
              </p>
            </div>
          </div>

          <div className={`${TREASURY_CARD} p-4 sm:p-5`}>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-[var(--app-text)]">
              <PiggyBank className="h-4 w-4 text-emerald-300/75" />
              Пополнить копилку
            </h3>
            <form onSubmit={handleDeposit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={deposit.amount}
                  onChange={(e) => setDeposit({ ...deposit, amount: e.target.value })}
                  placeholder="Сумма, ₽"
                  className={INPUT_CLASS}
                  required
                />
                <input
                  value={deposit.comment}
                  onChange={(e) => setDeposit({ ...deposit, comment: e.target.value })}
                  placeholder="Комментарий"
                  className={INPUT_CLASS}
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-11 rounded-xl border border-emerald-400/30 bg-emerald-950/40 font-semibold text-emerald-200/90 hover:brightness-105"
              >
                Отложить на баланс
              </button>
            </form>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-[var(--app-text)]">История копилки</h3>
            {bankDeposits.length === 0 ? (
              <p className="text-sm text-[var(--app-text-muted)]/65">
                Копилка пока пуста — сюда можно откладывать радости вне лавки монет.
              </p>
            ) : (
              bankDeposits.map((d) => (
                <div
                  key={d.id}
                  className={`${TREASURY_CARD} flex items-center justify-between gap-3 px-4 py-3`}
                >
                  <div className="text-sm">
                    <div className="font-medium text-emerald-300/85">
                      +{d.amount.toLocaleString('ru')} ₽
                    </div>
                    <div className="text-[var(--app-text-muted)]/60">
                      {new Date(d.date).toLocaleDateString('ru')}
                      {d.comment ? ` · ${d.comment}` : ''}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void deleteBankDeposit(d.id)}
                    className="rounded-lg p-1.5 text-[var(--app-text-muted)]/60 hover:border-red-400/25 hover:text-red-300/80"
                    title="Удалить запись"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'add' && (
        <div className={`${TREASURY_CARD} p-4 sm:p-5`}>
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-[var(--app-text)]">
            <Plus className="h-4 w-4 text-[var(--app-gold)]/80" />
            Добавить награду в лавку
          </h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              value={newReward.title}
              onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
              placeholder="Название награды"
              className={INPUT_CLASS}
              required
            />
            <textarea
              value={newReward.description}
              onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
              placeholder="Описание — что это за разрешённая радость"
              className={INPUT_CLASS}
              rows={2}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="number"
                value={newReward.cost}
                onChange={(e) => setNewReward({ ...newReward, cost: Number(e.target.value) })}
                placeholder="Стоимость в монетах"
                className={INPUT_CLASS}
              />
              <input
                value={newReward.category}
                onChange={(e) => setNewReward({ ...newReward, category: e.target.value })}
                placeholder="Категория"
                className={INPUT_CLASS}
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-12 rounded-xl border border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)]/40 font-semibold text-[var(--app-text)] hover:brightness-105"
            >
              Добавить в лавку
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
