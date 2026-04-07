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
