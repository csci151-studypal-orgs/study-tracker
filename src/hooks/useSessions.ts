import { useState, useCallback } from 'react';
import type { StudySession } from '../types';
import { loadSessions, saveSessions } from '../utils';

interface UseSessionsReturn {
  sessions: StudySession[];
  addSession: (session: StudySession) => void;
  updateSession: (id: string, patch: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
}

export function useSessions(): UseSessionsReturn {
  const [sessions, setSessions] = useState<StudySession[]>(loadSessions);

  const addSession = useCallback((session: StudySession) => {
    setSessions((prev) => {
      const next = [session, ...prev];
      saveSessions(next);
      return next;
    });
  }, []);

  const updateSession = useCallback((id: string, patch: Partial<StudySession>) => {
    setSessions((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
      saveSessions(next);
      return next;
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSessions(next);
      return next;
    });
  }, []);

  return { sessions, addSession, updateSession, deleteSession };
}
