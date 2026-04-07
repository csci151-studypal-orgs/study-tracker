import type { StudySession } from '../../types';
import { formatDuration, formatDate } from '../../utils';

interface SessionSummaryProps {
  session: StudySession;
}

export default function SessionSummary({ session }: SessionSummaryProps) {
  return (
    <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-1">
      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">✓ Session saved</p>
      <div className="text-sm text-gray-700 space-y-0.5">
        <p><span className="font-semibold">Subject:</span> {session.subject}</p>
        <p><span className="font-semibold">Duration:</span> {formatDuration(session.duration)}</p>
        <p><span className="font-semibold">Date:</span> {formatDate(session.date)}</p>
      </div>
    </div>
  );
}
