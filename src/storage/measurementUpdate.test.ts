import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MeasurementEntry } from '../types';

const { getAllMock, putTypeMock } = vi.hoisted(() => ({
  getAllMock: vi.fn(),
  putTypeMock: vi.fn(),
}));

vi.mock('../api/dataApi', () => ({
  dataApi: {
    getAll: getAllMock,
    putType: putTypeMock,
    patchSettings: vi.fn(),
  },
}));

import { remoteRepository } from './remoteStorageClient';

const base: MeasurementEntry = {
  id: 'm1',
  date: '2026-06-01',
  weight: 90,
  chest: null,
  waist: 100,
  belly: null,
  hips: null,
  thigh: null,
  biceps: null,
  comment: '',
};

describe('remoteRepository.updateMeasurement', () => {
  beforeEach(() => {
    remoteRepository.resetCache();
    getAllMock.mockReset();
    putTypeMock.mockReset();
    putTypeMock.mockResolvedValue({ type: 'measurements', payload: [], updatedAt: '' });
    getAllMock.mockResolvedValue({
      data: { measurements: [base], dailyEntries: [], rewards: [], bankDeposits: [] },
      settings: {
        themeId: 'dark',
        dailyCalorieLimit: null,
        nutritionTrackingMode: 'simple',
        activeCompanionId: 'default',
      },
    });
  });

  it('updates date and values and keeps list sorted', async () => {
    const saved = await remoteRepository.updateMeasurement('m1', {
      ...base,
      date: '2026-06-05',
      weight: 89.5,
      comment: 'исправил дату',
    });

    expect(saved.date).toBe('2026-06-05');
    expect(saved.weight).toBe(89.5);
    expect(saved.comment).toBe('исправил дату');

    const all = await remoteRepository.getMeasurements();
    expect(all).toHaveLength(1);
    expect(all[0].date).toBe('2026-06-05');
    expect(putTypeMock).toHaveBeenCalledWith(
      'measurements',
      expect.arrayContaining([expect.objectContaining({ id: 'm1', date: '2026-06-05' })]),
    );
  });

  it('throws when measurement id is missing', async () => {
    await expect(
      remoteRepository.updateMeasurement('missing', {
        ...base,
        date: '2026-06-02',
      }),
    ).rejects.toThrow('Measurement not found');
  });
});
