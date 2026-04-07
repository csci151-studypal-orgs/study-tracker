import { useState, useMemo } from 'react';
import type { StudySession } from '../../types';
import SessionItem from './SessionItem';
import SessionForm from '../SessionForm/SessionForm';

interface SessionListProps {
  sessions: StudySession[];
  onUpdate: (id: string, patch: Partial<StudySession>) => void;
  onDelete: (id: string) => void;
}

type SortOrder = 'newest' | 'oldest' | 'longest';

export default function SessionList({ sessions, onUpdate, onDelete }: SessionListProps) {
  const [filterSubject, setFilterSubject] = useState('');
  const [sortOrder, setSortOrder]         = useState<SortOrder>('newest');
  const [editingSession, setEditingSession]   = useState<StudySession | null>(null);
  const [deletingSession, setDeletingSession] = useState<StudySession | null>(null);

  const subjects = useMemo(
    () => [...new Set(sessions.map((s) => s.subject))].sort(),
    [sessions],
  );

  const displayed = useMemo(() => {
    let list = filterSubject
      ? sessions.filter((s) => s.subject === filterSubject)
      : [...sessions];

    if (sortOrder === 'oldest')  list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sortOrder === 'longest') list.sort((a, b) => b.duration - a.duration);
    else list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return list;
  }, [sessions, filterSubject, sortOrder]);

  const handleEditSave = (updated: StudySession) => {
    onUpdate(updated.id, updated);
    setEditingSession(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="longest">Longest first</option>
        </select>

        <span className="text-xs text-gray-400 ml-auto">
          {displayed.length} session{displayed.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        {displayed.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-10">
            No sessions yet. Start the timer or log a session.
          </p>
        ) : (
          displayed.map((s) => (
            <SessionItem
              key={s.id}
              session={s}
              onEdit={(sess) => { setEditingSession(sess); setDeletingSession(null); }}
              onDelete={(sess) => { setDeletingSession(sess); setEditingSession(null); }}
            />
          ))
        )}
      </div>

      {/* Edit form */}
      {editingSession && (
        <EditSession
          session={editingSession}
          onSave={handleEditSave}
          onCancel={() => setEditingSession(null)}
        />
      )}

    </div>
  );
}
