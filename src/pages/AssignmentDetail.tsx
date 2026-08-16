import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, ExternalLinkIcon, FileTextIcon, TrashIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Card, SectionHeading } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, PriorityBadge, StatusBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/Progress';
import { EmptyState } from '../components/ui/States';
import { PageHeader } from '../components/ui/PageHeader';
import { dueLabel, isOverdue, shortDate, time12 } from '../utils/date';
import { itemProgress } from '../utils/progress';

export function AssignmentDetail() {
  const { assignmentId = '' } = useParams();
  const { assignments, subject, upsertAssignment, removeAssignment, toast } = useStudyForge();
  const { open } = useQuickAdd();
  const navigate = useNavigate();

  const assignment = assignments.find((a) => a.id === assignmentId);
  if (!assignment) {
    return (
      <EmptyState
        title="Assignment not found"
        subtitle="It may have been deleted."
        actions={
        <Link to="/app/class-work">
            <Button>Back to class work</Button>
          </Link>
        } />);


  }

  const s = subject(assignment.subjectId);
  const progress = itemProgress(assignment);
  const overdue = assignment.status !== 'COMPLETED' && isOverdue(assignment.dueDate);

  const toggleItem = (id: string) =>
  upsertAssignment({
    ...assignment,
    checklist: assignment.checklist.map((c) => c.id === id ? { ...c, done: !c.done } : c),
    status:
    assignment.checklist.filter((c) => c.id === id ? !c.done : c.done).length ===
    assignment.checklist.length ?
    'COMPLETED' :
    'IN_PROGRESS'
  });

  return (
    <div>
      <PageHeader
        backTo={s ? `/app/subjects/${s.id}` : '/app/class-work'}
        backLabel={s ? s.name : 'Class work'}
        eyebrow={
        <>
            <Badge tone="yellow">Assignment {String(assignment.number).padStart(2, '0')}</Badge>
            {s && <Badge tone="ink">{s.code}</Badge>}
            <StatusBadge status={assignment.status} />
            <PriorityBadge priority={assignment.priority} />
          </>
        }
        title={assignment.title}
        actions={
        <>
            <Button variant="white" onClick={() => open('assignment', { editAssignment: assignment })}>
              Edit
            </Button>
            <Button
            variant="danger"
            onClick={() => {
              removeAssignment(assignment.id);
              toast('Assignment deleted', 'error');
              navigate('/app/class-work');
            }}>
            
              <TrashIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Delete
            </Button>
          </>
        } />
      

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card tone={overdue ? 'red' : 'purple'} className="p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                  {overdue ? 'Overdue' : 'Due'}
                </p>
                <p className="font-display text-3xl font-bold uppercase leading-none sm:text-4xl">
                  {dueLabel(assignment.dueDate)} • {time12(assignment.dueTime)}
                </p>
                <p className="mt-1 text-sm opacity-80">{shortDate(assignment.dueDate)}</p>
              </div>
              <p className="font-display text-5xl font-bold leading-none">{progress}%</p>
            </div>
            <ProgressBar value={progress} tone="yellow" height="lg" className="mt-5" />
          </Card>

          <Card className="p-6">
            <SectionHeading title="Description" />
            <p className="text-sm leading-relaxed">{assignment.description || 'No description added.'}</p>
            <div className="mt-6 border-t-3 border-ink pt-5 dark:border-white">
              <SectionHeading title="Instructions" />
              <p className="text-sm leading-relaxed">
                {assignment.instructions || 'No instructions added.'}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeading title="Checklist" hint="Tick items off as you go — progress updates automatically." />
            {assignment.checklist.length > 0 ?
            <ul className="space-y-2">
                {assignment.checklist.map((c) =>
              <li key={c.id}>
                    <button
                  type="button"
                  onClick={() => toggleItem(c.id)}
                  aria-pressed={c.done}
                  className="flex w-full items-center gap-3 border-3 border-ink px-3 py-2.5 text-left press focus-brut dark:border-white">
                  
                      <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center border-3 border-ink dark:border-white ${
                    c.done ? 'bg-ok' : 'bg-white dark:bg-transparent'}`
                    }>
                    
                        {c.done && <CheckIcon className="h-3.5 w-3.5 text-ink" strokeWidth={4} aria-hidden />}
                      </span>
                      <span className={`text-sm ${c.done ? 'line-through opacity-60' : ''}`}>{c.label}</span>
                    </button>
                  </li>
              )}
              </ul> :

            <p className="muted text-sm">No checklist items.</p>
            }
          </Card>

          <Card className="p-6">
            <SectionHeading title="Notes" />
            <textarea
              value={assignment.notes}
              onChange={(e) => upsertAssignment({ ...assignment, notes: e.target.value })}
              rows={4}
              aria-label="Assignment notes"
              placeholder="Anything to remember while working on this…"
              className="brut-input" />
            
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="p-5">
            <SectionHeading title="Submission" />
            <div className="space-y-3">
              <StatusBadge status={assignment.status} />
              <Button
                block
                variant={assignment.submitted ? 'ok' : 'primary'}
                onClick={() => {
                  upsertAssignment({
                    ...assignment,
                    submitted: !assignment.submitted,
                    status: !assignment.submitted ? 'COMPLETED' : 'IN_PROGRESS',
                    checklist: assignment.checklist.map((c) => ({
                      ...c,
                      done: !assignment.submitted ? true : c.done
                    }))
                  });
                  toast(!assignment.submitted ? 'Assignment submitted ✓' : 'Marked as in progress');
                }}>
                
                {assignment.submitted ? 'Submitted ✓' : 'Mark as submitted'}
              </Button>
              <Button
                block
                variant="white"
                onClick={() => open('task', { subjectId: assignment.subjectId })}>
                
                Create a task for this
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeading title="Attachments" />
            {assignment.attachments.length > 0 ?
            <ul className="space-y-2">
                {assignment.attachments.map((f) =>
              <li
                key={f}
                className="flex items-center gap-3 border-3 border-ink px-3 py-2 dark:border-white">
                
                    <FileTextIcon className="h-4 w-4 shrink-0" strokeWidth={3} aria-hidden />
                    <span className="truncate text-sm">{f}</span>
                  </li>
              )}
              </ul> :

            <p className="muted text-sm">No files attached.</p>
            }
          </Card>

          <Card className="p-5">
            <SectionHeading title="Reference links" />
            {assignment.links.length > 0 ?
            <ul className="space-y-2">
                {assignment.links.map((l) =>
              <li key={l}>
                    <a
                  href={l}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 border-3 border-ink px-3 py-2 text-sm underline decoration-[3px] underline-offset-4 press focus-brut dark:border-white">
                  
                      <ExternalLinkIcon className="h-4 w-4 shrink-0" strokeWidth={3} aria-hidden />
                      <span className="truncate">{l}</span>
                    </a>
                  </li>
              )}
              </ul> :

            <p className="muted text-sm">No links added.</p>
            }
          </Card>
        </aside>
      </div>
    </div>);

}