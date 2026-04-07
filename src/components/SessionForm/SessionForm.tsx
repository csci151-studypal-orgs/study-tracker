import { useState } from 'react';
import type { StudySession } from '../../types';
import { minToSec } from '../../utils';

interface SessionFormProps {
  onSessionSave: (session: StudySession) => void;
  /** If provided, the form pre-fills for editing */
  initial?: StudySession;
  onCancel?: () => void;
}

export default function SessionForm({ onSessionSave, initial, onCancel }: SessionFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  const [subject, setSubject]   = useState(initial?.subject ?? '');
  const [duration, setDuration] = useState(initial ? String(Math.round(initial.duration / 60)) : '');
  const [date, setDate]         = useState(initial ? initial.date.slice(0, 10) : today);
  const [notes, setNotes]       = useState(initial?.notes ?? '');
  const [saved, setSaved]       = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!subject.trim())      errs.subject  = 'Subject is required.';
    if (!duration || Number(duration) <= 0) errs.duration = 'Enter a valid duration.';
    if (!date)                errs.date     = 'Date is required.';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const session: StudySession = {
      id:       initial?.id ?? crypto.randomUUID(),
      subject:  subject.trim(),
      duration: minToSec(Number(duration)),
      date:     new Date(date + 'T12:00:00').toISOString(),
      notes:    notes.trim(),
      source:   initial?.source ?? 'manual',
    };
    onSessionSave(session);
    if (!initial) {
      setSubject(''); setDuration(''); setDate(today); setNotes('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setErrors({});
  };

  return (
    <div className="space-y-4">
      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 font-medium">
          ✓ Session logged successfully!
        </div>
      )}

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sf-subject">
          Subject
        </label>
        <input
          id="sf-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Physics, Literature…"
          maxLength={80}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
        />
        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
      </div>

      {/* Duration + Date */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sf-duration">
            Duration (minutes)
          </label>
          <input
            id="sf-duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="60"
            min={1}
            max={1440}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
          {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sf-date">
            Date
          </label>
          <input
            id="sf-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sf-notes">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="sf-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Topics covered, goals, reflections…"
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex-1 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
        >
          {initial ? 'Save changes' : 'Log session'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition focus:outline-none"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}