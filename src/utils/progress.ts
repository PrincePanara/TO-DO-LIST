import type { Assignment, LabWork, Project, Task } from '../types';

export function pct(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round(done / total * 100);
}

export function checklistProgress(items: {done: boolean;}[]): number {
  return pct(items.filter((i) => i.done).length, items.length);
}

export function itemProgress(item: {
  status: string;
  checklist: {done: boolean;}[];
}): number {
  if (item.status === 'COMPLETED') return 100;
  if (item.checklist.length === 0) return item.status === 'IN_PROGRESS' ? 40 : 0;
  return checklistProgress(item.checklist);
}

export function projectProgress(project: Project): number {
  if (project.milestones.length === 0) return 0;
  return Math.round(
    project.milestones.reduce((sum, m) => sum + m.progress, 0) / project.milestones.length
  );
}

export function completionRate(items: {status: string;}[]): number {
  return pct(items.filter((i) => i.status === 'COMPLETED').length, items.length);
}

export interface SubjectStats {
  tasks: number;
  assignments: number;
  labs: number;
  projects: number;
  progress: number;
}

export function subjectStats(
subjectId: string,
tasks: Task[],
assignments: Assignment[],
labs: LabWork[],
projects: Project[])
: SubjectStats {
  const t = tasks.filter((x) => x.subjectId === subjectId);
  const a = assignments.filter((x) => x.subjectId === subjectId);
  const l = labs.filter((x) => x.subjectId === subjectId);
  const p = projects.filter((x) => x.subjectId === subjectId);
  const scores = [
  ...t.map((x) => itemProgress(x)),
  ...a.map((x) => itemProgress(x)),
  ...l.map((x) => itemProgress(x)),
  ...p.map((x) => projectProgress(x))];

  const progress =
  scores.length === 0 ?
  0 :
  Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  return {
    tasks: t.length,
    assignments: a.length,
    labs: l.length,
    projects: p.length,
    progress
  };
}