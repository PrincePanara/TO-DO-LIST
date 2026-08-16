import React from 'react';
import { CheckIcon, ClockIcon, PencilIcon, TrashIcon } from 'lucide-react';
import type { Task } from '../../types';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useQuickAdd } from '../../contexts/QuickAdd';
import { Card } from '../ui/Card';
import { Badge, PriorityBadge, StatusBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/Progress';
import { dueLabel, isOverdue, time12 } from '../../utils/date';
import { itemProgress } from '../../utils/progress';

const categoryLabel: Record<Task['category'], string> = {
  STUDY: 'Study',
  ASSIGNMENT: 'Assignment',
  LAB: 'Lab',
  MINI_PROJECT: 'Mini project',
  MAJOR_PROJECT: 'Major project',
  PERSONAL: 'Personal'
};

export function TaskCard({ task, compact = false }: {task: Task;compact?: boolean;}) {
  const { subject, projects, toggleTask, removeTask, toast } = useStudyForge();
  const { user } = useAuth();
  const { open } = useQuickAdd();
  const s = subject(task.subjectId);
  const p = task.projectId ? projects.find(proj => proj.id === task.projectId) : null;
  const done = task.status === 'COMPLETED';
  const overdue = !done && isOverdue(task.dueDate);
  const progress = itemProgress(task);

  return (
    <Card
      as="li"
      shadow="sm"
      className={`flex flex-col gap-3 p-4 ${done ? 'opacity-70' : ''} ${
      overdue ? 'border-l-[10px] border-l-danger' : ''}`
      }>
      
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => toggleTask(task.id)}
          aria-pressed={done}
          aria-label={done ? `Mark ${task.title} as not done` : `Complete ${task.title}`}
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border-3 border-ink press focus-brut dark:border-white ${
          done ? 'bg-ok' : 'bg-white dark:bg-transparent'}`
          }>
          
          {done && <CheckIcon className="h-4 w-4 text-ink" strokeWidth={4} aria-hidden />}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`font-display text-base font-bold leading-tight ${
            done ? 'line-through' : ''}`
            }>
            
            {task.title}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {p && <Badge tone="yellow">{p.name}</Badge>}
            {s && <Badge tone="purple">{s.name}</Badge>}
            <Badge>{categoryLabel[task.category]}</Badge>
            {task.assigneeId && (
              <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink/70 dark:text-white/70">
                👤 {task.assigneeId === user?.uid ? 'You' : task.assigneeId}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 font-display text-[11px] font-bold uppercase tracking-[0.1em] ${
              overdue ? 'text-danger' : 'muted'}`
              }>
              
              <ClockIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
              {overdue ? 'Overdue' : 'Due'} {dueLabel(task.dueDate)} • {time12(task.dueTime)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {!compact &&
      <div className="flex flex-wrap items-center justify-between gap-3 border-t-3 border-ink pt-3 dark:border-white">
          <div className="flex items-center gap-3">
            <StatusBadge status={task.status} />
            {task.checklist.length > 0 &&
          <ProgressBar
            value={progress}
            height="sm"
            tone={done ? 'green' : 'purple'}
            className="w-28" />

          }
            {task.estimatedHours > 0 &&
          <span className="muted font-display text-[11px] font-bold uppercase tracking-[0.1em]">
                ~{task.estimatedHours}h
              </span>
          }
          </div>
          <div className="flex items-center gap-2">
            <button
            type="button"
            onClick={() => open('task', { editTask: task })}
            aria-label={`Edit ${task.title}`}
            className="flex h-8 w-8 items-center justify-center border-3 border-ink press focus-brut dark:border-white">
            
              <PencilIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
            </button>
            <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this task?')) {
                removeTask(task.id);
                toast('Task deleted', 'error');
              }
            }}
            aria-label={`Delete ${task.title}`}
            className="flex h-8 w-8 items-center justify-center border-3 border-ink bg-danger text-white press focus-brut dark:border-white">
            
              <TrashIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
            </button>
          </div>
        </div>
      }
    </Card>);

}