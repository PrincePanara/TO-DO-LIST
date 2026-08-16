import React from 'react';
import { Link } from 'react-router-dom';
import type { Assignment } from '../../types';
import { Card } from '../ui/Card';
import { Badge, PriorityBadge, StatusBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/Progress';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { dueLabel, isOverdue, shortDate } from '../../utils/date';
import { itemProgress } from '../../utils/progress';

export function AssignmentCard({
  assignment,
  showSubject = true



}: {assignment: Assignment;showSubject?: boolean;}) {
  const { subject } = useStudyForge();
  const s = subject(assignment.subjectId);
  const progress = itemProgress(assignment);
  const overdue = assignment.status !== 'COMPLETED' && isOverdue(assignment.dueDate);

  return (
    <Card as="li" className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="border-3 border-ink bg-sun px-2 py-0.5 font-display text-xs font-bold uppercase tracking-[0.12em] text-ink dark:border-white">
          Assignment {String(assignment.number).padStart(2, '0')}
        </span>
        {overdue ? <Badge tone="red">Overdue</Badge> : <PriorityBadge priority={assignment.priority} />}
      </div>

      <h3 className="mt-3 font-display text-xl font-bold uppercase leading-tight tracking-tight">
        {assignment.title}
      </h3>
      {showSubject && s && <p className="muted mt-1 text-xs font-bold uppercase tracking-[0.12em]">{s.name}</p>}

      <p className="muted mt-3 line-clamp-2 text-sm">{assignment.description}</p>

      <ProgressBar
        value={progress}
        tone={assignment.status === 'COMPLETED' ? 'green' : overdue ? 'red' : 'purple'}
        className="mt-4"
        label={`${progress}% complete`} />
      

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={assignment.status} />
        <Badge tone={overdue ? 'red' : 'plain'}>Due {dueLabel(assignment.dueDate)}</Badge>
        <span className="muted text-xs">{shortDate(assignment.dueDate)}</span>
      </div>

      <Link
        to={`/app/assignments/${assignment.id}`}
        className="mt-5 inline-flex items-center justify-center border-3 border-ink bg-ink px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.08em] text-white shadow-brut-sm press focus-brut dark:border-white">
        
        Open assignment
      </Link>
    </Card>);

}