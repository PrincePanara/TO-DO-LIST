import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Button } from '../components/ui/Button';
import { Card, SectionHeading } from '../components/ui/Card';
import { FilterTabs, PageHeader } from '../components/ui/PageHeader';
import { TodaySchedule, todayKey } from '../components/timetable/TodaySchedule';
import { EmptyState } from '../components/ui/States';
import type { ClassSlot, SubjectColor } from '../types';

const days: ClassSlot['day'][] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const dayLabels: Record<ClassSlot['day'], string> = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday'
};
const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

const slotTone: Record<SubjectColor, string> = {
  purple: 'bg-brand text-white',
  yellow: 'bg-sun text-ink',
  red: 'bg-danger text-white',
  green: 'bg-ok text-ink',
  white: 'bg-white text-ink dark:bg-white/10 dark:text-white'
};

function hourIndex(hhmm: string) {
  return hours.indexOf(`${hhmm.slice(0, 2)}:00`);
}

export function Timetable() {
  const { timetable, subject, removeClass, toast } = useStudyForge();
  const { open } = useQuickAdd();
  const navigate = useNavigate();
  const [view, setView] = useState<'WEEK' | 'DAY'>('WEEK');
  const today = todayKey();

  return (
    <div>
      <PageHeader
        title="My timetable"
        subtitle="Your weekly class structure, colour-coded by subject."
        actions={
          <>
            <Button variant="white" onClick={() => navigate('/app/timetable/import')}>
              Import Your Timetable
            </Button>
            <Button onClick={() => open('class')}>+ Add class</Button>
          </>
        } />
      

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <FilterTabs
          label="Timetable view"
          value={view}
          onChange={setView}
          options={[
          { value: 'WEEK', label: 'Week' },
          { value: 'DAY', label: 'Day' }]
          } />
        
        <p className="muted font-display text-xs font-bold uppercase tracking-[0.14em]">
          {timetable.length} classes scheduled
        </p>
      </div>

      {view === 'DAY' ?
      <div className="max-w-2xl">
          <SectionHeading
          title={today ? `${dayLabels[today]} schedule` : 'Sunday'}
          hint="The current class is highlighted while it runs." />
        
          <TodaySchedule />
        </div> :
      timetable.length === 0 ?
      <EmptyState
        title="No classes yet"
        subtitle="Add your first class to build the weekly grid."
        actions={<Button onClick={() => open('class')}>Add class</Button>} /> :


      <Card className="overflow-x-auto p-4">
          <div
          className="grid min-w-[860px] gap-1"
          style={{
            gridTemplateColumns: '76px repeat(6, minmax(120px, 1fr))',
            gridTemplateRows: `40px repeat(${hours.length}, 74px)`
          }}>
          
            <div aria-hidden />
            {days.map((d) =>
          <div
            key={d}
            className={`flex items-center justify-center border-3 border-ink font-display text-xs font-bold uppercase tracking-[0.12em] dark:border-white ${
            d === today ? 'bg-ink text-white' : 'bg-white text-ink dark:bg-white/5 dark:text-white'}`
            }>
            
                {d}
              </div>
          )}

            {hours.map((h, i) =>
          <div
            key={h}
            className="flex items-start justify-end pr-2 font-display text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ gridColumn: 1, gridRow: i + 2 }}>
            
                {h}
              </div>
          )}

            {hours.map((h, i) =>
          days.map((d, di) =>
          <button
            key={`${h}-${d}`}
            type="button"
            onClick={() => open('class', { day: d })}
            aria-label={`Add class on ${dayLabels[d]} at ${h}`}
            className="border-3 border-dashed border-ink/25 hover:border-brand hover:bg-brand-soft focus-brut dark:border-white/25"
            style={{ gridColumn: di + 2, gridRow: i + 2 }} />

          )
          )}

            {timetable.map((c) => {
            const start = hourIndex(c.start);
            const end = hourIndex(c.end);
            const di = days.indexOf(c.day);
            if (start < 0 || di < 0) return null;
            const span = Math.max(1, (end < 0 ? start + 1 : end) - start);
            const s = subject(c.subjectId);
            return (
              <div
                key={c.id}
                className={`group relative flex flex-col justify-between border-3 border-ink p-2 shadow-brut-xs dark:border-white ${
                slotTone[s?.color ?? 'white']}`
                }
                style={{ gridColumn: di + 2, gridRow: `${start + 2} / span ${span}` }}>
                
                  <div>
                    <p className="font-display text-[11px] font-bold uppercase leading-tight">
                      {s?.code ?? 'CLASS'}
                    </p>
                    <p className="mt-0.5 line-clamp-2 font-display text-xs font-bold uppercase leading-tight">
                      {s?.name ?? 'Class'}
                    </p>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-80">
                    {c.room} • {c.kind}
                  </p>
                  <button
                  type="button"
                  onClick={() => {
                    removeClass(c.id);
                    toast('Class removed', 'error');
                  }}
                  aria-label={`Remove ${s?.name ?? 'class'} on ${dayLabels[c.day]}`}
                  className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center border-[2px] border-ink bg-white text-ink group-hover:flex focus-brut">
                  
                    <TrashIcon className="h-3 w-3" strokeWidth={3} aria-hidden />
                  </button>
                </div>);

          })}
          </div>
        </Card>
      }
    </div>);

}