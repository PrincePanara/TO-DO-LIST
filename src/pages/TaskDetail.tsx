import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, TrashIcon, ClockIcon } from 'lucide-react';
import { useStudyForge, useUserProfiles } from '../contexts/StudyForgeContext';
import { useAuth } from '../contexts/AuthContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Card, SectionHeading } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, PriorityBadge, StatusBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/Progress';
import { EmptyState } from '../components/ui/States';
import { PageHeader } from '../components/ui/PageHeader';
import { ChecklistEditor } from '../components/forms/ChecklistEditor';
import { dueLabel, shortDate, time12, isOverdue } from '../utils/date';
import { itemProgress } from '../utils/progress';

const categoryLabel: Record<string, string> = {
  STUDY: 'Study',
  ASSIGNMENT: 'Assignment',
  LAB: 'Lab',
  MINI_PROJECT: 'Mini project',
  MAJOR_PROJECT: 'Major project',
  PERSONAL: 'Personal'
};

export function TaskDetail() {
  const { taskId = '' } = useParams();
  const { tasks, subject, projects, upsertTask, removeTask, toggleTask, toast } = useStudyForge();
  const { user } = useAuth();
  const { open } = useQuickAdd();
  const navigate = useNavigate();

  const task = tasks.find((t) => t.id === taskId);

  // We need to fetch profiles for assignee
  const assigneeId = task?.assigneeId;
  const profiles = useUserProfiles(assigneeId ? [assigneeId] : []);

  if (!task) {
    return (
      <EmptyState
        title="Task not found"
        subtitle="It may have been deleted."
        actions={
          <Button onClick={() => navigate(-1)}>Go back</Button>
        }
      />
    );
  }

  const s = subject(task.subjectId);
  const p = task.projectId ? projects.find(proj => proj.id === task.projectId) : null;
  const done = task.status === 'COMPLETED';
  const overdue = !done && isOverdue(task.dueDate);
  const progress = itemProgress(task);
  const assigneeName = assigneeId ? (profiles[assigneeId]?.name || profiles[assigneeId]?.email || assigneeId) : null;

  return (
    <div>
      <PageHeader
        backTo={p ? `/app/projects/${p.id}` : "/app/tasks"}
        backLabel={p ? "Project" : "Tasks"}
        eyebrow={
          <>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {overdue && <Badge tone="red">Overdue</Badge>}
          </>
        }
        title={task.title}
        actions={
          <>
            <Button variant="white" onClick={() => open('task', { editTask: task })}>
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  removeTask(task.id);
                  toast('Task deleted', 'error');
                  navigate(-1);
                }
              }}
            >
              <TrashIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Main Description */}
          <Card className="p-6">
            <SectionHeading title="Description" />
            {task.description ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed opacity-90">{task.description}</p>
            ) : (
              <p className="muted text-sm italic">No description provided.</p>
            )}
          </Card>

          {/* Checklist */}
          <Card className="p-6">
            <SectionHeading title="Subtasks & Checklist" />
            <ProgressBar
              value={progress}
              tone={done ? 'green' : 'purple'}
              className="mb-6"
              label={`${progress}% checklist completion`}
              showValue
            />
            <ChecklistEditor
              items={task.checklist}
              onChange={(newItems) => {
                upsertTask({ ...task, checklist: newItems });
              }}
              label="Items"
            />
          </Card>
        </div>

        <aside className="space-y-6">
          {/* Completion Action */}
          <Card className={`p-5 flex flex-col items-center justify-center gap-4 text-center ${done ? 'bg-ok/10 border-ok' : ''}`}>
            <h3 className="font-display font-bold uppercase tracking-wider text-sm">
              {done ? 'Task Completed!' : 'Mark as Done'}
            </h3>
            <button
              type="button"
              onClick={() => {
                toggleTask(task.id);
                toast(done ? 'Task marked active' : 'Task completed ✓');
              }}
              className={`flex h-16 w-16 items-center justify-center border-4 border-ink shadow-brut-sm press focus-brut dark:border-white ${
                done ? 'bg-ok' : 'bg-white text-ink dark:bg-transparent dark:text-white'
              }`}
            >
              <CheckIcon className={`h-8 w-8 ${done ? 'text-ink' : 'opacity-20'}`} strokeWidth={4} />
            </button>
            <p className="muted text-xs">
              {done ? 'Click to mark as incomplete' : 'Click to complete task'}
            </p>
          </Card>

          {/* Task Info */}
          <Card className="p-5">
            <SectionHeading title="Details" />
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="muted mb-1 text-[10px] font-bold uppercase tracking-widest">Deadline</dt>
                <dd className={`font-bold flex items-center gap-2 ${overdue ? 'text-danger' : ''}`}>
                  <ClockIcon className="h-4 w-4" strokeWidth={3} />
                  {shortDate(task.dueDate)} at {time12(task.dueTime)}
                  <span className="muted ml-1 text-xs font-normal">({dueLabel(task.dueDate)})</span>
                </dd>
              </div>
              
              <div>
                <dt className="muted mb-1 text-[10px] font-bold uppercase tracking-widest">Category</dt>
                <dd><Badge>{categoryLabel[task.category]}</Badge></dd>
              </div>

              {s && (
                <div>
                  <dt className="muted mb-1 text-[10px] font-bold uppercase tracking-widest">Subject</dt>
                  <dd><Badge tone="purple">{s.name}</Badge></dd>
                </div>
              )}

              {p && (
                <div>
                  <dt className="muted mb-1 text-[10px] font-bold uppercase tracking-widest">Project</dt>
                  <dd><Badge tone="yellow">{p.name}</Badge></dd>
                </div>
              )}

              {assigneeId && (
                <div>
                  <dt className="muted mb-1 text-[10px] font-bold uppercase tracking-widest">Assigned To</dt>
                  <dd className="font-display font-bold">
                    {assigneeId === user?.uid ? 'You' : assigneeName}
                  </dd>
                </div>
              )}

              {task.estimatedHours > 0 && (
                <div>
                  <dt className="muted mb-1 text-[10px] font-bold uppercase tracking-widest">Estimated Time</dt>
                  <dd className="font-display font-bold">{task.estimatedHours} hour(s)</dd>
                </div>
              )}
            </dl>
          </Card>

        </aside>
      </div>
    </div>
  );
}
