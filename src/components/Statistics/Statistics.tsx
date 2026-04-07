import { useMemo } from 'react';
import type { StudySession } from '../../types/index';
import { formatDuration, subjectColor } from '../../utils/utils';

interface StatisticsProps {
  sessions: StudySession[];
}

export default function Statistics({ sessions }: StatisticsProps) {
  const stats = useMemo(() => {
    const total = sessions.reduce((a, s) => a + s.duration, 0);
    const avgSec = sessions.length ? Math.round(total / sessions.length) : 0;

    const bySubject: Record<string, number> = {};
    sessions.forEach((s) => {
      bySubject[s.subject] = (bySubject[s.subject] ?? 0) + s.duration;
    });

    const subjectList = Object.entries(bySubject)
      .sort((a, b) => b[1] - a[1]);

    const maxDur = subjectList[0]?.[1] ?? 1;

    return { total, avgSec, subjectList, maxDur, subjectCount: subjectList.length };
  }, [sessions]);

  const metricCards = [
    { label: 'Total sessions',    value: sessions.length.toString() },
    { label: 'Total study time',  value: formatDuration(stats.total) },
    { label: 'Avg session',       value: formatDuration(stats.avgSec) },
    { label: 'Subjects',          value: stats.subjectCount.toString() },
  ];

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metricCards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">{c.label}</p>
            <p className="text-xl font-bold text-gray-800">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Subject breakdown */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">Time by subject</p>
        {stats.subjectList.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">No data yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.subjectList.map(([subject, duration]) => (
              <div key={subject} className="flex items-center gap-3">
                <span className="w-28 text-sm font-medium text-gray-700 truncate shrink-0">
                  {subject}
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((duration / stats.maxDur) * 100)}%`,
                      background: subjectColor(subject),
                    }}
                  />
                </div>
                <span className="w-16 text-right text-xs text-gray-400 shrink-0">
                  {formatDuration(duration)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}