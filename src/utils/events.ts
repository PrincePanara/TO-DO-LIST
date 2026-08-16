import type { Assignment, LabWork, Project, Task, WorkStatus } from '../types';
import { itemProgress, projectProgress } from './progress';

export type EventType = 'TASK' | 'ASSIGNMENT' | 'LAB' | 'PROJECT';

export interface AgendaEvent {
  id: string;
  title: string;
  type: EventType;
  subjectId: string | null;
  date: string;
  time: string;
  status: WorkStatus;
  progress: number;
  to: string;
  description: string;
}

export function buildEvents(
tasks: Task[],
assignments: Assignment[],
labs: LabWork[],
projects: Project[])
: AgendaEvent[] {
  const events: AgendaEvent[] = [
  ...tasks.map((t) => ({
    id: `task-${t.id}`,
    title: t.title,
    type: 'TASK' as EventType,
    subjectId: t.subjectId,
    date: t.dueDate,
    time: t.dueTime,
    status: t.status,
    progress: itemProgress(t),
    to: '/app/tasks',
    description: t.description
  })),
  ...assignments.map((a) => ({
    id: `assignment-${a.id}`,
    title: `Assignment ${String(a.number).padStart(2, '0')} — ${a.title}`,
    type: 'ASSIGNMENT' as EventType,
    subjectId: a.subjectId,
    date: a.dueDate,
    time: a.dueTime,
    status: a.status,
    progress: itemProgress(a),
    to: `/app/assignments/${a.id}`,
    description: a.description
  })),
  ...labs.map((l) => ({
    id: `lab-${l.id}`,
    title: `Lab ${String(l.number).padStart(2, '0')} — ${l.title}`,
    type: 'LAB' as EventType,
    subjectId: l.subjectId,
    date: l.submissionDate,
    time: '09:00',
    status: l.status,
    progress: itemProgress(l),
    to: `/app/labs/${l.id}`,
    description: l.objective
  })),
  ...projects.map((p) => ({
    id: `project-${p.id}`,
    title: p.name,
    type: 'PROJECT' as EventType,
    subjectId: p.subjectId,
    date: p.deadline,
    time: '23:59',
    status: p.status,
    progress: projectProgress(p),
    to: `/app/projects/${p.id}`,
    description: p.description
  }))];

  return events.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
}

export const eventTone: Record<EventType, 'purple' | 'yellow' | 'red' | 'green' | 'ink'> = {
  ASSIGNMENT: 'purple',
  LAB: 'ink',
  PROJECT: 'yellow',
  TASK: 'green'
};