import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLinkIcon, FileTextIcon, LinkIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Card, SectionHeading } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/Progress';
import { EmptyState } from '../components/ui/States';
import { FilterTabs, PageHeader } from '../components/ui/PageHeader';
import { TaskCard } from '../components/tasks/TaskCard';
import { AssignmentCard } from '../components/classwork/AssignmentCard';
import { LabCard } from '../components/labs/LabCard';
import { ProjectCard } from '../components/projects/ProjectCard';
import { NoteCard } from '../components/notes/NoteCard';
import { subjectStats } from '../utils/progress';
import { completionRate } from '../utils/progress';
import { dueLabel } from '../utils/date';

type Tab =
'OVERVIEW' |
'TASKS' |
'CLASS_WORK' |
'LAB_WORK' |
'PROJECTS' |
'NOTES' |
'RESOURCES' |
'PROGRESS';

export function SubjectWorkspace() {
  const { subjectId = '' } = useParams();
  const { subjects, tasks, assignments, labs, projects, notes } = useStudyForge();
  const { open } = useQuickAdd();
  const [tab, setTab] = useState<Tab>('OVERVIEW');

  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) {
    return (
      <EmptyState
        title="Subject not found"
        subtitle="It may have been deleted from your workspace."
        actions={
        <Link to="/app/subjects">
            <Button>Back to subjects</Button>
          </Link>
        } />);


  }

  const mine = {
    tasks: tasks.filter((t) => t.subjectId === subject.id),
    assignments: assignments.filter((a) => a.subjectId === subject.id),
    labs: labs.filter((l) => l.subjectId === subject.id),
    projects: projects.filter((p) => p.subjectId === subject.id),
    notes: notes.filter((n) => n.subjectId === subject.id)
  };
  const stats = subjectStats(subject.id, tasks, assignments, labs, projects);
  const miniProjects = mine.projects.filter((p) => p.type === 'MINI');
  const majorProjects = mine.projects.filter((p) => p.type === 'MAJOR');

  const summary = [
  { label: 'Tasks', value: stats.tasks, tone: 'purple' as const },
  { label: 'Assignments', value: stats.assignments, tone: 'yellow' as const },
  { label: 'Lab works', value: stats.labs, tone: 'white' as const },
  { label: 'Mini projects', value: miniProjects.length, tone: 'green' as const },
  { label: 'Major projects', value: majorProjects.length, tone: 'red' as const }];


  return (
    <div>
      <PageHeader
        backTo="/app/subjects"
        backLabel="All subjects"
        eyebrow={
        <>
            <Badge tone="ink">{subject.code}</Badge>
            <Badge tone="purple">{subject.credits} credits</Badge>
            {subject.theory && <Badge>Theory</Badge>}
            {subject.lab && <Badge tone="yellow">Lab</Badge>}
          </>
        }
        title={subject.name}
        subtitle={subject.description || `${subject.units} units${subject.teacher ? ` • ${subject.teacher}` : ''}`}
        actions={
        <>
            <Button variant="white" onClick={() => open('task', { subjectId: subject.id })}>
              + Task
            </Button>
            <Button onClick={() => open('assignment', { subjectId: subject.id })}>
              + Assignment
            </Button>
          </>
        } />
      

      <Card tone="purple" className="mb-6 flex flex-col gap-5 p-6 lg:flex-row lg:items-center">
        <div className="lg:w-72">
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] opacity-80">
            Subject progress
          </p>
          <p className="font-display text-6xl font-bold leading-none">{stats.progress}%</p>
        </div>
        <ProgressBar value={stats.progress} tone="yellow" height="lg" className="flex-1" />
      </Card>

      <ul className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {summary.map((s) =>
        <li key={s.label}>
            <Card tone={s.tone} className="h-full p-4" shadow="sm">
              <p className="font-display text-3xl font-bold leading-none">
                {String(s.value).padStart(2, '0')}
              </p>
              <p className="mt-1.5 font-display text-[11px] font-bold uppercase tracking-[0.12em] opacity-90">
                {s.label}
              </p>
            </Card>
          </li>
        )}
      </ul>

      <div className="mb-6 overflow-x-auto pb-1">
        <FilterTabs
          label="Subject sections"
          value={tab}
          onChange={setTab}
          options={[
          { value: 'OVERVIEW', label: 'Overview' },
          { value: 'TASKS', label: 'Tasks', count: mine.tasks.length },
          { value: 'CLASS_WORK', label: 'Class work', count: mine.assignments.length },
          { value: 'LAB_WORK', label: 'Lab work', count: mine.labs.length },
          { value: 'PROJECTS', label: 'Projects', count: mine.projects.length },
          { value: 'NOTES', label: 'Notes', count: mine.notes.length },
          { value: 'RESOURCES', label: 'Resources' },
          { value: 'PROGRESS', label: 'Progress' }]
          } />
        
      </div>

      {tab === 'OVERVIEW' &&
      <div className="grid gap-8 xl:grid-cols-2">
          <section aria-label="Today and upcoming">
            <SectionHeading title="Tasks in flight" />
            {mine.tasks.filter((t) => t.status !== 'COMPLETED').length > 0 ?
          <ul className="space-y-4">
                {mine.tasks.
            filter((t) => t.status !== 'COMPLETED').
            slice(0, 4).
            map((t) =>
            <TaskCard key={t.id} task={t} compact />
            )}
              </ul> :

          <EmptyState title="No open tasks" subtitle="This subject is fully up to date." />
          }
          </section>

          <section aria-label="Upcoming assignments">
            <SectionHeading title="Upcoming assignments" />
            {mine.assignments.length > 0 ?
          <ul className="grid gap-4">
                {mine.assignments.slice(0, 2).map((a) =>
            <AssignmentCard key={a.id} assignment={a} showSubject={false} />
            )}
              </ul> :

          <EmptyState
            title="No assignments"
            subtitle="Add the first assignment for this subject."
            actions={
            <Button onClick={() => open('assignment', { subjectId: subject.id })}>
                    Add assignment
                  </Button>
            } />

          }
          </section>

          <section aria-label="Latest lab work">
            <SectionHeading title="Latest lab work" />
            {mine.labs.length > 0 ?
          <ul className="grid gap-4">
                {mine.labs.slice(0, 2).map((l) =>
            <LabCard key={l.id} lab={l} showSubject={false} />
            )}
              </ul> :

          <EmptyState
            title="No lab records"
            subtitle={subject.lab ? 'Add your first experiment.' : 'This subject has no lab component.'}
            actions={
            subject.lab ?
            <Button onClick={() => open('lab', { subjectId: subject.id })}>Add lab work</Button> :
            undefined
            } />

          }
          </section>

          <section aria-label="Recent notes">
            <SectionHeading title="Recent notes" />
            {mine.notes.length > 0 ?
          <ul className="grid gap-4">
                {mine.notes.slice(0, 2).map((n) =>
            <NoteCard key={n.id} note={n} />
            )}
              </ul> :

          <EmptyState
            title="No notes yet"
            subtitle="Capture a lecture note or a revision sheet."
            actions={
            <Button onClick={() => open('note', { subjectId: subject.id })}>New note</Button>
            } />

          }
          </section>
        </div>
      }

      {tab === 'TASKS' &&
      <section aria-label="Subject tasks">
          <SectionHeading
          title="Tasks"
          action={
          <Button size="sm" onClick={() => open('task', { subjectId: subject.id })}>
                + Add task
              </Button>
          } />
        
          {mine.tasks.length > 0 ?
        <ul className="space-y-4">
              {mine.tasks.map((t) =>
          <TaskCard key={t.id} task={t} />
          )}
            </ul> :

        <EmptyState title="No tasks yet" subtitle="Break this subject down into small steps." />
        }
        </section>
      }

      {tab === 'CLASS_WORK' &&
      <section aria-label="Class work">
          <SectionHeading
          title="Assignments"
          action={
          <Button size="sm" onClick={() => open('assignment', { subjectId: subject.id })}>
                + Add assignment
              </Button>
          } />
        
          {mine.assignments.length > 0 ?
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {mine.assignments.map((a) =>
          <AssignmentCard key={a.id} assignment={a} showSubject={false} />
          )}
            </ul> :

        <EmptyState title="No assignments yet" subtitle="Add the first one to start tracking." />
        }
        </section>
      }

      {tab === 'LAB_WORK' &&
      <section aria-label="Lab work">
          <SectionHeading
          title="Experiments"
          action={
          <Button size="sm" onClick={() => open('lab', { subjectId: subject.id })}>
                + Add lab work
              </Button>
          } />
        
          {mine.labs.length > 0 ?
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {mine.labs.map((l) =>
          <LabCard key={l.id} lab={l} showSubject={false} />
          )}
            </ul> :

        <EmptyState title="No lab work yet" subtitle="Record your first experiment." />
        }
        </section>
      }

      {tab === 'PROJECTS' &&
      <section aria-label="Projects">
          <SectionHeading
          title="Projects"
          action={
          <Button size="sm" onClick={() => open('mini-project', { subjectId: subject.id })}>
                + Create project
              </Button>
          } />
        
          {mine.projects.length > 0 ?
        <ul className="grid gap-5 xl:grid-cols-2">
              {mine.projects.map((p) =>
          <ProjectCard key={p.id} project={p} />
          )}
            </ul> :

        <EmptyState title="No projects yet" subtitle="Start a mini or major project here." />
        }
        </section>
      }

      {tab === 'NOTES' &&
      <section aria-label="Notes">
          <SectionHeading
          title="Notes"
          action={
          <Button size="sm" onClick={() => open('note', { subjectId: subject.id })}>
                + New note
              </Button>
          } />
        
          {mine.notes.length > 0 ?
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {mine.notes.map((n) =>
          <NoteCard key={n.id} note={n} />
          )}
            </ul> :

        <EmptyState title="No notes yet" subtitle="Write your first note for this subject." />
        }
        </section>
      }

      {tab === 'RESOURCES' &&
      <section aria-label="Resources">
          <SectionHeading
          title="Resources"
          hint="Attachments and reference links collected from this subject's work." />
        
          <ul className="grid gap-4 md:grid-cols-2">
            {[
          ...mine.assignments.flatMap((a) =>
          a.attachments.map((f) => ({ kind: 'file' as const, label: f, from: `Assignment ${a.number}` }))
          ),
          ...mine.assignments.flatMap((a) =>
          a.links.map((l) => ({ kind: 'link' as const, label: l, from: `Assignment ${a.number}` }))
          ),
          ...mine.labs.flatMap((l) =>
          l.attachments.map((f) => ({ kind: 'file' as const, label: f, from: `Lab ${l.number}` }))
          )].
          map((r, i) =>
          <li key={`${r.label}-${i}`}>
                <Card className="flex items-center gap-4 p-4" shadow="sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border-3 border-ink bg-sun dark:border-white">
                    {r.kind === 'file' ?
                <FileTextIcon className="h-4 w-4 text-ink" strokeWidth={3} aria-hidden /> :

                <LinkIcon className="h-4 w-4 text-ink" strokeWidth={3} aria-hidden />
                }
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-bold">{r.label}</span>
                    <span className="muted block text-xs uppercase tracking-[0.12em]">{r.from}</span>
                  </span>
                  <ExternalLinkIcon className="h-4 w-4 shrink-0" strokeWidth={3} aria-hidden />
                </Card>
              </li>
          )}
          </ul>
          {mine.assignments.every((a) => a.attachments.length === 0 && a.links.length === 0) &&
        mine.labs.every((l) => l.attachments.length === 0) &&
        <EmptyState
          title="No resources yet"
          subtitle="Attachments and links you add to assignments and labs collect here." />

        }
        </section>
      }

      {tab === 'PROGRESS' &&
      <section aria-label="Subject progress" className="grid gap-5 md:grid-cols-2">
          {[
        { label: 'Task completion', value: completionRate(mine.tasks), tone: 'purple' as const },
        {
          label: 'Assignment completion',
          value: completionRate(mine.assignments),
          tone: 'yellow' as const
        },
        { label: 'Lab completion', value: completionRate(mine.labs), tone: 'green' as const },
        {
          label: 'Project completion',
          value: completionRate(mine.projects),
          tone: 'white' as const
        }].
        map((m) =>
        <Card key={m.label} tone={m.tone} className="p-6">
              <p className="font-display text-5xl font-bold leading-none">{m.value}%</p>
              <p className="mt-2 font-display text-xs font-bold uppercase tracking-[0.14em] opacity-90">
                {m.label}
              </p>
            </Card>
        )}
          <Card className="p-6 md:col-span-2">
            <SectionHeading title="Next deadlines" />
            <ul className="space-y-2">
              {[
            ...mine.assignments.map((a) => ({ label: `Assignment ${a.number} — ${a.title}`, date: a.dueDate })),
            ...mine.labs.map((l) => ({ label: `Lab ${l.number} — ${l.title}`, date: l.submissionDate })),
            ...mine.projects.map((p) => ({ label: p.name, date: p.deadline }))].

            sort((a, b) => a.date.localeCompare(b.date)).
            slice(0, 6).
            map((d) =>
            <li
              key={`${d.label}-${d.date}`}
              className="flex items-center justify-between gap-3 border-3 border-ink px-3 py-2 dark:border-white">
              
                    <span className="truncate text-sm font-bold">{d.label}</span>
                    <span className="shrink-0 font-display text-xs font-bold uppercase tracking-[0.1em]">
                      {dueLabel(d.date)}
                    </span>
                  </li>
            )}
            </ul>
          </Card>
        </section>
      }
    </div>);

}