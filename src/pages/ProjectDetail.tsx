import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExternalLinkIcon, PlusIcon, SendIcon, TrashIcon, UserCheckIcon, UserPlusIcon, UsersIcon, XIcon, ListTodoIcon } from 'lucide-react';
import { useStudyForge, useProjectTasks } from '../contexts/StudyForgeContext';
import { useAuth } from '../contexts/AuthContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Card, SectionHeading } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/Progress';
import { EmptyState } from '../components/ui/States';
import { PageHeader } from '../components/ui/PageHeader';
import { TaskCard } from '../components/tasks/TaskCard';
import { dueLabel, shortDate } from '../utils/date';
import { projectProgress } from '../utils/progress';
import type { ProjectStage } from '../types';

const pipeline: ProjectStage[] = [
'IDEA',
'PLANNING',
'DEVELOPMENT',
'TESTING',
'DOCUMENTATION',
'PRESENTATION',
'COMPLETED'];


export function ProjectDetail() {
  const { projectId = '' } = useParams();
  const { projects, subject, upsertProject, removeProject, inviteUserToProject, toast } = useStudyForge();
  const { user } = useAuth();
  const { open } = useQuickAdd();
  const navigate = useNavigate();
  const projectTasks = useProjectTasks(projectId);

  const [inviteUid, setInviteUid] = useState('');
  const [inviting, setInviting] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        subtitle="It may have been deleted."
        actions={
        <Link to="/app/projects">
            <Button>Back to projects</Button>
          </Link>
        } />);


  }

  const s = subject(project.subjectId);
  const progress = projectProgress(project);
  const stageIndex = pipeline.indexOf(project.stage);
  const major = project.type === 'MAJOR';
  const isOwner = user?.uid === project.ownerId;

  const setMilestone = (id: string, patch: {progress?: number;status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';}) =>
  upsertProject({
    ...project,
    milestones: project.milestones.map((m) => m.id === id ? { ...m, ...patch } : m)
  });

  const handleSendInvite = async () => {
    const uid = inviteUid.trim();
    if (!uid) return;
    setSendingInvite(true);
    await inviteUserToProject(project.id, uid, project.name);
    setSendingInvite(false);
    setInviteUid('');
    setInviting(false);
  };

  const members = project.members ?? [];
  const pendingInvites = project.pendingInvites ?? [];

  return (
    <div>
      <PageHeader
        backTo="/app/projects"
        backLabel="All projects"
        eyebrow={
        <>
            <Badge tone={major ? 'purple' : 'yellow'}>{major ? 'Major project' : 'Mini project'}</Badge>
            {s && <Badge tone="ink">{s.name}</Badge>}
            <StatusBadge status={project.status} />
          </>
        }
        title={project.name}
        subtitle={project.description}
        actions={
        <>
            <Button variant="white" onClick={() => open(major ? 'major-project' : 'mini-project', { editProject: project })}>
              Edit
            </Button>
            {isOwner && (
              <Button
              variant="danger"
              onClick={() => {
                removeProject(project.id);
                toast('Project deleted', 'error');
                navigate('/app/projects');
              }}>
              
                <TrashIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Delete
              </Button>
            )}
          </>
        } />
      

      <Card tone="purple" className="mb-6 flex flex-wrap items-end justify-between gap-6 p-6">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] opacity-80">Progress</p>
          <p className="font-display text-6xl font-bold leading-none">{progress}%</p>
          <p className="mt-2 text-sm opacity-90">
            Deadline {shortDate(project.deadline)} • {dueLabel(project.deadline).toLowerCase()}
          </p>
        </div>
        <ProgressBar value={progress} tone="yellow" height="lg" className="min-w-[240px] flex-1" />
      </Card>

      <section aria-label="Project pipeline" className="mb-8">
        <SectionHeading title="Project pipeline" hint="Click a stage to move the project forward." />
        <ol className="flex flex-wrap gap-2">
          {pipeline.map((stage, i) => {
            const done = i < stageIndex;
            const current = i === stageIndex;
            return (
              <li key={stage}>
                <button
                  type="button"
                  onClick={() => {
                    upsertProject({
                      ...project,
                      stage,
                      status: stage === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'
                    });
                    toast(`Project moved to ${stage.toLowerCase()} ✓`);
                  }}
                  className={`border-3 border-ink px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.1em] press focus-brut dark:border-white ${
                  current ?
                  'bg-brand text-white shadow-brut-sm' :
                  done ?
                  'bg-ok text-ink' :
                  'bg-white text-ink dark:bg-white/5 dark:text-white'}`
                  }>
                  
                  {done && '✓ '}
                  {stage}
                </button>
              </li>);

          })}
        </ol>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section aria-label="Milestones">
            <SectionHeading
              title="Milestones"
              action={
              <Button size="sm" variant="ink" onClick={() => open('task', { projectId: project.id, subjectId: project.subjectId })}>
                  <PlusIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Generate task
                </Button>
              } />
          
          <ul className="space-y-4">
            {project.milestones.map((m, i) =>
            <li key={m.id}>
                <Card className="p-5" shadow="sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="muted font-display text-[11px] font-bold uppercase tracking-[0.16em]">
                        Milestone {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight">{m.title}</h3>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                  <ProgressBar
                  value={m.progress}
                  tone={m.status === 'COMPLETED' ? 'green' : 'purple'}
                  className="mt-4"
                  showValue
                  label="Completion" />
                
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                    size="sm"
                    variant="white"
                    onClick={() =>
                    setMilestone(m.id, {
                      progress: Math.min(100, m.progress + 20),
                      status: m.progress + 20 >= 100 ? 'COMPLETED' : 'IN_PROGRESS'
                    })
                    }>
                    
                      +20%
                    </Button>
                    <Button
                    size="sm"
                    variant={m.status === 'COMPLETED' ? 'ok' : 'primary'}
                    onClick={() => {
                      const complete = m.status !== 'COMPLETED';
                      setMilestone(m.id, {
                        status: complete ? 'COMPLETED' : 'IN_PROGRESS',
                        progress: complete ? 100 : 60
                      });
                      if (complete) toast('Milestone completed ✓');
                    }}>
                    
                      {m.status === 'COMPLETED' ? 'Completed ✓' : 'Mark complete'}
                    </Button>
                      <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => open('task', { projectId: project.id, subjectId: project.subjectId })}>
                      
                        Create task
                      </Button>
                    </div>
                  </Card>
                </li>
              )}
            </ul>
          </section>

          <section aria-label="Project Tasks" className="mt-8">
            <SectionHeading
              title="Project Tasks"
              hint="Tasks specifically scoped to this project"
              action={
                <Button size="sm" variant="ink" onClick={() => open('task', { projectId: project.id, subjectId: project.subjectId })}>
                  <PlusIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Create task
                </Button>
              }
            />
            {projectTasks.length === 0 ? (
              <EmptyState
                icon={<ListTodoIcon className="h-6 w-6 text-ink dark:text-white" strokeWidth={2.5} aria-hidden />}
                title="No project tasks"
                subtitle="Create a task to track specific deliverables for this project."
              />
            ) : (
              <ul className="space-y-3">
                {projectTasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(t => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {/* ── Team Members Panel ── */}
          <Card className="p-5">
            <SectionHeading
              title="Team"
              action={
                isOwner && !inviting ? (
                  <Button
                    size="sm"
                    variant="ink"
                    onClick={() => setInviting(true)}
                    id="invite-member-btn"
                  >
                    <UserPlusIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                    &nbsp;Invite
                  </Button>
                ) : null
              }
            />

            {/* Invite-by-UID input (owner only) */}
            {isOwner && inviting && (
              <div className="mb-4 space-y-2">
                <p className="muted text-xs font-bold uppercase tracking-wide">Enter Firebase UID</p>
                <input
                  id="invite-uid-input"
                  type="text"
                  value={inviteUid}
                  onChange={(e) => setInviteUid(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendInvite()}
                  placeholder="Paste user UID…"
                  className="w-full border-3 border-ink bg-white px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand dark:border-white dark:bg-white/5 dark:text-white"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSendInvite}
                    disabled={!inviteUid.trim() || sendingInvite}
                    id="send-invite-btn"
                  >
                    <SendIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                    &nbsp;{sendingInvite ? 'Sending…' : 'Send invite'}
                  </Button>
                  <Button
                    size="sm"
                    variant="white"
                    onClick={() => { setInviting(false); setInviteUid(''); }}
                    id="cancel-invite-btn"
                  >
                    <XIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                    &nbsp;Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Owner row */}
            <ul className="space-y-2">
              <li className="flex items-center gap-3 border-3 border-ink bg-sun px-3 py-2 dark:border-white dark:bg-sun/20">
                <UsersIcon className="h-4 w-4 shrink-0 text-ink dark:text-white" strokeWidth={3} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs font-bold text-ink dark:text-white">
                    {project.ownerId}
                  </p>
                  {project.ownerId === user?.uid && (
                    <p className="text-[10px] font-bold uppercase tracking-wide text-ink/60 dark:text-white/60">You</p>
                  )}
                </div>
                <Badge tone="yellow">Owner</Badge>
              </li>

              {/* Accepted members */}
              {members.map((uid) => (
                <li
                  key={uid}
                  className="flex items-center gap-3 border-3 border-ink px-3 py-2 dark:border-white"
                >
                  <UserCheckIcon className="h-4 w-4 shrink-0 text-ok" strokeWidth={3} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs font-bold dark:text-white">{uid}</p>
                    {uid === user?.uid && (
                      <p className="text-[10px] font-bold uppercase tracking-wide text-ink/60 dark:text-white/60">You</p>
                    )}
                  </div>
                  <Badge tone="green">Member</Badge>
                </li>
              ))}

              {/* Pending invites */}
              {pendingInvites.map((uid) => (
                <li
                  key={uid}
                  className="flex items-center gap-3 border-3 border-ink/40 px-3 py-2 opacity-70 dark:border-white/40"
                >
                  <UserPlusIcon className="h-4 w-4 shrink-0 text-ink/50 dark:text-white/50" strokeWidth={3} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs font-bold dark:text-white">{uid}</p>
                  </div>
                  <Badge tone="plain">Pending</Badge>
                </li>
              ))}

              {/* Solo project state */}
              {members.length === 0 && pendingInvites.length === 0 && (
                <p className="muted text-sm">
                  Solo project.{isOwner ? ' Use the Invite button to add members.' : ''}
                </p>
              )}
            </ul>
          </Card>

          <Card className="p-5">
            <SectionHeading title="Technologies" />
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((t) =>
              <li key={t}>
                  <Badge tone="yellow">{t}</Badge>
                </li>
              )}
            </ul>
          </Card>

          <Card className="p-5">
            <SectionHeading title="Links" />
            <div className="space-y-2">
              {[project.repoLink, project.docsLink].filter(Boolean).length > 0 ?
              [project.repoLink, project.docsLink].filter(Boolean).map((l) =>
              <a
                key={l}
                href={l}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 border-3 border-ink px-3 py-2 text-sm underline decoration-[3px] underline-offset-4 press focus-brut dark:border-white">
                
                    <ExternalLinkIcon className="h-4 w-4 shrink-0" strokeWidth={3} aria-hidden />
                    <span className="truncate">{l}</span>
                  </a>
              ) :

              <p className="muted text-sm">No links added.</p>
              }
            </div>
          </Card>

          <Card tone="yellow" className="p-5">
            <SectionHeading title="Notes" />
            <p className="text-sm text-ink/80">{project.notes || 'No notes yet.'}</p>
          </Card>
        </aside>
      </div>
    </div>);

}