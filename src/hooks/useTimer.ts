import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerStatus } from '../types';

interface UseTimerReturn {
  elapsed: number;
  status: TimerStatus;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

export function useTimer(): UseTimerReturn {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    } else {
      clearTick();
    }
    return clearTick;
  }, [status, clearTick]);

  const start  = useCallback(() => setStatus('running'),  []);
  const pause  = useCallback(() => setStatus('paused'),   []);
  const resume = useCallback(() => setStatus('running'),  []);

  const stop = useCallback(() => {
    clearTick();
    setStatus('finished');
  }, [clearTick]);

  const reset = useCallback(() => {
    clearTick();
    setElapsed(0);
    setStatus('idle');
  }, [clearTick]);

  return { elapsed, status, start, pause, resume, stop, reset };
}
