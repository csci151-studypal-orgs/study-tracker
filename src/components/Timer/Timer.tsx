import { useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import SessionSummary from './SessionSummary';
import type { StudySession } from '../../types';

interface TimerProps {
  onSessionSave: (session: StudySession) => void;
}

export default function Timer({ onSessionSave }: TimerProps) {
  const [subject, setSubject] = useState('');
  const [lastSession, setLastSession] = useState<StudySession | null>(null);
  const { elapsed, status, start, pause, resume, stop, reset } = useTimer();

  const handleStop = () => {
    stop();
    if (elapsed > 0) {
      const session: StudySession = {
        id: crypto.randomUUID(),
        subject: subject.trim(),
        duration: elapsed,
        date: new Date().toISOString(),
        notes: '',
        source: 'timer',
      };
      setLastSession(session);
      onSessionSave(session);
    }
  };

  const handleReset = () => {
    reset();
    setSubject('');
    setLastSession(null);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      {/* Subject input */}
      <div className="w-full">
        <label htmlFor="timer-subject" className="block text-sm font-medium text-gray-600 mb-1">
          Subject
        </label>
        <input
          id="timer-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={status !== 'idle'}
          placeholder="e.g. Mathematics, History…"
          maxLength={80}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
        />
        {status === 'idle' && !subject.trim() && (
          <p className="text-xs text-gray-400 mt-1">Enter a subject before starting.</p>
        )}
      </div>

      <TimerDisplay elapsed={elapsed} status={status} />

      <TimerControls
        status={status}
        hasSubject={subject.trim().length > 0}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onStop={handleStop}
        onReset={handleReset}
      />

      {status === 'finished' && lastSession && (
        <SessionSummary session={lastSession} />
      )}
    </div>
  );
}
