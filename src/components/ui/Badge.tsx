import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { Priority, WorkStatus } from '../../types';

export type BadgeTone = 'purple' | 'yellow' | 'red' | 'green' | 'ink' | 'plain';

const tones: Record<BadgeTone, string> = {
  purple: 'bg-brand text-white',
  yellow: 'bg-sun text-ink',
  red: 'bg-danger text-white',
  green: 'bg-ok text-ink',
  ink: 'bg-ink text-white',
  plain: 'bg-white text-ink dark:bg-transparent dark:text-white'
};

export function Badge({
  tone = 'plain',
  className,
  children




}: {tone?: BadgeTone;className?: string;children: React.ReactNode;}) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1 border-[2px] border-ink px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-[0.1em] dark:border-white',
        tones[tone],
        className
      )}>
      
      {children}
    </span>);

}

const priorityTone: Record<Priority, BadgeTone> = {
  URGENT: 'red',
  IMPORTANT: 'yellow',
  NORMAL: 'plain'
};

export function PriorityBadge({ priority }: {priority: Priority;}) {
  return (
    <Badge tone={priorityTone[priority]}>
      {priority === 'URGENT' ? '!! ' : priority === 'IMPORTANT' ? '! ' : ''}
      {priority}
    </Badge>);

}

const statusLabel: Record<WorkStatus, string> = {
  NOT_STARTED: 'NOT STARTED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETED: 'COMPLETED'
};

const statusTone: Record<WorkStatus, BadgeTone> = {
  NOT_STARTED: 'plain',
  IN_PROGRESS: 'purple',
  COMPLETED: 'green'
};

export function StatusBadge({ status }: {status: WorkStatus;}) {
  return <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;
}