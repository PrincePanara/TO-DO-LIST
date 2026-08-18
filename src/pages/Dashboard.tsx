import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PartyPopperIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/Progress';
import { EmptyState } from '../components/ui/States';
import { TaskCard } from '../components/tasks/TaskCard';
import { DeadlineTimeline } from '../components/dashboard/DeadlineTimeline';
import { QuickActions } from '../components/dashboard/QuickActions';
import { TodaySchedule } from '../components/timetable/TodaySchedule';
import { buildEvents } from '../utils/events';
import { subjectStats } from '../utils/progress';
import { isOverdue, isToday } from '../utils/date';

export function Dashboard() {
  const { subjects, tasks, assignments, labs, projects } = useStudyForge();
  const { open } = useQuickAdd();

  const todaysTasks = tasks.filter((t) => isToday(t.dueDate) || isOverdue(t.dueDate) && t.status !== 'COMPLETED');
  const pending = tasks.filter((t) => t.status !== 'COMPLETED').length;
  const completed = [
    ...tasks.filter((t) => t.status === 'COMPLETED'),
    ...assignments.filter((a) => a.status === 'COMPLETED'),
    ...labs.filter((l) => l.status === 'COMPLETED')].
    length;

  const upcoming = useMemo(
    () =>
      buildEvents(tasks, assignments, labs, projects).
        filter((e) => e.status !== 'COMPLETED').
        slice(0, 6),
    [assignments, labs, projects, tasks]
  );

  const stats = [
    { value: subjects.length, label: 'Total subjects', tone: 'purple' as const, to: '/app/subjects' },
    { value: todaysTasks.length, label: "Today's tasks", tone: 'yellow' as const, to: '/app/tasks' },
    { value: pending, label: 'Pending', tone: 'red' as const, to: '/app/tasks' },
    { value: completed, label: 'Completed', tone: 'green' as const, to: '/app/progress' }];


  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl lg:text-5xl">
          Your Qubeso command center
        </h1>

      </div>

      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) =>
          <li key={s.label}>
            <Link to={s.to} className="block h-full focus-brut">
              <Card tone={s.tone} className="h-full p-5 press">
                <p className="font-display text-4xl font-bold leading-none sm:text-5xl">
                  {String(s.value).padStart(2, '0')}
                </p>
                <p className="mt-2 font-display text-xs font-bold uppercase tracking-[0.14em] opacity-90">
                  {s.label}
                </p>
              </Card>
            </Link>
          </li>
        )}
      </ul>

      <section aria-label="Upcoming deadlines">
        <SectionHeading
          title="Upcoming deadlines"
          hint="Everything due next, across every subject."
          action={
            <Link
              to="/app/calendar"
              className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.14em] underline decoration-[3px] underline-offset-4 focus-brut">

              Open calendar <ArrowRightIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
            </Link>
          } />

        {upcoming.length > 0 ?
          <DeadlineTimeline events={upcoming} /> :

          <EmptyState title="Nothing due" subtitle="You are completely clear. Enjoy it." />
        }
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.65fr_1fr]">
        <section aria-label="Today's tasks">
          <SectionHeading
            title="Today's tasks"
            hint="Overdue work is pulled in here until it is cleared."
            action={
              <Button size="sm" variant="ink" onClick={() => open('task')}>
                + Add task
              </Button>
            } />

          {todaysTasks.length > 0 ?
            <ul className="space-y-4">
              {todaysTasks.map((t) =>
                <TaskCard key={t.id} task={t} />
              )}
            </ul> :

            <EmptyState
              icon={<PartyPopperIcon className="h-8 w-8" strokeWidth={3} aria-hidden />}
              title="Your task list is clear 🎉"
              subtitle="Nothing is due today and nothing is overdue."
              actions={<Button onClick={() => open('task')}>Add task</Button>} />

          }

          <div className="mt-8">
            <SectionHeading
              title="Subject progress"
              action={
                <Link
                  to="/app/progress"
                  className="font-display text-xs font-bold uppercase tracking-[0.14em] underline decoration-[3px] underline-offset-4 focus-brut">

                  Full analytics
                </Link>
              } />

            <ul className="grid gap-4 sm:grid-cols-2">
              {subjects.slice(0, 6).map((s) => {
                const st = subjectStats(s.id, tasks, assignments, labs, projects);
                return (
                  <li key={s.id}>
                    <Card className="p-4" shadow="sm">
                      <div className="flex items-baseline justify-between gap-2">
                        <Link
                          to={`/app/subjects/${s.id}`}
                          className="truncate font-display text-base font-bold uppercase tracking-tight underline decoration-[3px] underline-offset-4 focus-brut">

                          {s.name}
                        </Link>
                        <span className="font-display text-sm font-bold">{st.progress}%</span>
                      </div>
                      <ProgressBar value={st.progress} className="mt-3" height="sm" />
                      <p className="muted mt-2 text-xs font-bold uppercase tracking-[0.1em]">
                        {st.tasks} tasks • {st.assignments} assignments • {st.labs} labs
                      </p>
                    </Card>
                  </li>);

              })}
            </ul>
          </div>
        </section>

        <aside className="space-y-8">
          <section aria-label="Today's schedule">
            <SectionHeading
              title="Today's schedule"
              action={
                <Link
                  to="/app/timetable"
                  className="font-display text-xs font-bold uppercase tracking-[0.14em] underline decoration-[3px] underline-offset-4 focus-brut">

                  Timetable
                </Link>
              } />

            <TodaySchedule dense />
          </section>

          <section aria-label="Quick actions">
            <SectionHeading title="Quick actions" />
            <QuickActions />
          </section>
        </aside>
      </div>
    </div>);

}