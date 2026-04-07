export interface StudySession {
  id: string;
  subject: string;
  /** Duration in seconds */
  duration: number;
  /** ISO 8601 date string */
  date: string;
  notes: string;
  /** 'timer' = recorded via built-in timer, 'manual' = manually logged */
  source: 'timer' | 'manual';
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export type NavTab = 'timer' | 'log' | 'sessions' | 'stats';