import type { StudySession } from '../../types';
import { formatDuration, formatDate, subjectColor } from '../../utils';

interface SessionItemProps {
  session: StudySession;
  onEdit: (session: StudySession) => void;
  onDelete: (session: StudySession) => void;
}

export default function SessionItem({ session, onEdit, onDelete }: SessionItemProps) {
  const color = subjectColor(session.subject);

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{session.subject}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatDuration(session.duration)} &middot; {formatDate(session.date)}
          {session.notes && ` · ${session.notes.slice(0, 50)}${session.notes.length > 50 ? '…' : ''}`}
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit(session)}
          className="px-3 py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 transition focus:outline-none"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(session)}
          className="px-3 py-1 rounded-lg border border-red-100 text-xs font-medium text-red-500 hover:bg-red-50 transition focus:outline-none"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
