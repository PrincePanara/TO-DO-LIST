import React from 'react';
import { MapPinIcon } from 'lucide-react';
import type { ClassSlot } from '../../types';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { time12 } from '../../utils/date';
import { EmptyState } from '../ui/States';

const dayKeys: ClassSlot['day'][] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function todayKey(): ClassSlot['day'] | null {
  const idx = new Date().getDay(); // 0 = Sunday
  if (idx === 0) return null;
  return dayKeys[idx - 1];
}

function minutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function TodaySchedule({ dense = false }: {dense?: boolean;}) {
  const { timetable, subject } = useStudyForge();
  const key = todayKey();
  const slots = timetable.
  filter((c) => c.day === key).
  sort((a, b) => a.start.localeCompare(b.start));
  const now = new Date().getHours() * 60 + new Date().getMinutes();

  if (!key || slots.length === 0) {
    return (
      <EmptyState
        title="No classes today"
        subtitle="Free day — a good window to clear pending lab records." />);


  }

  return (
    <ol className={dense ? 'space-y-2' : 'space-y-3'}>
      {slots.map((c) => {
        const s = subject(c.subjectId);
        const current = now >= minutes(c.start) && now < minutes(c.end);
        const past = now >= minutes(c.end);
        return (
          <li
            key={c.id}
            className={`flex items-center gap-4 border-3 border-ink px-4 py-3 dark:border-white ${
            current ?
            'bg-brand text-white shadow-brut-sm' :
            past ?
            'bg-white/60 opacity-60 dark:bg-white/5' :
            'bg-white dark:bg-white/5'}`
            }>
            
            <span className="w-16 shrink-0 font-display text-sm font-bold uppercase leading-tight">
              {time12(c.start).replace(' ', '')}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-base font-bold uppercase leading-tight">
                {s?.name ?? 'Class'}
              </span>
              <span
                className={`flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] ${
                current ? 'text-white/80' : 'muted'}`
                }>
                
                <MapPinIcon className="h-3 w-3" strokeWidth={3} aria-hidden />
                {c.room} • {c.kind}
              </span>
            </span>
            {current &&
            <span className="shrink-0 border-[2px] border-ink bg-sun px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.1em] text-ink">
                Now
              </span>
            }
          </li>);

      })}
    </ol>);

}