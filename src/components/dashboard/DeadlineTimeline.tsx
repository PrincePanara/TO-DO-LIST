import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import type { AgendaEvent } from '../../utils/events';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { dueLabel, isOverdue } from '../../utils/date';

const typeLabel: Record<AgendaEvent['type'], string> = {
  TASK: 'Task',
  ASSIGNMENT: 'Assignment',
  LAB: 'Lab',
  PROJECT: 'Project'
};

export function DeadlineTimeline({ events }: {events: AgendaEvent[];}) {
  const { subject } = useStudyForge();

  return (
    <ol className="flex gap-0 overflow-x-auto pb-2">
      {events.map((e, i) => {
        const overdue = isOverdue(e.date);
        const first = i === 0;
        return (
          <li key={e.id} className="flex shrink-0 items-stretch">
            <Link
              to={e.to}
              className={`flex w-[220px] flex-col border-3 border-ink px-4 py-4 press focus-brut dark:border-white ${
              overdue ?
              'bg-danger text-white' :
              first ?
              'bg-sun text-ink' :
              'bg-white text-ink dark:bg-white/5 dark:text-white'}`
              }>
              
              <span className="font-display text-xs font-bold uppercase tracking-[0.16em]">
                {overdue ? 'Overdue' : dueLabel(e.date)}
              </span>
              <span className="mt-2 font-display text-base font-bold uppercase leading-tight">
                {e.title}
              </span>
              <span className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] opacity-80">
                {typeLabel[e.type]} • {subject(e.subjectId)?.code ?? 'GEN'}
              </span>
            </Link>
            {i < events.length - 1 &&
            <span className="flex w-8 items-center justify-center" aria-hidden>
                <ArrowRightIcon className="h-5 w-5" strokeWidth={3} />
              </span>
            }
          </li>);

      })}
    </ol>);

}