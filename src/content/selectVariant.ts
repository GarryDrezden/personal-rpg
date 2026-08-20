import { addDays, format, parseISO } from 'date-fns';

/** Stable FNV-1a. Same seed always yields the same unsigned 32-bit value. */
export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function previousIsoDates(date: string, count: number): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || count <= 0) return [];
  const start = parseISO(date);
  const out: string[] = [];
  for (let i = 1; i <= count; i += 1) {
    out.push(format(addDays(start, -i), 'yyyy-MM-dd'));
  }
  return out;
}

export function contentSeed(parts: Array<string | number | null | undefined>): string {
  return parts.map((p) => (p == null ? '' : String(p))).join('|');
}

const EPOCH = '2020-01-01';
const selectMemo = new Map<string, string>();
const lastFilledByFamily = new Map<string, string>();

export function selectContentVariant<T extends { id: string }>(params: {
  candidates: T[];
  seed: string;
  blockedIds?: string[];
  recentSeeds?: string[];
  maxRecentExclusion?: number;
}): T {
  const { candidates, seed } = params;
  if (candidates.length === 0) {
    throw new Error('selectContentVariant: empty candidate pool');
  }
  if (candidates.length === 1) return candidates[0]!;

  const blocked = new Set(params.blockedIds ?? []);
  if (blocked.size === 0 && params.recentSeeds?.length) {
    const recent = params.recentSeeds.slice(0, params.maxRecentExclusion ?? 3);
    for (const recentSeed of recent) {
      const recentIndex = hashString(recentSeed) % candidates.length;
      blocked.add(candidates[recentIndex]!.id);
    }
  }

  const start = hashString(seed) % candidates.length;
  for (let i = 0; i < candidates.length; i += 1) {
    const next = candidates[(start + i) % candidates.length]!;
    if (!blocked.has(next.id)) return next;
  }
  return candidates[start]!;
}

function memoKey(
  date: string,
  family: string,
  theme: string,
  extra: string | undefined,
  poolKey: string,
): string {
  return contentSeed([date, family, theme, extra, poolKey]);
}

/**
 * Date-stable pick. Fills a memo from a fixed epoch so yesterday’s displayed
 * ID is exactly the ID blocked today. No persisted history. Consecutive
 * duplicates are impossible when the pool has more than one item.
 */
export function selectForDate<T extends { id: string }>(params: {
  candidates: T[];
  date: string;
  family: string;
  theme: string;
  extra?: string;
  lookbackDays?: number;
}): T {
  const { candidates } = params;
  if (candidates.length === 0) {
    throw new Error('selectForDate: empty candidate pool');
  }
  if (candidates.length === 1) return candidates[0]!;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(params.date)) {
    return selectContentVariant({
      candidates,
      seed: contentSeed([params.date, params.family, params.theme, params.extra]),
    });
  }

  const poolKey = candidates.map((item) => item.id).join(',');
  const targetKey = memoKey(params.date, params.family, params.theme, params.extra, poolKey);
  const cached = selectMemo.get(targetKey);
  if (cached) {
    return candidates.find((item) => item.id === cached) ?? candidates[0]!;
  }

  const lookback = Math.min(params.lookbackDays ?? 3, candidates.length - 1);
  const familyId = contentSeed([params.family, params.theme, params.extra, poolKey]);
  const lastFilled = lastFilledByFamily.get(familyId);
  let cursor =
    lastFilled && lastFilled >= EPOCH && lastFilled < params.date
      ? format(addDays(parseISO(lastFilled), 1), 'yyyy-MM-dd')
      : params.date < EPOCH
        ? params.date
        : EPOCH;

  while (cursor <= params.date) {
    const key = memoKey(cursor, params.family, params.theme, params.extra, poolKey);
    if (!selectMemo.has(key)) {
      const seed = contentSeed([cursor, params.family, params.theme, params.extra]);
      const blockedIds =
        cursor <= EPOCH || lookback === 0
          ? []
          : previousIsoDates(cursor, lookback)
              .map((day) =>
                selectMemo.get(
                  memoKey(day, params.family, params.theme, params.extra, poolKey),
                ),
              )
              .filter((id): id is string => Boolean(id));
      const pick = selectContentVariant({ candidates, seed, blockedIds });
      selectMemo.set(key, pick.id);
    }
    if (cursor === params.date) break;
    cursor = format(addDays(parseISO(cursor), 1), 'yyyy-MM-dd');
  }
  lastFilledByFamily.set(familyId, params.date > (lastFilled ?? '') ? params.date : lastFilled ?? params.date);

  const chosenId = selectMemo.get(
    memoKey(params.date, params.family, params.theme, params.extra, poolKey),
  );
  return candidates.find((item) => item.id === chosenId) ?? candidates[0]!;
}
