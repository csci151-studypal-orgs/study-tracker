import { useState, useMemo } from 'react';
import type { StudySession } from '../../types';
import SessionItem from './SessionItem';
import DeleteConfirm from './DeleteConfirm';
import SessionForm from '../SessionForm/SessionForm';
import { formatDuration } from '../../utils';

interface SessionListProps {
  sessions: StudySession[];
  onUpdate: (id: string, patch: Partial<StudySession>) => void;
  onDelete: (id: string) => void;
}

type SortOrder = 'newest' | 'oldest' | 'longest';

export default function SessionList({ sessions, onUpdate, onDelete }: SessionListProps) {
  const [filterSubject, setFilterSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [deletingSession, setDeletingSession] = useState<StudySession | null>(null);

  const subjects = useMemo(
    () => [...new Set(sessions.map((s) => s.subject))].sort(),
    [sessions],
  );

  const displayed = useMemo(() => {
    let list = filterSubject
      ? sessions.filter((s) => s.subject === filterSubject)
      : [...sessions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter((s) =>
        s.subject.toLowerCase().includes(query) ||
        s.notes.toLowerCase().includes(query)
      );
    }

    if (sortOrder === 'oldest')  list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sortOrder === 'longest') list.sort((a, b) => b.duration - a.duration);
    else list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return list;
  }, [sessions, filterSubject, searchQuery, sortOrder]);

  const handleEditSave = (updated: StudySession) => {
    onUpdate(updated.id, updated);
    setEditingSession(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingSession) {
      onDelete(deletingSession.id);
      setDeletingSession(null);
    }
  };

  const totalDuration = useMemo(() => displayed.reduce((sum, s) => sum + s.duration, 0), [displayed]);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Study Sessions</p>
              <p className="text-2xl font-bold text-gray-800">{displayed.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-800">{formatDuration(totalDuration)}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search subjects or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none"
          >
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="longest">Longest first</option>
          </select>
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <span className="text-xs text-gray-400 ml-auto">
          {displayed.length} session{displayed.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        {displayed.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm text-gray-400 mb-2">No sessions yet</p>
            <p className="text-xs text-gray-300">Start the timer or log a session to get started</p>
          </div>
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
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Edit session</p>
          <SessionForm
            initial={editingSession}
            onSessionSave={handleEditSave}
            onCancel={() => setEditingSession(null)}
          />
        </div>
      )}

      {/* Delete confirm */}
      {deletingSession && (
        <DeleteConfirm
          session={deletingSession}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingSession(null)}
        />
      )}
    </div>
  );
}
