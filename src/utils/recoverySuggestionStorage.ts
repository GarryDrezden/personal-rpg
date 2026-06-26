const STORAGE_KEY = 'personal-rpg-recovery-suggestion-dismissed';

type DismissedMap = Record<string, boolean>;

function readMap(): DismissedMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as DismissedMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: DismissedMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function isRecoverySuggestionDismissed(date: string): boolean {
  return readMap()[date] === true;
}

export function dismissRecoverySuggestion(date: string): void {
  const map = readMap();
  map[date] = true;
  writeMap(map);
}
