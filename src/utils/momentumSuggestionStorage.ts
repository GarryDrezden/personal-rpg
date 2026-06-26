const STORAGE_KEY = 'personal-rpg-momentum-help-dismissed';

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

export function isMomentumHelpDismissed(date: string): boolean {
  return readMap()[date] === true;
}

export function dismissMomentumHelp(date: string): void {
  const map = readMap();
  map[date] = true;
  writeMap(map);
}
