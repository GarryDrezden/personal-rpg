import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../store/appStore';
import { todayISO, formatDateRu, isMonday } from '../utils/dates';
import { getDelta, sortMeasurementsByDate } from '../utils/measurements';
import { Card } from '../components/ui/Card';
import { NumberInput } from '../components/ui/NumberInput';
import { StatTile } from '../components/ui/StatTile';
import type { MeasurementEntry } from '../types';

export function MeasurementsPage() {
  const { measurements, addMeasurement, settings } = useAppStore();
  const sorted = sortMeasurementsByDate(measurements);
  const weightDelta = getDelta(measurements, 'weight');
  const waistDelta = getDelta(measurements, 'waist');
  const today = todayISO();

  const [form, setForm] = useState<Omit<MeasurementEntry, 'id'>>({
    date: today,
    weight: null,
    chest: null,
    waist: null,
    belly: null,
    hips: null,
    thigh: null,
    biceps: null,
    comment: '',
  });
  const [saving, setSaving] = useState(false);

  const chartData = sorted
    .filter((m) => m.weight !== null)
    .map((m) => ({
      date: formatDateRu(m.date, 'd MMM'),
      weight: m.weight,
      waist: m.waist,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addMeasurement(form);
      setForm({ ...form, weight: null, chest: null, waist: null, belly: null, hips: null, thigh: null, biceps: null, comment: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Замеры</h1>
        {isMonday(today) && (
          <p className="text-success text-sm mt-1">
            Сегодня понедельник — +{settings.pointSettings.measurementsMondayBonus} XP и бонусные монеты за замеры
          </p>
        )}
      </header>

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="Вес"
          value={weightDelta.fromPrevious ? `${weightDelta.fromPrevious.to} кг` : '—'}
          sub={weightDelta.fromStart ? `от старта: ${weightDelta.fromStart.diff > 0 ? '+' : ''}${weightDelta.fromStart.diff.toFixed(1)}` : undefined}
        />
        <StatTile
          label="Талия"
          value={waistDelta.fromPrevious ? `${waistDelta.fromPrevious.to} см` : '—'}
          sub={waistDelta.fromStart ? `от старта: ${waistDelta.fromStart.diff > 0 ? '+' : ''}${waistDelta.fromStart.diff.toFixed(1)}` : undefined}
        />
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Новый замер</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm">
            Дата
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full rounded-xl border border-rpg-border px-3 py-2"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Вес" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />
            <NumberInput label="Талия" value={form.waist} onChange={(v) => setForm({ ...form, waist: v })} />
            <NumberInput label="Грудь" value={form.chest} onChange={(v) => setForm({ ...form, chest: v })} />
            <NumberInput label="Живот" value={form.belly} onChange={(v) => setForm({ ...form, belly: v })} />
            <NumberInput label="Ягодицы" value={form.hips} onChange={(v) => setForm({ ...form, hips: v })} />
            <NumberInput label="Бедро" value={form.thigh} onChange={(v) => setForm({ ...form, thigh: v })} />
            <NumberInput label="Бицепс" value={form.biceps} onChange={(v) => setForm({ ...form, biceps: v })} />
          </div>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Комментарий"
            className="w-full rounded-xl border border-rpg-border px-3 py-2"
            rows={2}
          />
          <button
            type="submit"
            disabled={saving}
            className="min-h-12 w-full rounded-xl bg-gold font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {saving ? 'Сохранение…' : 'Сохранить замер'}
          </button>
        </form>
      </Card>

      {chartData.length > 1 && (
        <Card>
          <h2 className="font-semibold mb-4">Динамика веса</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {chartData.length > 1 && (
        <Card>
          <h2 className="font-semibold mb-4">Динамика талии</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData.filter((d) => d.waist)}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="waist" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card>
        <h2 className="font-semibold mb-4">История</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-rpg-muted">
                <th className="py-2 pr-2">Дата</th>
                <th className="py-2 pr-2">Вес</th>
                <th className="py-2 pr-2">Талия</th>
                <th className="py-2">Δ вес</th>
              </tr>
            </thead>
            <tbody>
              {[...sorted].reverse().map((m, i, arr) => {
                const prev = arr[i + 1];
                const diff = prev?.weight && m.weight ? (m.weight - prev.weight).toFixed(1) : '—';
                return (
                  <tr key={m.id} className="border-b border-rpg-border/50">
                    <td className="py-2 pr-2">{formatDateRu(m.date)}</td>
                    <td className="py-2 pr-2">{m.weight ?? '—'}</td>
                    <td className="py-2 pr-2">{m.waist ?? '—'}</td>
                    <td className="py-2">{diff}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
