import { useCallback, useEffect, useRef, useState } from 'react';
import type { AutosaveStatusState } from '../components/ui/AutosaveStatus';

const DEFAULT_TIMEOUT_MS = 2500;

export function useAutosaveStatus(timeoutMs = DEFAULT_TIMEOUT_MS) {
  const [status, setStatus] = useState<AutosaveStatusState>('idle');
  const [message, setMessage] = useState<string | undefined>();
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  const reset = useCallback(() => {
    clearHideTimer();
    setStatus('idle');
    setMessage(undefined);
  }, [clearHideTimer]);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setStatus('idle');
      setMessage(undefined);
    }, timeoutMs);
  }, [clearHideTimer, timeoutMs]);

  const showSaving = useCallback((nextMessage?: string) => {
    clearHideTimer();
    setMessage(nextMessage);
    setStatus('saving');
  }, [clearHideTimer]);

  const showSaved = useCallback(
    (nextMessage?: string) => {
      setMessage(nextMessage);
      setStatus('saved');
      scheduleHide();
    },
    [scheduleHide],
  );

  const showError = useCallback(
    (nextMessage?: string) => {
      setMessage(nextMessage);
      setStatus('error');
      scheduleHide();
    },
    [scheduleHide],
  );

  return {
    status,
    message,
    showSaving,
    showSaved,
    showError,
    reset,
  };
}
