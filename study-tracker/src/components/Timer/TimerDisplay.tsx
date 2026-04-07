import type { TimerStatus } from '../../types';
import { formatTime } from '../../utils';

interface TimerDisplayProps {
  elapsed: number;
  status: TimerStatus;
}

const STATUS_STYLES: Record<TimerStatus, { color: string; label: string }> = {
  idle:     { color: 'text-gray-400',    label: 'Ready'       },
  running:  { color: 'text-emerald-600', label: 'Studying…'   },
  paused:   { color: 'text-amber-500',   label: 'Paused'      },
  finished: { color: 'text-blue-600',    label: 'Done!'       },
};

export default function TimerDisplay({ elapsed, status }: TimerDisplayProps) {
  const { color, label } = STATUS_STYLES[status];
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <div
        className={`font-mono text-7xl font-bold tabular-nums tracking-tight transition-colors duration-300 ${color}`}
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Elapsed: ${formatTime(elapsed)}`}
      >
        {formatTime(elapsed)}
      </div>
      <span className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${color}`}>
        {label}
      </span>
    </div>
  );
}
