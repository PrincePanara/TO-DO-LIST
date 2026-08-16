import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek } from
'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { Button, IconButton } from '../components/ui/Button';
import { Card, SectionHeading } from '../components/ui/Card';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/Progress';
import { FilterTabs, PageHeader } from '../components/ui/PageHeader';
import { buildEvents, type AgendaEvent } from '../utils/events';
import { shortDate, time12, toDate } from '../utils/date';

const legend: {label: string;className: string;}[] = [
{ label: 'Assignment', className: 'bg-brand' },
{ label: 'Project', className: 'bg-sun' },
{ label: 'Lab', className: 'bg-ink' },
{ label: 'Task', className: 'bg-ok' },
{ label: 'Overdue', className: 'bg-danger' }];


function eventClass(e: AgendaEvent): string {
  if (e.status === 'COMPLETED') return 'bg-ok text-ink';
  if (toDate(e.date) < new Date(new Date().toDateString())) return 'bg-danger text-white';
  if (e.type === 'ASSIGNMENT') return 'bg-brand text-white';
  if (e.type === 'PROJECT') return 'bg-sun text-ink';
  if (e.type === 'LAB') return 'bg-ink text-white';
  return 'bg-white text-ink dark:bg-white/10 dark:text-white';
}

export function CalendarPage() {
  const { tasks, assignments, labs, projects, subject } = useStudyForge();
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState<'MONTH' | 'WEEK' | 'DAY'>('MONTH');
  const [selected, setSelected] = useState<AgendaEvent | null>(null);

  const events = useMemo(
    () => buildEvents(tasks, assignments, labs, projects),
    [assignments, labs, projects, tasks]
  );

  const days = useMemo(() => {
    if (view === 'DAY') return [cursor];
    if (view === 'WEEK') {
      const start = startOfWeek(cursor, { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    const list: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) list.push(d);
    return list;
  }, [cursor, view]);

  const forDay = (d: Date) => events.filter((e) => isSameDay(toDate(e.date), d));

  const step = (dir: number) => {
    if (view === 'MONTH') setCursor(addMonths(cursor, dir));else
    if (view === 'WEEK') setCursor(addDays(cursor, dir * 7));else
    setCursor(addDays(cursor, dir));
  };

  return (
    <div>
      <PageHeader
        title="Academic calendar"
        subtitle="Every assignment, lab, project and task deadline on one grid."
        actions={
        <div className="flex items-center gap-2">
            <IconButton label="Previous period" onClick={() => step(-1)}>
              <ChevronLeftIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
            </IconButton>
            <Button variant="white" onClick={() => setCursor(new Date())}>
              Today
            </Button>
            <IconButton label="Next period" onClick={() => step(1)}>
              <ChevronRightIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
            </IconButton>
          </div>
        } />
      

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <FilterTabs
          label="Calendar view"
          value={view}
          onChange={setView}
          options={[
          { value: 'MONTH', label: 'Month' },
          { value: 'WEEK', label: 'Week' },
          { value: 'DAY', label: 'Day' }]
          } />
        
        <p className="font-display text-lg font-bold uppercase tracking-tight">
          {format(cursor, view === 'DAY' ? 'EEEE, d MMMM yyyy' : 'MMMM yyyy')}
        </p>
      </div>

      <ul className="mb-5 flex flex-wrap gap-4">
        {legend.map((l) =>
        <li key={l.label} className="flex items-center gap-2">
            <span className={`h-4 w-4 border-3 border-ink dark:border-white ${l.className}`} aria-hidden />
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.12em]">
              {l.label}
            </span>
          </li>
        )}
      </ul>

      <Card className="p-3 sm:p-4">
        {view !== 'DAY' &&
        <div className="mb-1 grid grid-cols-7 gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) =>
          <p
            key={d}
            className="py-2 text-center font-display text-[11px] font-bold uppercase tracking-[0.14em]">
            
                {d}
              </p>
          )}
          </div>
        }
        <div className={view === 'DAY' ? 'grid gap-1' : 'grid grid-cols-7 gap-1'}>
          {days.map((d) => {
            const dayEvents = forDay(d);
            const outside = view === 'MONTH' && !isSameMonth(d, cursor);
            const isToday = isSameDay(d, new Date());
            return (
              <div
                key={d.toISOString()}
                className={`flex min-h-[112px] flex-col gap-1 border-3 border-ink p-1.5 dark:border-white ${
                outside ? 'opacity-40' : ''} ${
                isToday ? 'bg-sun-soft dark:bg-white/10' : ''} ${view === 'DAY' ? 'min-h-[200px]' : ''}`}>
                
                <p
                  className={`font-display text-xs font-bold ${
                  isToday ?
                  'inline-flex h-6 w-6 items-center justify-center border-3 border-ink bg-ink text-white dark:border-white' :
                  ''}`
                  }>
                  
                  {format(d, 'd')}
                </p>
                <ul className="space-y-1">
                  {dayEvents.slice(0, view === 'MONTH' ? 3 : 8).map((e) =>
                  <li key={e.id}>
                      <button
                      type="button"
                      onClick={() => setSelected(e)}
                      className={`w-full truncate border-[2px] border-ink px-1.5 py-1 text-left font-display text-[10px] font-bold uppercase tracking-[0.04em] focus-brut dark:border-white ${eventClass(e)}`}>
                      
                        {e.title}
                      </button>
                    </li>
                  )}
                  {dayEvents.length > (view === 'MONTH' ? 3 : 8) &&
                  <li className="muted px-1 font-display text-[10px] font-bold uppercase">
                      +{dayEvents.length - 3} more
                    </li>
                  }
                </ul>
              </div>);

          })}
        </div>
      </Card>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.type ?? 'Event'}
        footer={
        selected &&
        <>
              <Link to={selected.to} onClick={() => setSelected(null)} className="flex-1">
                <Button block>Open</Button>
              </Link>
              <Button variant="white" onClick={() => setSelected(null)}>
                Close
              </Button>
            </>

        }>
        
        {selected &&
        <div className="space-y-5">
            <div>
              <SectionHeading title={selected.title} />
              <div className="flex flex-wrap gap-2">
                <Badge tone="purple">{selected.type}</Badge>
                <StatusBadge status={selected.status} />
                <Badge>{subject(selected.subjectId)?.name ?? 'General'}</Badge>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <div className="border-3 border-ink p-3 dark:border-white">
                <dt className="muted font-display text-[10px] font-bold uppercase tracking-[0.14em]">
                  Date
                </dt>
                <dd className="font-display text-sm font-bold">{shortDate(selected.date)}</dd>
              </div>
              <div className="border-3 border-ink p-3 dark:border-white">
                <dt className="muted font-display text-[10px] font-bold uppercase tracking-[0.14em]">
                  Time
                </dt>
                <dd className="font-display text-sm font-bold">{time12(selected.time)}</dd>
              </div>
            </dl>

            <ProgressBar value={selected.progress} label="Progress" showValue />

            <div>
              <SectionHeading title="Description" />
              <p className="text-sm leading-relaxed">
                {selected.description || 'No description recorded.'}
              </p>
            </div>
          </div>
        }
      </Drawer>
    </div>);

}