import { useState } from 'react';
import Timer from './components/Timer';
import SessionForm from './components/SessionForm';
import SessionList from './components/SessionList';
import Statistics from './components/Statistics';
import { useSessions } from './hooks/useSessions';
import type { NavTab, StudySession } from './types';

const TABS: { id: NavTab; label: string }[] = [
  { id: 'timer',    label: 'Timer'      },
  { id: 'log',      label: 'Log session'},
  { id: 'sessions', label: 'Sessions'   },
  { id: 'stats',    label: 'Statistics' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('timer');
  const { sessions, addSession, updateSession, deleteSession } = useSessions();

  const handleSessionSave = (session: StudySession) => {
    addSession(session);
  };

  const handleUpdate = (id: string, patch: Partial<StudySession>) => {
    updateSession(id, patch);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5"/>
                <path d="M7 4.5V7.5L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-base font-bold text-gray-800 tracking-tight">Study Tracker</h1>
          </div>
          <span className="text-xs text-gray-400">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Nav tabs */}
        <div className="max-w-2xl mx-auto px-4 flex gap-1 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {activeTab === 'timer' && (
          <section>
            <Timer onSessionSave={handleSessionSave} />
          </section>
        )}

        {activeTab === 'log' && (
          <section>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-5">Log a study session</h2>
              <SessionForm onSessionSave={handleSessionSave} />
            </div>
          </section>
        )}

        {activeTab === 'sessions' && (
          <section>
            <SessionList
              sessions={sessions}
              onUpdate={handleUpdate}
              onDelete={deleteSession}
            />
          </section>
        )}

        {activeTab === 'stats' && (
          <section>
            <Statistics sessions={sessions} />
          </section>
        )}
      </main>
    </div>
  );
}
