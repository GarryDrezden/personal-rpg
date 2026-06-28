import { create } from 'zustand';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SaveStatusState {
  status: SaveStatus;
  message: string | null;
  setSaving: () => void;
  setSaved: () => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useSaveStatusStore = create<SaveStatusState>((set) => ({
  status: 'idle',
  message: null,
  setSaving: () => set({ status: 'saving', message: null }),
  setSaved: () => set({ status: 'saved', message: null }),
  setError: (message) => set({ status: 'error', message }),
  reset: () => set({ status: 'idle', message: null }),
}));

const debouncers = new Map<string, ReturnType<typeof setTimeout>>();

export function debouncedRemoteSave(
  key: string,
  fn: () => Promise<void>,
  delayMs = 800,
) {
  const existing = debouncers.get(key);
  if (existing) clearTimeout(existing);
  useSaveStatusStore.getState().setSaving();
  debouncers.set(
    key,
    setTimeout(() => {
      void fn()
        .then(() => useSaveStatusStore.getState().setSaved())
        .catch((e) =>
          useSaveStatusStore
            .getState()
            .setError(e instanceof Error ? e.message : 'Ошибка сохранения'),
        );
    }, delayMs),
  );
}

export async function immediateRemoteSave(fn: () => Promise<void>) {
  useSaveStatusStore.getState().setSaving();
  try {
    await fn();
    useSaveStatusStore.getState().setSaved();
  } catch (e) {
    useSaveStatusStore
      .getState()
      .setError(e instanceof Error ? e.message : 'Ошибка сохранения');
    throw e;
  }
}
