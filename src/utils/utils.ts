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
