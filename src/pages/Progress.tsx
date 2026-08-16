import React from 'react';
import { Link } from 'react-router-dom';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { Card, SectionHeading } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/Progress';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { completionRate, projectProgress, subjectStats } from '../utils/progress';
import { daysUntil, isOverdue } from '../utils/date';

const weekBars = [
{ day: 'Mon', value: 4 },
{ day: 'Tue', value: 6 },
{ day: 'Wed', value: 3 },
{ day: 'Thu', value: 7 },
{ day: 'Fri', value: 5 },
{ day: 'Sat', value: 2 },
{ day: 'Sun', value: 1 }];


export function ProgressPage() {
  const { subjects, tasks, assignments, labs, projects } = useStudyForge();

  const taskRate = completionRate(tasks);
  const assignmentRate = completionRate(assignments);
  const labRate = completionRate(labs);
  const projectRate =
  projects.length === 0 ?
  0 :
  Math.round(projects.reduce((sum, p) => sum + projectProgress(p), 0) / projects.length);
  const overall = Math.round((taskRate + assignmentRate + labRate + projectRate) / 4);

  const overdue = [
  ...tasks.filter((t) => t.status !== 'COMPLETED' && isOverdue(t.dueDate)),
  ...assignments.filter((a) => a.status !== 'COMPLETED' && isOverdue(a.dueDate)),
  ...labs.filter((l) => l.status !== 'COMPLETED' && isOverdue(l.submissionDate))].
  length;

  const completedThisWeek = tasks.filter(
    (t) => t.status === 'COMPLETED' && daysUntil(t.dueDate) >= -7
  ).length;
  const completedThisMonth = tasks.filter(
    (t) => t.status === 'COMPLETED' && daysUntil(t.dueDate) >= -30
  ).length;

  const maxBar = Math.max(...weekBars.map((b) => b.value));

  return (
    <div>
      <PageHeader
        title="Academic progress"
        subtitle="How the semester is actually going, measured across every kind of work." />
      

      <div className="mb-8 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card tone="purple" className="flex flex-col justify-between p-6 lg:p-8">
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] opacity-80">
            Overall progress
          </p>
          <p className="my-4 font-display text-7xl font-bold leading-none lg:text-8xl">{overall}%</p>
          <ProgressBar value={overall} tone="yellow" height="lg" />
          <p className="mt-4 text-sm opacity-90">
            Averaged across tasks, assignments, labs and project milestones.
          </p>
        </Card>

        <ul className="grid grid-cols-2 gap-4">
          {[
          { label: 'Assignment completion', value: assignmentRate, tone: 'yellow' as const },
          { label: 'Lab completion', value: labRate, tone: 'green' as const },
          { label: 'Project completion', value: projectRate, tone: 'white' as const },
          { label: 'Task completion', value: taskRate, tone: 'white' as const }].
          map((m) =>
          <li key={m.label}>
              <Card tone={m.tone} className="flex h-full flex-col justify-between p-5">
                <p className="font-display text-4xl font-bold leading-none sm:text-5xl">{m.value}%</p>
                <div>
                  <ProgressBar value={m.value} tone="purple" height="sm" className="mt-4" />
                  <p className="mt-2 font-display text-[11px] font-bold uppercase tracking-[0.12em] opacity-90">
                    {m.label}
                  </p>
                </div>
              </Card>
            </li>
          )}
        </ul>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.3fr_1fr]">
        <section aria-label="Subject analytics">
          <SectionHeading title="Subject analytics" hint="Where your attention is actually landing." />
          <Card className="p-5">
            <ul className="space-y-4">
              {subjects.map((s) => {
                const st = subjectStats(s.id, tasks, assignments, labs, projects);
                return (
                  <li key={s.id}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <Link
                        to={`/app/subjects/${s.id}`}
                        className="truncate font-display text-sm font-bold uppercase tracking-[0.06em] underline decoration-[3px] underline-offset-4 focus-brut">
                        
                        {s.name}
                      </Link>
                      <span className="font-display text-sm font-bold">{st.progress}%</span>
                    </div>
                    <ProgressBar
                      value={st.progress}
                      tone={st.progress >= 75 ? 'green' : st.progress >= 40 ? 'purple' : 'red'}
                      height="sm" />
                    
                  </li>);

              })}
            </ul>
          </Card>
        </section>

        <section aria-label="Productivity">
          <SectionHeading title="Productivity" />
          <div className="space-y-4">
            <Card className="p-5">
              <p className="brut-label">Tasks completed this week</p>
              <div className="flex items-end gap-2" role="img" aria-label="Tasks completed per day this week">
                {weekBars.map((b) =>
                <div key={b.day} className="flex flex-1 flex-col items-center gap-2">
                    <div
                    className="w-full border-3 border-ink bg-brand dark:border-white"
                    style={{ height: `${b.value / maxBar * 110 + 12}px` }} />
                  
                    <span className="font-display text-[10px] font-bold uppercase">{b.day}</span>
                  </div>
                )}
              </div>
            </Card>

            <ul className="grid grid-cols-2 gap-4">
              {[
              { label: 'This week', value: completedThisWeek, tone: 'white' as const },
              { label: 'This month', value: completedThisMonth, tone: 'white' as const },
              { label: 'Avg completion', value: '1.8h', tone: 'yellow' as const },
              { label: 'Overdue', value: overdue, tone: overdue > 0 ? 'red' as const : 'green' as const }].
              map((m) =>
              <li key={m.label}>
                  <Card tone={m.tone} className="h-full p-4" shadow="sm">
                    <p className="font-display text-3xl font-bold leading-none">{m.value}</p>
                    <p className="mt-1.5 font-display text-[11px] font-bold uppercase tracking-[0.12em] opacity-90">
                      {m.label}
                    </p>
                  </Card>
                </li>
              )}
            </ul>

            <Card tone="ink" className="flex items-center justify-between p-5">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.16em] opacity-70">
                  Current streak
                </p>
                <p className="font-display text-4xl font-bold leading-none">12 days</p>
              </div>
              <Badge tone="green">On track</Badge>
            </Card>
          </div>
        </section>
      </div>
    </div>);

}