import type { StudySession } from '../../types';
import { formatDuration, formatDate } from '../../utils';

interface DeleteConfirmProps {
  session: StudySession;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({ session, onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-800 mb-1">Delete this session?</p>
      <p className="text-xs text-gray-500 mb-4">
        "{session.subject}" — {formatDuration(session.duration)} on {formatDate(session.date)}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition focus:outline-none"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
