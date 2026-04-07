
/** Zero-pad a number to 2 digits */
export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Format seconds → MM:SS or HH:MM:SS */
export function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Format seconds → human-readable string e.g. "1h 23m 4s" */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const parts: string[] = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s || !parts.length) parts.push(`${s}s`);
  return parts.join(' ');
}

/** Format an ISO date string to a readable date */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

/** Convert minutes (number) → seconds */
export function minToSec(minutes: number): number {
  return Math.round(minutes * 60);
}

/** Convert seconds → minutes (rounded) */
export function secToMin(seconds: number): number {
  return Math.round(seconds / 60);
}

/** Deterministic color per subject name */
const SUBJECT_COLORS = [
  '#1D9E75', '#378ADD', '#D85A30',
  '#7F77DD', '#D4537E', '#BA7517', '#639922',
];

export function subjectColor(subject: string): string {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = (hash * 31 + subject.charCodeAt(i)) & 0xffff;
  }
  return SUBJECT_COLORS[hash % SUBJECT_COLORS.length];
}

/** localStorage helpers */
const STORAGE_KEY = 'st_sessions';

export function loadSessions(): import('../types').StudySession[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveSessions(sessions: import('../types').StudySession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
