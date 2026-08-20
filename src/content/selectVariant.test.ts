import { describe, expect, it } from 'vitest';
import { selectContentVariant, selectForDate } from './selectVariant';

describe('selectContentVariant', () => {
  const candidates = [
    { id: 'a' },
    { id: 'b' },
    { id: 'c' },
    { id: 'd' },
    { id: 'e' },
  ];

  it('is deterministic for the same seed', () => {
    const a = selectContentVariant({ candidates, seed: '2026-08-01|today|cozy' });
    const b = selectContentVariant({ candidates, seed: '2026-08-01|today|cozy' });
    expect(a.id).toBe(b.id);
  });

  it('does not pick the reconstructed previous-day id when the pool is large enough', () => {
    const today = selectForDate({
      candidates,
      date: '2026-08-04',
      family: 'demo',
      theme: 'cozy',
    });
    const yesterday = selectForDate({
      candidates,
      date: '2026-08-03',
      family: 'demo',
      theme: 'cozy',
    });
    expect(today.id).not.toBe(yesterday.id);
  });

  it('falls back when the pool is a single item', () => {
    expect(selectContentVariant({ candidates: [{ id: 'only' }], seed: 'x' }).id).toBe('only');
  });
});
