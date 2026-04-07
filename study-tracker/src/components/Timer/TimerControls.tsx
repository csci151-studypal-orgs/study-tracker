import type { TimerStatus } from '../../types';

interface TimerControlsProps {
  status: TimerStatus;
  hasSubject: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
}

const base =
  'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed';

export default function TimerControls({
  status,
  hasSubject,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {status === 'idle' && (
        <button
          onClick={onStart}
          disabled={!hasSubject}
          className={`${base} w-full bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400`}
        >
          ▶ Start session
        </button>
      )}

      {status === 'running' && (
        <>
          <button
            onClick={onPause}
            className={`${base} flex-1 bg-amber-400 hover:bg-amber-500 text-amber-900 focus:ring-amber-300`}
          >
            ⏸ Pause
          </button>
          <button
            onClick={onStop}
            className={`${base} flex-1 bg-red-500 hover:bg-red-600 text-white focus:ring-red-400`}
          >
            ⏹ Stop &amp; save
          </button>
        </>
      )}

      {status === 'paused' && (
        <>
          <button
            onClick={onResume}
            className={`${base} flex-1 bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400`}
          >
            ▶ Resume
          </button>
          <button
            onClick={onStop}
            className={`${base} flex-1 bg-red-500 hover:bg-red-600 text-white focus:ring-red-400`}
          >
            ⏹ Stop &amp; save
          </button>
        </>
      )}

      {status === 'finished' && (
        <button
          onClick={onReset}
          className={`${base} w-full bg-gray-700 hover:bg-gray-800 text-white focus:ring-gray-500`}
        >
          ↩ New session
        </button>
      )}
    </div>
  );
}
