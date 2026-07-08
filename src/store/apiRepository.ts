import type {
  AppData,
  AppSettings,
  DailyEntry,
  MeasurementEntry,
  Reward,
  BankDeposit,
} from '../types';
import type { DataRepository } from './repository';

const API = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? 'API error');
  }
  return res.json() as Promise<T>;
}

export const apiRepository: DataRepository = {
  loadAll: () => request<AppData>(`${API}/`),

  upsertDaily: (entry) =>
    request<DailyEntry>(`${API}/daily/${entry.date}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    }),

  deleteDaily: (date) =>
    request(`${API}/daily/${date}`, { method: 'DELETE' }).then(() => undefined),

  getDaily: (from, to) =>
    request<DailyEntry[]>(`${API}/daily?from=${from}&to=${to}`),

  getMeasurements: () => request<MeasurementEntry[]>(`${API}/measurements`),

  addMeasurement: (entry) =>
    request<MeasurementEntry>(`${API}/measurements`, {
      method: 'POST',
      body: JSON.stringify(entry),
    }),

  updateMeasurement: (id, entry) =>
    request<MeasurementEntry>(`${API}/measurements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    }),

  deleteMeasurement: (id) =>
    request(`${API}/measurements/${id}`, { method: 'DELETE' }).then(() => undefined),

  getRewards: () => request<Reward[]>(`${API}/rewards`),

  addReward: (reward) =>
    request<Reward>(`${API}/rewards`, {
      method: 'POST',
      body: JSON.stringify(reward),
    }),

  updateReward: (id, patch) =>
    request<Reward>(`${API}/rewards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    }),

  deleteReward: (id) =>
    request(`${API}/rewards/${id}`, { method: 'DELETE' }).then(() => undefined),

  purchaseReward: (id) =>
    request<Reward>(`${API}/rewards/${id}/purchase`, { method: 'POST' }),

  getBankDeposits: () => request<BankDeposit[]>(`${API}/bank`),

  addBankDeposit: (entry) =>
    request<BankDeposit>(`${API}/bank`, {
      method: 'POST',
      body: JSON.stringify(entry),
    }),

  deleteBankDeposit: (id) =>
    request(`${API}/bank/${id}`, { method: 'DELETE' }).then(() => undefined),

  getSettings: () => request<AppSettings>(`${API}/settings`),

  saveSettings: (settings) =>
    request<AppSettings>(`${API}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};
